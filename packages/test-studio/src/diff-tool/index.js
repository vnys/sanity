import {DiffTool} from './DiffTool'
import {route} from 'part:@sanity/base/router'

export default {
  router: route('/:exampleName'),
  title: 'Test Diffs',
  name: 'test-diffs',
  component: DiffTool
}
