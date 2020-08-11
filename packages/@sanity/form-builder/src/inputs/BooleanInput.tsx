import React, {useRef} from 'react'
import Switch from 'part:@sanity/components/toggles/switch'
import Checkbox from 'part:@sanity/components/toggles/checkbox'
import ValidationStatus from 'part:@sanity/components/validation/status'
import PatchEvent, {set} from '../PatchEvent'
import {Type, Marker} from '../typedefs'
import styles from './BooleanInput.css'

type Props = {
  type: Type
  value: boolean | null
  readOnly: boolean | null
  onFocus: () => void
  onChange: (arg0: PatchEvent) => void
  markers: Marker[]
}
// Todo: support indeterminate state, see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox

export default function BooleanInput(props: Props) {
  const handleChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    props.onChange(PatchEvent.from(set(event.currentTarget.checked)))
  }
  const {value, type, readOnly, onFocus, markers} = props
  const isCheckbox = type.options && type.options.layout === 'checkbox'
  return (
    <div className={styles.root}>
      {isCheckbox ? (
        <Checkbox
          label={type.title}
          readOnly={readOnly}
          onChange={handleChange}
          onFocus={onFocus}
          checked={value}
          description={type.description}
        >
          <ValidationStatus markers={markers} />
        </Checkbox>
      ) : (
        <Switch
          readOnly={readOnly}
          checked={value}
          label={type.title}
          description={type.description}
          onChange={handleChange}
          onFocus={onFocus}
        >
          <ValidationStatus markers={markers} />
        </Switch>
      )}
    </div>
  )
}
