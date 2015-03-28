# imagemin-newer

> Minify images with imagemin only if they need to be updated

# Install

** NOT PUBLISHED YET, WORK IN PROGRESS **

```
npm install imagemin-newer
```

# Use

To use as a plugin, just require it alongside imagemin and pass it :

```js
var newer = require('imagemin-newer')
var Imagemin = require('imagemin')

var imagemin = new Imagemin()
    .src('images/*.{gif,jpg,png,svg}')
    .use(newer('build/images'))
    .use(Imagemin.gifsicle())
    .use(Imagemin.jpegtran())
    .use(Imagemin.optipng())
    .use(Imagemin.svgo())
    .dest('build/images')

imagemin.run(function (err, files) {
  if (err) {
    throw err
  }
  console.log(files[0])
  // => {path: 'build/images/foo.jpg', contents: <Buffer 89 50 4e ...>}
  // the files array will now be only what actually changed
})
```

# CLI

If you install globally (or run imagemin-newer via npm scripts) then you'll have access to a small command line tool as well. It doesn't have any of the options that imagemin has and it only accepts directories (no globs).

```
imagemin-newer <directory> <output>

Options:
  -d, --debug    turn on verbose logging                        [default: false]
  -h, --help     Show help
  -v, --version  Show version number

Examples:
  imagemin-newer source build    compress images in source and output to build
```

# Why

If you automatically imagemin an entire folder when files change, you'll soon become tired of watching every image compress for no reason. Imagemin-newer checks to see if images need to be compressed.

There are a lot of other ways to do this if you are using gulp, like [gulp-changed](https://www.npmjs.com/package/gulp-changed) or with [gulp-watch](https://github.com/floatdrop/gulp-watch) (like [this](https://github.com/gulpjs/gulp/blob/master/docs/recipes/rebuild-only-files-that-change.md)). So if you use gulp, just do that!

If you don't use gulp, this might be exactly what you're looking for.

# Contribute

Contributions are welcome! This project uses the [standard style](https://github.com/feross/standard), so you should use it too! `npm test` will automatically make sure the code is written to the standard. If the tests pass, you are good to go!



