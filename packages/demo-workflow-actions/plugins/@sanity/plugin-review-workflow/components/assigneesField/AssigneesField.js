import FormField from 'part:@sanity/components/formfields/default'
import {insert, PatchEvent, setIfMissing, unset} from 'part:@sanity/form-builder/patch-event'
import React from 'react'
import {AssigneesInput} from '../assigneesInput'

import styles from './AssigneesField.css'

const AssigneesField = React.forwardRef((props, focusableRef) => {
  const {type: schemaType, value} = props

  const inputProps = {
    onAdd(userId) {
      const position = 'after'
      const atIndex = value ? value.length - 1 : -1
      props.onChange(
        PatchEvent.from([
          // Create array if not already set
          setIfMissing([]),
          insert([userId], position, [atIndex])
        ])
      )
    },

    // TODO:
    // onBlur: props.onBlur,
    // onFocus: props.onFocus,

    onClear() {
      props.onChange(PatchEvent.from([unset()]))
    },

    onRemove(userId) {
      const index = value.indexOf(userId)
      if (index === -1) return
      props.onChange(PatchEvent.from([unset([index])]))
    }
  }

  return (
    <FormField description={schemaType.description} label={schemaType.title}>
      <div className={styles.field}>
        <AssigneesInput {...inputProps} props={props} ref={focusableRef} value={value} />
      </div>
    </FormField>
  )
})

export default AssigneesField
