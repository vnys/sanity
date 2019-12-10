import {createAction} from 'part:@sanity/base/actions/utils'
import CloseIcon from 'part:@sanity/base/close-icon'
import {useMetadata} from '../store'
import {inferInitialState} from './_helpers'
import {useDocumentOperation} from '@sanity/react-hooks'

export const unpublishAction = createAction(props => {
  const ops = useDocumentOperation(props.id, props.type)
  const metadata = useMetadata(props.id, inferInitialState(props))

  if (metadata && metadata.state !== 'published') {
    return null
  }

  const onHandle = async () => {
    if (ops.unpublish.disabled) return

    metadata.setState('draft')

    await ops.unpublish.execute()
  }

  return {
    disabled: Boolean(ops.unpublish.disabled || !metadata),
    icon: CloseIcon,
    keyboardShortcut: ['mod', 'shift', 'u'],
    label: 'Unpublish',
    onHandle
  }
})
