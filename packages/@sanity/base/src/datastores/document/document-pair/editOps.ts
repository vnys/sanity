/* eslint-disable @typescript-eslint/no-use-before-define */
import {concat, Observable, of, EMPTY, merge} from 'rxjs'
import {map, publishReplay, refCount, mergeMapTo, share, tap} from 'rxjs/operators'
import {IdPair} from '../types'
import {createObservableCache} from '../utils/createObservableCache'
import {createOperationsAPI, GUARDED, PublicOperations} from './operations/api'
import {operationArgs} from './operationArgs'
import {documentOperationResults} from '../operations'

const cacheOn = createObservableCache<PublicOperations>()

export function editOpsOf(idPair: IdPair, typeName: string): Observable<PublicOperations> {
  const args$ = operationArgs(idPair, typeName).pipe(share())

  const ops$ = concat(of(GUARDED), args$.pipe(map(createOperationsAPI)))
  const operationResults$ = documentOperationResults(args$, idPair.publishedId).pipe(
    tap(console.log),
    mergeMapTo(EMPTY)
  )

  return merge(ops$, operationResults$).pipe(
    publishReplay(1),
    refCount(),
    cacheOn(idPair.publishedId)
  )
}
