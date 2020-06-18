import {StringDiffChunk} from '../types'

export function getStringDiffChunks(text: string, ops: any[]) {
  if (ops.length === 0) return [{text}]

  const chunks: StringDiffChunk[] = []

  let offset = 0

  for (const op of ops) {
    if (op.offset > offset) {
      chunks.push({text: text.slice(offset, op.offset)})
    }

    if (op.type === 'delText') {
      chunks.push({type: 'del', text: text.slice(op.offset, op.offset + op.length)})
      offset = op.offset + op.length
    }

    if (op.type === 'insText') {
      chunks.push({type: 'ins', text: op.text})
      offset = op.offset
    }
  }

  if (offset < text.length) {
    chunks.push({text: text.slice(offset)})
  }

  return chunks
}
