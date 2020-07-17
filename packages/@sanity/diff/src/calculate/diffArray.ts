import {
  ArrayDiff,
  Maybe,
  Path,
  KeySegment,
  KeyedSanityObject,
  ArrayDiffOperation,
  AddAfterOperation,
  RemoveOperation
} from '../types'
import {diffItem} from './diffItem'
import {getLongestCommonSubsequence} from './lcs'

const SORT_ORDER: ArrayDiffOperation['op'][] = ['add', 'move', 'remove', 'change']

export function diffArray<T = unknown>(
  fromValue: Maybe<T[]>,
  toValue: Maybe<T[]>,
  path: Path = []
): ArrayDiff {
  const from = fromValue || []
  const to = toValue || []

  let changes: ArrayDiffOperation[] = []
  if (from !== to) {
    changes =
      isUniquelyKeyed(from) && isUniquelyKeyed(to)
        ? diffArrayByKey(from, to, path)
        : diffArrayByIndex(from, to, path)
  }

  return {
    type: 'array',
    path,
    fromValue,
    toValue,
    changes,
    isChanged: changes.length > 0
  }
}

function diffArrayByIndex(
  fromValue: unknown[],
  toValue: unknown[],
  path: Path
): ArrayDiffOperation[] {
  const hasUniqueValues =
    fromValue.every(isUniquePrimitiveWithinArray) && toValue.every(isUniquePrimitiveWithinArray)

  if (hasUniqueValues) {
    return simplifySemanticDiff(getSemanticDiff(fromValue, toValue, path))
  }

  const ops: ArrayDiffOperation[] = []
  const length = Math.max(fromValue.length, toValue.length)

  for (let i = 0; i < length; i++) {
    const diff = diffItem(fromValue[i], toValue[i], path.concat(i))
    if (!diff || !diff.isChanged) {
      continue
    }

    const itemPath = path.concat(i)
    if (i > fromValue.length - 1) {
      ops.push({
        op: 'add',
        index: i,
        path: itemPath,
        toValue: toValue[i],
        after: i - 1
      })
    } else if (i > toValue.length - 1) {
      ops.push({
        op: 'remove',
        index: i,
        path: itemPath,
        fromValue: fromValue[i]
      })
    } else {
      ops.push({
        op: 'change',
        index: i,
        path: itemPath,
        diff
      })
    }
  }

  return ops
}

// Note: requires uniquely keyed array
function diffArrayByKey(
  fromValue: KeyedSanityObject[],
  toValue: KeyedSanityObject[],
  path: Path
): ArrayDiffOperation[] {
  return getSemanticDiff(fromValue, toValue, path)
}

function isSameItem(
  itemA: KeyedSanityObject | unknown,
  itemB: KeyedSanityObject | unknown
): boolean {
  return (getKey(itemA) || itemA) === (getKey(itemB) || itemB)
}

function isEqual(itemA: KeyedSanityObject | unknown, itemB: KeyedSanityObject | unknown): boolean {
  const left = getKey(itemA) || itemA
  const right = getKey(itemB) || itemB
  const diff = diffItem(left, right, [])
  return !diff || !diff.isChanged
}

function isUniquePrimitiveWithinArray(value: unknown, index: number, items: unknown[]): boolean {
  return isPrimitiveValue(value) && items.indexOf(value, index + 1) === -1
}

function isPrimitiveValue(item: unknown) {
  if (item === null) {
    return true
  }

  switch (typeof item) {
    case 'string':
    case 'number':
    case 'boolean':
      return true
    default:
      return false
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

function getPathSegment(obj: unknown, index: number): KeySegment | number {
  const key = getKey(obj)
  return key ? {_key: key} : index
}

// Note: requires unique items
function getSemanticDiff(
  prevItems: unknown[],
  nextItems: unknown[],
  path: Path
): ArrayDiffOperation[] {
  const ops: ArrayDiffOperation[] = []

  // See if we can find a common head and tail of the array
  // This makes the "longest common subsequence" algorithm faster by providing a smaller subset to compare
  const prevLength = prevItems.length
  const nextLength = nextItems.length
  const minLength = Math.min(prevLength, nextLength)

  let prevIndex

  let numCommonHead = 0
  while (isEqual(prevItems[numCommonHead], nextItems[numCommonHead]) && numCommonHead < minLength) {
    numCommonHead++
  }

  let numCommonTail = 0
  while (
    isEqual(prevItems[prevLength - 1 - numCommonTail], nextItems[nextLength - 1 - numCommonTail]) &&
    numCommonTail + numCommonHead < minLength
  ) {
    prevIndex = prevLength - 1 - numCommonTail
    numCommonTail++
  }

  const numCommonEnds = numCommonHead + numCommonTail

  if (prevLength === nextLength && numCommonEnds === prevLength) {
    // The whole array is equal
    return []
  }

  if (numCommonEnds === prevLength) {
    // We've got the same start and end, so one or more consecutive items has been added
    for (let index = numCommonHead; index < nextLength - numCommonTail; index++) {
      const itemPath = path.concat(getPathSegment(nextItems[index], index))
      ops.push({
        op: 'add',
        index,
        path: itemPath,
        ...(index === 0 ? {before: 0} : {after: getPathSegment(nextItems[index - 1], index - 1)}),
        toValue: nextItems[index]
      })
    }
    return ops
  }

  if (numCommonEnds === nextLength) {
    // We've got the same start and end, so one or more consecutive items has been removed
    for (let index = numCommonHead; index < prevLength - numCommonTail; index++) {
      const itemPath = path.concat(getPathSegment(prevItems[index], index))
      ops.push({
        op: 'remove',
        index,
        fromValue: prevItems[index],
        path: itemPath
      })
    }
    return ops
  }

  // Simple cases covered, we should try to minimize the number of operations
  const prev =
    numCommonEnds > 0 ? prevItems.slice(numCommonHead, prevLength - numCommonTail) : prevItems
  const next =
    numCommonEnds > 0 ? nextItems.slice(numCommonHead, nextLength - numCommonTail) : nextItems

  // Find the longest consecutive subset of the changed parts
  const lcs = getKey(prev[0])
    ? // Use keys if array is keyed array
      getLongestCommonSubsequence(prev.map(getKey), next.map(getKey))
    : // Otherwise compare by value
      getLongestCommonSubsequence(prev, next)

  // Find items that have been "removed" from their original position
  // Note that this might mean they are simply _moved_
  let possiblyRemoved: number[] = []
  for (let index = numCommonHead; index < prevLength - numCommonTail; index++) {
    if (lcs.prevIndices.indexOf(index - numCommonHead) === -1) {
      possiblyRemoved.push(index)
    }
  }

  // Find items that have moved or was added
  let possiblyRemovedLength = possiblyRemoved.length
  const compareLength = nextLength - numCommonTail
  for (let index = numCommonHead; index < compareLength; index++) {
    const item = next[index - numCommonHead]
    const prevItem = nextItems[index - 1]
    const nextItem = nextItems[index + 1]

    let nextIndex = lcs.nextIndices.indexOf(index - numCommonHead)
    if (nextIndex !== -1) {
      // Item existed previously
      prevIndex = lcs.prevIndices[nextIndex] + numCommonHead
      nextIndex = lcs.nextIndices[nextIndex] + numCommonHead
      continue
    }

    // Item was added, try to match with a removed item and register as position move
    let isMove = false
    for (let removedPrevIndex = 0; removedPrevIndex < possiblyRemovedLength; removedPrevIndex++) {
      prevIndex = possiblyRemoved[removedPrevIndex]
      if (!isSameItem(prev[prevIndex - numCommonHead], next[index - numCommonHead])) {
        continue
      }

      // It's a move!
      const itemPath = path.concat(getPathSegment(item, index))
      ops.push({
        op: 'move',
        fromIndex: prevIndex,
        toIndex: index,
        path: itemPath
      })

      const diff = diffItem(prevItems[prevIndex], nextItems[index], itemPath)
      if (diff && diff.isChanged) {
        ops.push({
          op: 'change',
          index,
          path: itemPath,
          diff
        })
      }

      possiblyRemoved.splice(removedPrevIndex, 1)
      nextIndex = index
      isMove = true
      break
    }

    if (!isMove) {
      // Did not find a matching item, so it was added
      const itemPath = path.concat(getPathSegment(item, index))
      const baseAdd: Omit<AddAfterOperation, 'after'> = {
        op: 'add',
        index,
        path: itemPath,
        toValue: item
      }

      if (typeof prevItem !== 'undefined') {
        ops.push({...baseAdd, after: getPathSegment(prevItem, index - 1)})
      } else if (typeof nextItem !== 'undefined') {
        ops.push({...baseAdd, before: getPathSegment(nextItem, index + 1)})
      } else {
        ops.push({...baseAdd, before: 0})
      }
    }
  }

  possiblyRemoved.forEach(index => {
    // Item was removed
    ops.push({
      op: 'remove',
      fromValue: prevItems[index],
      index,
      path: path.concat(getPathSegment(prevItems[index], index))
    })
  })

  return ops.sort(sortOperations)
}

function sortOperations(op1: ArrayDiffOperation, op2: ArrayDiffOperation): number {
  return SORT_ORDER.indexOf(op1.op) - SORT_ORDER.indexOf(op2.op)
}

// When comparing primitive values, we may end up with results that include an
// add + remove operation, when in essence that is actually a "change" operation
// as long as the data types are the same. Loop over the array and replace these
// occurances with a single change operation
function simplifySemanticDiff(diffs: ArrayDiffOperation[]): ArrayDiffOperation[] {
  const source = diffs.slice()
  const simplified: ArrayDiffOperation[] = []
  for (let index = 0; index < source.length; index++) {
    const diff = source[index]
    if (diff.op !== 'add') {
      simplified.push(diff)
      continue
    }

    let removal: RemoveOperation | undefined
    for (let x = index; x < source.length; x++) {
      const candidate = source[x]
      if (
        candidate.op === 'remove' &&
        candidate.index === diff.index &&
        typeof candidate.fromValue === typeof diff.toValue
      ) {
        removal = candidate
        source.splice(x, 1)
        simplified.push({
          op: 'change',
          diff: diffItem(candidate.fromValue, diff.toValue, diff.path),
          path: diff.path,
          index
        })
        break
      }
    }

    if (!removal) {
      simplified.push(diff)
    }
  }
  return simplified
}
