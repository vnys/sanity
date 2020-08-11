export default {
  name: 'simpleBlock',
  title: 'Simple block',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {type: 'block', of: [{type: 'image', name: 'image'}]},
        {type: 'image', name: 'image'}
      ]
    }
  ]
}
