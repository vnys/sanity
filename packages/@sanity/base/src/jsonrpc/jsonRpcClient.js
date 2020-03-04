import {AsyncSubject} from 'rxjs'
import {generate as randomString} from 'randomstring'

const CONNECT_TIMEOUT_MS = 5000
const CLOSE_SERVICE_RESTART = 1012

const hasWebSocket = typeof window !== 'undefined' && typeof window.WebSocket === 'function'

export const getRpcClient = client => {
  let ws
  let closed = true
  let connected = false
  const pending = new Map()

  function getId() {
    let id
    do {
      id = randomString({length: 16})
    } while (pending.has(id))
    return id
  }

  function tryParse(json) {
    try {
      return JSON.parse(json)
    } catch (err) {
      return null
    }
  }

  function send(data) {
    if (!connected) {
      throw new Error(`Not connected`)
    }

    ws.send(data)
  }

  function close() {
    if (connected) {
      ws.close()
      for (const subject of pending.values()) {
        subject.complete()
      }
    }

    closed = true
  }

  function onNotification(msg) {
    const id = msg.params && msg.params.subscription
    if (!id) {
      console.warn('Got notification without subscription ID')
      return
    }

    const subject = pending.get(id)
    if (!subject) {
      console.warn('Got notification without matching subscription (id: %s)', id)
      return
    }

    subject.next(msg.params.result)
  }

  function onMessage(msg) {
    if (!msg.id) {
      onNotification(msg)
      return
    }

    const subject = pending.get(msg.id)
    if (!subject) {
      console.warn('Got response without pending request (id: %s)', msg.id)
      return
    }

    if (typeof msg.result === 'undefined' && msg.error) {
      // @todo typed errors on JSON RPC errors?
      const {message, data} = msg.error
      subject.error(new Error(message && data ? `${message} - ${data}` : message || data))
    } else {
      subject.next(msg.result)
      subject.complete()
    }

    pending.delete(msg.id)
  }

  function formatRequest(method, params, id = null) {
    return JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id
    })
  }

  function request(method, params) {
    const id = getId()
    const subject = new AsyncSubject()

    pending.set(id, subject)
    send(formatRequest(method, params, id))

    return subject
  }

  function subscribe(method, params) {
    const id = getId()
    return new Observable(subscription => {
      let subscriptionId

      const subRequest = request(`${method}_subscribe`, params).subscribe(subId => {
        subscriptionId = subId
        pending.set(subscriptionId, subscription)
      })

      return () => {
        request(`${method}_unsubscribe`, [subscriptionId])
        pending.delete(id)
        subscription.complete()
        subRequest.unsubscribe()
      }
    })
  }

  function connect() {
    closed = false

    return new Promise((resolve, reject) => {
      if (!hasWebSocket) {
        throw new Error('No WebSocket implementation available')
      }

      const api = {request, subscribe, close}

      if (ws && connected) {
        resolve(api)
        return
      }

      const {dataset} = client.config()
      const url = client.getUrl(`/socket/${dataset}`).replace(/^http/, 'ws')
      const connectTimeout = setTimeout(
        reject,
        CONNECT_TIMEOUT_MS,
        new Error('Timed out trying to connect')
      )

      ws = new WebSocket(url)

      // @todo reconnect logic
      ws.addEventListener('close', err => {
        clearTimeout(connectTimeout)
        connected = false
        console.error('Eeek, it closed!', err)
      })

      ws.addEventListener('message', event => {
        const msg = tryParse(event.data)
        if (!msg || !msg.jsonrpc) {
          return
        }

        if (msg.method === 'welcome') {
          clearTimeout(connectTimeout)
          connected = true
          resolve(api)
          return
        }

        onMessage(msg)
      })
    })
  }

  return connect()
}
