// DEV: We adjust `nodeBefore` because we don't need whitespace manipulation
// DEV: and `transform` makes us do our own walking
exports.nodeBefore  = function (node) {
  // If the node is an identifier (e.g. `a` in `var a;`)
  if (node.type === 'Identifier') {
    // If the identifier has been seen before, rename it to that
    var name = node.value;
    if (nameMap[name] !== undefined) {

    // Otherwise, create a new name and update the identifier
    } else {
      // TODO: Use phonetic and seeds
      var newName = Math.random() + '';
      node.value = nameMap[name] = newName;
    }
  }

  // Return the adjusted node
  return node;
};
