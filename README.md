# imagemin-newer &nbsp &nbsp [![](https://img.shields.io/npm/v/imagemin-newer.svg?style=flat-square)](https://www.npmjs.com/package/imagemin-newer)

> Minify images with `imagemin` only if they need to be updated

# Install

```
npm install imagemin-newer
```

# Use

To use as a node script:

```js
import imageMinNewer from "imagemin-newer";

const src = resolve("source/");
const dist = resolve("");
try {
  const files = await imageminNewer({
    src: "source/images",
    dist: "build/images",
    webp: true
  });
  console.log(files); // => [{destinationPath: "/path/to/file.webp", data: <Buffer 89 50 4e ...>},...]
} catch (error) {
  console.error(err);
}
```

# CLI

If you install globally (or run `imagemin-newer` via npm scripts) then you'll have access to a small command line tool as well. It doesn't have any of the options that `imagemin` has and it only accepts directories (no globs).

```bash
imagemin-newer <directory> <output>

Options:
  -w, --webp     create webp versions from compatible images    [default: false]
  -d, --debug    turn on verbose logging                        [default: false]
  -h, --help     Show help
  -v, --version  Show version number

Examples:
  imagemin-newer source build    compress images in source and output to build
```

# Why

If you automatically `imagemin` an entire folder when files change, you'll soon become tired of watching every image compress for no reason. This plugin checks to see if images have changed before optimizing them.

There are a lot of other ways to do this if you are using gulp, like [gulp-changed](https://www.npmjs.com/package/gulp-changed) or with [gulp-watch](https://github.com/floatdrop/gulp-watch) (like [this](https://github.com/gulpjs/gulp/blob/master/docs/recipes/rebuild-only-files-that-change.md)). So if you use gulp, just do that!

If you don't use gulp, this might be exactly what you're looking for.

# Contribute

Contributions are welcome! `npm test` is your friend. If the tests pass, you are good to go! Make sure to check the cli in addition to the library file.
