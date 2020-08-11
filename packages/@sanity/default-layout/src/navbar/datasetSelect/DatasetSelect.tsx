import React from 'react'
import {Subscription} from 'rxjs'
import enhanceClickOutside from 'react-click-outside'
import ChevronDownIcon from 'part:@sanity/base/chevron-down-icon'
import {withRouterHOC} from 'part:@sanity/base/router'
import {map} from 'rxjs/operators'
import {state as urlState} from '../../datastores/urlState'
import {CONFIGURED_SPACES} from '../../util/spaces'

import styles from './DatasetSelect.css'

interface OuterProps {
  isVisible: boolean
}

interface Props {
  isVisible: boolean
  router: {
    navigate: (state: {space: string}) => void
  }
}

interface State {
  isVisible: boolean
  menuOpen: boolean
  currentSpace: {name: string} | null
}

const currentSpace$ = urlState.pipe(
  map(event => event.state && event.state.space),
  map(spaceName => CONFIGURED_SPACES.find(sp => sp.name === spaceName))
)

class DatasetSelect extends React.PureComponent<Props, State> {
  currentSpaceSubscription: Subscription | null

  state = {
    menuOpen: false,
    currentSpace: null,
    isVisible: false
  }

  componentDidMount() {
    this.currentSpaceSubscription = currentSpace$.subscribe(space => {
      this.setState({currentSpace: space})
    })
  }

  componentWillUnmount() {
    this.currentSpaceSubscription.unsubscribe()
  }

  handleClickOutside = () => {
    if (this.state.menuOpen) {
      this.setState({menuOpen: false})
    }
  }

  handleMenuToggle = () => {
    this.setState(prev => ({menuOpen: !prev.menuOpen}))
  }

  handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.router.navigate({space: event.target.value})
    this.setState({menuOpen: false}, () => {
      window.location.reload()
    })
  }

  render() {
    const {currentSpace, isVisible} = this.state
    const tabIndex = isVisible ? 0 : -1

    return (
      <div aria-hidden={!isVisible} className={styles.root}>
        <select
          onChange={this.handleChange}
          tabIndex={tabIndex}
          value={(currentSpace && currentSpace.name) || undefined}
        >
          {CONFIGURED_SPACES.map(space => (
            <option key={space.name} value={space.name}>
              {space.title}
            </option>
          ))}
        </select>
        <ChevronDownIcon />
      </div>
    )
  }
}

export default withRouterHOC(enhanceClickOutside(DatasetSelect)) as React.ComponentType<OuterProps>
