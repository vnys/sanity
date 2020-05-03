import * as React from 'react'
import imageUrl from '@sanity/image-url'
import client from 'part:@sanity/base/client'
import {ObjectDiff} from '../../../../utils/diff'
import FieldDiffContainer from '../components/FieldDiffContainer'
import styles from './ImageDiff.css'
import Arrow from './__temporary__/Arrow'

interface Image {
  asset?: {
    _ref?: string
  }
  hotspot?: {
    x: number
    y: number
    width: number
    height: number
  }
  crop?: {
    x: number
    y: number
    width: number
    height: number
  }
}

interface Props {
  diff: ObjectDiff<Image>
  field: any
}

function ImageDiff({diff, field}: Props) {
  if (!diff.isChanged) {
    return null
  }

  const builder = imageUrl(client)

  const prevImage = diff.fromValue && diff.fromValue.asset && diff.fromValue.asset._ref
  const nextImage = diff.toValue && diff.toValue.asset && diff.toValue.asset._ref

  return (
    <FieldDiffContainer>
      {prevImage && (
        <div className={styles.imageFramePrev}>
          <img
            src={
              builder
                .image(prevImage)
                .width(300)
                .height(240)
                .fit('max')
                .toString() || ''
            }
          />
        </div>
      )}

      {prevImage && <Arrow direction="down" />}

      {nextImage && (
        <div className={styles.imageFrame}>
          <img
            src={
              builder
                .image(nextImage)
                .width(300)
                .height(240)
                .fit('max')
                .toString() || ''
            }
          />
        </div>
      )}
    </FieldDiffContainer>
  )
}

export default ImageDiff
