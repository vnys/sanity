import * as operations from './index'
import {OperationArgs} from '../../types'

/* Ok, this became a bit messy - sorry
 *  The important thing to consider here is the PublicOperations interface -
 *  as long as this is properly typed, how everything else is implemented doesn't matter
 *  */

type GenericFn = (...args: any[]) => any
interface GuardedOperation<ExecuteFn> {
  disabled: 'NOT_READY'
  execute: () => never
}
type ExtraParameters<T extends (first: any, ...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never

type WrappedOperation<ExecuteFn extends GenericFn, ErrorStrings> = {
  disabled: false | ErrorStrings
  execute: (...args: ExtraParameters<ExecuteFn>[]) => ReturnType<ExecuteFn>
}

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any

type OperationImpl<ExecuteFn extends GenericFn, ErrorStrings> = {
  disabled: (args: OperationArgs) => false | ErrorStrings
  execute(args: OperationArgs, ...extraArgs: Parameters<ExecuteFn>[] | any[]): ReturnType<ExecuteFn>
}

type Operation<ExecuteFn extends GenericFn, DisabledReasons = false> =
  | GuardedOperation<ExecuteFn>
  | WrappedOperation<ExecuteFn, DisabledReasons>

type Prepare<T, K = any> = (doc: T) => K

// Note: Changing this interface in a backwards incompatible manner will be a breaking change
export interface PublicOperations {
  commit: Operation<() => Promise<void>>
  delete: Operation<() => Promise<void>, 'NOTHING_TO_DELETE'>
  del: Operation<() => Promise<void>, 'NOTHING_TO_DELETE'>
  publish: Operation<
    (prepare?: Prepare<any>) => Promise<void>,
    'LIVE_EDIT_ENABLED' | 'ALREADY_PUBLISHED' | 'NO_CHANGES'
  >
  patch: Operation<(patches: any[]) => void>
  discardChanges: Operation<() => Promise<void>, 'NO_CHANGES' | 'NOT_PUBLISHED'>
  unpublish: Operation<() => Promise<void>, 'NOT_PUBLISHED'>
  duplicate: Operation<(prepare?: Prepare<any>) => Promise<string>, 'NOTHING_TO_DUPLICATE'>
  restore: Operation<(revision: string) => Promise<void>>
}

function createOperationGuard<ExecuteFn extends GenericFn, ErrorStrings, ReturnValue>(
  opName: string,
  op: OperationImpl<ExecuteFn, ErrorStrings>
): GuardedOperation<ExecuteFn> {
  return {
    disabled: 'NOT_READY',
    execute: () => {
      throw new Error(`Called ${opName} before it was ready.`)
    }
  }
}

// This creates a version of the operations api that will throw if called.
// Most operations depend on having the "current document state" available locally and if an action gets called
// before we have the state available, we throw an error to signal "premature" invocation before ready
export const GUARDED: PublicOperations = {
  commit: createOperationGuard('commit', operations.commit),
  delete: createOperationGuard('delete', operations.delete),
  del: createOperationGuard('del', operations.delete),
  publish: createOperationGuard('publish', operations.publish),
  patch: createOperationGuard('patch', operations.patch),
  discardChanges: createOperationGuard('discardChanges', operations.discardChanges),
  unpublish: createOperationGuard('unpublish', operations.unpublish),
  duplicate: createOperationGuard('duplicate', operations.duplicate),
  restore: createOperationGuard('restore', operations.restore)
}

function wrap<ExecuteFn extends GenericFn, ErrorStrings>(
  opName: keyof PublicOperations,
  op: OperationImpl<ExecuteFn, ErrorStrings>,
  operationArgs: OperationArgs
): WrappedOperation<ExecuteFn, ErrorStrings> {
  const disabled = op.disabled(operationArgs)
  return {
    disabled,
    execute: (...extraArgs: Parameters<ExecuteFn>[]): ReturnType<ExecuteFn> =>
      op.execute(operationArgs, ...extraArgs)
  }
}

export function createOperationsAPI(args: OperationArgs): PublicOperations {
  return {
    commit: wrap('commit', operations.commit, args),
    delete: wrap('delete', operations.delete, args),
    del: wrap('delete', operations.delete, args),
    publish: wrap('publish', operations.publish, args),
    patch: wrap('patch', operations.patch, args),
    discardChanges: wrap('discardChanges', operations.discardChanges, args),
    unpublish: wrap('unpublish', operations.unpublish, args),
    duplicate: wrap('duplicate', operations.duplicate, args),
    restore: wrap('restore', operations.restore, args)
  }
}
