import client from 'part:@sanity/base/client'
import {merge, Subject} from 'rxjs'
import {map, scan, share, switchMap, tap} from 'rxjs/operators'
import {getQueryResultObservable, getServerEventObservable} from '../lib/document-store'
import {useObservable} from '../lib/utils/hooks'

function stateReducer(state, event) {
  if (event.type === 'snapshot') {
    return {data: event.snapshot, loading: false}
  }

  if (event.type === 'move') {
    return {
      ...state,
      data: state.data.map(metadata => {
        if (metadata._id === `workflow-metadata.${event.id}`) {
          return {...metadata, state: event.nextState}
        }

        return metadata
      })
    }
  }

  if (event.type === 'removeAssignee') {
    return {
      ...state,
      data: state.data.map(metadata => {
        if (metadata._id === event.id) {
          const assignees = metadata.assignees
          const exists = assignees && assignees.includes(event.userId)

          if (exists) {
            return {
              ...metadata,
              assignees: assignees.filter(userId => userId !== event.userId)
            }
          }
        }

        return metadata
      })
    }
  }

  if (event.type === 'addAssignee') {
    return {
      ...state,
      data: state.data.map(metadata => {
        if (metadata._id === event.id) {
          const assignees = metadata.assignees || []
          const exists = assignees.includes(event.userId)

          if (!exists) {
            return {
              ...metadata,
              assignees: assignees.concat([event.userId])
            }
          }
        }

        return metadata
      })
    }
  }

  if (event.type === 'clearAssignees') {
    return {
      ...state,
      data: state.data.map(metadata => {
        if (metadata._id === event.id) {
          const {assignees: _, ...newMetadata} = metadata
          return newMetadata
        }

        return metadata
      })
    }
  }

  return state
}

function getMetadataListObservable(assigneeId) {
  const filter = ['_type == $type', assigneeId && '$assigneeId in assignees']
    .filter(Boolean)
    .join(' && ')
  const params = {type: 'workflow.metadata', assigneeId}
  const query = `* [${filter}] {
    _id,
    "ref": coalesce(
      *[_id == "drafts." + ^.documentId]{_id,_type}[0],
      *[_id == ^.documentId]{_id,_type}[0]
    ),
    state,
    assignees
  }`

  return getServerEventObservable({filter, params}).pipe(
    switchMap(serverEvent => {
      return getQueryResultObservable({query, params}).pipe(map(data => ({data, serverEvent})))
    })
  )
}

function getMetadataListContext(assigneeId) {
  const actionEventSubject = new Subject()
  const actionEvent$ = actionEventSubject.asObservable()
  const snapshotEvent$ = getMetadataListObservable(assigneeId).pipe(
    map(({data, serverEvent}) => ({
      type: 'snapshot',
      snapshot: data,
      timestamp: serverEvent.timestamp ? Date.parse(serverEvent.timestamp) : -1
    }))
  )
  const event$ = merge(snapshotEvent$, actionEvent$)
  const events$ = event$.pipe(
    scan((acc, event) => acc.concat(event), []),
    // Sort events by timestamp, so that older server patches
    // are always applied before newer local patches.
    tap(events => {
      events.sort((a, b) => a.timestamp - b.timestamp)
    })
  )
  const state$ = events$.pipe(
    map(events => events.reduce(stateReducer, {data: []})),
    map(state => ({
      ...state,
      addAssignee,
      clearAssignees,
      move,
      removeAssignee
    })),
    share()
  )

  return state$

  function move(id, nextState) {
    actionEventSubject.next({type: 'move', id, nextState, timestamp: Date.now()})

    return client
      .patch(`workflow-metadata.${id}`)
      .set({state: nextState})
      .commit()
  }

  function clearAssignees(id) {
    actionEventSubject.next({type: 'clearAssignees', id, timestamp: Date.now()})

    client
      .patch(id)
      .unset(['assignees'])
      .commit()
  }

  function addAssignee(id, userId) {
    actionEventSubject.next({type: 'addAssignee', id, userId, timestamp: Date.now()})

    client
      .patch(id)
      .setIfMissing({assignees: []})
      .insert('after', 'assignees[-1]', [userId])
      .commit()
  }

  function removeAssignee(id, userId) {
    actionEventSubject.next({type: 'removeAssignee', id, userId, timestamp: Date.now()})

    client
      .patch(id)
      .unset([`assignees[@ == ${JSON.stringify(userId)}]`])
      .commit()
  }
}

export function useMetadataList(assigneeId) {
  const stream = getMetadataListContext(assigneeId)
  const initialValue = {loading: true}
  const keys = [assigneeId]

  return useObservable(stream, initialValue, keys)
}
