import {OperationArgs} from '../../types'
import {omit} from 'lodash'
import {isLiveEditEnabled} from '../utils/isLiveEditEnabled'

export const patch = {
  disabled: (): false => false,
  execute: ({snapshots, idPair, draft, published, typeName}: OperationArgs, patches = []): void => {
    if (isLiveEditEnabled(typeName)) {
      // No drafting, so patch and commit the published document
      published.createIfNotExists({
        _id: idPair.publishedId,
        _type: typeName
      })
      published.patch(patches)
    } else {
      draft.createIfNotExists({
        ...omit(snapshots.published, '_updatedAt'),
        _id: idPair.draftId,
        _type: typeName
      })
      draft.patch(patches)
    }
  }
}
