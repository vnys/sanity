import React from 'react'
import {Position, Size, Theme, Tooltip as BaseTooltip} from 'react-tippy'

import styles from './tooltip.css'

export function Tooltip(props: {
  children: React.ReactNode
  className?: string
  content: React.ReactNode
  disabled?: boolean
  position?: Position
  size?: Size
  theme?: Theme
  title?: string
}) {
  return (
    <BaseTooltip
      className={props.className}
      disabled={props.disabled}
      html={
        <div className={styles.root}>
          <span>{props.content}</span>
        </div>
      }
      arrow
      inertia
      position={props.position}
      theme={props.theme}
      distance={13}
      sticky
      size={props.size}
      title={props.title || ''}
    >
      {props.children}
    </BaseTooltip>
  )
}
