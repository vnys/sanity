import {combineLatest, Observable} from 'rxjs'
import {map, publishReplay, refCount, switchMap} from 'rxjs/operators'
import {IdPair, SanityDocument} from '../types'
import {snapshotPair} from './snapshotPair'
import {createObservableCache} from '../utils/createObservableCache'
import {isLiveEditEnabled} from './utils/isLiveEditEnabled'

export interface EditState {
  id: string
  type: string
  draft: null | SanityDocument
  published: null | SanityDocument
}

const cacheOn = createObservableCache<EditState>()

export function editStateOf(idPair: IdPair, typeName: string): Observable<EditState> {
  return snapshotPair(idPair).pipe(
    switchMap(({draft, published}) => combineLatest([draft.snapshots$, published.snapshots$])),
    map(([draftSnapshot, publishedSnapshot]) => ({
      id: idPair.publishedId,
      type: typeName,
      draft: draftSnapshot,
      published: publishedSnapshot,
      liveEdit: isLiveEditEnabled(typeName)
    })),
    publishReplay(1),
    refCount(),
    cacheOn(idPair.publishedId)
  )
}
