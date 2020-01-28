import {concat, EMPTY, Observable, of, Subject} from 'rxjs'
import {concatMap, filter, mergeMapTo, withLatestFrom} from 'rxjs/operators'

import * as operations from './document-pair/operations/index'
import {PublicOperations} from './document-pair/operations/api'

export interface Operation {
  type: keyof PublicOperations
  args: {id: string; type: string; extraArgs: any[]}
}

// for consumption outside of react only
export function createEventHandler<T>(): [Observable<T>, (nextValue: T) => void] {
  const events$: Subject<T> = new Subject()
  const handler = (event: T) => events$.next(event)
  return [events$.asObservable(), handler]
}

const [_operations$, _emitOperation] = createEventHandler<Operation>()

const toObservable = (value: undefined | Observable<any>) =>
  typeof value === 'undefined' ? of(null) : value

export const operations$ = _operations$

export function documentOperationResults(args$, id) {
  const opsForDoc$ = operations$.pipe(filter(op => op.args.id === id))
  return opsForDoc$.pipe(
    withLatestFrom(args$),
    concatMap(([op, operationArgs]) => {
      if (operations[op.type].disabled(operationArgs)) {
        return []
      }
      return concat(
        // phase('start', op),
        toObservable(operations[op.type].execute(operationArgs, ...(op.args.extraArgs || []))).pipe(
          mergeMapTo(EMPTY)
        )
        // phase('end', op)
      )
    })
  )
}

export const emitOperation = _emitOperation
