'use strict';

const path = require('path');

module.exports = {
  name: 'bundlesize:test',
  description: 'Assert that your app\'s bundle size is within its defined limits',

  availableOptions: [],
  works: 'insideProject',

  run() {
    let BundlesizeTestTask = require('../tasks/test');

    let testTask = new BundlesizeTestTask({
      ui: this.ui,
      rootDir: this.project.root,
      buildDir: path.join(this.project.root, 'dist')
    });

    return testTask.run();
  }
};
