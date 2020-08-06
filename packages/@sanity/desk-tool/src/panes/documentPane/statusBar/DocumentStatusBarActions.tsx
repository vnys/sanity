/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-handler-names */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-multi-comp */

import {useEditState, useConnectionState} from '@sanity/react-hooks'
import React from 'react'
import {Tooltip} from 'react-tippy'
import Button from 'part:@sanity/components/buttons/default'
import Hotkeys from 'part:@sanity/components/typography/hotkeys'
import {RenderActionCollectionState} from 'part:@sanity/base/actions/utils'
import resolveDocumentActions from 'part:@sanity/base/document-actions/resolver'

import {HistoryRestoreAction} from '../../../actions/HistoryRestoreAction'
import styles from './DocumentStatusBarActions.css'
import {ActionMenu} from './ActionMenu'
import {ActionStateDialog} from './ActionStateDialog'

const TOUCH_SUPPORT = 'ontouchstart' in document.documentElement

interface Props {
  id: string
  type: string
  states: any[]
  disabled: boolean
  isMenuOpen: boolean
  showMenu: boolean
  onMenuOpen: () => void
  onMenuClose: () => void
}

function ConditionalTooltip(
  props: React.ComponentProps<typeof Tooltip> & {children: any; show: boolean}
) {
  const {show, ...rest} = props
  return props.show ? <Tooltip {...rest} /> : rest.children
}

function DocumentStatusBarActionsInner(props: Props) {
  const {states, showMenu} = props
  const [firstActionState, ...menuActionStates] = states

  return (
    <div className={props.isMenuOpen ? styles.isMenuOpen : styles.root}>
      {firstActionState && (
        <div className={styles.mainAction}>
          <ConditionalTooltip
            show={firstActionState.title || firstActionState.shortcut}
            arrow
            theme="light"
            hideOnClick={false}
            disabled={TOUCH_SUPPORT}
            className={styles.tooltip}
            html={
              <div className={styles.tooltipBox}>
                {firstActionState.title && (
                  <span className={styles.tooltipTitle}>{firstActionState.title}</span>
                )}
                {firstActionState.shortcut && (
                  <span className={styles.tooltipHotkeys}>
                    <Hotkeys keys={String(firstActionState.shortcut).split('+')} size="small" />
                  </span>
                )}
              </div>
            }
          >
            <Button
              className={
                showMenu ? styles.mainActionButtonWithMoreActions : styles.mainActionButton
              }
              icon={firstActionState.icon}
              color={firstActionState.disabled ? undefined : firstActionState.color || 'primary'}
              disabled={props.disabled || Boolean(firstActionState.disabled)}
              aria-label={firstActionState.title}
              onClick={firstActionState.onHandle}
            >
              {firstActionState.label}
            </Button>
          </ConditionalTooltip>
          {firstActionState.dialog && <ActionStateDialog dialog={firstActionState.dialog} />}
        </div>
      )}
      {showMenu && menuActionStates.length > 0 && (
        <ActionMenu
          actionStates={menuActionStates}
          isOpen={props.isMenuOpen}
          onOpen={props.onMenuOpen}
          onClose={props.onMenuClose}
          disabled={props.disabled}
        />
      )}
    </div>
  )
}

export function DocumentStatusBarActions(props: {id: string; type: string}) {
  const editState: any = useEditState(props.id, props.type)
  const connectionState = useConnectionState(props.id, props.type)

  const [isMenuOpen, setMenuOpen] = React.useState(false)

  const actions = editState ? resolveDocumentActions(editState) : null

  return actions ? (
    <RenderActionCollectionState
      component={DocumentStatusBarActionsInner}
      isMenuOpen={isMenuOpen}
      showMenu={actions.length > 1}
      onMenuOpen={() => setMenuOpen(true)}
      onMenuClose={() => setMenuOpen(false)}
      onActionComplete={() => setMenuOpen(false)}
      actions={actions}
      actionProps={editState}
      disabled={connectionState !== 'connected'}
    />
  ) : null
}

interface HistoryStatusBarActionsProps {
  id: string
  type: string
  revision: string
}

const historyActions = [HistoryRestoreAction]

export function HistoryStatusBarActions(props: HistoryStatusBarActionsProps) {
  const editState: any = useEditState(props.id, props.type)
  const connectionState = useConnectionState(props.id, props.type)

  if (!editState) {
    return null
  }

  const disabled = (editState.draft || editState.published || {})._rev === props.revision

  const actionProps = {...editState, revision: props.revision}
  return (
    <RenderActionCollectionState
      component={DocumentStatusBarActionsInner}
      actions={historyActions}
      actionProps={actionProps}
      disabled={connectionState !== 'connected' || Boolean(disabled)}
    />
  )
}
