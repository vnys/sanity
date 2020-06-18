import React from 'react'
import {getKey} from '../../../lib/key'
import {getStringDiffChunks} from '../../../lib/stringDiff'
import {StringDiff} from '../../../components/stringDiff'

import styles from './block.css'

export function PortableTextDiffBlock({node}: any) {
  const children = node.fromValue.children

  return (
    <div className={styles.root}>
      {children.map(child => {
        if (child._type === 'span') {
          const text = child.text
          const childKey = child._key
          const ops = node.operations.filter(op => childKey === getKey(op.path))
          const chunks = getStringDiffChunks(text, ops)

          return <StringDiff chunks={chunks} key={child._key} />
        }

        return <span key={child._key}>unknown child type: {child._type}</span>
      })}
    </div>
  )
}
