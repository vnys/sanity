import {ObjectModel} from './object-model'
import {Patcher} from './internal-patcher'
import {RawPatch} from './patch'

type StringBuilder = {type: 'string'; data: string}
type ObjectBuilder = {type: 'object'; data: {[key: string]: unknown}}
type ArrayBuilder = unknown[]

const Model: ObjectModel<unknown, StringBuilder, ObjectBuilder, ArrayBuilder> = {
  wrap(data: any): unknown {
    return data
  },

  finalize(b: StringBuilder | ObjectBuilder | ArrayBuilder): unknown {
    if (Array.isArray(b)) {
      return b
    } else {
      return b.data
    }
  },

  objectGetKeys(value: unknown): string[] {
    return Object.keys(value as any)
  },

  objectGetField(value: unknown, key: string): unknown {
    return (value as any)[key]
  },

  arrayGetElement(value: unknown, idx: number): unknown {
    return (value as any[])[idx]
  },

  copyObject(value: unknown | null): ObjectBuilder {
    let res: ObjectBuilder = {
      type: 'object',
      data: {}
    }
    if (value !== null) {
      for (let [key, val] of Object.entries(value as ObjectBuilder)) {
        res.data[key] = val
      }
    }
    return res
  },

  copyArray(value: unknown | null): ArrayBuilder {
    if (value === null) return []
    return (value as ArrayBuilder).slice()
  },

  copyString(value: unknown | null): StringBuilder {
    return {
      type: 'string',
      data: value === null ? '' : (value as string)
    }
  },

  objectSetField(target: ObjectBuilder, key: string, value: unknown): void {
    target.data[key] = value
  },

  objectDeleteField(target: ObjectBuilder, key: string): void {
    delete target.data[key]
  },

  arrayAppendValue(target: ArrayBuilder, value: unknown): void {
    target.push(value)
  },

  arrayAppendSlice(target: ArrayBuilder, source: unknown, left: number, right: number): void {
    target.push(...(source as ArrayBuilder).slice(left, right))
  },

  stringAppendSlice(target: StringBuilder, source: unknown, left: number, right: number): void {
    target.data += (source as string).slice(left, right)
  },

  stringAppendValue(target: StringBuilder, value: unknown): void {
    target.data += value as string
  }
}

// Applies a patch on a JavaScript object.
export function applyPatch(left: any, patch: RawPatch): any {
  let root = left // No need to wrap because the representation is the same.
  let patcher = new Patcher(Model, root, patch)
  return patcher.process()
}
