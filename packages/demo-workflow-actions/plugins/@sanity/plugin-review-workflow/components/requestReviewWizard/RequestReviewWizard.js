import React from 'react'
import Button from 'part:@sanity/components/buttons/default'
import PopOverDialog from 'part:@sanity/components/dialogs/popover'
import {AssigneesInput} from '../assigneesInput'

import styles from './RequestReviewWizard.css'

function RequestReviewWizard(props) {
  const [value, setValue] = React.useState(props.metadata.assignees || [])

  const inputProps = {
    onAdd(userId) {
      const idx = value.indexOf(userId)
      if (idx > -1) return
      setValue(value.concat([userId]))
    },

    onClear() {
      setValue([])
    },

    onRemove(userId) {
      const idx = value.indexOf(userId)
      if (idx === -1) return
      const newValue = value.slice(0)
      newValue.splice(idx, 1)
      setValue(newValue)
    }
  }

  const handleSend = () => {
    if (props.onSend) props.onSend(value)
  }

  return (
    <PopOverDialog
      onClickOutside={props.onClose}
      padding="none"
      placement="top"
      useOverlay={false}
      hasAnimation
    >
      <AssigneesInput {...inputProps} value={value} />
      <div className={styles.buttonContainer}>
        <Button
          color={value.length === 0 ? undefined : 'primary'}
          disabled={value.length === 0}
          onClick={handleSend}
        >
          Send request
        </Button>
      </div>
    </PopOverDialog>
  )
}

export default RequestReviewWizard
