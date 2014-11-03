// Load in dependencies
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
        fs.writeFileSync(filepath.replace('test-files/', 'actual-files/'));
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
  describe('formatting a JS file with single variable definitions', function () {
    testUtils.format(__dirname + '/test-files/single-variables.js');

    it('updates the names', function () {
      // TODO: Generate a seed and stick to it
      console.log('');
      console.log(this.output);
    });
  });
});
