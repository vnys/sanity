export const diff = {
  type: 'array',
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
  //         text: 'Hello,world'
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
  //         text: 'Hello,world'
  //       }
  //     ]
  //   }
  // ],
  operations: [
    {
      type: 'patch',
      path: [0, 0],
      nodeType: 'span',
      diff: [{text: 'foo '}, {type: 'del', text: 'bar'}, {type: 'ins', text: ' az'}]
      // value: {
      //   _type: 'block',
      //   _key: 'a',
      //   children: [{_type: 'span', _key: 'a', text: 'Hello, world'}]
      // }
    },
    {
      type: 'insert',
      path: [1],
      value: {
        _type: 'block',
        _key: 'a',
        children: [{_type: 'span', _key: 'a', text: 'Hello, world'}]
      }
    }
  ]
}
