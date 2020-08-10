import {ObjectDiff} from '@sanity/diff'
import React from 'react'
import {Annotation} from '../../panes/documentPane/history/types'
import {ObjectField} from '../../panes/documentPane/types'
import {DiffComponent} from '../types'
import {buildChangeList} from './buildChangeList'

export const ObjectFieldDiff: DiffComponent<ObjectDiff<Annotation, ObjectField>> = ({
  diff,
  schemaType
}) => {
  console.log('ObjectFieldDiff', diff, schemaType)

  const changes = buildChangeList(schemaType as any, diff, [])

  console.log(changes)

  return <div>ObjectFieldDiff</div>
}
