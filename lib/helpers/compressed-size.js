const gzip = require('gzip-size');
let brotli;

module.exports = function getCompressedSize(data, compression) {
  let size;
  switch (compression) {
    case 'gzip':
      size = gzip.sync(data);
      break;
    case 'brotli':
      try {
        // eslint-disable-next-line node/no-unpublished-require
        brotli = require('brotli-size');
      } catch (error) {
        const SilentError = require('silent-error');

        throw new SilentError(
          `Missing optional dependency: brotli compression was configured, but the
          "brotli-size" optional dependency is not installed. Install it with:
          npm install --save-dev brotli-size`);
      }
      size = brotli.sync(data);
      break;
    case 'none':
    default:
      size = Buffer.byteLength(data);
  }

  return size;
};
