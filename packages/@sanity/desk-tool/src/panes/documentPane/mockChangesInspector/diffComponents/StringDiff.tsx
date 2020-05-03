import * as React from 'react'
import {StringDiff as IStringDiff, StringDiffSegment} from '../../../../utils/diff'
import FieldDiffContainer from '../components/FieldDiffContainer'

import styles from './StringDiff.css'

function StringSegment({segment}: {segment: StringDiffSegment}) {
  if (segment.type === 'added') {
    return <span className={styles.add}>{segment.text}</span>
  }

  if (segment.type === 'removed') {
    return <span className={styles.remove}>{segment.text}</span>
  }

  return <span>{segment.text}</span>
}

interface Props {
  diff: IStringDiff
}

function StringDiff(props: Props) {
  return (
    <FieldDiffContainer>
      {props.diff.segments.map((segment, idx) => (
        <StringSegment key={String(idx)} segment={segment} />
      ))}
    </FieldDiffContainer>
  )
}

export default StringDiff
