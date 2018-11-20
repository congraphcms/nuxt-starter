// Globally register all filters for convenience, because they
// will be used very frequently. Filters are registered using the
// camelCased version of their file name.

import Vue from 'vue'
// import camelCase from 'lodash/camelCase'

// https://webpack.js.org/guides/dependency-management/#require-context
const filters = require.context(
  // Search for files in the current directory
  '@/filters',
  // Search for files in subdirectories
  false,
  // Include any .js files that are not unit tests
  /^((?!\.unit\.).)*\.js$/
)

// For each matching file name...
filters.keys().forEach(fileName => {
  // Skip this file, as it's not a filter
  if (fileName === './index.js') return

  // Get the fitler
  const filterFunc = filters(fileName)

  // Get the camelCase version of the filter name
  const filterName = fileName
    // Remove the "./" from the beginning
    .replace(/^\.\//, '')
    // Remove the file extension from the end
    .replace(/\.\w+$/, '')

  // Globally register the component
  Vue.filter(filterName, filterFunc.default || filterFunc)
})
