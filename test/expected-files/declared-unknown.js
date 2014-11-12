function hello() {
  var renameA = {};
  var world = true;
  with (renameA) {
    console.log(world);
  }
}
