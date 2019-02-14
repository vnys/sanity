const path = require('path')

export function loadSchema(name) {
  //---- Setup plugin loader
  const registerLoader = require('@sanity/plugin-loader')
  const schemaEntry = require.resolve(`../fixtures/schemas/${name}/schema.js`)
  registerLoader({basePath: path.dirname(schemaEntry)})
  // eslint-disable-next-line import/no-dynamic-require
  return require(schemaEntry).default
}
