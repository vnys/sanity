import {diffArray} from '../src/calculate/diffArray'

describe('diffArray', () => {
  describe('primitive/mixed values', () => {
    test('short-circuits on referential identity', () => {
      const arr = ['foo', {obj: 'here'}]
      expect(diffArray(arr, arr).isChanged).toBe(false)
    })

    test('handles equal arrays', () => {
      const diff = diffArray([1, 2], [1, 2])
      expect(diff.isChanged).toBe(false)
      expect(diff.changes).toHaveLength(0)
    })

    test('handles different arrays, primitive types', () => {
      const diff = diffArray([1, 'foo', false, null], [2, 'foo', false, null])
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(1)
      expect(diff.changes[0]).toMatchObject({
        op: 'change',
        index: 0,
        diff: {
          isChanged: true,
          fromValue: 1,
          toValue: 2
        }
      })
    })

    test('handles added items', () => {
      const diff = diffArray([1, 2], [1, 3, 2])
      expect(diff).toBeTruthy()
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(1)
      expect(diff.changes[0]).toMatchInlineSnapshot(`
        Object {
          "after": 0,
          "index": 1,
          "op": "add",
          "path": Array [
            1,
          ],
          "toValue": 3,
        }
      `)
    })

    test('handles removed items', () => {
      const diff = diffArray([1, 3, 2], [1, 2])
      expect(diff).toBeTruthy()
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(1)
      expect(diff.changes[0]).toMatchInlineSnapshot(`
        Object {
          "fromValue": 3,
          "index": 1,
          "op": "remove",
          "path": Array [
            1,
          ],
        }
      `)
    })

    test('handles all types (equal)', () => {
      const diff = diffArray(
        [1, 'z', {_key: 'zing', val: 'yes'}, null, false, 9],
        [1, 'z', {_key: 'zing', val: 'yes'}, null, false, 9]
      )
      expect(diff.isChanged).toBe(false)
      expect(diff.changes).toHaveLength(0)
    })

    test('handles all types (diff)', () => {
      const diff = diffArray(
        [1, 'z', {_key: 'zing', val: 'yes'}, null, false, 9],
        [2, 'x', {_key: 'zing', val: 'no'}, 3, true, '9']
      )

      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(6)
      expect(diff.changes).toMatchInlineSnapshot(`
        Array [
          Object {
            "diff": Object {
              "fromValue": 1,
              "isChanged": true,
              "path": Array [
                0,
              ],
              "toValue": 2,
              "type": "number",
            },
            "index": 0,
            "op": "change",
            "path": Array [
              0,
            ],
          },
          Object {
            "diff": Object {
              "fromValue": "z",
              "isChanged": true,
              "path": Array [
                1,
              ],
              "segments": Array [
                Object {
                  "text": "z",
                  "type": "removed",
                },
                Object {
                  "text": "x",
                  "type": "added",
                },
              ],
              "toValue": "x",
              "type": "string",
            },
            "index": 1,
            "op": "change",
            "path": Array [
              1,
            ],
          },
          Object {
            "diff": Object {
              "fields": Object {
                "val": Object {
                  "fromValue": "yes",
                  "isChanged": true,
                  "path": Array [
                    2,
                    "val",
                  ],
                  "segments": Array [
                    Object {
                      "text": "yes",
                      "type": "removed",
                    },
                    Object {
                      "text": "no",
                      "type": "added",
                    },
                  ],
                  "toValue": "no",
                  "type": "string",
                },
              },
              "fromValue": Object {
                "_key": "zing",
                "val": "yes",
              },
              "isChanged": true,
              "path": Array [
                2,
              ],
              "toValue": Object {
                "_key": "zing",
                "val": "no",
              },
              "type": "object",
            },
            "index": 2,
            "op": "change",
            "path": Array [
              2,
            ],
          },
          Object {
            "diff": Object {
              "fromValue": null,
              "isChanged": true,
              "path": Array [
                3,
              ],
              "toValue": 3,
              "type": "number",
            },
            "index": 3,
            "op": "change",
            "path": Array [
              3,
            ],
          },
          Object {
            "diff": Object {
              "fromValue": false,
              "isChanged": true,
              "path": Array [
                4,
              ],
              "toValue": true,
              "type": "boolean",
            },
            "index": 4,
            "op": "change",
            "path": Array [
              4,
            ],
          },
          Object {
            "diff": Object {
              "fromType": "number",
              "fromValue": 9,
              "isChanged": true,
              "path": Array [
                5,
              ],
              "toType": "string",
              "toValue": "9",
              "type": "typeChange",
            },
            "index": 5,
            "op": "change",
            "path": Array [
              5,
            ],
          },
        ]
      `)
    })
  })

  describe('not uniquely keyed objects', () => {
    test('uses array indexes (change)', () => {
      const from = [
        {_key: 'a', val: 1},
        {_key: 'b', val: 2}
      ]
      const to = [
        {_key: 'a', val: 3},
        {_key: 'a', val: 4}
      ]
      const diff = diffArray(from, to)

      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(2)
      expect(diff.changes[0]).toMatchObject({
        op: 'change',
        path: [0],
        diff: {
          fromValue: from[0],
          toValue: to[0]
        }
      })
    })

    test('uses array indexes (add)', () => {
      const from = [{_key: 'a', val: 1}]
      const to = [
        {_key: 'a', val: 1},
        {_key: 'a', val: 2}
      ]
      const diff = diffArray(from, to)

      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(1)
      expect(diff.changes[0]).toMatchObject({
        op: 'add',
        index: 1,
        path: [1],
        toValue: to[1],
        after: 0
      })
    })

    test('uses array indexes (remove)', () => {
      const from = [
        {_key: 'a', val: 1},
        {_key: 'a', val: 2}
      ]
      const to = [{_key: 'a', val: 1}]
      const diff = diffArray(from, to)

      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(1)
      expect(diff.changes[0]).toMatchObject({
        op: 'remove',
        index: 1,
        path: [1],
        fromValue: from[1]
      })
    })

    test('uses array indexes (unchanged)', () => {
      const from = [
        {_key: 'a', val: 1},
        {_key: 'a', val: 2}
      ]
      const to = [
        {_key: 'a', val: 1},
        {_key: 'a', val: 2}
      ]
      const diff = diffArray(from, to)

      expect(diff.isChanged).toBe(false)
      expect(diff.changes).toHaveLength(0)
    })
  })

  describe('uniquely keyed objects', () => {
    // Equality
    test('handles equal arrays', () => {
      const diff = diffArray([{_key: 'foo', value: 'foo'}], [{_key: 'foo', value: 'foo'}])
      expect(diff.isChanged).toBe(false)
      expect(diff.changes).toHaveLength(0)
    })

    test('handles equal arrays (referential identity)', () => {
      const obj = {_key: 'foo', value: 'foo'}
      const arr = [obj]
      expect(diffArray(arr, arr).isChanged).toBe(false)
      expect(diffArray([obj], [obj]).isChanged).toBe(false)
    })

    // Added
    test('handles added items (prepend)', () => {
      const diff = diffArray(
        [{_key: 'b', value: 'b'}],
        [
          {_key: 'a', value: 'a'},
          {_key: 'b', value: 'b'}
        ]
      )
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(1)
      expect(diff.changes[0]).toMatchObject({
        op: 'add',
        before: 0,
        index: 0,
        path: [{_key: 'a'}],
        toValue: {_key: 'a', value: 'a'}
      })
    })

    test('handles added items (append)', () => {
      const diff = diffArray(
        [{_key: 'a', value: 'a'}],
        [
          {_key: 'a', value: 'a'},
          {_key: 'b', value: 'b'}
        ]
      )
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(1)
      expect(diff.changes[0]).toMatchObject({
        op: 'add',
        after: {_key: 'a'},
        index: 1,
        path: [{_key: 'b'}],
        toValue: {_key: 'b', value: 'b'}
      })
    })

    test('handles added items (center)', () => {
      const diff = diffArray(
        [
          {_key: 'a', value: 'a'},
          {_key: 'c', value: 'c'}
        ],
        [
          {_key: 'a', value: 'a'},
          {_key: 'b', value: 'b'},
          {_key: 'c', value: 'c'}
        ]
      )
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(1)
      expect(diff.changes[0]).toMatchObject({
        op: 'add',
        after: {_key: 'a'},
        index: 1,
        path: [{_key: 'b'}],
        toValue: {_key: 'b', value: 'b'}
      })
    })

    test('handles added items (multiple)', () => {
      const diff = diffArray(
        [
          {_key: 'a', value: 'a'},
          {_key: 'c', value: 'c'}
        ],
        [
          {_key: 'a', value: 'a'},
          {_key: 'b', value: 'b'},
          {_key: 'c', value: 'c'},
          {_key: 'd', value: 'd'}
        ]
      )
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(2)
      expect(diff.changes[0]).toMatchObject({
        op: 'add',
        after: {_key: 'a'},
        index: 1,
        path: [{_key: 'b'}],
        toValue: {_key: 'b', value: 'b'}
      })
      expect(diff.changes[1]).toMatchObject({
        op: 'add',
        after: {_key: 'c'},
        index: 3,
        path: [{_key: 'd'}],
        toValue: {_key: 'd', value: 'd'}
      })
    })

    test('handles added items (multiple alt)', () => {
      const diff = diffArray(
        [
          {_key: 'a', value: 'a'},
          {_key: 'b', value: 'b'},
          {_key: 'c', value: 'c'},
          {_key: 'd', value: 'd'}
        ],
        [
          {_key: '0', value: '0'},
          {_key: 'a', value: 'a'},
          {_key: 'b', value: 'b'},
          {_key: '5', value: '5'},
          {_key: 'c', value: 'c'},
          {_key: 'd', value: 'd'},
          {_key: '9', value: '9'}
        ]
      )
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(3)
      expect(diff.changes[0]).toMatchObject({
        op: 'add',
        before: {_key: 'a'},
        index: 0,
        path: [{_key: '0'}],
        toValue: {_key: '0', value: '0'}
      })
      expect(diff.changes[1]).toMatchObject({
        op: 'add',
        after: {_key: 'b'},
        index: 3,
        path: [{_key: '5'}],
        toValue: {_key: '5', value: '5'}
      })
      expect(diff.changes[2]).toMatchObject({
        op: 'add',
        after: {_key: 'd'},
        index: 6,
        path: [{_key: '9'}],
        toValue: {_key: '9', value: '9'}
      })
    })

    test('handles added items (prepend with no shared)', () => {
      const diff = diffArray([{_key: 'b', value: 'b'}], [{_key: 'a', value: 'a'}])
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(2)
      expect(diff.changes[0]).toMatchObject({
        op: 'add',
        before: 0,
        index: 0,
        path: [{_key: 'a'}],
        toValue: {_key: 'a', value: 'a'}
      })
    })

    // Removed
    test('handles removed items (start)', () => {
      const diff = diffArray(
        [
          {_key: 'a', value: 'a'},
          {_key: 'b', value: 'b'}
        ],
        [{_key: 'b', value: 'b'}]
      )
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(1)
      expect(diff.changes[0]).toMatchObject({
        op: 'remove',
        index: 0,
        path: [{_key: 'a'}],
        fromValue: {_key: 'a', value: 'a'}
      })
    })

    test('handles removed items (end)', () => {
      const diff = diffArray(
        [
          {_key: 'a', value: 'a'},
          {_key: 'b', value: 'b'}
        ],
        [{_key: 'a', value: 'a'}]
      )
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(1)
      expect(diff.changes[0]).toMatchObject({
        op: 'remove',
        index: 1,
        path: [{_key: 'b'}],
        fromValue: {_key: 'b', value: 'b'}
      })
    })

    test('handles removed items (center)', () => {
      const diff = diffArray(
        [
          {_key: 'a', value: 'a'},
          {_key: 'b', value: 'b'},
          {_key: 'c', value: 'c'}
        ],
        [
          {_key: 'a', value: 'a'},
          {_key: 'c', value: 'c'}
        ]
      )
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(1)
      expect(diff.changes[0]).toMatchObject({
        op: 'remove',
        index: 1,
        path: [{_key: 'b'}],
        fromValue: {_key: 'b', value: 'b'}
      })
    })

    test('handles removed items (multiple)', () => {
      const diff = diffArray(
        [
          {_key: 'a', value: 'a'},
          {_key: 'b', value: 'b'},
          {_key: 'c', value: 'c'},
          {_key: 'd', value: 'd'}
        ],
        [
          {_key: 'a', value: 'a'},
          {_key: 'c', value: 'c'}
        ]
      )
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(2)
      expect(diff.changes[0]).toMatchObject({
        op: 'remove',
        index: 1,
        path: [{_key: 'b'}],
        fromValue: {_key: 'b', value: 'b'}
      })
      expect(diff.changes[1]).toMatchObject({
        op: 'remove',
        index: 3,
        path: [{_key: 'd'}],
        fromValue: {_key: 'd', value: 'd'}
      })
    })

    // Moved
    test('handles moved items (to start)', () => {
      const diff = diffArray(
        [
          {_key: 'a', value: 'a'},
          {_key: 'b', value: 'b'},
          {_key: 'c', value: 'c'}
        ],
        [
          {_key: 'c', value: 'c'},
          {_key: 'a', value: 'a'},
          {_key: 'b', value: 'b'}
        ]
      )
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(1)
      expect(diff.changes[0]).toMatchObject({
        op: 'move',
        fromIndex: 2,
        toIndex: 0,
        path: [{_key: 'c'}]
      })
    })

    test('handles moved items (to end)', () => {
      const diff = diffArray(
        [
          {_key: 'a', value: 'a'},
          {_key: 'b', value: 'b'},
          {_key: 'c', value: 'c'}
        ],
        [
          {_key: 'b', value: 'b'},
          {_key: 'c', value: 'c'},
          {_key: 'a', value: 'a'}
        ]
      )
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(1)
      expect(diff.changes[0]).toMatchObject({
        op: 'move',
        fromIndex: 0,
        toIndex: 2,
        path: [{_key: 'a'}]
      })
    })

    test('handles moved items (to middle)', () => {
      const diff = diffArray(
        [
          {_key: 'a', value: 'a'},
          {_key: 'b', value: 'b'},
          {_key: 'c', value: 'c'}
        ],
        [
          {_key: 'b', value: 'b'},
          {_key: 'a', value: 'a'},
          {_key: 'c', value: 'c'}
        ]
      )
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(1)
      expect(diff.changes[0]).toMatchObject({
        op: 'move',
        fromIndex: 1,
        toIndex: 0,
        path: [{_key: 'b'}]
      })
    })

    test('handles moved items (with change)', () => {
      const diff = diffArray(
        [
          {_key: 'a', value: 'a'},
          {_key: 'b', value: 'b'},
          {_key: 'c', value: 'c'}
        ],
        [
          {_key: 'b', value: 'new value'},
          {_key: 'a', value: 'a'},
          {_key: 'c', value: 'c'}
        ]
      )
      expect(diff.isChanged).toBe(true)
      expect(diff.changes).toHaveLength(2)
      expect(diff.changes[0]).toMatchObject({
        op: 'move',
        fromIndex: 1,
        toIndex: 0,
        path: [{_key: 'b'}]
      })
      expect(diff.changes[1]).toMatchObject({
        op: 'change',
        index: 0,
        path: [{_key: 'b'}],
        diff: {
          isChanged: true,
          fromValue: {value: 'b'},
          toValue: {value: 'new value'}
        }
      })
    })
  })
})
