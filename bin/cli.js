#!/usr/bin/env node
var Imagemin = require('imagemin')
var color = require('cli-color')
var newer = require('../')
var path = require('path')
var argv = require('yargs')
  .demand(2)
  .usage('imagemin-newer <directory> <output>')
  .example('imagemin-newer source build', 'compress images in source and output to build')
  .options({
    'd': {
      alias: 'debug',
      type: 'boolean',
      default: false,
      describe: 'turn on verbose logging'
    }
  })
  .help('h')
  .alias('h', 'help')
  .version(require(__dirname + '/../package.json').version + '\n', 'v')
  .alias('v', 'version').argv

function resolve (p) {
  return path.resolve(process.cwd(), p)
}

function debug (message) {
  if (argv.debug) {
    console.log(message)
  }
}

var glob = path.join(resolve(argv._[0]), '**/*.{gif,jpg,png,svg}')
var output = resolve(argv._[argv._.length - 1])

var imagemin = new Imagemin()
    .src(glob)
    .use(newer(output))
    .use(Imagemin.gifsicle())
    .use(Imagemin.jpegtran())
    .use(Imagemin.optipng())
    .use(Imagemin.svgo())
    .dest(output)

imagemin.run(function (err, files) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  if (files.length > 0) {
    var images = files.length > 1 ? ' images' : ' image'
    if (argv.d) {
      files.forEach(function (file) {
        debug('✓ ' + file.path)
      })
    }
    console.log(color.green('✓ Successfully optimized ' + files.length + images))
  } else {
    debug('All images up to date')
  }
  process.exit(0)
})
