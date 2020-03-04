import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles/ActivityContainer.css'
import Activity from './Activity'

export default function ActivityContainer({activity}) {
  return (
    <div className={styles.root} data-activity-container={activity && activity.map(act => act.id)}>
      {activity && activity.map(act => <Activity key={act.id} id={act.id} />)}
    </div>
  )
}

ActivityContainer.propTypes = {
  activity: PropTypes.arrayOf(PropTypes.shapeOf({id: PropTypes.string}))
}
