import {OperationArgs} from '../../types'

import {omit} from 'lodash'
import {isLiveEditEnabled} from '../utils/isLiveEditEnabled'
import {merge} from 'rxjs'

const id = <T>(id: T): T => id

export const publish = {
  disabled: ({typeName, snapshots}: OperationArgs) => {
    if (isLiveEditEnabled(typeName)) {
      return 'LIVE_EDIT_ENABLED'
    }
    if (!snapshots.draft) {
      return snapshots.published ? 'ALREADY_PUBLISHED' : 'NO_CHANGES'
    }
    return false
  },
  execute: ({idPair, snapshots, draft, published}: OperationArgs, prepare = id) => {
    if (snapshots.published) {
      // If it exists already, we only want to update it if the revision on the remote server
      // matches what our local state thinks it's at
      published.patch([{unset: ['_reserved_prop_'], ifRevisionID: snapshots.published._rev}])

      // Hack until other mutations support revision locking
      published.createOrReplace({
        ...omit(prepare(snapshots.draft), '_updatedAt'),
        _id: idPair.publishedId
      })
    } else {
      // If the document has not been published, we want to create it - if it suddenly exists
      // before being created, we don't want to overwrite if, instead we want to yield an error
      published.create({
        ...omit(prepare(snapshots.draft), '_updatedAt'),
        _id: idPair.publishedId
      })
    }
    draft.delete()
    return merge(draft.commit(), published.commit())
  }
}
