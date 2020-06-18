import React from 'react'
import {StringDiff} from '../../../components/stringDiff'
import {getStringDiffChunks} from '../../../lib/stringDiff'

import styles from './diff.css'

// const mockProps = {
//   node: {
//     type: 'string',
//     fromValue: '',
//     operations: [{type: 'insText', offset: 0, text: 'Hello, world'}]
//   }
// }

export function StringFieldDiff(props: any) {
  const {node} = props
  const chunks = getStringDiffChunks(node.fromValue, node.operations)

  return (
    <div className={styles.root}>
      <div>
        <StringDiff chunks={chunks} />
      </div>
    </div>
  )
}
