/* eslint-disable react/no-multi-comp, complexity*/

import defaultStyles from 'part:@sanity/components/fieldsets/default-style'
import PropTypes from 'prop-types'
import React from 'react'
import ArrowDropDown from 'part:@sanity/base/arrow-drop-down'
import ValidationStatus from 'part:@sanity/components/validation/status'
import AnimateHeight from 'react-animate-height'
import DefaultLabel from 'part:@sanity/components/labels/default'

export default class Fieldset extends React.Component {
  static propTypes = {
    description: PropTypes.string,
    legend: PropTypes.string.isRequired,
    columns: PropTypes.number,
    isCollapsible: PropTypes.bool,
    onFocus: PropTypes.func,
    isCollapsed: PropTypes.bool,
    fieldset: PropTypes.shape({
      description: PropTypes.string,
      legend: PropTypes.string
    }),
    children: PropTypes.node,
    level: PropTypes.number,
    className: PropTypes.string,
    tabIndex: PropTypes.number,
    transparent: PropTypes.bool,
    styles: PropTypes.object,
    markers: PropTypes.array
  }

  static defaultProps = {
    level: 1,
    fieldset: {},
    markers: [],
    className: '',
    isCollapsed: false,
    isCollapsible: false // can collapsing be toggled by user?
  }

  constructor(props) {
    super()
    this.state = {
      isCollapsed: props.isCollapsed,
      hasBeenToggled: false
    }
  }

  handleToggle = () => {
    this.setState(prevState => ({
      isCollapsed: !prevState.isCollapsed,
      hasBeenToggled: true
    }))
  }

  handleFocus = event => {
    if (event.target === this._focusElement) {
      // Make sure we don't trigger onFocus for child elements
      this.props.onFocus(event)
    }
  }

  focus() {
    this._focusElement.focus()
  }

  setFocusElement = el => {
    this._focusElement = el
  }

  render() {
    const {
      fieldset,
      legend,
      description,
      columns,
      level,
      className,
      isCollapsible,
      isCollapsed: _ignore,
      children,
      tabIndex,
      transparent,
      markers,
      ...rest
    } = this.props

    const {isCollapsed, hasBeenToggled} = this.state

    const styles = {
      ...defaultStyles,
      ...this.props.styles
    }

    const validation = markers.filter(marker => marker.type === 'validation')
    const errors = validation.filter(marker => marker.level === 'error')

    const rootClassName = [
      styles.root,
      errors.length > 0 && styles.hasErrors,
      styles[`columns${columns}`],
      styles[`level${level}`],
      transparent && styles.transparent,
      this.props.onFocus && styles.canFocus,
      className
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        {...rest}
        onFocus={this.handleFocus}
        tabIndex={tabIndex}
        ref={this.setFocusElement}
        className={rootClassName}
      >
        <fieldset className={styles.fieldset}>
          <div className={styles.inner}>
            <div className={styles.header}>
              <div className={styles.headerMain}>
                {
                  // Uses the tabIndex 0 and -1 here to avoid focus state on click
                }
                <legend
                  className={`${styles.legend} ${isCollapsed ? '' : styles.isOpen}`}
                  tabIndex={isCollapsible ? 0 : undefined}
                  // eslint-disable-next-line react/jsx-no-bind
                  onKeyDown={event => (event.key === 'Enter' ? this.handleToggle() : false)}
                >
                  <div
                    tabIndex={-1}
                    onClick={isCollapsible ? this.handleToggle : undefined}
                    style={{outline: 'none'}}
                  >
                    {isCollapsible && (
                      <div className={`${styles.arrow} ${isCollapsed ? '' : styles.isOpen}`}>
                        <ArrowDropDown />
                      </div>
                    )}
                    <DefaultLabel className={styles.label}>
                      {legend || fieldset.legend}
                    </DefaultLabel>
                  </div>
                  <ValidationStatus
                    markers={markers}
                    showSummary={markers.filter(marker => marker.type === 'validation').length > 1}
                  />
                </legend>
                {(description || fieldset.description) && (
                  <p className={`${styles.description} ${isCollapsed ? '' : styles.isOpen}`}>
                    {description || fieldset.description}
                  </p>
                )}
              </div>
            </div>
            {isCollapsible && (
              <AnimateHeight
                duration={250}
                height={isCollapsed && children ? 0 : 'auto'}
                className={styles.animateHeight}
                contentClassName={styles.content}
              >
                <div className={styles.fieldWrapper}>
                  {(hasBeenToggled || !isCollapsed) && children}
                </div>
              </AnimateHeight>
            )}
            {!isCollapsible && (
              <div className={styles.content}>
                <div className={styles.fieldWrapper}>{!isCollapsed && children}</div>
              </div>
            )}
          </div>
        </fieldset>
      </div>
    )
  }
}
