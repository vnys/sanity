import React from 'react'

import styles from './block.css'

function getKey(path: string[]) {
  return path.join('#')
}

function getChunks(child: any, operations: any) {
  const childKey = child._key

  const ops = operations.filter(op => {
    return childKey === getKey(op.path)
  })

  if (ops.length === 0) {
    return [{text: child.text}]
  }

  const chunks: any[] = []

  let offset = 0

  for (const op of ops) {
    if (op.offset > offset) {
      // offset =
      chunks.push({text: child.text.slice(offset, op.offset)})
    }

    if (op.type === 'delText') {
      chunks.push({del: true, text: child.text.slice(op.offset, op.offset + op.length)})
      offset = op.offset + op.length
      // + op.length
    }

    if (op.type === 'insText') {
      // offset = op.offset
      chunks.push({ins: true, text: op.text})
      offset = op.offset //+ op.text.length
    }
  }

  if (offset < child.text.length) {
    chunks.push({text: child.text.slice(offset)})
  }

  return chunks
}

export function PTDiffBlock({node}: any) {
  const children = node.fromValue.children

  return (
    <>
      <div className={styles.root}>
        {children.map(child => {
          if (child._type === 'span') {
            const chunks = getChunks(child, node.operations)

            return (
              <span key={child._key}>
                {chunks.map((chunk, chunkIndex) => {
                  if (chunk.del) {
                    return <del key={chunkIndex}>{chunk.text}</del>
                  }

                  if (chunk.ins) {
                    return <ins key={chunkIndex}>{chunk.text}</ins>
                  }

                  return <span key={chunkIndex}>{chunk.text}</span>
                })}
              </span>
            )
          }

          return <span key={child._key}>unknown child type: {child._type}</span>
        })}
      </div>
      {/* <pre>{JSON.stringify(node, null, 2)}</pre> */}
    </>
  )
}
