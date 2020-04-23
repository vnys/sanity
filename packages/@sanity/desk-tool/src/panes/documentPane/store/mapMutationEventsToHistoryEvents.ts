import {DocumentHistoryEvent, DocumentMutationEvent} from './types'

interface StateMachineContext {
  // exists: boolean
  events: DocumentHistoryEvent[]
  state: 'initial' | 'exists'
  draftExists: boolean
  publishedExists: boolean
}

function mutationEventAffectsDraft(mutationEvent: DocumentMutationEvent): boolean {
  return mutationEvent.documentIds.map(id => id.startsWith('drafts.')).length > 0
}

function mutationEventAffectsPublished(mutationEvent: DocumentMutationEvent): boolean {
  return mutationEvent.documentIds.map(id => !id.startsWith('drafts.')).length > 0
}

function handleInitial(ctx: StateMachineContext, mutationEvent: DocumentMutationEvent): void {
  console.log('handleInitial', mutationEvent.documentIds)

  if (mutationEvent.mutation.hasOwnProperty('createIfNotExists')) {
    // Created!
    ctx.events.push({
      type: 'create',
      timestamp: mutationEvent.timestamp,
      revisionId: mutationEvent.revisionId,
      userId: mutationEvent.userId
    })

    ctx.state = 'exists'

    if (mutationEventAffectsDraft(mutationEvent)) ctx.draftExists = true
    if (mutationEventAffectsPublished(mutationEvent)) ctx.publishedExists = true
  } else {
    console.log('handleInitial:  unknown mutation event:', mutationEvent)
    throw new Error(`handleInitial: unexpected mutation event (see console)`)
  }
}

function handleExists(ctx: StateMachineContext, mutationEvent: DocumentMutationEvent): void {
  console.log('handleExists', mutationEvent.documentIds)

  if (mutationEvent.mutation.hasOwnProperty('createIfNotExists')) {
    // ignore
  } else if (mutationEvent.mutation.hasOwnProperty('patch')) {
    // Edited!
    ctx.events.push({
      type: 'edit',
      timestamp: mutationEvent.timestamp,
      revisionId: mutationEvent.revisionId,
      userId: mutationEvent.userId
    })
  } else {
    console.log('handleExists: unknown mutation event:', mutationEvent)
    throw new Error(`handleExists: unexpected mutation event (see console)`)
  }
}

export function mapMutationEventsToHistoryEvents(
  mutationEvents: DocumentMutationEvent[]
): DocumentHistoryEvent[] {
  const rawMutationEvents = mutationEvents.slice(0)

  const ctx: StateMachineContext = {
    // exists: false,
    events: [],
    state: 'initial',
    draftExists: false,
    publishedExists: false
  }

  // Sort by date
  // TODO: find out if this is necessary, or if it's already sorted in the backend
  rawMutationEvents.sort((a, b) => a.timestamp - b.timestamp)

  console.log(rawMutationEvents)

  for (const mutationEvent of rawMutationEvents) {
    switch (ctx.state) {
      case 'initial':
        handleInitial(ctx, mutationEvent)
        break
      case 'exists':
        handleExists(ctx, mutationEvent)
        break
      default:
        throw new Error(`unknown state: ${ctx.state}`)
    }
    // if (ctx.state === 'initial') {
    //   handleInitial(ctx, mutationEvent)
    // } else if (ctx.state === 'exists') handleExists(ctx, mutationEvent)
  }

  // console.log(rawEvents)
  return ctx.events
}
