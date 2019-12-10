import CheckIcon from 'part:@sanity/base/check-icon'
import {createAction} from 'part:@sanity/base/actions/utils'
import {useMetadata} from '../store'
import {inferInitialState} from './_helpers'

export const approveAction = createAction(props => {
  const metadata = useMetadata(props.id, inferInitialState(props))

  if (metadata.state !== 'inReview') {
    return null
  }

  const onHandle = () => {
    metadata.setState('approved')
  }

  return {
    disabled: !metadata,
    icon: CheckIcon,
    label: 'Approve',
    onHandle
  }
})
