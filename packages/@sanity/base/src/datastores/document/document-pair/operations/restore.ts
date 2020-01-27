import {OperationArgs} from '../../types'
import historyStore from 'part:@sanity/base/datastore/history'
import {returnVoid} from '../../utils/returnVoid'

export const restore = {
  disabled: (): false => false,
  execute: ({idPair}: OperationArgs, fromRevision: string): Promise<void> => {
    return historyStore
      .restore(idPair.publishedId, fromRevision)
      .toPromise()
      .then(returnVoid)
  }
}
