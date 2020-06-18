export default {
  nodes: [
    {
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

    {
      fromValue: {
        _type: 'block',
        _key: 'c',
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
    }
  ]

  // contexts: [
  //   {
  //     path: [0],
  //     chunks: [
  //       {type: 'text', value: 'Hello, '},
  //       {type: 'text', value: 'Hello, '}
  //     ]
  //   }
  // ],

  // type: 'array',
  // fromValue: [
  //   {
  //     _type: 'block',
  //     _key: 'a',
  //     style: 'normal',
  //     markDefs: [],
  //     children: [
  //       {
  //         _type: 'span',
  //         _key: 'a',
  //         text: 'Hello, world!'
  //       }
  //     ]
  //   },
  //   {
  //     _type: 'block',
  //     _key: 'b',
  //     style: 'normal',
  //     markDefs: [],
  //     children: [
  //       {
  //         _type: 'span',
  //         _key: 'a',
  //         text: 'Hello, world!'
  //       }
  //     ]
  //   }
  // ],
  // toValue: [
  //   {
  //     _type: 'block',
  //     _key: 'a',
  //     style: 'normal',
  //     markDefs: [],
  //     children: [
  //       {
  //         _type: 'span',
  //         _key: 'a',
  //         text: 'Hello, team!'
  //       }
  //     ]
  //   },
  //   {
  //     _type: 'block',
  //     _key: 'b',
  //     style: 'normal',
  //     markDefs: [],
  //     children: [
  //       {
  //         _type: 'span',
  //         _key: 'a',
  //         text: 'Hello, world!'
  //       }
  //     ]
  //   }
  // ],
  // operations: [
  //   {
  //     type: 'delText',
  //     path: [0, 0],
  //     offset: 7,
  //     length: 5
  //   },
  //   {
  //     type: 'insText',
  //     path: [0, 0],
  //     offset: 7,
  //     text: 'team'
  //   },
  //   {
  //     type: 'ins',
  //     path: [1],
  //     value: {
  //       _type: 'block',
  //       _key: 'b',
  //       children: [{_type: 'span', _key: 'a', text: 'Hello, world'}]
  //     }
  //   }
  // ]
}
