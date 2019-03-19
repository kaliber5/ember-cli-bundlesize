'use strict';

const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const emberGenerate = blueprintHelpers.emberGenerate;
const emberNew = blueprintHelpers.emberNew;
const setupTestHooks = blueprintHelpers.setupTestHooks;
const { file } = require('ember-cli-blueprint-test-helpers/chai');

const expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy ember-cli-bundlesize', function() {
  setupTestHooks(this);

  it('creates config file', function() {
    let args = ['ember-cli-bundlesize'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerate(args))
      .then(() => {
        expect(file('config/bundlesize.js')).to.equal(
          file(`${__dirname}/../fixtures/config/bundlesize.js`)
        );
      });
  });
});
