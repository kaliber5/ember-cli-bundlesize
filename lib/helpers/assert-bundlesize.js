'use strict';

const bytes = require('bytes');
const getBundlesize = require('./get-bundlesize');

module.exports = function assertBundlesize(config, buildDir) {
  let {
    pattern,
    limit
  } = config;

  let maxSize = bytes.parse(limit);

  // @todo validate config

  return getBundlesize(pattern, buildDir)
    .then(size => {
      if (size > maxSize) {
        throw new Error(`${bytes(size)} > ${bytes(maxSize)}`);
      } else {
        return `${bytes(size)} <= ${bytes(maxSize)}`;
      }
    });
};
