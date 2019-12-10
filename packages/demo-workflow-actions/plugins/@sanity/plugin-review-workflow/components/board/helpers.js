import documentStore from 'part:@sanity/base/datastore/document'
import {of} from 'rxjs'
import {skip, switchMap, take} from 'rxjs/operators'

export function ensureDraft(documentId, typeName) {
  documentStore.local
    .editOpsOf(documentId, typeName)
    .pipe(
      skip(1),
      take(1),
      switchMap(ops => {
        if (ops.unpublish) {
          if (ops.unpublish.disabled) {
            // console.log('unpublish is disabled')
          } else {
            return ops.unpublish.execute()
          }
        }
        return of(ops)
      })
    )
    .subscribe()
}

export function ensurePublished(documentId, typeName) {
  documentStore.local
    .editOpsOf(documentId, typeName)
    .pipe(
      skip(1),
      take(1),
      switchMap(ops => {
        if (ops.publish) {
          if (ops.publish.disabled) {
            // console.log('publish is disabled')
          } else {
            return ops.publish.execute()
          }
        }
        return of(ops)
      })
    )
    .subscribe()
}
