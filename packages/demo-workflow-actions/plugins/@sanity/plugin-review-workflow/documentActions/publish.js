import {createAction} from 'part:@sanity/base/actions/utils'
import PublishIcon from 'react-icons/lib/md/publish'
import {useMetadata} from '../store'
import {inferInitialState} from './_helpers'
import {useDocumentOperation} from '@sanity/react-hooks'

export const publishAction = createAction(props => {
  const ops = useDocumentOperation(props.id, props.type)
  const metadata = useMetadata(props.id, inferInitialState(props))

  if (props.liveEdit || metadata.state === 'published') {
    return null
  }

  const onHandle = async () => {
    if (ops.publish.disabled) return

    metadata.setState('published')

    await ops.publish.execute()
  }

  return {
    disabled: Boolean(ops.publish.disabled || !metadata),
    icon: PublishIcon,
    keyboardShortcut: ['mod', 'shift', 'p'],
    label: 'Publish',
    onHandle
  }
})
