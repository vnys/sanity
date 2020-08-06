export {Doc} from '../types'

export type MendozaPatch = unknown[]

export type MendozaEffectPair = {
  apply: MendozaPatch
  revert: MendozaPatch
}

// An "action" represent a single action which can be applied to a document.
// It has information about the patches to apply to the draft and/or published version,
// and what type of action it was.
//
// Be aware that `create` is not a separate action. If you're interested in this
// you need to check if the previous action was a `delete` action.

export {RemoteMutationWithVersion} from '@sanity/base/lib/datastores/document/document-pair/remoteMutations'

export type ChunkType = 'create' | 'editDraft' | 'delete' | 'publish' | 'unpublish' | 'discardDraft'

export type Chunk = {
  id: string
  type: ChunkType
  start: number
  end: number
  startTimestamp: Date
  endTimestamp: Date
  authors: Set<string>
}

// TODO: How should this look?
export type Annotation = any

export type Transaction = {
  id: string
  author: string
  timestamp: Date
  draftEffect?: MendozaEffectPair
  publishedEffect?: MendozaEffectPair
}

export type TransactionLogEvent = {
  id: string
  timestamp: string
  author: string
  documentIDs: string[]
  effects: Record<string, MendozaEffectPair>
}
