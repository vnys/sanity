import * as React from 'react'

const rotation = {
  left: 180,
  right: 0,
  up: -90,
  down: 90
}

export default function Arrow({
  direction = 'right',
  width = '2em'
}: {
  direction?: 'left' | 'right' | 'up' | 'down'
  width?: string
}) {
  return (
    <svg
      version="1.1"
      viewBox="0 0 917 806"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width,
        margin: '10px auto',
        transform: `rotate(${rotation[direction]}deg)`,
        display: 'block'
      }}
    >
      <path
        d="M477.501 70.999 L 450.508 98.006 585.503 233.003 L 720.497 368.000 385.749 368.000 L 51.000 368.000 51.000 406.500 L 51.000 445.000 385.249 445.000 L 719.497 445.000 584.746 579.754 L 449.994 714.508 477.001 741.501 L 504.007 768.493 685.253 587.246 L 866.499 406.000 685.496 224.997 L 504.493 43.993 477.501 70.999"
        fill="black"
      />
    </svg>
  )
}
