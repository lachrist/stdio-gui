# stdio-gui

StdioGUI is a terminal emulator for browsers which works with [node.js streams](https://nodejs.org/api/stream.html) thanks to [browserify](http://browserify.org).

```js
var StdioGui = require("stdio-gui");
var stdin = new Stream.Writable(...);
var stdout = new Stream.Readable(...);
var stderr = new Stream.Readable(...);
var div = document.createElement("div");
var stdiogui = StdioGui(div, {
  encoding: "utf8",
  greeting: "> ",
  onctrl: function (key) {
    if (key === "c") {
      console.log("SIGINT");
    } else if (key === "d") {
      stdin.write(null);
    }
  }
});
var stdio = [stdin, stdout, stderr];
stdiogui(stdio);
```
