import React from 'react'
import cx from 'classnames'
import styles from './styles/PresenceDock.css'
import Avatar from './Avatar'

export default function PresenceDock({children, presence}) {
  const [topPresence, setTopPresence] = React.useState([])
  const [bottomPresence, setBottomPresence] = React.useState([])

  const rootRef = React.useRef(null)
  const topRef = React.useRef(null)
  const bottomRef = React.useRef(null)

  function sendToDock(scrollContainer, presenceContainers) {
    const topElm = topRef && topRef.current
    const bottomElm = bottomRef && bottomRef.current
    let _topPresence = []
    let _bottomPresence = []
    presenceContainers.forEach(elm => {
      const ids = elm
        .getAttribute('data-presence-container')
        .split(',')
        .filter(id => !!id.trim())
      if (ids.length > 0) {
        // Get y positions of the elements
        // Note: this is only done for fields with actual presence in them, so we can afford a getBoundingClientRect
        const topDockTopY = topElm.getBoundingClientRect().y
        const bottomDockTopY = bottomElm.getBoundingClientRect().y
        const containerTopY = elm.getBoundingClientRect().y

        // Does it belong in either top dock or bottom dock?
        const isBelow =
          containerTopY > scrollContainer.offsetHeight / 2 && containerTopY > bottomDockTopY
        const isAbove =
          containerTopY < scrollContainer.offsetHeight / 2 && containerTopY < topDockTopY

        if (isAbove) {
          _topPresence = _topPresence.concat(ids)
          elm.setAttribute('data-hidden', 'top')
        } else if (isBelow) {
          elm.setAttribute('data-hidden', 'bottom')
          _bottomPresence = _bottomPresence.concat(ids)
        } else {
          elm.removeAttribute('data-hidden')
        }
      }
    })
    setTopPresence(
      _topPresence.map(id => ({
        id,
        position: 'top'
      }))
    )
    setBottomPresence(
      _bottomPresence.map(id => ({
        id,
        position: 'bottom'
      }))
    )
  }

  // Effect that initially sets up a scroll listener
  // for the nearest scroll container, and docks presence to top and bottom
  React.useEffect(() => {
    const rootElm = rootRef && rootRef.current
    const scrollContainer = getScrollContainer(rootElm)
    if (!scrollContainer) {
      console.error("No scrolling container found. You probably don't need a dock here.")
      return
    }
    const presenceContainers = rootElm.querySelectorAll('[data-presence-container]')
    scrollContainer.addEventListener(
      'scroll',
      debounce(() => {
        sendToDock(scrollContainer, presenceContainers)
      }, 100)
    )
    sendToDock(scrollContainer, presenceContainers)
  }, [])

  // Dock the presence containers whenever presence changes
  React.useEffect(() => {
    const rootElm = rootRef && rootRef.current
    const scrollContainer = getScrollContainer(rootElm)
    if (!scrollContainer) {
      return
    }
    const presenceContainers = rootElm.querySelectorAll('[data-presence-container]')
    sendToDock(scrollContainer, presenceContainers)
  }, [presence])

  function scrollToPresence(event) {
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
        {topPresence.map(presence => (
          <Avatar
            key={`${presence.id}-${presence.position}`}
            id={presence.id}
            position={presence.position}
            scrollToField={scrollToPresence}
          />
        ))}
      </div>
      {children}
      <div className={cx(styles.dock, styles.bottom)} ref={bottomRef}>
        {bottomPresence.map(presence => (
          <Avatar
            key={`${presence.id}-${presence.position}`}
            id={presence.id}
            position={presence.position}
            scrollToField={scrollToPresence}
          />
        ))}
      </div>
    </div>
  )
}

// Util to get scroll container
const scrollRegex = /(auto|scroll)/
const style = (node, prop) => getComputedStyle(node, null).getPropertyValue(prop)
const isScroll = node =>
  scrollRegex.test(style(node, 'overflow') + style(node, 'overflow-y') + style(node, 'overflow-x'))
const getScrollContainer = node =>
  !node || node === document.body
    ? document.body
    : isScroll(node)
    ? node
    : getScrollContainer(node.parentNode)
