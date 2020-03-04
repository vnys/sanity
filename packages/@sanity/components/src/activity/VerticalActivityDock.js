import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import {debounce} from 'lodash'
import styles from './styles/ActivityDock.css'
import Activity from './Activity'
import {getScrollContainer} from './util'

export default function VerticalActivityDock({children, activity, renderActivity}) {
  const [topActivity, setTopActivity] = React.useState([])
  const [bottomActivity, setBottomActivity] = React.useState([])

  const rootRef = React.useRef(null)
  const topRef = React.useRef(null)
  const bottomRef = React.useRef(null)

  function sendToDock(scrollContainer, activityContainers) {
    const topElm = topRef && topRef.current
    const bottomElm = bottomRef && bottomRef.current
    let _topActivity = []
    let _bottomActivity = []
    activityContainers.forEach(elm => {
      const ids = elm
        .getAttribute('data-activity-container')
        .split(',')
        .filter(id => !!id.trim())
      if (ids.length > 0) {
        // Get y positions of the elements
        // Note: this is only done for fields with actual activity in them, so we can afford a getBoundingClientRect
        const topDockTopY = topElm.getBoundingClientRect().y
        const bottomDockTopY = bottomElm.getBoundingClientRect().y
        const containerTopY = elm.getBoundingClientRect().y

        // Does it belong in either top dock or bottom dock?
        const isBelow =
          containerTopY > scrollContainer.offsetHeight / 2 && containerTopY > bottomDockTopY
        const isAbove =
          containerTopY < scrollContainer.offsetHeight / 2 && containerTopY < topDockTopY

        if (isAbove) {
          _topActivity = _topActivity.concat(ids)
          elm.setAttribute('data-hidden', 'top')
        } else if (isBelow) {
          elm.setAttribute('data-hidden', 'bottom')
          _bottomActivity = _bottomActivity.concat(ids)
        } else {
          elm.removeAttribute('data-hidden')
        }
      }
    })
    setTopActivity(
      _topActivity.map(id => ({
        id,
        position: 'top'
      }))
    )
    setBottomActivity(
      _bottomActivity.map(id => ({
        id,
        position: 'bottom'
      }))
    )
  }

  // Effect that initially sets up a scroll listener
  // for the nearest scroll container, and docks activity to top and bottom
  React.useEffect(() => {
    const rootElm = rootRef && rootRef.current
    const scrollContainer = getScrollContainer(rootElm)
    if (!scrollContainer) {
      console.error("No scrolling container found. You probably don't need a dock here.") // eslint-disable-line no-console
      return
    }
    const activityContainers = rootElm.querySelectorAll('[data-activity-container]')
    scrollContainer.addEventListener(
      'scroll',
      debounce(() => {
        sendToDock(scrollContainer, activityContainers)
      }, 100)
    )
    sendToDock(scrollContainer, activityContainers)
  }, [])

  // Dock the activity containers whenever activity changes
  React.useEffect(() => {
    const rootElm = rootRef && rootRef.current
    const scrollContainer = getScrollContainer(rootElm)
    if (!scrollContainer) {
      return
    }
    const activityContainers = rootElm.querySelectorAll('[data-activity-container]')
    sendToDock(scrollContainer, activityContainers)
  }, [activity])

  function scrollToActivity(event) {
    const position = event.currentTarget.getAttribute('data-dock')
    if (position === 'top') {
      event.currentTarget.scrollIntoView({behavior: 'smooth', block: 'end'})
    } else {
      event.currentTarget.scrollIntoView({behavior: 'smooth'})
    }
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={cx(styles.dock, styles.top)} ref={topRef}>
        {topActivity.map(act => (
          <Activity
            key={`${act.id}-${act.position}`}
            id={act.id}
            position={act.position}
            scrollToField={scrollToActivity}
          >
            {renderActivity(act)}
          </Activity>
        ))}
      </div>
      {children}
      <div className={cx(styles.dock, styles.bottom)} ref={bottomRef}>
        {bottomActivity.map(act => (
          <Activity
            key={`${act.id}-${act.position}`}
            id={act.id}
            position={act.position}
            scrollToField={scrollToActivity}
          >
            {renderActivity(activity)}
          </Activity>
        ))}
      </div>
    </div>
  )
}

VerticalActivityDock.propTypes = {
  children: PropTypes.node,
  activity: PropTypes.array(),
  renderActivity: PropTypes.func
}
