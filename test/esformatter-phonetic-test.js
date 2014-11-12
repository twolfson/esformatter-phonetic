// Load in dependencies
var assert = require('assert');
var fs = require('fs');
var CircularJSON = require('circular-json');
var esformatter = require('esformatter');
var extend = require('obj-extend');
var esformatterPhonetic = require('../');

// Define test utilities
var testUtils = {
  format: function (filepath, options) {
    before(function formatFn () {
      // Register our plugin
      esformatter.register(esformatterPhonetic);

      // Format our content
      var input = fs.readFileSync(filepath, 'utf8');
      this.output = esformatter.format(input, {
        phonetic: extend({
          baseSeed: 1337
        }, options)
      });

      // Unregister our plugin
      esformatter.unregister(esformatterPhonetic);

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
// Basic functionality
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

  describe('formatting a JS file with a variable that is possibly a property', function () {
    testUtils.format(__dirname + '/test-files/with.js');

    it('does not update the names', function () {
      var expectedOutput = fs.readFileSync(__dirname + '/expected-files/with.js', 'utf8');
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
});

// Intermediate cases
describe('esformatter-phonetic', function () {
  describe('formatting a JS file with a common variable name in different scopes', function () {
    testUtils.format(__dirname + '/test-files/mixed-scopes.js');

    it('uses the same variable name between to maintain implicit connection', function () {
      var expectedOutput = fs.readFileSync(__dirname + '/expected-files/mixed-scopes.js', 'utf8');
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

// Edge cases
describe('esformatter-phonetic', function () {
  describe('formatting a script with no potential changes', function () {
    before(function formatNonupdatableScript () {
      // Define and register plugins
      var that = this;
      var beforePlugin = {
        transform: function (ast) {
          // Save incoming AST
          that.beforeAstJson = CircularJSON.stringify(ast);
        }
      };
      var afterPlugin = {
        transform: function (ast) {
          // Save outgoing AST
          that.afterAstJson = CircularJSON.stringify(ast);
        }
      };
      esformatter.register(beforePlugin);
      esformatter.register(esformatterPhonetic);
      esformatter.register(afterPlugin);

      // Parse our content
      esformatter.format([
        'console.log(\'hello\');'
      ].join('\n'));

      // Remove our plugins
      esformatter.unregister(beforePlugin);
      esformatter.unregister(esformatterPhonetic);
      esformatter.unregister(afterPlugin);
    });

    it('leaves the tree clean', function () {
      assert.strictEqual(this.beforeAstJson, this.afterAstJson);
    });
  });
});
