import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from 'part:@sanity/components/progress/bar-style'

export default class ProgressBar extends React.PureComponent {
  static propTypes = {
    percent: PropTypes.number,
    isInProgress: PropTypes.bool
  }

  static defaultProps = {
    percent: 0,
    isInProgress: false
  }

  render() {
    const {percent, isInProgress} = this.props
    const barStyle = {width: `${percent}%`}
    const isComplete = percent >= 100
    const className = classNames(
      styles.root,
      !isComplete && isInProgress && styles.isInProgress,
      isComplete && styles.isComplete
    )

    // {showPercent && <div className={styles.percent}>{Math.round(percent, 1)}%</div>}
    // {text && <div className={styles.text}>{text}</div>}

    return (
      <div className={className}>
        <div className={styles.bar} style={barStyle} />
      </div>
    )
  }
}
