var nameMap = {};

// DEV: We adjust `nodeBefore` because we don't need whitespace manipulation
// DEV: and `transform` makes us do our own walking
exports.transform  = function (program) {
  // console.log(program.body[0].declarations[0].id.name);
  program.body[0].declarations[0].id.name = 'hai';
  // // If the node is an identifier (e.g. `a` in `var a;`)
  // if (node.type === 'Identifier') {
  //   // If the identifier has been seen before, rename it to that
  //   var name = node.name;
  //   if (nameMap[name] !== undefined) {
  //     node.name = nameMap[name];
  //   // Otherwise, create a new name and update the identifier
  //   } else {
  //     // TODO: Use phonetic and seeds
  //     var newName = Math.random() + '';
  //     node.name = nameMap[name] = newName;
  //   }
  //   console.log(node.name);
  // }

  // Return the adjusted node
  return program;
};
