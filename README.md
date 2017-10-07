# stdio-gui

stdio-widget is a terminal emulator for browsers which works with [nodejs streams](https://nodejs.org/api/stream.html) through [browserify](http://browserify.org).
Usage [here](demo/), live demo [here](https://cdn.rawgit.com/lachrist/stdio-widget/763990d8/demo/index.html).

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
