import {OperationArgs} from '../../types'
import {merge} from 'rxjs'

export const del = {
  disabled: ({snapshots}) => (snapshots.draft || snapshots.published ? false : 'NOTHING_TO_DELETE'),
  execute: ({draft, published}: OperationArgs) => {
    draft.delete()
    published.delete()
    return merge(draft.commit(), published.commit())
  }
}
