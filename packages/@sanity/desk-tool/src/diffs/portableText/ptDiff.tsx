import {ArrayDiff} from '@sanity/diff'
import React from 'react'
import {ArrayItemMetadata} from '../../panes/documentPane/changesPanel/types'
import {Annotation} from '../../panes/documentPane/history/types'

export interface PTDiffProps {
  diff: ArrayDiff<Annotation>
  items?: ArrayItemMetadata[]
  schemaType: {name: string}
}

export function PTDiff(props: PTDiffProps) {
  return <div>Portable Text Diff</div>
}
