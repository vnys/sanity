import client from 'part:@sanity/base/client'
import {merge, Observable, Subject} from 'rxjs'
import {filter, map, scan, share, switchMap, take, tap} from 'rxjs/operators'
import {getQueryResultObservable, getServerEventObservable} from '../lib/document-store'
import {useObservable} from '../lib/utils/hooks'

function stateReducer(state, event) {
  if (event.type === 'snapshot') {
    return event.data
  }

  if (event.type === 'clearAssignees') {
    return {...state, assignees: []}
  }

  if (event.type === 'setAssignees') {
    return {...state, assignees: event.assignees}
  }

  if (event.type === 'setState') {
    return {...state, state: event.state}
  }

  return state
}

export function getMetadataContext(documentId, defaultState) {
  const id = `workflow-metadata.${documentId}`
  const initialState = {
    _type: 'workflow.metadata',
    _id: `workflow-metadata.${documentId}`,
    state: defaultState || 'draft',
    assignees: [],
    documentId
  }
  const serverEvent$ = getServerEventObservable({filter: '_id == $id', params: {id}})
  const snapshotEvent$ = serverEvent$.pipe(
    switchMap(event => {
      return getQueryResultObservable({query: `*[_id == $id][0]`, params: {id}}).pipe(
        map(data => {
          return {
            type: 'snapshot',
            data,
            timestamp: Date.parse(event.type === 'welcome' ? data._updatedAt : event.timestamp)
          }
        })
      )
    })
  )
  const metadata$ = snapshotEvent$.pipe(map(event => event.data))
  const createEvent$ = metadata$.pipe(
    filter(data => !data),
    map(() => ({type: 'snapshot', snapshot: initialState, timestamp: -1})),
    take(1),
    tap(create)
  )
  const actionEventSubject = new Subject()
  const actionEvent$ = actionEventSubject.asObservable()
  const event$ = merge(createEvent$, snapshotEvent$, actionEvent$)
  const events$ = event$.pipe(
    scan((acc, event) => {
      const events = acc.concat([event])
      events.sort((a, b) => a.timestamp - b.timestamp)
      return events
    }, [])
  )
  const state$ = events$.pipe(
    map(events => events.reduce(stateReducer, {})),
    map(state => ({...state, clearAssignees, delete: del, setAssignees, setState, ok: true})),
    share()
  )

  return {initialState, state$}

  function clearAssignees() {
    actionEventSubject.next({type: 'clearAssignees', timestamp: Date.now()})

    return client
      .patch(id)
      .unset(['assignees'])
      .commit()
  }

  function del() {
    actionEventSubject.next({type: 'delete', timestamp: Date.now()})

    return client.delete(id)
  }

  function setAssignees(assignees) {
    actionEventSubject.next({type: 'setAssignees', assignees, timestamp: Date.now()})

    return client
      .patch(id)
      .set({assignees})
      .commit()
  }

  function setState(state) {
    actionEventSubject.next({type: 'setState', state, timestamp: Date.now()})

    return client
      .patch(id)
      .set({state})
      .commit()
  }

  function create() {
    return client
      .transaction()
      .createOrReplace(initialState)
      .commit()
  }
}

const CONTEXT_CACHE = {}
export function getCachedMetadataContext(documentId, defaultState) {
  if (!CONTEXT_CACHE[documentId]) {
    CONTEXT_CACHE[documentId] = {
      ctx: getMetadataContext(documentId, defaultState),
      observers: []
    }
  }

  const {ctx, observers} = CONTEXT_CACHE[documentId]

  const state$ = Observable.create(observer => {
    observers.push(observer)

    const sub = ctx.state$.subscribe(observer)

    return () => {
      sub.unsubscribe()

      const index = observers.indexOf(observer)

      if (index > -1) {
        observers.splice(index, 1)
      }

      if (observers.length === 0) {
        delete CONTEXT_CACHE[documentId]
      }
    }
  })

  return {...ctx, state$}
}

export function useMetadata(documentId, defaultState) {
  const {state$: stream, initialState} = getCachedMetadataContext(documentId, defaultState)
  const keys = [documentId]

  return useObservable(stream, initialState, keys)
}
