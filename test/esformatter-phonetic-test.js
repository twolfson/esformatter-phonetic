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
      this.output = esformatter.format(input);
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
      console.log(this.output);
    });
  });
});
