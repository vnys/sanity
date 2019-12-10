import React from 'react'
import {createAction} from 'part:@sanity/base/actions/utils'
import EyeIcon from 'part:@sanity/base/eye-icon'
import {useMetadata} from '../store'
import {RequestReviewWizard} from '../components/requestReviewWizard'
import {inferInitialState} from './_helpers'

export const requestReviewAction = createAction(props => {
  const [showWizardDialog, setShowWizardDialog] = React.useState(false)
  const metadata = useMetadata(props.id, inferInitialState(props))

  if (metadata && !['draft', 'changesRequested'].includes(metadata.state)) {
    return null
  }

  const onHandle = async () => {
    if (!showWizardDialog) {
      setShowWizardDialog(true)
    }
  }

  const onSend = assignees => {
    setShowWizardDialog(false)

    if (assignees.length === 0) {
      metadata.clearAssignees()
    } else {
      metadata.setAssignees(assignees)
    }

    metadata.setState('inReview')
  }

  return {
    dialog: showWizardDialog && {
      type: 'legacy',
      content: (
        <RequestReviewWizard
          metadata={metadata}
          onClose={() => setShowWizardDialog(false)}
          onSend={onSend}
        />
      )
    },
    disabled: showWizardDialog || !metadata,
    icon: EyeIcon,
    label: 'Request review',
    onHandle
  }
})
