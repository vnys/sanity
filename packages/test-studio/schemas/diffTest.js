export default {
  name: 'diffTest',
  title: 'Diff test',
  type: 'object',
  fields: [
    {
      name: 'boolean',
      type: 'boolean',
      title: 'Boolean'
    },
    {
      name: 'string',
      type: 'string',
      title: 'String'
    },
    {
      name: 'number',
      type: 'number',
      title: 'Number'
    },
    {
      name: 'primitiveArray',
      type: 'array',
      title: 'Primitive array',
      of: [{type: 'string'}]
    },
    {
      name: 'keyedArray',
      type: 'array',
      title: 'Keyed array',
      of: [{type: 'experiment'}]
    }
  ]
}
