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

// Define helper to get phonetic names
exports.getPhoneticName = function (name) {
  // If the name is not defined, create one
  if (nameMap[name] === undefined) {
    // If there was a base seed provided, calculate the current value
    var seed = null;
    if (phoneticOptions.baseSeed !== undefined) {
      seed = phoneticOptions.baseSeed + nameIndex;
      nameIndex += 1;
    }

    // Generate and save the new name
    nameMap[name] = phonetic.generate(extend({
      seed: seed
    }, phoneticOptions));
  }

  // Return the name
  return nameMap[name];
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

  // TODO: Create TODO regarding eval support

  // Walk over the identifiers
  rocambole.moonwalk(ast, function updateIdentifiers (node) {
    // If the node is an identifier and a variable
    if (node.type === 'Identifier' && node.scopeInfo) {
      // DEV: Logic taken from `uglifyjs2` (linked from `beautify-with-words`)
      // https://github.com/mishoo/UglifyJS2/blob/v2.4.11/lib/scope.js#L59-L63
      // If the identifier is top level and we aren't touching top level items, do nothing
      var isTopLevel = node.scopeInfo.topLevel === ecmaVariableScope.SCOPE_INFO_TOP_LEVEL.YES;
      if (isTopLevel && phoneticOptions.renameTopLevel !== true) {
        return;
      }

      // If the identifier has not been declared, do nothing
      if (node.scopeInfo.declared !== ecmaVariableScope.SCOPE_INFO_DECLARED.YES) {
        return;
      }

      // Rename our identifier
      var name = node.startToken.value;
      node.startToken.value = exports.getPhoneticName(name);
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
