// Globally register all base components for convenience, because they
// will be used very frequently. Components are registered using the
// PascalCased version of their file name.

import Vue from 'vue'

// // https://webpack.js.org/guides/dependency-management/#require-context
const components = require.context(
  // Look for files in the components/globals directory
  '@/pages',
  // Do not look in subdirectories
  false,

  // Only include "_base-" prefixed .vue files
  // /_base-[\w-]+\.vue$/

  // include all files
  /[A-Z]\w+\.(vue)$/
)
console.log(components);
// For each matching file name...
components.keys().forEach(fileName => {
    console.log(fileName);
  // Get the component config
  const componentConfig = components(fileName)
  const componentName = fileName
    .split('/')
    .pop()
    .split('.')[0]
console.log(fileName, componentConfig, componentName);
  // Globally register the component
  Vue.component(componentName, componentConfig.default || componentConfig)
})
