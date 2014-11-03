// stringBefore > tokenBefore > nodeBefore > nodeAfter > tokenAfter > transform > stringAfter
exports.stringBefore  = function (something) {
  console.log(arguments);
  return something;
};
exports.tokenBefore  = function (something) {
  console.log(arguments);
  return something;
};
exports.nodeBefore  = function (something) {
  console.log(arguments);
  return something;
};
exports.nodeAfter  = function (something) {
  console.log(arguments);
  return something;
};
exports.tokenAfter  = function (something) {
  console.log(arguments);
  return something;
};
exports.transform  = function (something) {
  console.log(arguments);
  return something;
};
exports.stringAfter = function (something) {
  console.log(arguments);
  return something;
};
