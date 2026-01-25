#!/usr/bin/env node
import color from "cli-color";
import path from "path";
import yargs from "yargs";
import imageminNewer from "../index.js";
import packageJson from "../package.json" with { type: "json"};

const argv = yargs
  .demand(2)
  .usage("imagemin-newer <directory> <output>")
  .example(
    "imagemin-newer source build",
    "compress images in source and output to build",
  )
  .options({
    d: {
      alias: "debug",
      type: "boolean",
      default: false,
      describe: "turn on verbose logging",
    },
    w: {
      alias: "webp",
      type: "boolean",
      default: false,
      describe: "generate webp versions of files in addition to minification",
    },
  })
  .help("h")
  .alias("h", "help")
  .version(packageJson.version + "\n", "v")
  .alias("v", "version").argv;

function resolve(p) {
  return path.resolve(process.cwd(), p);
}

function debug(message) {
  if (argv.debug) {
    console.log(message);
  }
}

async function run() {
  var src = resolve(argv._[0]);
  var dist = resolve(argv._[argv._.length - 1]);
  try {
    const files = await imageminNewer({ webp: argv.webp, src, dist });
    if (files.length > 0) {
      var images = files.length > 1 ? " images" : " image";
      if (argv.d) {
        files.forEach(function (file) {
          debug("✓ " + file.destinationPath);
        });
      }
      console.log(
        color.green("✓ Successfully optimized " + files.length + images),
      );
    } else {
      debug("All images up to date");
    }
  } catch (error) {
    console.error(err);
    process.exit(1);
  }
}

run();
