/* eslint-disable react/button-has-type */

import PropTypes from 'prop-types'
import React from 'react'

import styles from './Button.module.css'

function Button(props) {
  const {children, color, disabled, href, onClick, type, ...restProps} = props

  const _children = <div tabIndex={-1}>{children}</div>

  const handleClick = evt => {
    if (disabled) {
      evt.preventDefault()
      return
    }

    onClick(evt)
  }

  const commonProps = {
    ...restProps,
    className: styles.root,
    'data-color': color,
    'data-disabled': disabled,
    onClick: handleClick
  }

  if (type === 'link') {
    return (
      <a {...commonProps} href={href} tabIndex={disabled ? -1 : 0}>
        {_children}
      </a>
    )
  }

  return (
    <button {...commonProps} disabled={disabled} type={type}>
      {_children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'danger']),
  disabled: PropTypes.bool,
  href: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
}

Button.defaultProps = {
  children: undefined,
  color: undefined,
  disabled: false,
  href: undefined,
  onClick: () => null,
  type: 'button'
}

export default Button
