const path = require('path')
const test = require('tape')
const ghRelease = require('../')
const fixture = path.join.bind(null, __dirname, 'fixtures')

test('should return err if no authentication is provided', function (t) {
  t.plan(1)
  ghRelease({
    workpath: fixture('basic')
  }, function (err, result) {
    t.deepEqual(err.message, 'missing required options: auth')
  })
})

test('should return error if changelog version !== package.json version', function (t) {
  t.plan(1)
  ghRelease({
    workpath: fixture('mismatch')
  }, function (err, result) {
    t.deepEqual(err.message, 'CHANGELOG.md out of sync with package.json (0.0.1 !== 0.0.0)')
  })
})

test('should return error if changelog version !== lerna.json version', function (t) {
  t.plan(1)
  ghRelease({
    workpath: fixture('lerna-mismatch')
  }, function (err, result) {
    t.deepEqual(err.message, 'CHANGELOG.md out of sync with lerna.json (0.0.1 !== 0.0.0)')
  })
})

test('should return error if a non-empty unreleased section exists', function (t) {
  const errStr = 'Unreleased changes detected in CHANGELOG.md, aborting'
  t.plan(1)
  ghRelease({
    workpath: fixture('unreleased')
  }, function (err, result) {
    t.deepEqual(err.message, errStr)
  })
})

test('should return error if no versions exist', function (t) {
  t.plan(1)
  ghRelease({
    workpath: fixture('no-versions')
  }, function (err, result) {
    t.deepEqual(err.message, 'CHANGELOG.md does not contain any versions')
  })
})

test('should allow empty unreleased sections', function (t) {
  const errStr = 'Unreleased changes detected in CHANGELOG.md, aborting'
  t.plan(1)
  ghRelease({
    workpath: fixture('unreleased-alt')
  }, function (err, result) {
    t.notEqual(err.message, errStr)
  })
})
