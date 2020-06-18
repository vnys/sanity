import classNames from 'classnames'
import React from 'react'
import {Tooltip} from '../../../../../components/tooltip'
import {getStringDiffChunks} from '../../../lib/stringDiff'
import {StringDiff} from '../../../components/stringDiff'

import styles from './diff.css'

// const mockProps = {
//   nodes: [
//     {
//       type: 'string',
//       path: [0],
//       fromValue: 'foo',
//       operations: [
//         {type: 'delText', offset: 0, length: 3},
//         {type: 'insText', offset: 3, text: 'qux'}
//       ]
//     },
//     {
//       type: 'string',
//       path: [1],
//       fromValue: undefined,
//       operations: [{type: 'insText', offset: 0, text: 'bar'}]
//     },
//     {
//       type: 'string',
//       path: [2],
//       fromValue: undefined,
//       operations: [{type: 'insText', offset: 0, text: 'baz'}]
//     }
//   ]
// }

function ArrayDiffNode(props: {node: any}) {
  const {node} = props

  if (node.type === 'string') {
    const text = node.fromValue || ''
    const chunks = getStringDiffChunks(text, node.operations)

    return (
      <div className={styles.stringNodeValue}>
        <div>
          <StringDiff chunks={chunks} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.stringNodeValue}>
      <div>
        Unknown node type: <code>{node.type}</code>
      </div>
    </div>
  )
}

export function ArrayFieldDiff(props: any) {
  const {nodes} = props.node

  return (
    <div className={styles.root}>
      {nodes.map(node => {
        const inserted = node.fromValue === undefined

        return (
          <div
            key={node.path.join('/')}
            className={classNames(styles.diffNode, inserted && styles.inserted)}
          >
            <Tooltip content={<>Inserted</>} size="small" theme="light">
              <div className={styles.diffNodePath}>
                <span>{node.path.join('/')}</span>
              </div>
            </Tooltip>
            <div className={styles.diffNodeValueContainer}>
              <ArrayDiffNode node={node} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
