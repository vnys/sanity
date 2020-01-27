import {OperationArgs} from '../../types'
import {merge} from 'rxjs'
import {returnVoid} from '../../utils/returnVoid'

export const commit = {
  disabled: (): false => false,
  execute: ({draft, published}: OperationArgs): Promise<void> => {
    return merge(draft.commit(), published.commit())
      .toPromise()
      .then(returnVoid)
  }
}
