'use strict';

module.exports = {
  name: require('./package').name,

  includedCommands() {
    return {
      'bundlesize:test': require('./lib/commands/test')
    };
  },
};
