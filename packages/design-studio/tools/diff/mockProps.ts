export default {
  type: 'document',
  fields: [
    {type: 'array', name: 'array', title: 'Array', of: [{type: 'string'}]},
    {
      type: 'array',
      name: 'arrayWithObjects',
      title: 'Array with objects',
      of: [{type: 'object', fields: [{type: 'string', name: 'title', title: 'Title'}]}]
    },
    {type: 'image', name: 'image', title: 'Image'},
    {type: 'object', name: 'object', title: 'Object'},
    {type: 'array', name: 'portableText', title: 'Portable text', of: [{type: 'block'}]},
    {type: 'string', name: 'string', title: 'String'}
  ],
  // @todo
  // fromValue: null,
  // toValue: null,
  nodes: [
    // array
    {
      type: 'array',
      key: 'array',
      fromValue: ['foo'],
      toValue: ['qux', 'bar', 'baz'],
      nodes: [
        {
          type: 'string',
          path: [0],
          fromValue: 'foo',
          operations: [
            {type: 'delText', offset: 0, length: 3},
            {type: 'insText', offset: 3, text: 'qux'}
          ]
        },
        {
          type: 'string',
          path: [1],
          fromValue: undefined,
          operations: [{type: 'insText', offset: 0, text: 'bar'}]
        },
        {
          type: 'string',
          path: [2],
          fromValue: undefined,
          operations: [{type: 'insText', offset: 0, text: 'baz'}]
        }
      ]
    },

    // arrayWithObjects
    {
      type: 'array',
      key: 'arrayWithObjects',
      fromValue: [],
      toValue: [{_type: 'author', _key: 'a', name: 'Steve'}],
      nodes: [
        {
          type: 'author',
          path: ['a'],
          fromValue: undefined,
          operations: [
            {
              type: 'insert',
              value: {_type: 'author', _key: 'a', name: 'Steve'}
            }
          ]
        },
        {
          type: 'author',
          path: ['b'],
          fromValue: undefined,
          operations: [
            {
              type: 'insert',
              value: {_type: 'author', _key: 'a', name: 'Roger'}
            }
          ]
        }
      ]
    },

    // image
    {
      type: 'image',
      key: 'image',
      fromValue: {
        _type: 'image',
        _key: 'b',
        asset: {
          _ref: 'image-1-jpg',
          _type: 'reference'
        }
      },
      toValue: {
        _type: 'image',
        _key: 'b',
        asset: {
          _ref: 'image-2-jpg',
          _type: 'reference'
        }
      }
    },

    // object
    {
      type: 'object',
      key: 'object',
      fields: [
        {type: 'string', name: 'title', title: 'String'},
        {type: 'image', name: 'image', title: 'Image'}
      ],
      nodes: [
        {
          key: 'title',
          type: 'string',
          fromValue: 'test',
          operations: [{type: 'insText', offset: 4, text: 'ing'}]
        },

        {
          key: 'image',
          type: 'image',
          fromValue: {
            _type: 'image',
            _key: 'b',
            asset: {
              _ref: 'image-3-jpg',
              _type: 'reference'
            }
          },
          toValue: {
            _type: 'image',
            _key: 'b',
            asset: {
              _ref: 'image-4-jpg',
              _type: 'reference'
            }
          }
        }
      ]
    },

    // portableText
    {
      type: 'array',
      key: 'portableText',
      // @todo
      // fromValue: null,
      nodes: [
        {
          type: 'block',
          fromValue: {
            _type: 'block',
            _key: 'a',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'a',
                text: 'Hello, world! I’m doing fine. How are you?'
              }
            ]
          },
          operations: [
            {
              type: 'delText',
              path: ['a'],
              offset: 7,
              length: 5
            },
            {
              type: 'insText',
              path: ['a'],
              offset: 12,
              text: 'team'
            },
            {
              type: 'delText',
              path: ['a'],
              offset: 24,
              length: 4
            },
            {
              type: 'insText',
              path: ['a'],
              offset: 28,
              text: 'OK'
            },
            {
              type: 'insText',
              path: ['a'],
              offset: 41,
              text: ' doing'
            }
          ]
        },

        {
          type: 'image',
          fromValue: {
            _type: 'image',
            _key: 'b',
            asset: {
              _ref: 'image-3-jpg',
              _type: 'reference'
            }
          },
          toValue: {
            _type: 'image',
            _key: 'b',
            asset: {
              _ref: 'image-4-jpg',
              _type: 'reference'
            }
          }
        },

        {
          type: 'block',
          fromValue: {
            _type: 'block',
            _key: 'c',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'a',
                text: 'Hello, world!'
              }
            ]
          },
          operations: [
            {
              type: 'delText',
              path: ['a'],
              offset: 7,
              length: 5
            },
            {
              type: 'insText',
              path: ['a'],
              offset: 12,
              text: 'team'
            }
          ]
        }
      ]
    },

    // string
    {
      type: 'string',
      key: 'string',
      fromValue: '',
      toValue: 'Hello, world!',
      operations: [{type: 'insText', offset: 0, text: 'Hello, world!'}]
    }
  ]
}
