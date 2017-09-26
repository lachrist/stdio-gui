
function write (container, prompt, color) {
  function print (line) {
    var span = document.createElement("span");
    span.style.color = color;
    span.textContent = line;
    container.insertBefore(span, prompt);
  }
  return function (text) {
    var lines = text.split("\n");
    var last = lines.pop();
    lines.forEach(function (line) {
      print(line);
      container.insertBefore(document.createElement("br"), prompt);
    });
    print(last);
  }
}

module.exports = function (container, options) {

  var stdins = [];
  var last = true;
  var clear = document.createElement("div");
  var prompt = document.createElement("div");
  var greeting = document.createElement("span");
  var cursor = document.createElement("span");

  container.tabIndex = 0;
  container.style.color = "white";
  container.style.fontFamily = "monospace";
  container.style.backgroundColor = "black";
  container.style.borderRadius = "20px";
  container.style.padding = "20px";
  container.style.overflow = "scroll";
  container.appendChild(clear);
  container.appendChild(prompt);

  options = options || {};
  options.encoding = options.encoding || "utf8";
  options.greeting = options.greeting || "> ";
  options.onctrl = options.onctrl || function () {};

  clear.style.position = "relative";
  clear.style.top = "-10px";
  clear.textContent = "Clear";
  clear.style.cursor = "pointer";
  clear.style.textDecoration = "underline";
  clear.onclick = function () {
    while (container.firstChild.nextSibling)
      container.removeChild(container.firstChild.nextSibling);
    container.appendChild(prompt);
  };

  cursor.style.backgroundColor = "white";
  cursor.style.color = "black";
  cursor.textContent = "_";
  greeting.textContent = options.greeting;
  prompt.appendChild(greeting);
  prompt.appendChild(cursor);

  container.onkeydown = function (event) {
    if (event.ctrlKey) {
      options.onctrl(event.key);
    } else if (event.keyCode === 8 && cursor.previousSibling !== greeting) {
      prompt.removeChild(cursor.previousSibling);
    } else if (event.keyCode === 37 && cursor.previousSibling !== greeting) {
      var current = cursor.textContent;
      cursor.textContent = cursor.previousSibling.textContent;
      prompt.removeChild(cursor.previousSibling);
      if (last) {
        last = false;
      } else {
        prompt.insertBefore(document.createTextNode(current), cursor.nextSibling);
      }
    } else if (event.keyCode === 39 && !last) {
      prompt.insertBefore(document.createTextNode(cursor.textContent), cursor);
      if (cursor.nextSibling) {
        cursor.textContent = cursor.nextSibling.textContent;
        prompt.removeChild(cursor.nextSibling);
      } else {
        last = true;
        cursor.textContent = "_";
      }
    } else if (event.keyCode === 13) {
      var input = prompt.textContent.substring(options.greeting.length);
      if (last)
        input = input.substring(0, input.length-1);
      input += "\n";
      var div = document.createElement("div");
      div.textContent = options.greeting+input
      container.insertBefore(div, prompt);
      stdins.forEach(function (stdin) { stdin.write(input) });
      while (prompt.firstChild.nextSibling)
        prompt.removeChild(prompt.firstChild.nextSibling);
      prompt.append(cursor);
      cursor.textContent = "_";
      last = true;
    }
  }

  container.onkeypress = function (event) {
    if (!event.ctrlKey && event.charCode !== 8 && event.charCode !== 13) {
      prompt.insertBefore(document.createTextNode(String.fromCharCode(event.charCode)), cursor);
    }
  }

  return function (stdio) {
    stdins.push(stdio[0]);
    function remove () {
      var index = stdins.indexOf(stdio[0]);
      if (index !== -1) {
        stdins.splice(index, 1)
      }
    }
    stdio[0].on("close", remove);
    stdio[0].on("finish", remove);
    stdio[1].setEncoding(options.encoding);
    stdio[1].on("data", write(container, prompt, "white"));
    stdio[2].setEncoding(options.encoding);
    stdio[2].on("data", write(container, prompt, "red"));
  };

};
