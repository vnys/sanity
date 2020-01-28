import {useDocumentOperation} from '@sanity/react-hooks'
import {defaultActions} from 'part:@sanity/base/document-actions'
import {
  ConfirmDialogAction,
  ModalDialogAction,
  PopoverDialogAction
} from './test-action-tool/actions/DialogActions'

function TestAction() {
  return {
    label: 'A custom action',
    title: `An action that doesn't do anything particular`
  }
}

function PublishNowAction({type, id, onComplete}) {
  const {publish, patch} = useDocumentOperation(id, type)
  return {
    label: 'Publish now',
    onHandle: () => {
      patch.execute([
        {
          set: {
            publishedAt: new Date().toISOString()
          }
        }
      ])
      publish.execute()
      onComplete()
    }
  }
}

export default function resolveDocumentActions(editState, type) {
  return [
    PublishNowAction,
    ...defaultActions,
    TestAction,
    PopoverDialogAction,
    ModalDialogAction,
    ConfirmDialogAction
  ]
}
