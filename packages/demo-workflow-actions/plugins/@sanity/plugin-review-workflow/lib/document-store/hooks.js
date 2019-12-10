import {useObservable} from '../utils/hooks'
import {getDocumentEntryObservable} from './documentEntry'
import {getDocumentIdsStateObservable} from './documentIds'
import {getDocumentObservable} from './document'
import {getDocumentListStateObservable} from './documentList'
import {getQueryResultObservable} from './queryResult'

const noop = () => void 0

// query snapshot

export function useQueryResult({query, params}) {
  const stream = getQueryResultObservable({query, params})
  const initialValue = null
  const keys = [query, JSON.stringify(params)]

  return useObservable(stream, initialValue, keys)
}

// document snapshot

export function useDocument({filter, params}) {
  const stream = getDocumentObservable({filter, params})
  const initialValue = null
  const keys = [filter, JSON.stringify(params)]

  return useObservable(stream, initialValue, keys)
}

// document entry

export function useDocumentEntry(id) {
  const stream = getDocumentEntryObservable(id)
  const initialValue = {
    reconnecting: false,
    draft: {
      api: null,
      data: null,
      deleted: null
    },
    published: {
      api: null,
      data: null,
      deleted: null
    },
    error: null,
    retry: noop
  }
  const keys = [id]

  return useObservable(stream, initialValue, keys)
}

// document ids

export function useDocumentIds(opts) {
  const stream = getDocumentIdsStateObservable(opts)
  const initialValue = {data: null, error: null, loading: false, onRetry: noop}
  const keys = [opts.filter, JSON.stringify(opts.params)]

  return useObservable(stream, initialValue, keys)
}

// document list

export function useDocumentList(opts) {
  const stream = getDocumentListStateObservable(opts)
  const initialValue = {data: null, error: null, loading: false, onRetry: noop}
  const keys = [opts.filter, JSON.stringify(opts.params)]

  return useObservable(stream, initialValue, keys)
}
