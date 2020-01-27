import {OperationArgs} from '../../types'
import client from 'part:@sanity/base/client'
import {omit} from 'lodash'
import {returnVoid} from '../../utils/returnVoid'

export const unpublish = {
  disabled: ({snapshots}: OperationArgs) => {
    return snapshots.published ? false : 'NOT_PUBLISHED'
  },
  execute: ({idPair, snapshots}: OperationArgs): Promise<void> => {
    let tx = client.observable.transaction().delete(idPair.publishedId)

    if (snapshots.published) {
      tx = tx.createIfNotExists({
        ...omit(snapshots.published, '_updatedAt'),
        _id: idPair.draftId
      })
    }

    return tx
      .commit()
      .toPromise()
      .then(returnVoid)
  }
}
