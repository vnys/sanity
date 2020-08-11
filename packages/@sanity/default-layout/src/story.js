import {storiesOf} from 'part:@sanity/storybook'
import {withKnobs} from 'part:@sanity/storybook/addons/knobs'
import {ExampleStory} from './stories/example'
import {BrandingStory} from './stories/branding'
import {ToolSwitcherStory} from './stories/toolSwitcher'
import {ToolSwitcherItemStory} from './stories/toolSwitcherItem'
import {NotFoundStory} from './stories/notFound'
import {LoginStatusStory} from './stories/loginStatus'
import {SearchFieldMobileStory} from './stories/searchFieldMobile'
import {SearchFieldDesktopStory} from './stories/searchFieldDesktop'

storiesOf('@sanity/default-layout', module)
  .addDecorator(withKnobs)
  .add('Example', ExampleStory)
  .add('Branding', BrandingStory)
  .add('Toolswitcher', ToolSwitcherStory)
  .add('ToolSwitcherItem', ToolSwitcherItemStory)
  .add('Not Found', NotFoundStory)
  .add('Login Status', LoginStatusStory)
  .add('Search Field (mobile)', SearchFieldMobileStory)
  .add('Search Field (desktop)', SearchFieldDesktopStory)
