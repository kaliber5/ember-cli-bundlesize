'use strict';

const execa = require('execa');

module.exports = function emberBuild() {
  return execa('ember', ['build', '--prod'])
}
