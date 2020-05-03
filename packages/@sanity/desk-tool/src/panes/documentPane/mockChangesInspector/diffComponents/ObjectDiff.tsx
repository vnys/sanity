import * as React from 'react'
import {ObjectDiff as IObjectDiff, Diff} from '../../../../utils/diff'
import FieldDiff from '../FieldDiff'
import styles from './ObjectDiff.css'

interface Props {
  diff: IObjectDiff
  field: any
}

function ObjectFieldDiff({diff, field}: {diff: Diff; field: any}) {
  return (
    <div className={styles.diffCard}>
      <FieldDiff diff={diff} field={field} />
    </div>
  )
}

function ObjectDiff({diff, field}: Props) {
  if (!diff.isChanged) {
    return null
  }

  return (
    <div className={styles.root}>
      <h4 className={styles.title}>{field.type.title}</h4>

      <div className={styles.diffCardList}>
        {field.type.fields.map((subField: any, idx: number) => {
          const subDiff = diff.children[subField.name]
          if (!subDiff) {
            return null
          }

          return <ObjectFieldDiff diff={subDiff} field={subField} key={String(idx)} />
        })}
      </div>
    </div>
  )
}

export default ObjectDiff
