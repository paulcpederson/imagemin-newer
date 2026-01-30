import rimraf from "rimraf";
import { dirname, join, extname } from "path";
import test from "tape";
import ncp from "ncp";
import fs from "fs";
import { fileURLToPath } from "url";
import imageminNewer from "../index.js";

var imgFolder = join(dirname(fileURLToPath(import.meta.url)), "images");
var srcFolder = join(imgFolder, "source");
var destFolder = join(imgFolder, "build");
function run(webp) {
  return imageminNewer({ dist: destFolder, src: srcFolder, webp });
}

function rm() {
  rimraf.sync(destFolder);
}

test("new images", async function (t) {
  rm();
  const files = await run();
  t.equal(files.length, 6, "if no previous output, optimization");
  rm();
  t.end();
});

test("unmodified images", async function (t) {
  rm();
  ncp(srcFolder, destFolder, async function (err) {
    if (err) throw err;
    const files = await run();
    if (err) throw err;
    t.equal(files.length, 0, "if all files are the same, no optimization");
    rm();
    t.end();
  });
});

test("modified images", async function (t) {
  rm();
  ncp(srcFolder, destFolder, async function (err) {
    if (err) throw err;
    fs.renameSync(join(srcFolder, "1.gif"), join(srcFolder, "2.gif"));
    const files = await run();
    fs.renameSync(join(srcFolder, "2.gif"), join(srcFolder, "1.gif"));
    rm();
    if (err) throw err;
    t.equal(files.length, 1, "if a file is updated, it should be optimized");
    t.end();
  });
});

test("web p generation", async function (t) {
  rm();
  const files = await run(true);
  t.equal(files.length, 6, "should still update all files");
  const webpFiles = files
    .map((file) => extname(file.destinationPath))
    .filter((ext) => ext === ".webp");
  t.equal(webpFiles.length, 3, "should output webp files");
  rm();
  t.end();
});

test("should preserve folder structure", async function (t) {
  rm();
  const files = await run(true);
  t.ok(
    files.some((result) => result.destinationPath.includes("/images/build/2.webp")),
    "should build root files",
  );
  t.ok(
    files.some((result) => result.destinationPath.includes("/images/build/subdir/4.webp")),
    "should preserve folder tree",
  );
  const webpFiles = files
    .map((file) => extname(file.destinationPath))
    .filter((ext) => ext === ".webp");
  t.equal(webpFiles.length, 3, "should output webp files");
  rm();
  t.end();
});
