# stdio-gui

stdio-widget is a terminal emulator for browsers which works with [node.js streams](https://nodejs.org/api/stream.html) through [browserify](http://browserify.org).
Test [here](test/main.js) result [here](https://rawgit.com/lachrist/stdio-widget/master/test/index.html).

### `stdio = require("stdio-widget")(container, options)`
  * `container :: dom.Element`
    * BrowserEvent `"ctrl"`
      * `key :: string`
  * `options :: object`
    * `encoding :: string`
    * `greeting :: string`
  * `stdio(stdin, stdout, stderr)`
    * `stdin :: stream.Writable`
    * `stdout :: stream.Readable`
    * `stderr :: stream.Readable`
