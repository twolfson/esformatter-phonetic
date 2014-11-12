function hello() {
  var renameA = true;
  if (true) {
    // DEV: These remain the same name for intention hinting
    let renameA = false;
  }
}
