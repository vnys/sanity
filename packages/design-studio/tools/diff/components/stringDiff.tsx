import React from 'react'
import {StringDiffChunk} from '../types'

import styles from './stringDiff.css'

export function StringDiff({chunks}: {chunks: StringDiffChunk[]}) {
  return (
    <span className={styles.root}>
      {chunks.map((chunk, chunkIndex) => {
        if (chunk.type === 'del') {
          return <del key={chunkIndex}>{chunk.text}</del>
        }

        if (chunk.type === 'ins') {
          return <ins key={chunkIndex}>{chunk.text}</ins>
        }

        return <span key={chunkIndex}>{chunk.text}</span>
      })}
    </span>
  )
}
