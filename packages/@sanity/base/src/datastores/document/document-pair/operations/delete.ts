import {OperationArgs} from '../../types'
import {merge} from 'rxjs'
import {returnVoid} from '../../utils/returnVoid'

export const del = {
  disabled: ({snapshots}) => (snapshots.draft || snapshots.published ? false : 'NOTHING_TO_DELETE'),
  execute: ({draft, published}: OperationArgs): Promise<void> => {
    draft.delete()
    published.delete()
    return merge(draft.commit(), published.commit())
      .toPromise()
      .then(returnVoid)
  }
}
