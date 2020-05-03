/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  diff_match_patch as DiffMatchPatch,
  DIFF_DELETE,
  DIFF_EQUAL,
  DIFF_INSERT
} from 'diff-match-patch'

const dmp = new DiffMatchPatch()
const dmpOperations: {[key: number]: StringDiffSegment['type']} = {
  [DIFF_EQUAL]: 'unchanged',
  [DIFF_DELETE]: 'removed',
  [DIFF_INSERT]: 'added'
}

const ignoredFields = ['_id', '_type', '_createdAt', '_updatedAt', '_rev']

export function diffItem(fromValue: unknown, toValue: unknown, path: Path = []): Diff | undefined {
  if (fromValue === toValue) {
    return
  }

  const fromType = getType(fromValue)
  const toType = getType(toValue)
  const dataType = fromType === 'null' ? toType : fromType

  const isContainer = dataType === 'object' || dataType === 'array'
  if (!isContainer) {
    return diffPrimitive(fromValue as PrimitiveValue, toValue as PrimitiveValue, path, dataType)
  }

  if (fromType !== toType && fromType !== 'null' && toType !== 'null') {
    // Array => Object / Object => Array
    return {type: 'typeChange', path, fromType, toType, fromValue, toValue, isChanged: true}
  }

  return dataType === 'array'
    ? diffArray(fromValue as unknown[], toValue as unknown[], path)
    : diffObject(fromValue as object, toValue as object, path)
}

export function diffObject(
  fromValue: SanityObject | null | undefined,
  toValue: SanityObject | null | undefined,
  path: Path
): ObjectDiff | undefined {
  if (fromValue === toValue) {
    return undefined
  }

  function getChildren(): ObjectDiff['children'] {
    const children: ObjectDiff['children'] = {}
    const atRoot = path.length === 0
    const from = fromValue || {}
    const to = toValue || {}
    const cache: {[fieldName: string]: Diff | undefined} = {}

    // Find all the unique field names within from and to
    const allFields = [...Object.keys(from), ...Object.keys(to)].filter(
      (fieldName, index, siblings) => siblings.indexOf(fieldName) === index
    )

    // Create lazy differs for each field within the object
    allFields.forEach(fieldName => {
      if (
        // Don't diff _rev, _createdAt etc
        (atRoot && ignoredFields.includes(fieldName)) ||
        // Don't diff two nullish values (null/undefined)
        (isNullish(from[fieldName]) && isNullish(to[fieldName]))
      ) {
        return
      }

      // Create lazy getter/differ for each field
      Object.defineProperty(children, fieldName, {
        enumerable: true,
        get: function() {
          if (fieldName in cache) {
            return cache[fieldName]
          }

          const fieldDiff = diffItem(from[fieldName], to[fieldName], path.concat(fieldName))
          cache[fieldName] = fieldDiff || undefined
          return cache[fieldName]
        }
      })
    })

    return children
  }

  return {
    type: 'object',
    path,
    fromValue,
    toValue,

    /**
     * Discouraged: prefer looping over children unless you need to check every field!
     */
    get isChanged(): boolean {
      return Object.keys(this.children).some(key => !isNullish(this.children[key]))
    },

    get children(): ObjectDiff['children'] {
      delete this.children
      this.children = getChildren()
      return this.children
    }
  }
}

function diffArray(fromValue: unknown[], toValue: unknown[], path: Path): ArrayDiff | undefined {
  const from = fromValue || []
  const to = toValue || []

  const children =
    isUniquelyKeyed(from) && isUniquelyKeyed(to)
      ? diffArrayByKey(from, to, path)
      : diffArrayByIndex(from, to, path)

  return children.length > 0
    ? {
        type: 'array',
        path,
        fromValue,
        toValue,
        children,
        isChanged: children.length > 0
      }
    : undefined
}

function diffArrayByIndex(fromValue: unknown[], toValue: unknown[], path: Path): Diff[] {
  const children: Diff[] = []
  const length = Math.max(fromValue.length, toValue.length)

  for (let i = 0; i < length; i++) {
    const diff = diffItem(fromValue[i], toValue[i], path.concat(i))
    if (diff && diff.isChanged) {
      children.push(diff)
    }
  }

  return children
}

function diffArrayByKey(
  fromValue: KeyedSanityObject[],
  toValue: KeyedSanityObject[],
  path: Path
): Diff[] {
  const children: Diff[] = []

  const keyedA = indexByKey(fromValue)
  const keyedB = indexByKey(toValue)

  // There's a bunch of hard/semi-hard problems related to using keys
  // Unless we have the exact same order, just use indexes for now
  if (!arrayIsEqual(keyedA.keys, keyedB.keys)) {
    return diffArrayByIndex(fromValue, toValue, path)
  }

  for (let i = 0; i < keyedB.keys.length; i++) {
    const key = keyedB.keys[i]
    const valueA = keyedA.index[key]
    const valueB = keyedB.index[key]
    const diff = diffItem(valueA, valueB, path.concat({_key: key}))

    if (diff && diff.isChanged) {
      children.push(diff)
    }
  }

  return children
}

function diffPrimitive(
  fromValue: PrimitiveValue,
  toValue: PrimitiveValue,
  path: Path,
  type: NormalizedType
): Diff | undefined {
  if (fromValue === toValue) {
    return undefined
  }

  if (type === 'string') {
    return diffString(`${fromValue || ''}`, `${toValue || ''}`, path)
  }

  return {
    type: getType(fromValue || toValue),
    path,
    fromValue,
    toValue,
    isChanged: true
  }
}

function diffString(fromValue: string, toValue: string, path: Path): StringDiff {
  return {
    type: 'string',
    path,
    fromValue,
    toValue,
    // Called from isPrimitive, which checks for equality, so should always be true
    isChanged: true,
    get segments(): StringDiffSegment[] {
      const dmpDiffs = dmp.diff_main(fromValue, toValue)
      dmp.diff_cleanupSemantic(dmpDiffs)
      delete this.segments
      this.segments = dmpDiffs.map(([op, text]) => ({type: dmpOperations[op], text}))
      return this.segments
    }
  }
}

function isUniquelyKeyed(arr: unknown[]): arr is KeyedSanityObject[] {
  const keys: string[] = []

  for (let i = 0; i < arr.length; i++) {
    const key = getKey(arr[i])
    if (!key || keys.indexOf(key) !== -1) {
      return false
    }

    keys.push(key)
  }

  return true
}

function getKey(obj: unknown): string | undefined {
  return (typeof obj === 'object' && obj !== null && (obj as KeyedSanityObject)._key) || undefined
}

function indexByKey(
  arr: KeyedSanityObject[]
): {keys: string[]; index: {[key: string]: KeyedSanityObject}} {
  return arr.reduce(
    (acc, item) => {
      acc.keys.push(item._key)
      acc.index[item._key] = item
      return acc
    },
    {keys: [] as string[], index: {} as {[key: string]: KeyedSanityObject}}
  )
}

function arrayIsEqual(fromValue: unknown[], toValue: unknown[]): boolean {
  return fromValue.length === toValue.length && fromValue.every((item, i) => toValue[i] === item)
}

function getType(obj: unknown): NormalizedType {
  if (Array.isArray(obj)) {
    return 'array'
  }

  if (obj === null || obj === void 0) {
    return 'null'
  }

  const type = typeof obj
  switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'object':
      return type
    default:
      return 'unknown'
  }
}

function isNullish(thing: unknown): boolean {
  return thing === null || typeof thing === 'undefined'
}

type PathSegment = string | number | {_key: string}
type Path = PathSegment[]

type NormalizedType = 'array' | 'null' | 'string' | 'number' | 'boolean' | 'object' | 'unknown'

interface BaseDiff {
  type: NormalizedType | 'typeChange'
  path: Path
  fromValue: unknown
  toValue: unknown
  isChanged: boolean
}

export interface StringDiffSegment {
  type: 'unchanged' | 'removed' | 'added'
  text: string
}

export type StringDiff = BaseDiff & {
  type: 'string'
  fromValue: string | undefined | null
  toValue: string | undefined | null
  segments: StringDiffSegment[]
}

export type NumberDiff = BaseDiff & {
  type: 'number'
  fromValue: number | undefined | null
  toValue: number | undefined | null
}

export type BooleanDiff = BaseDiff & {
  type: 'boolean'
  fromValue: boolean | undefined | null
  toValue: boolean | undefined | null
}

export type ObjectDiff<T extends object = object> = BaseDiff & {
  type: 'object'
  fromValue: T | undefined | null
  toValue: T | undefined | null
  children: {[fieldName: string]: Diff | undefined}
}

export type ArrayDiff = BaseDiff & {
  type: 'array'
  fromValue: unknown[] | undefined | null
  toValue: unknown[] | undefined | null
  children: Diff[]
}

export type UnknownTypeDiff = BaseDiff & {
  type: 'unknown'
}

export type TypeChangeDiff = BaseDiff & {
  type: 'typeChange'
  fromType: NormalizedType
  toType: NormalizedType
}

export type Diff =
  | BaseDiff
  | StringDiff
  | NumberDiff
  | BooleanDiff
  | ObjectDiff
  | ArrayDiff
  | UnknownTypeDiff
  | TypeChangeDiff

type PrimitiveValue = string | number | boolean | null | undefined

export interface KeyedSanityObject {
  [key: string]: unknown
  _key: string
}

export type SanityObject = KeyedSanityObject | Partial<KeyedSanityObject>
