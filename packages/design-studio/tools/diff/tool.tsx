import React from 'react'
import {PTDiff} from './components'

import styles from './tool.css'

export function DiffTool() {
  return (
    <div className={styles.root}>
      <h1>Diffs</h1>

      <PTDiff />
    </div>
  )
}
