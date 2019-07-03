'use strict';

const path = require('path');
const fs = require('fs');
const SilentError = require('silent-error');
const chalk = require('chalk');
const emberBuild = require('../helpers/ember-build');
const assertBundlesize = require('../helpers/assert-bundlesize');

module.exports = class BundlesizeTestTask {

  constructor(options) {
    Object.assign(this, options);
  }

  run() {
    let errors = 0;
    return Promise.resolve()
      .then(() => {
        if (this.buildApp) {
          this.ui.startProgress('Building for production...');
          return emberBuild()
            .then(() => this.ui.stopProgress());
        }
      })
      .then(() => {
        let config = this.getConfig();

        return Promise.all(
          Object.keys(config)
            .map((key, index) => {
              return assertBundlesize(config[key], this.buildDir)
                .then((msg) => {
                  return `ok ${index+1} - ${key}: ${msg}`;
                })
                .catch((err) => {
                  errors++;
                  return `not ok ${index+1} - ${key}: ${err.message}`;
                });
            })
        )
      })
      .then((results) => {
        results.forEach((msg) => this.ui.writeLine(msg));
        if (errors > 0) {
          throw new SilentError(`Bundlesize check failed with ${errors} error${errors > 1 ? 's' : ''}!`);
        } else {
          this.ui.writeLine(chalk.green('Bundlesize check was successful. Good job!'));
        }
      })
  }

  getConfig() {
    let configPath = path.isAbsolute(this.configPath) ? this.configPath : path.join(this.rootDir, this.configPath);
    if (!fs.existsSync(configPath)) {
      throw new SilentError(`Config file '${this.configPath}' not found. Please run 'ember generate ember-cli-bundlesize' to generate a default config`);
    }
    const config = require(configPath);
    return this._getFlattenedConfig(config);
  }

  /**
   * Flatten config by joining app name with pattern name. An `app` with pattern for `javascript` in config is returned
   * as `{ ['app:javascript']: { limit, pattern, compression } }`.
   * @param {Object} config
   */
  _getFlattenedConfig(config) {
    const appNames = Object.keys(config);
    const flattenedConfig = appNames.reduce((result, appName) => {
      const app = config[appName];
      const patterns = Object.keys(app);
      const appPatternWithConfig = patterns.reduce((appResult, pattern) => {
        const appNameWithPatternKey = `${appName}:${pattern}`;
        appResult[appNameWithPatternKey] = app[pattern];
        return appResult;
      }, {});
      return Object.assign(appPatternWithConfig, result);
    }, {});
    return flattenedConfig;
  }
};
