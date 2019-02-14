import createSchema from 'part:@sanity/base/schema-creator'

export default createSchema({
  name: 'default',
  types: [{type: 'document', name: 'reallySimple', fields: [{name: 'title', type: 'string'}]}]
})
