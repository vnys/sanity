import * as React from 'react'
import FieldDiff from './FieldDiff'

import styles from './ChangesInspector.css'

// mock props:
import {documentDiff} from './mockProps'

// mock schema:
const mockSchema = {
  type: 'document',
  name: 'post',
  fields: [
    {type: 'string', name: 'title', title: 'Title'},
    {type: 'array', name: 'authors', title: 'Authors'},
    {type: 'boolean', name: 'isPublished', title: 'Is published'},
    {type: 'color', name: 'color', title: 'Color'},
    {type: 'date', name: 'publishedAt', title: 'Published at'},
    {
      type: 'object',
      name: 'seo',
      title: 'SEO',
      fields: [{type: 'string', name: 'title', title: 'Title'}]
    }
  ]
}

function ChangesInspector(props: any) {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h3 className={styles.title}>Changes</h3>
      </header>

      <div className={styles.diffCardList}>
        {mockSchema.fields.map(field => {
          const diff = documentDiff.fields[field.name]

          if (!diff) return null

          return (
            <div className={styles.diffCard} key={field.name}>
              <FieldDiff diff={diff.diff} field={field} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ChangesInspector
