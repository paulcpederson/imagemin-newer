var through = require('through2')

var newer = function (file, cb) {
  //logic to determine if the file needs update
  console.log(file)
  cb(null, true)
}

module.exports = function () {

  return through.ctor({objectMode: true}, function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file)
      return
    }

    if (file.isStream()) {
      cb(new Error('Streaming is not supported'))
      return
    }

    var self = this

    newer(file, function (err, update) {
      if (update) {
        self.push(file)
      }
      return cb()
    })

  })
}
