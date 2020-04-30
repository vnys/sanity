/* eslint-disable react/prop-types */
import React, {FunctionComponent} from 'react'
import {isEqual} from 'lodash'
import {PortableTextChild, Type} from '@sanity/portable-text-editor'

import Preview from '../../../Preview'
import {EditObject} from './EditObject'
import {PatchEvent} from '../../../PatchEvent'
import {Marker} from '../../../typedefs'
import {Path} from '../../../typedefs/path'

type Props = {
  value: PortableTextChild
  type: Type
  referenceElement: React.RefObject<HTMLSpanElement>
  readOnly: boolean
  markers: Marker[]
  focusPath: Path
  handleChange: (patchEvent: PatchEvent) => void
  onFocus: (arg0: Path) => void
  onBlur: () => void
}

export const InlineObject: FunctionComponent<Props> = ({
  value,
  type,
  readOnly,
  markers,
  focusPath,
  referenceElement,
  handleChange,
  onFocus,
  onBlur
}) => {
  const [isEditing, setEditingInlineBlock] = React.useState(false)
  // const validation = markers.filter(marker => marker.type === 'validation')
  // const errors = validation.filter(marker => marker.level === 'error')
  // const classnames = classNames([
  //   styles.root,
  //   editor.value.selection.focus.isInNode(node) && styles.focused,
  //   isSelected && styles.selected,
  //   errors.length > 0 && styles.hasErrors
  // ])

  // const focusPath = [{_key: block._key}, 'children', {_key: child._key}, FOCUS_TERMINATOR]
  // TODO: Path and focuspath needs to be fixed.
  const path = [{_key: value._key}]

  const handleOpen = (): void => {
    // setTimeout(() => {
    //   onFocus(focusPath)
    // }, 100)
    setEditingInlineBlock(true)
  }

  const handleClose = (event): void => {
    event.stopPropagation()
    setEditingInlineBlock(false)
  }

  // const handleView = (): any => {
  //   onFocus(focusPath)
  // }

  const valueKeys = value ? Object.keys(value) : []
  const isEmpty = !value || isEqual(valueKeys.sort(), ['_key', '_type'].sort())
  return (
    <span
      // className={classnames}
      contentEditable={false}
    >
      {isEditing && (
        <EditObject
          value={value}
          type={type}
          path={path}
          referenceElement={referenceElement}
          readOnly={readOnly}
          markers={markers}
          focusPath={focusPath}
          onFocus={onFocus}
          onBlur={onBlur}
          handleChange={handleChange}
          handleClose={handleClose}
        />
      )}
      <span
        onClick={readOnly ? () => {} : handleOpen}
        // className={styles.previewContainer}
        style={readOnly ? {cursor: 'default'} : {}} // TODO: Probably move to styles aka. className?
      >
        {!isEmpty && <Preview type={type} value={value} layout="inline" />}
        {isEmpty && !readOnly && <span>Click to edit</span>}
      </span>
    </span>
  )
}
