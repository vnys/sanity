import React from 'react'
import {ImageDiff, PTDiff} from './components'

import styles from './tool.css'

export function DiffTool() {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <h1>Diffs</h1>

        <div style={{display: 'grid', gridGap: '1.5em'}}>
          <div>
            <div className={styles.label}>Portable text</div>
            <PTDiff />
          </div>

          <div>
            <div className={styles.label}>Array</div>
            <PTDiff />
          </div>

          <div>
            <div className={styles.label}>Object</div>
            <PTDiff />
          </div>

          <div>
            <div className={styles.label}>Image</div>
            <ImageDiff node={{fromValue: {}, toValue: {}}} />
          </div>
        </div>
      </div>
    </div>
  )
}
