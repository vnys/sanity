import * as React from 'react'
import {diffObject} from '../../../utils/diff'
import {Doc} from '../types'
import FieldDiff from './FieldDiff'

import styles from './ChangesInspector.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Schema = any

interface Props {
  fromValue: Doc | null
  isLoading: boolean
  onHistoryClose: () => void
  toValue: Doc | null
  schemaType: Schema
}

function ChangesInspector(props: Props): React.ReactElement {
  const {fromValue, toValue, schemaType} = props
  const docDiff = React.useMemo(() => diffObject(fromValue, toValue, []), [fromValue, toValue])
  const fieldDiffs = docDiff ? docDiff.children : {}

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h3 className={styles.title}>Changes</h3>
      </header>

      <div className={styles.diffCardList}>
        {schemaType.fields.map(field => {
          const diff = fieldDiffs[field.name]
          if (!diff) {
            return null
          }

          return (
            <div className={styles.diffCard} key={field.name}>
              <FieldDiff diff={diff} field={field} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ChangesInspector
