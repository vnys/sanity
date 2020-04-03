/* eslint-disable @typescript-eslint/no-use-before-define */
import client from 'part:@sanity/base/client'
import {Observable} from 'rxjs'
import {map, tap} from 'rxjs/operators'

export interface JSONRpcMessageEvent {
  i: string
  type: string
  m: {
    clientId: string
    [key: string]: any
  }
}

export interface PresenceStateEvent<State> {
  type: 'state'
  state: State
}

interface PresenceDisconnectEvent {
  type: 'disconnect'
}

interface PresenceRollCallEvent {
  type: 'rollCall'
}

type PresenceEvent<T> = PresenceStateEvent<T> | PresenceDisconnectEvent | PresenceRollCallEvent

type ReceivedEvent<T> = T & {
  clientId: string
  identity: string
  timestamp: string
}

const toPresenceEvent = <State>(
  event: JSONRpcMessageEvent
): ReceivedEvent<PresenceEvent<State>> => {
  return messageToPresenceEvent(event)
}

const isStateEvent = (event: JSONRpcMessageEvent) => {
  return event.type === 'state'
}

const messageToPresenceEvent = <State>(
  event: JSONRpcMessageEvent
): ReceivedEvent<PresenceEvent<State>> => {
  const {m: message, i: identity} = event
  if (isStateEvent(event)) {
    return {
      type: 'state',
      identity,
      clientId: message.clientId,
      timestamp: new Date().toISOString(),
      state: message.state
    }
  } else if (message.type === 'disconnect') {
    return {
      type: 'disconnect',
      identity,
      clientId: message.clientId,
      timestamp: new Date().toISOString()
    }
  } else if (message.type === 'rollCall') {
    return {
      type: 'rollCall',
      identity,
      clientId: message.clientId,
      timestamp: new Date().toISOString()
    }
  }
  throw new Error(`Got unknown presence event: ${JSON.stringify(event)}`)
}

export const createJSONRpcTransport = <State>(
  clientId: string
): [
  Observable<ReceivedEvent<PresenceEvent<State>>>,
  (messages: PresenceEvent<State>[]) => void
] => {
  console.log('foo')
  const messages$ = client.jsonRpc
    .subscribe('presence', {apiVersion: 'v1'})
    .pipe(map(toPresenceEvent), tap(console.log))

  const sendMessages = messages => {
    messages.forEach(message => {
      switch (message.type) {
        case 'rollCall':
          client.jsonRpc.request('presence_rollcall', {apiVersion: 'v1'})
          break
        case 'state':
          client.jsonRpc.request('presence_announce', {
            apiVersion: 'v1',
            data: {clientId, state: message.state}
          })
      }
    })
  }

  return [messages$, sendMessages]
}
