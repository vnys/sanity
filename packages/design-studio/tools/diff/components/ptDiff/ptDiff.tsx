import React from 'react'
import {diff} from './mockProps'

import styles from './ptDiff.css'

function PTDiffNode({index, node}: any) {
  if (node._type === 'block') {
    if (!node.children) return null

    return (
      <div>
        {node.children.map((child, childIndex) => (
          <PTDiffNode key={childIndex} index={childIndex} node={child} />
        ))}
      </div>
    )
  }

  if (node._type === 'span') {
    return <span className={styles.ins}>{node.text}</span>
  }

  return <div>Unknown portable text node: {node._type}</div>
}

export function PTDiff() {
  return (
    <div>
      <div className={styles.label}>Body</div>
      <div className={styles.card}>
        {diff.operations.map((op, opIndex) => {
          if (op.type === 'insert') {
            return (
              <div className={styles.op} key={opIndex}>
                #{op.path.join('/')} insert: <PTDiffNode node={op.value} />
              </div>
            )
          }

          if (op.type === 'patch') {
            return (
              <div className={styles.op} key={opIndex}>
                #{op.path.join('/')} patch
              </div>
            )
          }

          return (
            <div className={styles.op} key={opIndex}>
              #{op.path.join('/')}: unknown operation: {op.type}
            </div>
          )
        })}

        <pre>{JSON.stringify(diff, null, 2)}</pre>
      </div>
    </div>
  )
}
