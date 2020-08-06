/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-filename-extension */

import React from 'react'
import PublicIcon from 'part:@sanity/base/public-icon'
import BinaryIcon from 'part:@sanity/base/binary-icon'
import HistoryIcon from 'part:@sanity/base/history-icon'
import resolveProductionPreviewUrl from 'part:@sanity/transitional/production-preview/resolve-production-url?'
import Hotkeys from 'part:@sanity/components/typography/hotkeys'
import styles from './menuItems.css'
import {Doc, MenuAction} from '../types'

interface Params {
  canShowHistoryList?: boolean
  isHistoryOpen?: boolean
  isHistoryEnabled?: boolean
  isLiveEditEnabled?: boolean
  rev: string | null
  value: Doc | null
}

const getHistoryMenuItem = (params: Params): MenuAction | null => {
  const {value, isLiveEditEnabled, isHistoryEnabled, isHistoryOpen, canShowHistoryList} = params

  if (isLiveEditEnabled || !canShowHistoryList) {
    return null
  }

  if (isHistoryEnabled) {
    return {
      action: 'browseHistory',
      title: 'Browse history',
      icon: HistoryIcon,
      isDisabled: isHistoryOpen || !value
    }
  }

  return null
}

const getInspectItem = ({value}: Params): MenuAction => ({
  action: 'inspect',
  title: (
    <span className={styles.menuItem}>
      <span className={styles.menuItemLabel}>Inspect</span>
      <span className={styles.hotkey}>
        <Hotkeys keys={['Ctrl', 'Alt', 'I']} size="small" />
      </span>
    </span>
  ),
  icon: BinaryIcon,
  isDisabled: !value
})

export const getProductionPreviewItem = ({value, rev}: Params): MenuAction | null => {
  if (!value || !resolveProductionPreviewUrl) {
    return null
  }

  let previewUrl

  try {
    previewUrl = resolveProductionPreviewUrl(value, rev)
  } catch (error) {
    error.message = `An error was thrown while trying to get production preview url: ${error.message}`
    // eslint-disable-next-line no-console
    console.error(error)
    return null
  }

  if (!previewUrl) {
    return null
  }

  return {
    action: 'production-preview',
    title: (
      <span className={styles.menuItem}>
        <span className={styles.menuItemLabel}>Open preview</span>
        <span className={styles.hotkey}>
          <Hotkeys keys={['Ctrl', 'Alt', 'O']} size="small" />
        </span>
      </span>
    ),
    icon: PublicIcon,
    url: previewUrl
  }
}

export const getMenuItems = (params: Params): MenuAction[] => {
  const items = [getProductionPreviewItem, getHistoryMenuItem, getInspectItem]
    .filter(Boolean)
    .map(fn => fn(params))

  return items.filter(i => i !== null) as MenuAction[]
}
