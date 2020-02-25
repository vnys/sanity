import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles/ScrollContainer.css'

export default class ScrollContainer extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    onScroll: PropTypes.func,
    tabIndex: PropTypes.number,
    registerIntersectionObserver: PropTypes.func
  }

  static defaultProps = {
    children: undefined,
    className: '',
    onScroll: () => null,
    tabIndex: undefined
  }

  getChildContext() {
    return {
      getScrollContainer: () => this._scrollContainerElement
    }
  }

  static defaultProps = {
    className: ''
  }

  static childContextTypes = {
    getScrollContainer: PropTypes.func
  }

  componentDidMount() {
    if (this.props.onScroll) {
      this._scrollContainerElement.addEventListener('scroll', this.handleScroll, {passive: true})
    }
    if (this.props.registerIntersectionObserver) {
      this.props.registerIntersectionObserver(this._scrollContainerElement)
    }
  }

  componentWillUnmount() {
    if (this.props.onScroll) {
      this._scrollContainerElement.removeEventListener('scroll', this.handleScroll, {passive: true})
    }
  }

  handleScroll = event => {
    this.props.onScroll(event)
  }

  setScrollContainerElement = element => {
    this._scrollContainerElement = element
  }

  render() {
    return (
      <div
        ref={this.setScrollContainerElement}
        className={`${styles.scrollContainer} ${this.props.className}`}
        tabIndex={this.props.tabIndex}
      >
        {this.props.children}
      </div>
    )
  }
}
