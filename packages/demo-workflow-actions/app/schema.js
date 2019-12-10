import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'
import reviewWorkflowSchemaTypes from 'part:@sanity/plugin-review-workflow/schemas'

const post = {
  type: 'document',
  name: 'post',
  title: 'Post',
  fields: [
    {type: 'string', name: 'title', title: 'Title'},
    {type: 'datetime', name: 'publishedAt', title: 'Published at'},
    {type: 'image', name: 'image', title: 'Image'}
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
      media: 'image'
    }
  }
}

const release = {
  type: 'document',
  name: 'release',
  title: 'Release',
  fields: [
    {type: 'string', name: 'title', title: 'Title'},
    {type: 'datetime', name: 'publishedAt', title: 'Published at'}
  ]
}

const author = {
  type: 'document',
  name: 'author',
  title: 'Author',
  fields: [{type: 'string', name: 'name', title: 'Name'}]
}

export default createSchema({
  name: 'demo-review-workflow',
  types: schemaTypes.concat([author, post, release, ...reviewWorkflowSchemaTypes])
})
