var changed = require('file-changed')
var through = require('through2')
var path = require('path')
var fs = require('fs')

var newer = function (srcFile, destFile, cb) {
  fs.stat(destFile, function (err, stats) {
    if (err) {
      cb(null, true)
    } else {
      var srcTime = srcFile.stat.mtime.getTime()
      var destTime = stats.mtime.getTime()
      cb(null, srcTime > destTime)
    }
  })
}

module.exports = function (dest) {

  return through.ctor({objectMode: true}, function (file, enc, cb) {
    var self = this

    if (file.isNull()) {
      cb(null, file)
      return
    }

    if (file.isStream()) {
      cb(new Error('Streaming is not supported'))
      return
    }

    // /Users/paulcpederson/Documents/Sandbox/npm-tester/                            - process.cwd
    // /Users/paulcpederson/Documents/Sandbox/npm-tester/images/build                - destBase
    // /Users/paulcpederson/Documents/Sandbox/npm-tester/images/source/nested/1.gif  - file.path
    // /Users/paulcpederson/Documents/Sandbox/npm-tester/images/build/nested/1.gif   - ???

    var destBase = path.resolve(file.cwd, dest)
    var relativePath = path.relative(file.base, file.path)
    var destPath = path.resolve(destBase, relativePath)

    newer(file, destPath, function (err, update) {
      if (update) {
        self.push(file)
      }
      return cb()
    })

  })
}
