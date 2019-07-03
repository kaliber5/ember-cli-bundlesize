ember-cli-bundlesize
==============================================================================
[![Build Status](https://travis-ci.com/kaliber5/ember-cli-bundlesize.svg?branch=master)](https://travis-ci.com/kaliber5/ember-cli-bundlesize)
[![Ember Observer Score](https://emberobserver.com/badges/ember-cli-bundlesize.svg)](https://emberobserver.com/addons/ember-cli-bundlesize)
[![npm version](https://badge.fury.io/js/ember-cli-bundlesize.svg)](https://badge.fury.io/js/ember-cli-bundlesize)

Make sure your Ember app stays small by testing its bundle size against a given size budget.

Installation
------------------------------------------------------------------------------

```
ember install ember-cli-bundlesize
```

Make sure to `git add` the added `config/bundlesize.js` file!

#### Optional dependency

If your app uses Brotli compression and the `brotli` option is set in your configuration (i.e `compression: 'brotli'`), you must install the optional dependency: `brotli-size`.

```
npm install --save-dev brotli-size
```

Usage
------------------------------------------------------------------------------

This addon lets you define buckets for your asset files (e.g. JavaScript, CSS, images), and a size budget for each
bucket that all files belonging to that bucket must not exceed, e.g "max. 400KB of JavaScript after GZip compression".

### Running bundle size tests

Run this command to build and assert that your app does not exceed the defined limits:

```
ember bundlesize:test
```
This will create a production build of your app (so that may take a bit), and assert that all the files defined for
each bucket don't exceed its limits, after compression. In case of a failure the command will exit with a non-zero exit
code. So you can integrate this command into your CI workflow, and make your builds fail when the bundle size test
does not pass.

If you do not want to build the app before running the tests you can disable the build by passing `--build-app=false`.

If you want to use a different build directory from the default one (`dist`), use `--build-dir=other-dist-directory`.

### Configuration

After installing the addon, a `config/bundlesize.js` file with a default configuration will be generated:

```js
module.exports = {
  app: {
    javascript: {
      pattern: 'assets/*.js',
      limit: '500KB',
      compression: 'gzip'
    },
    css: {
      pattern: 'assets/*.css',
      limit: '50KB',
      compression: 'gzip'
    }
  }
};
```

In this example, top level is defined by `app`, followed by two buckets, `javascript` and `css`. You can include as many apps and buckets as you wish. Each app supports multiple buckets and each bucket supports the following configuration properties:

* `pattern`: a `glob` pattern (or array thereof) defining the files belonging to this bucket
* `limit`: the maximum size all files defined by `pattern` may consume. you can use common size units like `B`, `KB`, `MB`
* `compression`: what compression type to use before comparing:
  * `gzip` (default)
  * `brotli`: compress files using Brotli
  * `none`: do not compress files at all

To override the location of the config path you can pass: `config-path="<PATH TO CONFIG>"`
