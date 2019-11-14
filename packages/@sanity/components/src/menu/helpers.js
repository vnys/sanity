export function getNextFocusableMenuItemIndex(children, currentIndex) {
  const length = children.length
  const focusableLength = children.filter(child => !child.props.disabled).length
  if (!focusableLength === 0) return -1
  let index = currentIndex + 1
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (index >= length) {
      index = -1
    } else if (children[index] && !children[index].props.disabled) {
      return index
    }
    index += 1
    return index
  }
}

export function getPreviousFocusableMenuItemIndex(children, currentIndex) {
  const length = children.length
  const focusableLength = children.filter(child => !child.props.disabled).length
  if (!focusableLength === 0) return -1
  let index = currentIndex - 1
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (index < 0) {
      index = length
    } else if (children[index] && !children[index].props.disabled) {
      return index
    }
    index -= 1
    return index
  }
}
