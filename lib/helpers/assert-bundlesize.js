'use strict';

const bytes = require('bytes');
const getBundlesize = require('./get-bundlesize');

function compressionLabel(compression) {
  switch (compression) {
    case null:
    case undefined:
    case 'none':
      return 'uncompressed';
    default:
      return compression;
  }
}

module.exports = function assertBundlesize(config, buildDir) {
  let {
    pattern,
    limit,
    compression
  } = config;

  let maxSize = bytes.parse(limit);

  // @todo validate config

  return getBundlesize(pattern, buildDir, compression)
    .then(size => {
      if (size > maxSize) {
        throw new Error(`${bytes(size)} > ${bytes(maxSize)} (${compressionLabel(compression)})`);
      } else {
        return `${bytes(size)} <= ${bytes(maxSize)} (${compressionLabel(compression)})`;
      }
    });
};
