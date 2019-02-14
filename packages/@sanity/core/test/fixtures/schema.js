import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'
export default createSchema({
  name: 'test-examples',
  types: schemaTypes.concat([
    {type: 'document', name: 'foo', fields: [{name: 'hi', type: 'string'}]}
  ])
})
