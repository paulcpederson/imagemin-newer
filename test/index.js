var Imagemin = require('imagemin')
var rimraf = require('rimraf')
var newer = require('../')
var path = require('path')
var test = require('tape')
var ncp = require('ncp').ncp
var fs = require('fs')

var imgFolder = path.join(__dirname, 'images')
var srcFolder = path.join(imgFolder, 'source')
var destFolder = path.join(imgFolder, 'build')
var glob = path.join(srcFolder, '**/*.{gif,jpg,png,svg}')

function imagemin () {
  return new Imagemin()
    .src(glob)
    .use(newer(destFolder))
    .use(Imagemin.gifsicle())
    .use(Imagemin.jpegtran())
    .use(Imagemin.optipng())
    .use(Imagemin.svgo())
    .dest(destFolder)
}

function rm () {
  rimraf.sync(destFolder)
}

test('new images', function (t) {
  rm()
  imagemin().run(function (err, files) {
    if (err) throw err
    t.equal(files.length, 4, 'if there are no dest files, all files should be optimized')
    rm()
    t.end()
  })
})

test('unmodified images', function (t) {
  rm()
  ncp(srcFolder, destFolder, function (err) {
    if (err) throw err
    imagemin().run(function (err, files) {
      if (err) throw err
      t.equal(files.length, 0, 'if all files are the same, no files should be optimized')
      rm()
      t.end()
    })
  })
})

test('modified images', function (t) {
  rm()
  ncp(srcFolder, destFolder, function (err) {
    if (err) throw err
    fs.renameSync(path.join(srcFolder, '1.gif'), path.join(srcFolder, '2.gif'))
    imagemin().run(function (err, files) {
      fs.renameSync(path.join(srcFolder, '2.gif'), path.join(srcFolder, '1.gif'))
      rm()
      if (err) throw err
      t.equal(files.length, 1, 'if a file is updated, it should be optimized')
      t.end()
    })
  })
})
