import React from 'react'
import userStore from 'part:@sanity/base/user'
import PropTypes from 'prop-types'
import styles from './styles/Activity.css'

export default function Activity({id, position, children, scrollToActivity}) {
  const [user, setUser] = React.useState(null)
  React.useEffect(() => {
    if (id) {
      userStore.getUser(id).then(result => {
        setUser(result)
      })
    }
  }, [user])

  function handleScrollToActivity(event) {
    if (scrollToActivity) {
      scrollToActivity(event)
    }
  }

  return (
    <div className={styles.root} onClick={handleScrollToActivity} data-dock={position}>
      <div className={styles.avatar} data-status={status}>
        <div className={styles.inner}>{children}</div>
      </div>
      <div className={styles.arrow} data-dock={position}>
        <svg viewBox="0 0 6 6">
          <path d="M0 6L3 0L6 6H4H2H0Z" />
        </svg>
      </div>
    </div>
  )
}

Activity.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  position: PropTypes.string,
  scrollToActivity: PropTypes.func
}

Activity.defaultProps = {
  id: null,
  position: null,
  scrollToActivity: null
}
