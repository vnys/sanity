import {useUserColorManager} from '@sanity/base'
import {ItemDiff} from '@sanity/diff'
import React from 'react'
import {FallbackDiff} from '../_fallback/FallbackDiff'
import {resolveDiffComponent} from '../resolveDiffComponent'
import {Annotation} from '../../panes/documentPane/history/types'
import {getAnnotationColor} from '../helpers'
import {isPTSchemaType, PTDiff} from '../portableText'
import {ArrayDiffProps} from './types'

import styles from './arrayFieldDiff.css'

export function ArrayFieldDiff(props: ArrayDiffProps) {
  const userColorManager = useUserColorManager()

  if (isPTSchemaType(props.schemaType)) {
    return <PTDiff diff={props.diff} items={props.items} schemaType={props.schemaType} />
  }

  return (
    <div className={styles.root}>
      <div className={styles.itemList}>
        {props.items &&
          props.items.map((change, changeIndex) => {
            const {diff} = change

            const color =
              diff.type === 'added' || diff.type === 'removed'
                ? getAnnotationColor(userColorManager, diff.annotation)
                : null

            return (
              <div className={styles.diffItemContainer} key={String(changeIndex)}>
                <div
                  className={styles.diffItemIndexes}
                  style={color ? {background: color.bg, color: color.fg} : {}}
                >
                  <ArrayDiffIndexes fromIndex={diff.fromIndex} toIndex={diff.toIndex} />
                </div>
                <div className={styles.diffItemBox}>
                  <DefaultArrayDiffItem
                    diff={diff}
                    fromType={change.fromType}
                    toType={change.toType}
                  />
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

// eslint-disable-next-line complexity
function ArrayDiffIndexes({fromIndex, toIndex}: {fromIndex?: number; toIndex?: number}) {
  if (fromIndex === undefined && toIndex === undefined) {
    // neither `fromIndex` nor `toIndex`
    return <span className={styles.arrayDiffIndexes} />
  }

  if (fromIndex !== undefined && toIndex === undefined) {
    // `fromIndex` only (removed)
    return (
      <span className={styles.arrayDiffIndexes}>
        <span>{fromIndex}</span>
      </span>
    )
  }

  if (fromIndex === undefined && toIndex !== undefined) {
    // `toIndex` only
    return (
      <span className={styles.arrayDiffIndexes}>
        <span>{toIndex}</span>
      </span>
    )
  }

  if (fromIndex === toIndex) {
    // unchanged
    return (
      <span className={styles.arrayDiffIndexes}>
        <span>{fromIndex}</span>
      </span>
    )
  }

  if (fromIndex !== undefined && toIndex !== undefined && fromIndex < toIndex) {
    return (
      <span className={styles.arrayDiffIndexes}>
        <span>{fromIndex}</span>
        <span>&darr;</span>
        <span>{toIndex}</span>
      </span>
    )
  }

  return (
    <span className={styles.arrayDiffIndexes}>
      <span>{toIndex}</span>
      <span>&uarr;</span>
      <span>{fromIndex}</span>
    </span>
  )
}

// eslint-disable-next-line complexity
function DefaultArrayDiffItem(props: {
  diff: ItemDiff<Annotation>
  fromType?: {name: string}
  toType?: {name: string}
}) {
  const {diff, fromType, toType} = props

  if (diff.type === 'added') {
    return (
      <pre className={styles.addedItem}>
        Added array item ({toType && toType.name}): {JSON.stringify(diff, null, 2)}
      </pre>
    )
  }

  if (diff.type === 'changed') {
    const DiffComponent = (toType && resolveDiffComponent(toType as any)) || FallbackDiff

    console.log('array item changed', diff.diff, toType)

    return (
      <DiffComponent diff={diff.diff} schemaType={toType as any} />
      // <pre className={styles.changedItem}>
      //   Changed array item ({fromType && fromType.name}&rarr;
      //   {toType && toType.name}): {JSON.stringify(diff, null, 2)}
      // </pre>
    )
  }

  if (diff.type === 'removed') {
    return (
      <pre className={styles.removedItem}>
        Removed array item ({fromType && fromType.name}): {JSON.stringify(diff, null, 2)}
      </pre>
    )
  }

  // @todo: render moved items?
  return (
    <pre className={styles.item}>
      Unchanged item ({toType && toType.name}): {JSON.stringify(diff, null, 2)}
    </pre>
  )
}
