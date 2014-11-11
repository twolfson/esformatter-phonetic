function hello() {
  var obj = {};
  var world = true;
  with (obj) {
    consoe.log(world);
  }
}
