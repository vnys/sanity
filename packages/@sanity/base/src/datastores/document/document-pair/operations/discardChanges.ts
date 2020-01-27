import {OperationArgs} from '../../types'
import {returnVoid} from '../../utils/returnVoid'

export const discardChanges = {
  disabled: ({snapshots}: OperationArgs) => {
    if (!snapshots.draft) {
      return 'NO_CHANGES'
    }
    if (!snapshots.published) {
      return 'NOT_PUBLISHED'
    }
    return false
  },
  execute: ({draft}: OperationArgs): Promise<void> => {
    draft.delete()
    return draft
      .commit()
      .toPromise()
      .then(returnVoid)
  }
}
