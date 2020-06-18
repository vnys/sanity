export interface StringDiffChunk {
  type?: 'del' | 'ins'
  text: string
}
