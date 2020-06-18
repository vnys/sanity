import React from 'react'
import {ImageFieldDiff} from '../image'
import {StringFieldDiff} from '../string'
import {useSchemaType} from '../../schema'

import styles from './diff.css'

function CustomDiffField({node}: {node: any}) {
  const schemaType = useSchemaType(node.type)

  if (!schemaType) {
    return (
      <div>
        Unknown node type: <code>{node.type}</code>
      </div>
    )
  }

  return <div>CustomDiffField</div>
}

function DiffField({fields, node}: {fields: any; node: any}) {
  const field = fields.find(f => f.name === node.key)

  if (!field) {
    return (
      <div>
        Unknown field key: <code>{node.key}</code>
      </div>
    )
  }

  if (node.type === 'string') {
    return (
      <div className={styles.field}>
        <div className={styles.label}>{field.title}</div>
        <div className={styles.diffNode}>
          <StringFieldDiff node={node} />
        </div>
      </div>
    )
  }

  if (node.type === 'image') {
    return (
      <div className={styles.field}>
        <div className={styles.label}>{field.title}</div>
        <div className={styles.diffNode}>
          <ImageFieldDiff node={node} />
        </div>
      </div>
    )
  }

  return <CustomDiffField node={node} />
}

export function ObjectFieldDiff(props: any) {
  const {fields, nodes} = props.node

  return (
    <div className={styles.root}>
      {nodes.map(node => {
        return <DiffField fields={fields} key={node.key} node={node} />
      })}
    </div>
  )
}
