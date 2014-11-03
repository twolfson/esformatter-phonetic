// DEV: We adjust `nodeBefore` because we don't need whitespace manipulation
// DEV: and `transform` makes us do our own walking
exports.nodeBefore  = function (node) {
  // If the node is a variable declaraction
  console.log(node.type);

  // Return the adjusted node
  return node;
};
