import Imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import imageminSvgo from "imagemin-svgo";
import imageminWebp from "imagemin-webp";
import imageminGifsicle from "imagemin-gifsicle";
import { glob } from "glob";
import fs, { Stats } from "fs";
import path from "path";

/**
 * @returns {Promise<Stats>}
 */
async function getStats(file) {
  return new Promise((resolve, reject) => {
    fs.stat(file, function (err, stats) {
      if (err) {
        resolve(null);
      } else {
        resolve(stats);
      }
    });
  });
}

/**
 *
 * @param {string} file the path to the file to check
 * @param {string} src the path to the source folder.
 * @param {string} dest the path to the output folder.
 * @returns {Promise<false|string>}
 */
async function newer(file, src, dest) {
  const srcStats = await getStats(file);
  if (!srcStats) {
    // if the source file somehow isn't there, no need to run any optimization
    return false;
  }
  const relativePath = path.relative(src, file);
  const outputPath = path.join(dest, relativePath);
  const outputStats = await getStats(outputPath);
  // if the output file is there and newer than the source file, no optimization
  if (outputStats && outputStats.mtimeMs > srcStats.mtimeMs) {
    return false;
  }
  return file;
}

async function minifyFile(file, src, dest, webp) {
  const relativePath = path.relative(src, file);
  const outputPath = path.dirname(path.join(dest, relativePath));
  const results = await Imagemin([file], {
    destination: outputPath,
    plugins: [
      imageminGifsicle(),
      imageminJpegtran(),
      imageminSvgo(),
      imageminPngquant(),
      ...(webp ? [imageminWebp()] : []),
    ],
  });
  return results[0];
}

/**
 * Options for imagemin newer
 * @typedef {object} NewerOptions
 * @property {string} src - Glob for all the source files
 * @property {string} dist - Folder path for output
 * @param {boolean} webp - Include webp versions
 * @returns {void}
 */

/**
 * Optimize images if a newer version is available.
 * @param {NewerOptions} options
 * @returns {Promise<import("imagemin").Result>} - see imagemin for return value of function
 */
export default async function (options) {
  if (!options.src || !options.dist) {
    throw new Error("Both src and dist options are required.");
  }

  const src = path.resolve(options.src);
  const globPath = path.join(src, "**/*.{gif,jpg,png,svg}");
  const output = path.resolve(options.dist);
  const files = await glob(globPath);
  const statCheck = await Promise.all(
    files.map((file) => newer(file, src, output)),
  );
  const newerFiles = statCheck.filter((isNewer) => isNewer);
  return Promise.all(
    newerFiles.map((file) => minifyFile(file, src, output, options.webp)),
  );
}
