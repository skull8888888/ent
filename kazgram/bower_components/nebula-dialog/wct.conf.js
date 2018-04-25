const pkg = require('./package.json');
const build = `${pkg.name} v${pkg.version} (${Math.round(new Date().getTime() / 1000)})`
const persistent = process.argv.includes('--persistent')

console.log(`BUILD: ${build}`)

module.exports = {
  verbose: false,
  expanded: true,
  persistent: persistent,
  simpleOutput: true,
  plugins: {
    local: {
      disabled: true,
      browsers: ['chrome', 'firefox']
    },
    sauce: {
      disabled: true,
      name: pkg.name,
      build: build,
      browsers: [{
        browserName: 'chrome',
        platform: 'Windows 10',
        version: 'latest'
      }, {
        browserName: 'firefox',
        platform: 'Windows 10',
        version: 'latest'
      }, {
        browserName: 'microsoftedge',
        platform: 'Windows 10',
        version: 'latest'
      }, {
        browserName: 'safari',
        platform: 'macOS 10.12',
        version: 'latest'
      }]
    }
  }
}
