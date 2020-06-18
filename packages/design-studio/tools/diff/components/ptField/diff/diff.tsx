import React from 'react'
import {ImageDiff} from '../../image'
import {PTDiffBlock} from './block'
import mockProps from './mockProps'

import styles from './diff.css'

export function PTDiff() {
  const {nodes} = mockProps

  return (
    <div className={styles.root}>
      {nodes.map(node => {
        if (node.fromValue._type === 'block') {
          return (
            <div className={styles.card} key={node.fromValue._key}>
              <PTDiffBlock node={node} />
            </div>
          )
        }

        if (node.fromValue._type === 'image') {
          return <ImageDiff key={node.fromValue._key} node={node} />
        }

        return (
          <div className={styles.card} key={node.fromValue._key}>
            Unknown item type: <code>{node.fromValue._type}</code>
          </div>
        )
      })}
    </div>
  )
}
