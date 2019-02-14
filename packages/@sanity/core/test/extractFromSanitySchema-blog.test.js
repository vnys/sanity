import {test} from 'tap'
import {loadSchema} from './utils/loadSchema'
import extractFromSanitySchema from '../src/actions/graphql/extractFromSanitySchema'

const schema = loadSchema('blog')

test('blog schema matches snapshot', t => {
  t.matchSnapshot(extractFromSanitySchema(schema))
  t.end()
})
