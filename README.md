# imagemin-newer

> Minify images with imagemin only if they need to be updated

If you automatically imagemin an entire folder when files change, you'll soon become tired of watching every image compress for no reason. Imagemin-newer checks to see if images need to be compressed.

# Install

** NOT PUBLISHED YET, WORK IN PROGRESS **

```
npm install imagemin-newer
```

# Use

To use as a plugin, just require it alongside imagemin and `use` it:

```js
var newer = require('imagemin-newer')
var Imagemin = require('imagemin')

var imagemin = new Imagemin()
    .src('images/*.{gif,jpg,png,svg}')
    .use(newer())
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

# Contribute

Contributions are welcome! This project uses the [standard style](https://github.com/feross/standard), so you should use it too! `npm test` will automatically make sure the code is written to the standard. If the tests pass, you are good to go!



