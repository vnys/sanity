import React from 'react'
import {
  ArrayFieldDiff,
  ImageFieldDiff,
  ObjectFieldDiff,
  PortableTextFieldDiff,
  StringFieldDiff
} from './fields'
import mockProps from './mockProps'
import mockSchema from './mockSchema'
import {SchemaProvider} from './schema'

import styles from './tool.css'

function FieldDiff({field, node}: {field: any; node: any}) {
  if (node.type === 'array') {
    const isPortableText = field.of.filter(n => n.type === 'block').length > 0

    if (isPortableText) {
      return <PortableTextFieldDiff node={node} />
    }

    return <ArrayFieldDiff node={node} />
  }

  if (node.type === 'image') {
    return <ImageFieldDiff node={node} />
  }

  if (node.type === 'object') {
    return <ObjectFieldDiff node={node} />
  }

  if (node.type === 'string') {
    return <StringFieldDiff node={node} />
  }

  return <div>{node.type}</div>
}

export function DiffTool() {
  const {fields, nodes} = mockProps

  return (
    <SchemaProvider schema={mockSchema}>
      <div className={styles.root}>
        <div className={styles.container}>
          <h1 className={styles.heading}>{nodes.length} changed fields</h1>

          <div className={styles.fieldList}>
            {nodes.map(node => {
              const field = fields.find(f => f.name === node.key)

              if (!field) {
                return (
                  <div>
                    Field not found: <code>{node.key}</code>
                  </div>
                )
              }

              return (
                <div key={node.key}>
                  <div className={styles.label}>{field.title}</div>
                  <FieldDiff field={field} node={node} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </SchemaProvider>
  )
}
