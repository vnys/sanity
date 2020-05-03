import * as React from 'react'
import {Diff} from '../../../utils/diff'
import {FieldDiffProvider} from './fieldDiffProvider'
import diffComponents from './diffComponents'

function resolveDiffComponent(diff: Diff, field: any) {
  let type = field.type
  let component
  while (type && !component) {
    const typeName = type.name ? type.name : type.jsonType
    component = diffComponents[typeName]
    type = type.type || {name: type.jsonType}
  }
  return component
}

interface Props {
  diff: Diff
  field: any
}

function FieldDiffResolver({diff, field}: Props) {
  // @todo should diff components have to consider type changes? invalid type values?
  const DiffComponent = resolveDiffComponent(diff, field)

  if (DiffComponent) {
    return <DiffComponent diff={diff} field={field} />
  }

  return (
    <div>
      DefaultDiff ({diff.type})<pre>{JSON.stringify(diff, null, 2)}</pre>
    </div>
  )
}

function FieldDiff({diff, field}: Props) {
  return (
    <FieldDiffProvider field={field}>
      <FieldDiffResolver diff={diff} field={field} />
    </FieldDiffProvider>
  )
}

export default FieldDiff
