/* eslint-disable react/prop-types */
import React, {FunctionComponent, SyntheticEvent} from 'react'
import classNames from 'classnames'
import {PortableTextChild, Type, RenderAttributes} from '@sanity/portable-text-editor'

import {PatchEvent} from '../../../PatchEvent'
import {Marker} from '../../../typedefs'
import {Path} from '../../../typedefs/path'

import styles from './Annotation.css'
import {FOCUS_TERMINATOR} from '@sanity/util/paths'

type Props = {
  value: PortableTextChild
  type: Type
  children: JSX.Element
  attributes: RenderAttributes
  readOnly: boolean
  markers: Marker[]
  focusPath: Path
  onFocus: (arg0: Path) => void
  onChange: (patchEvent: PatchEvent, path: Path) => void
}

export const Annotation: FunctionComponent<Props> = ({
  children,
  markers,
  attributes: {focused, selected, path},
  value,
  onFocus
}) => {
  const validation = markers.filter(marker => marker.type === 'validation')
  const errors = validation.filter(marker => marker.level === 'error')
  const classnames = classNames([
    styles.root,
    focused && styles.focused,
    selected && styles.selected,
    errors.length > 0 && styles.hasErrors
  ])

  const handleOpen = (event: SyntheticEvent<HTMLSpanElement>): void => {
    event.preventDefault()
    event.stopPropagation()
    onFocus([...path.slice(0, 1), 'markDefs', {_key: value._key}, FOCUS_TERMINATOR])
  }

  return (
    <span className={classnames} onClick={handleOpen}>
      {children}
    </span>
  )
}
