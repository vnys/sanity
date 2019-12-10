import React from 'react'
import SelectAssignee from './SelectAssignee'
import SelectDocType from './SelectDocType'

import styles from './Navbar.css'

export default function Navbar(props) {
  return (
    <div className={styles.root}>
      <div>
        <label>Filter by assignee</label>
        <div>
          <SelectAssignee onChange={props.onAssigneeFilterChange} />
        </div>
      </div>

      <div>
        <label>Filter by type</label>
        <div>
          <SelectDocType onChange={props.onDocTypeChange} />
        </div>
      </div>
    </div>
  )
}
