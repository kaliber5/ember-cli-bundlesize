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
  expect(matches[1]).to.equal(app);
  expect(matches[2]).to.equal(key);
  if (pass) {
    expect(bytes.parse(matches[3])).to.be.below(bytes.parse(limit));
  } else {
    expect(bytes.parse(matches[3])).to.be.above(bytes.parse(limit));
  }
  expect(matches[4]).to.equal(limit);
  expect(matches[5]).to.equal(compression === 'none' ? 'uncompressed' : compression);
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
