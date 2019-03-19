'use strict';

const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const emberGenerate = blueprintHelpers.emberGenerate;
const emberNew = blueprintHelpers.emberNew;
const fs = require('fs');
const setupTestHooks = blueprintHelpers.setupTestHooks;

const expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy ember-cli-bundlesize', function() {
  setupTestHooks(this);

  it('creates config file', function() {
    let args = ['ember-cli-bundlesize'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerate(args))
      .then(() => {
        const bufferFromConfig = fs.readFileSync('config/bundlesize.js');
        const bufferFromFixture = fs.readFileSync(
          `${__dirname}/../fixtures/config/bundlesize.js`
        );
        expect(bufferFromConfig.equals(bufferFromFixture)).to.be.true;
      });
  });
});
