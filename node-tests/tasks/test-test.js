const { expect } = require('chai');
const Task = require('../../lib/tasks/test');
const tmp = require('tmp');
const path = require('path');
const fs = require('fs-extra');
const MockUI = require('console-ui/mock');
const chalk = require('chalk');
const bytes = require('bytes');

const buildDir = path.join(__dirname, '../fixtures/dist');

function createConfig(dir, config) {
  let contents = `module.exports = ${JSON.stringify(config)};`;
  fs.outputFileSync(path.join(dir, 'config/bundlesize.js'), contents);
}

function assertOutput(line, pass, config, app, key) {
  let { limit, compression } = config[app][key];
  let pattern = pass ?
    /ok \d+ - (\w+):(\w+): (.+) <= (.+) \((\w+)\)/
    :
    /not ok \d+ - (\w+):(\w+): (.+) > (.+) \((\w+)\)/;

  expect(line).to.match(pattern);
  let matches = pattern.exec(line);
  const [actualAppName, actualPatternName, actualFileSize, actualSizeLimit, actualCompression] = matches.slice(1);

  expect(actualAppName).to.equal(app);
  expect(actualPatternName).to.equal(key);
  if (pass) {
    expect(bytes.parse(actualFileSize)).to.be.below(bytes.parse(limit));
  } else {
    expect(bytes.parse(actualFileSize)).to.be.above(bytes.parse(limit));
  }
  expect(actualSizeLimit).to.equal(limit);
  expect(actualCompression).to.equal(compression === 'none' ? 'uncompressed' : compression);
}

describe('bundlesize:test', function() {
  let rootDir;
  let ui;
  let task;

  beforeEach(function() {
    rootDir = tmp.dirSync().name;
    ui = new MockUI();
    task = new Task({
      ui,
      rootDir,
      buildDir,
      buildApp: false,
      configPath: 'config/bundlesize.js'
    });
  });

  it('it handles multiple apps', function () {
    let config = {
      app1: {
        javascript1: {
          pattern: '*.js',
          limit: '6KB',
          compression: 'gzip',
        },
        css2: {
          pattern: '*.css',
          limit: '1KB',
          compression: 'gzip'
        }
      },
      app2: {
        javascript3: {
          pattern: '*.js',
          limit: '6KB',
          compression: 'brotli'
        },
        css4: {
          pattern: '*.css',
          limit: '1KB',
          compression: 'brotli'
        }
      }
    }

    createConfig(rootDir, config);
    task.run()
      .then(() => {
        const outLines = ui.output.split('\n').slice(0, 4);
        assertOutput(outLines[0], true, config, 'app2', 'javascript3');
        assertOutput(outLines[1], true, config, 'app2', 'css4');
        assertOutput(outLines[2], true, config, 'app1', 'javascript1');
        assertOutput(outLines[3], true, config, 'app1', 'css2');
      });
  });

  it('it handles oversized apps correctly', function () {
    let config = {
      app1: {
        javascript1: {
          pattern: '*.js',
          limit: '1KB',
          compression: 'gzip',
        },
        css2: {
          pattern: '*.css',
          limit: '1KB',
          compression: 'gzip'
        }
      },
      app2: {
        javascript3: {
          pattern: '*.js',
          limit: '6KB',
          compression: 'brotli'
        },
        css4: {
          pattern: '*.css',
          limit: '1KB',
          compression: 'brotli'
        }
      }
    }

    createConfig(rootDir, config);
    task.run()
      .then(() => expect(false, 'Failing check must not resolve.').to.be.true)
      .catch(err => {
        const outLines = ui.output.split('\n').slice(0, 4);
        assertOutput(outLines[0], true, config, 'app2', 'javascript3');
        assertOutput(outLines[1], true, config, 'app2', 'css4');
        assertOutput(outLines[2], false, config, 'app1', 'javascript1');
        assertOutput(outLines[3], true, config,'app1', 'css2');
        expect(err.message).to.equal('Bundlesize check failed with 1 error!');
      })
  });

  [
    'none',
    'gzip',
    'brotli'
  ].forEach(compression => {
    it(`it passes bundlesize test (${compression})`, function() {
      let config = {
        app: {
          javascript: {
            pattern: '*.js',
            limit: '6KB',
            compression
          },
          css: {
            pattern: '*.css',
            limit: '1KB',
            compression
          }
        }
      };

      createConfig(rootDir, config);

      return task.run()
        .then(() => {
          let outLines = ui.output.split('\n');
          assertOutput(outLines[0], true, config, 'app', 'javascript');
          assertOutput(outLines[1], true, config, 'app', 'css');
          expect(outLines[2]).to.equal(chalk.green('Bundlesize check was successful. Good job!'));
        });
    });

    it(`it fails bundlesize test (${compression})`, function() {
      let config = {
        app: {
          javascript: {
            pattern: '*.js',
            limit: '1KB',
            compression
          },
          css: {
            pattern: '*.css',
            limit: '1KB',
            compression
          }
        }
      };

      createConfig(rootDir, config);

      return task.run()
        .then(() => expect(false, 'Failing check must not resolve.').to.be.true)
        .catch((err) => {
          let outLines = ui.output.split('\n');
          assertOutput(outLines[0], false, config, 'app', 'javascript');
          assertOutput(outLines[1], true, config, 'app', 'css');

          expect(err.message).to.equal('Bundlesize check failed with 1 error!');
        });
    });
  });
});
