import React from 'react'
import {ImageFieldDiff} from '../../image'
import {PortableTextDiffBlock} from './block'

import styles from './diff.css'

export function PortableTextFieldDiff(props: any) {
  const {nodes} = props.node

  return (
    <div className={styles.root}>
      {nodes.map(node => {
        if (node.type === 'block') {
          return (
            <div className={styles.card} key={node.fromValue._key}>
              <PortableTextDiffBlock node={node} />
            </div>
          )
        }

        if (node.type === 'image') {
          return <ImageFieldDiff key={node.fromValue._key} node={node} />
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
