import * as React from 'react'
import schema from 'part:@sanity/base/schema?'
import Preview from 'part:@sanity/base/preview?'
import {ObjectDiff} from '../../../../utils/diff'
import FieldDiffContainer from '../components/FieldDiffContainer'
import Arrow from './__temporary__/Arrow'

interface Reference {
  _ref?: string
  _weak?: boolean
}

interface Props {
  diff: ObjectDiff<Reference>
  field: any
}

function getReferencedType(type) {
  if (!type.to) {
    return type.type ? getReferencedType(type.type) : undefined
  }

  const target = Array.isArray(type.to) ? type.to[0] : type.to
  return schema.get(target.name)
}

function ReferenceDiff({diff, field}: Props) {
  if (!diff.isChanged) {
    return null
  }

  const type = getReferencedType(field.type)
  const prev = diff.fromValue && diff.fromValue._ref
  const next = diff.toValue && diff.toValue._ref

  return (
    <FieldDiffContainer>
      {prev && <Preview type={type} value={diff.fromValue} layout="default" />}
      {prev && <Arrow direction="down" />}
      {next && <Preview type={type} value={diff.toValue} layout="default" />}
    </FieldDiffContainer>
  )
}

export default ReferenceDiff
