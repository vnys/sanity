import {action} from 'part:@sanity/storybook/addons/actions'
import React from 'react'
import LoginStatus from '../navbar/loginStatus/LoginStatus'
import NavbarStyles from '../navbar/Navbar.css'
import DefaultLayoutStyles from '../DefaultLayout.css'

export function LoginStatusStory() {
  return (
    <div className={DefaultLayoutStyles.navBar}>
      <div className={NavbarStyles.root}>
        <div className={NavbarStyles.loginStatus}>
          <LoginStatus
            user={{
              name: 'John Doe',
              profileImage: 'https://randomuser.me/api/portraits/men/12.jpg'
            }}
            onLogout={() => action('onLogout')}
          />
        </div>
      </div>
    </div>
  )
}
