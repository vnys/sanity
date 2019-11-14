/* eslint-disable import/prefer-default-export */
/* eslint-disable react/jsx-no-bind */

import React from 'react'
import Button from 'part:@sanity/components/button'
import Menu from 'part:@sanity/components/menu'
import MenuItem from 'part:@sanity/components/menu-item'
import {storiesOf} from 'part:@sanity/storybook'
import {withKnobs} from 'part:@sanity/storybook/addons/knobs'
import {action} from 'part:@sanity/storybook/addons/actions'

export const actions = {
  onClick: action('onClick')
}

storiesOf('Menu', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    return (
      <div>
        <Menu button={<Button>Actions…</Button>} id="menu">
          <MenuItem label="Foo" onClick={() => actions.onClick('Foo')} />
          <MenuItem disabled label="Bar" onClick={() => actions.onClick('Bar')} />
          <MenuItem label="Baz" onClick={() => actions.onClick('Baz')} />
          <MenuItem label="Qux" onClick={() => actions.onClick('Qux')} />
        </Menu>
        <hr />
        <Button>Button</Button>
      </div>
    )
  })
