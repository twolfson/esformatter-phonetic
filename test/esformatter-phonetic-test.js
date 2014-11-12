// Load in dependencies
var assert = require('assert');
var fs = require('fs');
var esformatter = require('esformatter');
var extend = require('obj-extend');
var esformatterPhonetic = require('../');

// Register our plugin
esformatter.register(esformatterPhonetic);

// TODO: Allow for updating top level variables via `topLevel: true`

// Define test utilities
var testUtils = {
  format: function (filepath, options) {
    before(function formatFn () {
      // Format our content
      var input = fs.readFileSync(filepath, 'utf8');
      this.output = esformatter.format(input, {
        phonetic: extend({
          baseSeed: 1337
        }, options)
      });

      // If we are in a debug environment, write the output to disk
      if (process.env.TEST_DEBUG) {
        try {
          fs.mkdirSync(__dirname + '/actual-files/');
        } catch (err) {
          // Ignore error (prob caused by directory existing)
        }
        var debugFilepath = filepath.replace('test-files/', 'actual-files/');
        fs.writeFileSync(debugFilepath, this.output);
      }
    });
    after(function cleanup () {
      // Cleanup output
      delete this.output;
    });
  }
};

// Start our tests
describe('esformatter-phonetic', function () {
  describe('formatting a JS file with a declared `var`', function () {
    testUtils.format(__dirname + '/test-files/declared-yes.js');

    it('updates the names', function () {
      var expectedOutput = fs.readFileSync(__dirname + '/expected-files/declared-yes.js', 'utf8');
      assert.strictEqual(this.output, expectedOutput);
    });
  });

  describe('formatting a JS file with an undeclared variable', function () {
    testUtils.format(__dirname + '/test-files/declared-no.js');

    it('does not update the names', function () {
      var expectedOutput = fs.readFileSync(__dirname + '/expected-files/declared-no.js', 'utf8');
      assert.strictEqual(this.output, expectedOutput);
    });
  });

  // TODO: Move `ecmaVariableScope` from 3 to 4 loops. The third will tag the original identifier with a `sawWith` flag
  //   Then, the 4th will move add `usedInAWith`
  // TODO: Also, remove `declared` as it is impractical
  describe.skip('formatting a JS file with a variable that is possibly a property', function () {
    testUtils.format(__dirname + '/test-files/declared-unknown.js');

    it('does not update the names', function () {
      var expectedOutput = fs.readFileSync(__dirname + '/expected-files/declared-unknown.js', 'utf8');
      assert.strictEqual(this.output, expectedOutput);
    });
  });

  describe('formatting a JS file with a top level variable', function () {
    testUtils.format(__dirname + '/test-files/top-level-yes.js');

    it('does not update the names', function () {
      var expectedOutput = fs.readFileSync(__dirname + '/expected-files/top-level-yes.js', 'utf8');
      assert.strictEqual(this.output, expectedOutput);
    });
  });

  describe('formatting a JS file with a non-top level variable', function () {
    testUtils.format(__dirname + '/test-files/top-level-no.js');

    it('does not update the names', function () {
      var expectedOutput = fs.readFileSync(__dirname + '/expected-files/top-level-no.js', 'utf8');
      assert.strictEqual(this.output, expectedOutput);
    });
  });

  describe('formatting a JS file with a top level variable and allowed renames for top levels', function () {
    testUtils.format(__dirname + '/test-files/top-level-override.js', {
      renameTopLevel: true
    });

    it('does not update the names', function () {
      var expectedOutput = fs.readFileSync(__dirname + '/expected-files/top-level-override.js', 'utf8');
      assert.strictEqual(this.output, expectedOutput);
    });
  });
});
