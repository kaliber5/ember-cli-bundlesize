'use strict';

const path = require('path');

module.exports = {
  name: 'bundlesize:test',
  description: 'Assert that your app\'s bundle size is within its defined limits',
  works: 'insideProject',

  availableOptions: [
    { name: 'config-path', type: String, default: 'config/bundlesize.js' },
    { name: 'build-app', type: Boolean, default: true }
  ],

  run(options) {
    let BundlesizeTestTask = require('../tasks/test');

    let testTask = new BundlesizeTestTask({
      ui: this.ui,
      rootDir: this.project.root,
      buildDir: path.join(this.project.root, 'dist'),
      configPath: options.configPath,
      buildApp: options.buildApp
    });

    return testTask.run();
  }
};
