// Util to get scroll container
const scrollRegex = /(auto|scroll)/
const style = (node, prop) => getComputedStyle(node, null).getPropertyValue(prop)
const isScroll = node =>
  scrollRegex.test(style(node, 'overflow') + style(node, 'overflow-y') + style(node, 'overflow-x'))

// eslint-disable-next-line import/prefer-default-export
export const getScrollContainer = node =>
  // eslint-disable-next-line no-nested-ternary
  !node || node === document.body
    ? document.body
    : isScroll(node)
    ? node
    : getScrollContainer(node.parentNode)
