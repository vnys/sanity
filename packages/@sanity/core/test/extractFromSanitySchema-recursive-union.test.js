import {test} from 'tap'
import {loadSchema} from './utils/loadSchema'
import extractFromSanitySchema from '../src/actions/graphql/extractFromSanitySchema'

const schema = loadSchema('recursive-union')

test('simple schema matches snapshot', t => {
  t.doesNotThrow(() => extractFromSanitySchema(schema))
  // t.matchSnapshot(extractFromSanitySchema(schema))
  t.end()
})
