import {snapshotPair} from './snapshotPair'
import {OperationArgs} from '../types'
import {map, switchMap} from 'rxjs/operators'
import {combineLatest} from 'rxjs'

export function operationArgs(idPair, typeName) {
  return snapshotPair(idPair).pipe(
    switchMap(versions =>
      combineLatest([versions.draft.snapshots$, versions.published.snapshots$]).pipe(
        map(
          ([draft, published]): OperationArgs => ({
            idPair,
            typeName: typeName,
            snapshots: {draft, published},
            draft: versions.draft,
            published: versions.published
          })
        )
      )
    )
  )
}
