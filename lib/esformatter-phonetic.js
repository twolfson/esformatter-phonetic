// Load in dependencies
var extend = require('obj-extend');
var phonetic = require('phonetic');

// Define shared variables for transformation
// DEV: These are set/reset by `setOptions` which is run every `esformatter.format` call
var nameIndex;
var nameMap;
var phoneticOptions;

// Handle options for phonetic
exports.setOptions = function (options) {
  // Reset name map and pluck phonetic options
  nameIndex = 0;
  nameMap = {};
  phoneticOptions = options.phonetic || {};
};

// DEV: We adjust `nodeBefore` because we don't need whitespace manipulation
// DEV: and `transform` makes us do our own walking
exports.nodeBefore = function (node) {
  console.log(node);
  // If the node is an identifier (e.g. `a` in `var a;`)
  if (node.type === 'Identifier') {
    // If the identifier has been seen before, rename it to that
    var name = node.startToken.value;
    if (nameMap[name] !== undefined) {
      node.startToken.value = nameMap[name];
    // Otherwise, create a new name and update the identifier
    } else {
      // If there was a base seed provided, calculate the current value
      var seed = null;
      if (phoneticOptions.baseSeed !== undefined) {
        seed = phoneticOptions.baseSeed + nameIndex;
        nameIndex += 1;
      }

      // Generate and save the new name
      var newName = phonetic.generate(extend({
        seed: seed
      }, phoneticOptions));
      node.startToken.value = nameMap[name] = newName;
    }
  }

  // Return the adjusted node
  return node;
};
