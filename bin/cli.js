#!/usr/bin/env node

var ghRelease = require(__dirname + '/../')
var getDefaults = require(__dirname + '/../lib/get-defaults')
var extend = require('util')._extend
var ghauth = require('ghauth')
var authOptions = {
  configName: 'gh-release',
  scopes: ['repo'],
  note: 'This token is for gh-release',
  userAgent: 'gh-release'
}
var argv = require('yargs')
  .usage('Usage: $0 -t [tag_name] -c [commit] -n [name] -b [body] -o [owner] -r [repo] -d -p')
  .options({
    't': {
      alias: 'tag_name',
      type: 'string',
      describe: 'tag for this release'
    },
    'c': {
      alias: 'target_commitish',
      type: 'string',
      describe: 'commitish value for tag'
    },
    'n': {
      alias: 'name',
      type: 'string',
      describe: 'text of release title'
    },
    'b': {
      alias: 'body',
      type: 'string',
      describe: 'text of release body'
    },
    'o': {
      alias: 'owner',
      describe: 'repo owner'
    },
    'r': {
      alias: 'repo',
      describe: 'repo name'
    },
    'd': {
      alias: 'draft',
      type: 'boolean',
      default: false,
      describe: 'publish as draft'
    },
    'p': {
      alias: 'prerelease',
      type: 'boolean',
      default: false,
      describe: 'publish as prerelease'
    }
  })
  .help('h')
  .alias('h', 'help')
  .version(require(__dirname + '/../package.json').version + '\n', 'v')
  .alias('v', 'version')
  .argv

ghauth(authOptions, function (err, auth) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  var defaults = getDefaults()
  var whitelist = Object.keys(defaults)
  var options = extend(getDefaults(), argv)

  Object.keys(options).forEach(function (key) {
    if (whitelist.indexOf(key) === -1) delete options[key]
  })

  ghRelease(options, auth, function (err, result) {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    if (!result || !result.html_url) {
      console.error('unknown error')
    }

    console.log(result.html_url)
  })
})
