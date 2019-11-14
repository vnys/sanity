/* eslint-disable import/prefer-default-export */
/* eslint-disable react/jsx-no-bind */

import React from 'react'
import Button from 'part:@sanity/components/button'
import {storiesOf} from 'part:@sanity/storybook'
import {withKnobs} from 'part:@sanity/storybook/addons/knobs'
import {action} from 'part:@sanity/storybook/addons/actions'

export const actions = {
  onClick: action('onClick')
}

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    return (
      <div id="button-story">
        <style>{`
          #button-story { text-align: center; }
          #button-story > * { margin: 0.5em; }
        `}</style>

        <Button onClick={() => actions.onClick('Default')}>Default</Button>
        <Button onClick={() => actions.onClick('Primary')} color="primary">
          Primary
        </Button>
        <Button color="success" onClick={() => actions.onClick('Success')}>
          Success
        </Button>
        <Button color="warning" onClick={() => actions.onClick('Warning')}>
          Warning
        </Button>
        <Button color="danger" onClick={() => actions.onClick('Danger')}>
          Danger
        </Button>
        <Button color="danger" disabled onClick={() => actions.onClick('Danger (disabled)')}>
          Disabled
        </Button>
        <Button
          color="secondary"
          type="link"
          href="#"
          onClick={evt => {
            evt.preventDefault()
            actions.onClick('Link')
          }}
        >
          Link
        </Button>
        <Button
          color="secondary"
          disabled
          type="link"
          href="#"
          onClick={evt => {
            evt.preventDefault()
            actions.onClick('Link')
          }}
        >
          Link (disabled)
        </Button>
      </div>
    )
  })
