import createSchema from 'part:@sanity/base/schema-creator'

export default createSchema({
  name: 'default',
  types: [
    {
      type: 'document',
      name: 'post',
      fields: [{name: 'title', type: 'string'}]
    },
    {
      type: 'document',
      name: 'recursiveUnionTest',
      fields: [
        {name: 'title', type: 'reference', to: [{type: 'recursiveUnionTest'}, {type: 'post'}]}
      ]
    }
  ]
})
