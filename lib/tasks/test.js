'use strict';

const path = require('path');
const fs = require('fs');
const SilentError = require('silent-error');
const chalk = require('chalk');
const emberBuild = require('../helpers/ember-build');
const assertBundlesize = require('../helpers/assert-bundlesize');

const CONFIG_PATH = 'config/bundlesize.js';

function hasBuild() {
  return true;
}

module.exports = class BundlesizeTestTask {

  constructor(options) {
    Object.assign(this, options);
  }

  run() {
    let errors = 0;
    return Promise.resolve()
      .then(() => {
        if (this.skipBuildIfAvailable && hasBuild()) {
          return;
        }
        this.ui.startProgress('Building for production...');
        return emberBuild()
          .then(() => this.ui.stopProgress());
      })
      .then(() => {
        let config = this.getConfig();

        return Promise.all(
          Object.keys(config)
            .map((key, index) => {
              return assertBundlesize(config[key], this.buildDir)
                .then((msg) => {
                  this.ui.writeLine(`ok ${index+1} - ${key}: ${msg}`);
                })
                .catch((err) => {
                  this.ui.writeLine(`not ok ${index+1} - ${key}: ${err.message}`);
                  errors++;
                });
            })
        )
      })
      .then(() => {
        if (errors > 0) {
          throw new SilentError(`Bundlesize check failed with ${errors} error${errors > 1 ? 's' : ''}.`);
        } else {
          this.ui.writeLine(chalk.green('Bundlesize check was successful. Good job!'));
        }
      })
  }

  getConfig() {
    let configPath = path.join(this.rootDir, CONFIG_PATH);
    if (!fs.existsSync(configPath)) {
      throw new SilentError('Config file `config/bundlesize.js` not found. Please run `ember generate ember-cli-bundlesize` to generate a default config');
    }
    return require(configPath);
  }
};
