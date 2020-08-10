import {Diff, ObjectDiff, Path, FieldDiff, ItemDiff} from '@sanity/diff'
import {Annotation} from '../../../history/types'
import {ObjectField} from '../types'

const toString = Object.prototype.toString
// Copied from https://github.com/ForbesLindesay/type-of, but inlined to have fine grained control

// eslint-disable-next-line complexity
export function resolveJSType(val) {
  switch (toString.call(val)) {
    case '[object Function]':
      return 'function'
    case '[object Date]':
      return 'date'
    case '[object RegExp]':
      return 'regexp'
    case '[object Arguments]':
      return 'arguments'
    case '[object Array]':
      return 'array'
    case '[object String]':
      return 'string'
    default:
  }

  if (typeof val == 'object' && val && typeof val.length == 'number') {
    try {
      // eslint-disable-next-line max-depth
      if (typeof val.callee == 'function') {
        return 'arguments'
      }
    } catch (ex) {
      // eslint-disable-next-line max-depth
      if (ex instanceof TypeError) {
        return 'arguments'
      }
    }
  }

  if (val === null) {
    return 'null'
  }

  if (val === undefined) {
    return 'undefined'
  }

  if (val && val.nodeType === 1) {
    return 'element'
  }

  if (val === Object(val)) {
    return 'object'
  }

  return typeof val
}

export function resolveTypeName(value) {
  const jsType = resolveJSType(value)
  return (jsType === 'object' && '_type' in value && value._type) || jsType
}

export function getDiffAtPath(diff: ObjectDiff<Annotation>, path: Path): Diff<Annotation> | null {
  let node: Diff<Annotation> = diff

  for (const pathSegment of path) {
    if (node.type === 'object' && typeof pathSegment === 'string') {
      const fieldDiff: FieldDiff<Annotation> = node.fields[pathSegment]

      // eslint-disable-next-line max-depth
      if (!fieldDiff || fieldDiff.type === 'unchanged') {
        return null
      }

      // eslint-disable-next-line max-depth
      if (fieldDiff.type === 'added' || fieldDiff.type === 'removed') {
        // @todo how do we want to handle this?
        // @todo to test, set a boolean field from undefined to a value
        return null
      }

      node = fieldDiff.diff
    } else {
      throw new Error(
        `Mismatch between path segment (${typeof pathSegment}) and diff type (${diff.type})`
      )
    }
  }

  return node
}

// @todo: typings
function resolveArrayOfType(objectField: ObjectField, value: any): {name: string} | undefined {
  const typeName = resolveTypeName(value)

  if ((objectField.type as any).of) {
    return (objectField.type as any).of.find(t => t.name === typeName) || undefined
  }

  return undefined
}

export function getArrayItemDiffType(
  diff: ItemDiff<Annotation>,
  objectField: ObjectField
): {
  fromType?: {name: string}
  toType?: {name: string}
} {
  // return diff.items.map(diffItem => {
  if (diff.type === 'added') {
    return {
      toType: resolveArrayOfType(objectField, diff.toValue)
    }
  } else if (diff.type === 'changed') {
    return {
      fromType: resolveArrayOfType(objectField, diff.toValue),
      toType: resolveArrayOfType(objectField, diff.toValue)
    }
  } else if (diff.type === 'removed') {
    return {
      fromType: resolveArrayOfType(objectField, diff.fromValue)
    }
  }

  // unchanged
  return {
    toType: resolveArrayOfType(objectField, diff.toValue)
  }
}
