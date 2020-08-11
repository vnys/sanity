/* eslint-disable complexity */
import PropTypes from 'prop-types'
import React from 'react'

import styles from 'part:@sanity/components/formfields/default-style'
import DefaultLabel from 'part:@sanity/components/labels/default'
import ValidationStatus from 'part:@sanity/components/validation/status'

export default class DefaultFormField extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    inline: PropTypes.bool,
    description: PropTypes.string,
    level: PropTypes.number,
    children: PropTypes.node,
    wrapped: PropTypes.bool,
    labelFor: PropTypes.string,
    markers: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string
      })
    )
  }

  static defaultProps = {
    level: 1,
    markers: []
  }

  render() {
    const {
      level,
      label,
      labelFor,
      description,
      children,
      inline,
      wrapped,
      className,
      markers
    } = this.props

    const levelClass = `level_${level}`

    return (
      <div
        className={`
          ${inline ? styles.inline : styles.block}
          ${styles[levelClass] || ''}
          ${wrapped ? styles.wrapped : ''}
          ${className || ''}`}
      >
        <label className={styles.inner} htmlFor={labelFor}>
          {label && (
            <div className={styles.header}>
              <div className={styles.headerMain}>
                <div className={styles.title}>
                  {label && (
                    <DefaultLabel className={styles.label} level={level}>
                      {label}
                    </DefaultLabel>
                  )}
                  <ValidationStatus markers={markers} />
                </div>
                {description && <div className={styles.description}>{description}</div>}
              </div>
            </div>
          )}
          <div className={styles.content}>{children}</div>
        </label>
      </div>
    )
  }
}
