var Stream = require("stream");
var StdioWidget = require("../main.js");
function noop () {};
var stdin = new Stream.Writable({
  decodeStrings: false,
  write: function (chunk, encoding, callback) {
    if (encoding !== "utf8")
      throw new Error("this should never happen");
    stdout.push(JSON.stringify(chunk), "utf8");
    callback();
  }
});
var stdout = new Stream.Readable({read:noop});
var stderr = new Stream.Readable({read:noop});
var div = document.createElement("div");
div.addEventListener("ctrl", function (event) {
  stdout.push("ctrl-"+event.key);
});
div.style.height = "200px";
div.style.width = "400px";
div.style.resize = "both";
document.body.append(div);
var stdio = StdioWidget(div, {
  encoding: "utf8",
  greeting: "popov> ",
  colors: {
    stdin: "Black",
    stdout: "Green",
    stderr: "DarkMagenta",
    background: "LightGrey"
  }
});
stdio(stdin, stdout, stderr);
setInterval(function () {
  stderr.push("\\   /\n \\ / \n  X  \n / \\ \n/   \\\n", "utf8");
}, 5000);