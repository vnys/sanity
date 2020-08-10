import {ArrayDiff} from '@sanity/diff'
import {ArrayItemChangeNode} from '../../panes/documentPane/changesPanel/types'
import {Annotation} from '../../panes/documentPane/history/types'

export interface ArrayDiffProps {
  diff: ArrayDiff<Annotation>
  items?: ArrayItemChangeNode[]
  schemaType: {name: string}
}
