import {ArrayDiff} from '@sanity/diff'
import {ArrayItemChangeNode} from '../../../changesPanel/types'
import {Annotation} from '../../../history/types'

export interface ArrayDiffProps {
  diff: ArrayDiff<Annotation>
  items?: ArrayItemChangeNode[]
  schemaType: {name: string}
}
