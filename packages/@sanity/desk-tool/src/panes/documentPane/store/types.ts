// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MutationMetadata = any

export interface DocumentTransactionEvent {
  id: string
  timestamp: string
  author: string
  mutations: any[]
  documentIDs: string[]
}

export interface DocumentMutationEvent {
  documentIds: string[]
  mutation: MutationMetadata
  revisionId: string
  timestamp: number
  userId: string
}

export interface DocumentHistoryCreateEvent {
  type: 'create'
  timestamp: number
  revisionId: string
  userId: string
}

export interface DocumentHistoryEditEvent {
  type: 'edit'
  timestamp: number
  revisionId: string
  userId: string
}

export type DocumentHistoryEvent = DocumentHistoryCreateEvent | DocumentHistoryEditEvent
