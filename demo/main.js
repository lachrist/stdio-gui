var Stream = require("stream");
var StdioWidget = require("../main.js");
function noop () {};
var stdin = new Stream.Writable({
  decodeStrings: false,
  write: function (chunk, encoding, callback) {
    // As stdio-widget's encoding is set to utf8 and
    // decodeStrings is set to false, this should never append."
    if (encoding !== "utf8")
      throw new Error("assertion failure");
    stdout.push(JSON.stringify(chunk), "utf8");
    callback();
  }
});
var stdout = new Stream.Readable({read:noop});
var stderr = new Stream.Readable({read:noop});
var div = document.createElement("div");
var stdio = StdioWidget(div, {
  encoding: "utf8",
  greeting: "> "
});
div.addEventListener("ctrl", function (event) {
  stdout.push("ctrl-"+event.key);
});
setInterval(function () {
  stderr.push("error", "utf8");
}, 5000);
stdio(stdin, stdout, stderr);
document.body.append(div);