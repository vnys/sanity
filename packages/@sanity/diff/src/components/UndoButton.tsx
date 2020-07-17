import * as React from 'react'
import UndoIcon from 'part:@sanity/base/undo-icon'
import Button from 'part:@sanity/components/buttons/default'
import {DiffContext} from './diffContext'
import {useUndo} from '../operations/undoChange'

export const UndoButton = () => {
  const diffContext = React.useContext(DiffContext)
  return diffContext.isFallback ? null : <UndoChangeButton />
}

function UndoChangeButton() {
  const undoChange = useUndo()
  return <Button aria-label="Undo" icon={UndoIcon} kind="secondary" onClick={undoChange} />
}
