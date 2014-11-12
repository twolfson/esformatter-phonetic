// Load in dependencies
var ecmaVariableScope = require('ecma-variable-scope');
var extend = require('obj-extend');
var phonetic = require('phonetic');
var rocambole = require('rocambole');

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
exports.transform = function (ast) {
  // Mark up the AST with scope information
  ast = ecmaVariableScope(ast);

  // Skip over the custom node properties
  rocambole.BYPASS_RECURSION._nearestScope = true;
  rocambole.BYPASS_RECURSION._scopeType = true;
  rocambole.BYPASS_RECURSION.scopeInfo = true;
  rocambole.BYPASS_RECURSION.scope = true;

  // TODO: Clean up custom properties inside of AST to prevent fucking with other nodes

  // Walk over the identifiers
  rocambole.moonwalk(ast, function updateIdentifiers (node) {
    // If the node is an identifier and a variable
    if (node.type === 'Identifier' && node.scopeInfo) {
      // DEV: Logic taken from `uglifyjs2` (linked from `beautify-with-words`)
      // https://github.com/mishoo/UglifyJS2/blob/v2.4.11/lib/scope.js#L59-L63
      // If the identifier is top level, do nothing
      if (node.scopeInfo.topLevel === ecmaVariableScope.SCOPE_INFO_TOP_LEVEL.YES) {
        return;
      }

      // If the identifier has not been declared, do nothing
      // TODO: Add `renameGlobals: true`
      // if (node.scopeInfo.declared !== ecmaVariableScope.SCOPE_INFO_DECLARED.YES) {
      //   return;
      // }

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
  });

  // Clean up custom node properties
  delete rocambole.BYPASS_RECURSION._nearestScope;
  delete rocambole.BYPASS_RECURSION._scopeType;
  delete rocambole.BYPASS_RECURSION.scopeInfo;
  delete rocambole.BYPASS_RECURSION.scope;

  // Return the modified AST
  return ast;
};
