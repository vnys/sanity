import createSchema from 'part:@sanity/base/schema-creator'
import blockContent from './blockContent'
import category from './category'
import post from './post'
import author from './author'

export default createSchema({
  name: 'default',
  types: [post, author, category, blockContent]
})
