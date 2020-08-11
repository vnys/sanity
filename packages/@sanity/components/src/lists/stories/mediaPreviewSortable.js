import Chance from 'chance'
import {range, random} from 'lodash'
import {List as GridList} from 'part:@sanity/components/lists/grid'
import {
  List as SortableGridList,
  Item as SortableGridItem,
  DragHandle
} from 'part:@sanity/components/lists/sortable-grid'
import MediaPreview from 'part:@sanity/components/previews/media'
import Sanity from 'part:@sanity/storybook/addons/sanity'
import React from 'react'
import {arrayMove} from 'react-sortable-hoc'

const chance = new Chance()

const containerStyle = {
  width: '90%',
  height: '90%',
  boxShadow: '0 0 10px #999',
  overflow: 'auto',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translateX(-50%) translateY(-50%)'
}

class SortableGridTester extends React.PureComponent {
  constructor(props, args) {
    super(props, args)
    this.state = {
      items: this.props.items.slice()
    }
  }

  handleOnSort = ({oldIndex, newIndex}) => {
    const {items} = this.state
    this.setState({
      items: arrayMove(items, oldIndex, newIndex)
    })
    this.props.onSort()
  }

  render() {
    const {items} = this.state
    const {renderWith: Preview} = this.props

    return (
      <SortableGridList onSort={this.handleOnSort}>
        {items.map((item, index) => (
          <SortableGridItem key={item.key} index={index}>
            <DragHandle />
            <Preview item={item} />
          </SortableGridItem>
        ))}
      </SortableGridList>
    )
  }
}

export function MediaPreviewSortableStory() {
  const items = range(50).map((item, i) => {
    const width = random(10, 80) * 10
    const height = random(10, 50) * 10
    const randomImage = `http://placekitten.com/${width}/${height}`
    return {
      key: `${i}`,
      title: chance.name(),
      imageUrl: randomImage,
      aspect: width / height
    }
  })
  return (
    <Sanity part="part:@sanity/components/lists/grid" propTables={[GridList]}>
      <div style={containerStyle}>
        <SortableGridTester items={items} renderWith={MediaPreview} />
      </div>
    </Sanity>
  )
}
