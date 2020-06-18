import React from 'react'
import {SanityImage} from './sanityImage'

import styles from './diff.css'

export function ImageDiff(props: {node: any}) {
  const {node} = props

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <div>
          {node.fromValue && node.fromValue.asset && <SanityImage asset={node.fromValue.asset} />}
        </div>
        <div style={{textAlign: 'center'}}>&rarr;</div>
        <div>
          {node.toValue && node.toValue.asset && <SanityImage asset={node.toValue.asset} />}
        </div>
      </div>
      {/* <pre>{JSON.stringify(node, null, 2)}</pre> */}
    </div>
  )
}
