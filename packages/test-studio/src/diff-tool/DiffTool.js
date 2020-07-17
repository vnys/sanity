import * as React from 'react'
import {diffItem, resolveDiffComponent} from '@sanity/diff'
import {StateLink, withRouterHOC} from 'part:@sanity/base/router'
import schema from 'part:@sanity/base/schema'
import {examples} from './examples'
import styles from './DiffTool.css'

const INVALID_JSON = Symbol.for('INVALID_JSON')

// eslint-disable-next-line complexity
function DiffTestTool(props) {
  const [customFromValue, setCustomFromValue] = React.useState()
  const [customToValue, setCustomToValue] = React.useState()

  const example = examples[props.router.state.exampleName]
  const hasExample = typeof example !== 'undefined'

  const fromValue = hasExample && !customFromValue ? example.fromValue : tryParse(customFromValue)
  const toValue = hasExample && !customToValue ? example.toValue : tryParse(customToValue)

  const fromValueStr =
    hasExample && !customFromValue ? JSON.stringify(example.fromValue, null, 2) : customFromValue
  const toValueStr =
    hasExample && !customToValue ? JSON.stringify(example.toValue, null, 2) : customToValue

  const diff =
    fromValue === INVALID_JSON || toValue === INVALID_JSON
      ? undefined
      : diffItem(fromValue, toValue)

  const diffType = diff && diff.type !== 'typeChange' ? diff.type : typeof fromValue
  let schemaTypeName = diffType === 'object' ? fromValue._type || toValue._type : diffType
  if (example && example.schemaTypeName) {
    schemaTypeName = example.schemaTypeName
  }

  const schemaType = diff && schema.get(schemaTypeName)
  const DiffComponent = (schemaType && resolveDiffComponent(schemaType)) || MissingDiffComponent

  return (
    <>
      <div>
        <nav>
          <ul className={styles.nav}>
            {Object.keys(examples).map(exampleName => (
              <li className={styles.link} key={exampleName}>
                <StateLink state={{exampleName}}>{examples[exampleName].title}</StateLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {typeof example !== 'undefined' && (
        <div style={{display: 'flex'}}>
          <div style={{flex: 1, padding: '10px'}}>
            <h2>From</h2>
            <textarea
              style={{
                width: '95%',
                height: '230px',
                backgroundColor: fromValue === INVALID_JSON ? '#ffcccb' : '#fff'
              }}
              value={fromValueStr}
              onChange={evt => setCustomFromValue(evt.target.value)}
            />
          </div>
          <div style={{flex: 1, padding: '10px'}}>
            <h2>To</h2>
            <textarea
              style={{
                width: '95%',
                height: '230px',
                backgroundColor: toValue === INVALID_JSON ? '#ffcccb' : '#fff'
              }}
              value={toValueStr}
              onChange={evt => setCustomToValue(evt.target.value)}
            />
          </div>
        </div>
      )}
      {diff && <DiffComponent schemaType={schemaType} {...diff} />}
      {diff && (
        <div>
          <h2>JSON</h2>
          <pre>
            <code>{JSON.stringify(diff, null, 2)}</code>
          </pre>
        </div>
      )}
    </>
  )
}

function tryParse(str) {
  if (!str) {
    return null
  }

  try {
    return JSON.parse(str)
  } catch (err) {
    return INVALID_JSON
  }
}

function MissingDiffComponent(props) {
  return (
    <div style={{backgroundColor: 'salmon'}}>Missing diff component for type "{props.type}"</div>
  )
}

export const DiffTool = withRouterHOC(({router, ...rest}) => (
  <DiffTestTool key={router.state.exampleName} router={router} {...rest} />
))
