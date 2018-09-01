'use strict';

const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerate = blueprintHelpers.emberGenerate;

const expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy ember-cli-bundlesize', function() {
  setupTestHooks(this);

  it('creates config file', function() {
    let args = ['ember-cli-bundlesize'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerate(args, (file) => {
        expect(file('config/bundlesize.js')).to.equal(file(`${__dirname}/../fixtures/config/bundlesize.js`));
    }));
  });
});
