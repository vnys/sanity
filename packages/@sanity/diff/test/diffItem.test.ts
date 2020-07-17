import {diffItem} from '../src/calculate/diffItem'

describe('diffItem', () => {
  test('null => null', () => {
    expect(diffItem(null, null)).toBe(undefined)
  })

  test('undefined => undefined', () => {
    expect(diffItem(undefined, undefined)).toBe(undefined)
  })

  test('throws on unsupported types', () => {
    expect(() => diffItem(Symbol.for('kiss'), 'b')).toThrowErrorMatchingInlineSnapshot(
      `"Unsupported type passed to differ: symbol"`
    )
  })

  test('arrays', () => {
    expect(diffItem(['a'], ['b'])).toMatchInlineSnapshot(`
      Object {
        "changes": Array [
          Object {
            "diff": Object {
              "fromValue": "a",
              "isChanged": true,
              "path": Array [
                0,
              ],
              "segments": Array [
                Object {
                  "text": "a",
                  "type": "removed",
                },
                Object {
                  "text": "b",
                  "type": "added",
                },
              ],
              "toValue": "b",
              "type": "string",
            },
            "index": 0,
            "op": "change",
            "path": Array [
              0,
            ],
          },
        ],
        "fromValue": Array [
          "a",
        ],
        "isChanged": true,
        "path": Array [],
        "toValue": Array [
          "b",
        ],
        "type": "array",
      }
    `)
  })

  test('type change', () => {
    expect(diffItem('bf1942', 0xbf1942)).toMatchInlineSnapshot(`
      Object {
        "fromType": "string",
        "fromValue": "bf1942",
        "isChanged": true,
        "path": Array [],
        "toType": "number",
        "toValue": 12523842,
        "type": "typeChange",
      }
    `)
  })
})
