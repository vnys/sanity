/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as React from 'react'
import CheckIcon from 'part:@sanity/base/check-icon'
import SyncIcon from 'part:@sanity/base/sync-icon'
import styles from './SyncState.css'
import {useSyncState, useConnectionState} from '@sanity/react-hooks'

interface Props {
  id: string
  type: string
}

export function SyncState(props: Props) {
  const {isSyncing} = useSyncState(props.id, props.type)
  const connectionState = useConnectionState(props.id, props.type)

  const isConnected = connectionState === 'connected'

  const icon = isSyncing || !isConnected ? <SyncIcon /> : <CheckIcon />
  const className = isSyncing
    ? styles.isSyncing
    : !isConnected
    ? styles.isDisconnected
    : styles.statusIcon

  return <span className={className}>{icon}</span>
}
