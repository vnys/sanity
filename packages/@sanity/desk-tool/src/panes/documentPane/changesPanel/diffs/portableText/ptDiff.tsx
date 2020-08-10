import {ArrayDiff} from '@sanity/diff'
import React from 'react'
import {ArrayItemChangeNode} from '../../../changesPanel/types'
import {Annotation} from '../../../history/types'

export interface PTDiffProps {
  diff: ArrayDiff<Annotation>
  items?: ArrayItemChangeNode[]
  schemaType: {name: string}
}

export function PTDiff(props: PTDiffProps) {
  return <div>Portable Text Diff</div>
}
