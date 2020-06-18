import React from 'react'

import styles from './sanityImage.css'

export function SanityImage(props: {asset: any}) {
  const {asset} = props

  return <div className={styles.root}>{asset._ref}</div>
}
