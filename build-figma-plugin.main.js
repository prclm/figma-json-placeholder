// build-figma-plugin.main.js
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const eslint = require('esbuild-plugin-eslint')

// eslint-disable-next-line no-undef
module.exports = function (buildOptions) {
  return {
    ...buildOptions,
    plugins: [...buildOptions.plugins, eslint()],
  }
}
