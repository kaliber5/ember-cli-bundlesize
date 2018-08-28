'use strict';

const fg = require('fast-glob');
const fs = require('fs');
const getCompressedSize = require('./compressed-size');

function getFileSize(file, compression) {
  let contentsBuffer = fs.readFileSync(file);

  return getCompressedSize(contentsBuffer, compression);
}

function combineSizes(fileSizes) {
  return fileSizes.reduce((result, fileSize) => result + fileSize, 0);
}

module.exports = function getBundlesize(pattern, buildDir, compression) {
  return fg(pattern, {
    cwd: buildDir,
    onlyFiles: true,
    absolute: true
  })
    .then(files => Promise.all(files.map(file => getFileSize(file, compression))))
    .then(fileSizes => combineSizes(fileSizes))
};
