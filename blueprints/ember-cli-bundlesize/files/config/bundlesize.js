'use strict';

module.exports = {
  javascript: {
    pattern: 'assets/*.js',
    limit: '500KB',
    compression: 'gzip'
  },
  css: {
    pattern: 'assets/*.css',
    limit: '50KB',
    compression: 'gzip'
  }
};
