function hello() {
  var obj = {};
  var world = true;
  with (obj) {
    console.log(world);
  }
}
