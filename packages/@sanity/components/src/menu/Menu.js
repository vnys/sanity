/* eslint-disable react/jsx-no-bind */

import PropTypes from 'prop-types'
import React, {cloneElement, useEffect, useRef, useState} from 'react'
import {getNextFocusableMenuItemIndex, getPreviousFocusableMenuItemIndex} from './helpers'

import styles from './Menu.module.css'

function Menu(props) {
  const {id} = props
  const buttonWrapperElementRef = useRef()
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [focusedMenuItemIndex, setFocusedMenuItemIndex] = useState(-1)

  const handleButtonClick = () => {
    setMenuIsOpen(true)
    setFocusedMenuItemIndex(0)
  }

  const handleButtonKeyDown = evt => {
    if (menuIsOpen) return

    if (evt.key === 'ArrowDown') {
      setMenuIsOpen(true)
      setFocusedMenuItemIndex(getNextFocusableMenuItemIndex(props.children, focusedMenuItemIndex))
    }

    if (evt.key === 'ArrowUp') {
      setMenuIsOpen(true)
      setFocusedMenuItemIndex(
        getPreviousFocusableMenuItemIndex(props.children, focusedMenuItemIndex)
      )
    }
  }

  const handleMenuKeyDown = evt => {
    if (!menuIsOpen) return

    if (evt.key === 'ArrowDown') {
      setFocusedMenuItemIndex(getNextFocusableMenuItemIndex(props.children, focusedMenuItemIndex))
    }

    if (evt.key === 'ArrowUp') {
      setFocusedMenuItemIndex(
        getPreviousFocusableMenuItemIndex(props.children, focusedMenuItemIndex)
      )
    }
  }

  const handleMenuItemClick = () => {
    setTimeout(() => {
      setMenuIsOpen(false)
      setFocusedMenuItemIndex(-1)
      const buttonWrapperElement = buttonWrapperElementRef.current
      if (buttonWrapperElement && buttonWrapperElement.firstChild) {
        buttonWrapperElement.firstChild.focus()
      }
    }, 0)
  }

  const handleMenuItemMouseOver = menuItemIndex => {
    setFocusedMenuItemIndex(menuItemIndex)
  }

  const button = cloneElement(props.button, {
    'aria-controls': `${id}-menu`,
    'aria-haspopup': true,
    id: `${id}-button`,
    onClick: handleButtonClick,
    onKeyDown: handleButtonKeyDown
  })

  const children = props.children.map((child, childIndex) => {
    return cloneElement(child, {
      isFocused: focusedMenuItemIndex === childIndex,
      onClick: evt => {
        if (child.props.onClick) child.props.onClick(evt)
        handleMenuItemClick()
      },
      onMouseOver: () => handleMenuItemMouseOver(childIndex)
    })
  })

  // Capture "click" and "focus" events outside of the menu
  useEffect(() => {
    const handleWindowEvent = evt => {
      if (!evt.target) return
      const menuElement = evt.target.closest(`#${id}-menu`)
      if (!menuElement) {
        // clicked outside
        setMenuIsOpen(false)
        setFocusedMenuItemIndex(-1)
      }
    }
    if (menuIsOpen) {
      window.addEventListener('click', handleWindowEvent)
      window.addEventListener('focus', handleWindowEvent, true)
    }
    return () => {
      if (menuIsOpen) {
        window.removeEventListener('click', handleWindowEvent)
        window.removeEventListener('focus', handleWindowEvent, true)
      }
    }
  }, [id, menuIsOpen])

  return (
    <>
      <div className={styles.buttonWrapper} ref={buttonWrapperElementRef}>
        {button}
      </div>
      <ul
        aria-labelledby={`${id}-menu`}
        className={menuIsOpen ? styles.isMenuOpen : styles.isMenuClosed}
        id={`${id}-menu`}
        onKeyDown={handleMenuKeyDown}
        role="menu"
      >
        {children}
      </ul>
    </>
  )
}

Menu.propTypes = {
  button: PropTypes.node.isRequired,
  children: PropTypes.node,
  id: PropTypes.string.isRequired
}

Menu.defaultProps = {
  children: undefined
}

export default Menu
