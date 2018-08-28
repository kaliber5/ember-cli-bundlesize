'use strict';

const fg = require('fast-glob');
const fs = require('fs');
const zlib = require('zlib');
const RSVP = require('rsvp');
const gzip = RSVP.denodeify(zlib.gzip);

// function getFileSize(file) {
//   let contentsBuffer = fs.readFileSync(file);
//   return gzip(contentsBuffer).then(buffer => ({
//     size: contentsBuffer.length,
//     compressedSize: buffer.length
//   }));
// }

function getFileSize(file) {
  let contentsBuffer = fs.readFileSync(file);
  return contentsBuffer.length;
}

function combineSizes(fileSizes) {
  return fileSizes.reduce((result, fileSize) => result + fileSize, 0);
}

module.exports = function getBundlesize(pattern, buildDir) {
  return fg(pattern, {
    cwd: buildDir,
    onlyFiles: true,
    absolute: true
  })
    .then(files => Promise.all(files.map(getFileSize)))
    .then(fileSizes => combineSizes(fileSizes))
};
