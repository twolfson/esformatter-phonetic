// Load in dependencies
var assert = require('assert');
var fs = require('fs');
var esformatter = require('esformatter');
var esformatterPhonetic = require('../');

// Register our plugin
esformatter.register(esformatterPhonetic);

// Define test utilities
var testUtils = {
  format: function (filepath) {
    before(function formatFn () {
      // Format our content
      var input = fs.readFileSync(filepath, 'utf8');
      this.output = esformatter.format(input, {
        phonetic: {
          baseSeed: 1337
        }
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
  describe('formatting a JS file with a single variable in a `var`', function () {
    testUtils.format(__dirname + '/test-files/single-variables.js');

    it('updates the names', function () {
      var expectedOutput = fs.readFileSync(__dirname + '/expected-files/single-variables.js', 'utf8');
      assert.strictEqual(this.output, expectedOutput);
    });
  });

  describe('formatting a JS file with multiple variables in a `var`', function () {
    testUtils.format(__dirname + '/test-files/multiple-variables.js');

    it('updates the names', function () {
      var expectedOutput = fs.readFileSync(__dirname + '/expected-files/multiple-variables.js', 'utf8');
      assert.strictEqual(this.output, expectedOutput);
    });
  });

  describe.only('formatting a JS file with references to browser variables', function () {
    testUtils.format(__dirname + '/test-files/browser-variables.js');

    it('does not affect the browser variables', function () {
      var expectedOutput = fs.readFileSync(__dirname + '/expected-files/browser-variables.js', 'utf8');
      assert.strictEqual(this.output, expectedOutput);
    });
  });
});
