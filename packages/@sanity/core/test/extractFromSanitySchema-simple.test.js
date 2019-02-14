import {test} from 'tap'
import {loadSchema} from './utils/loadSchema'
import extractFromSanitySchema from '../src/actions/graphql/extractFromSanitySchema'

const schema = loadSchema('simple')

test('simple schema matches snapshot', t => {
  t.matchSnapshot(extractFromSanitySchema(schema))
  t.end()
})
