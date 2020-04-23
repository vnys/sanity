import client from 'part:@sanity/base/client'
import {defer, from, Observable} from 'rxjs'
import {map} from 'rxjs/operators'
import {mapMutationEventsToHistoryEvents} from './mapMutationEventsToHistoryEvents'
import {DocumentHistoryEvent, DocumentMutationEvent, DocumentTransactionEvent} from './types'

const ndjsonToArray = (ndjson: string): DocumentTransactionEvent[] => {
  return ndjson
    .toString()
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line))
}

export function getDocumentTransactionEventLog$(
  documentId: string
): Observable<DocumentTransactionEvent[]> {
  const ids = [documentId, `drafts.${documentId}`]
  const dataset = client.clientConfig.dataset
  const url = `/data/history/${dataset}/transactions/${ids.join(',')}?excludeContent=true`

  return defer(() => {
    const promise = client.request({url}) as any

    return from(promise.then(ndjsonToArray)) as Observable<DocumentTransactionEvent[]>
  })
}

function mapTransactionEventsToMutationEvents(
  transactions: DocumentTransactionEvent[]
): DocumentMutationEvent[] {
  return transactions.reduce((acc, transaction) => {
    return acc.concat(
      transaction.mutations.map(mutation => {
        return {
          documentIds: transaction.documentIDs,
          mutation,
          revisionId: transaction.id,
          timestamp: Date.parse(transaction.timestamp),
          userId: transaction.author
        }
      })
    )
  }, [] as DocumentMutationEvent[])
}

export function getDocumentMutationEvents$(
  documentId: string
): Observable<DocumentMutationEvent[]> {
  const transactionLog$ = getDocumentTransactionEventLog$(documentId)

  return transactionLog$.pipe(map(mapTransactionEventsToMutationEvents))
}

export function getDocumentTimelineEvents$(documentId: string): Observable<DocumentHistoryEvent[]> {
  return getDocumentMutationEvents$(documentId).pipe(map(mapMutationEventsToHistoryEvents))
}
