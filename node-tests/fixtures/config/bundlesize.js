'use strict';

module.exports = {
  app: {
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
  }
};
