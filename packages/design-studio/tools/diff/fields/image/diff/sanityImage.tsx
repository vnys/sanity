import React from 'react'

import styles from './sanityImage.css'

const srcs = {
  'image-1-jpg':
    'https://images.unsplash.com/photo-1592439071603-bb7586535a16?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',

  'image-2-jpg':
    'https://images.unsplash.com/photo-1558035579-a10d04acf787?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',

  'image-3-jpg':
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',

  'image-4-jpg':
    'https://images.unsplash.com/photo-1520262454473-a1a82276a574?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2700&q=80'
}

export function SanityImage(props: {asset: any}) {
  const {asset} = props

  const src = srcs[asset._ref]

  if (src) {
    return (
      <div className={styles.root}>
        <img src={src} />
      </div>
    )
  }

  return <div className={styles.root}>{asset._ref}</div>
}
