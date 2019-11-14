import PropTypes from 'prop-types'
import React, {useEffect, useRef} from 'react'

import styles from './MenuItem.module.css'

function MenuItem(props) {
  const {disabled, isFocused, label, onClick, onMouseOver} = props

  const buttonElementRef = useRef()

  useEffect(() => {
    if (isFocused) {
      const buttonElement = buttonElementRef.current
      if (buttonElement) {
        buttonElement.focus()
      }
    }
  }, [isFocused])

  return (
    <li className={styles.root} role="presentation" tabIndex={-1}>
      <button
        aria-label={label}
        disabled={disabled}
        ref={buttonElementRef}
        onClick={disabled ? undefined : onClick}
        onMouseOver={disabled ? undefined : onMouseOver}
        role="menuitem"
        type="button"
        tabIndex={-1}
      >
        <div tabIndex={-1}>
          <span className={styles.label}>{label}</span>
        </div>
      </button>
    </li>
  )
}

MenuItem.propTypes = {
  disabled: PropTypes.bool,
  isFocused: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func
}

MenuItem.defaultProps = {
  disabled: false,
  isFocused: false,
  onClick: undefined,
  onMouseOver: undefined
}

export default MenuItem
