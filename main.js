
const write = (container, prompt, color) => {
  const print = (line) => {
    const span = document.createElement("span");
    span.style.color = color;
    span.textContent = line;
    container.insertBefore(span, prompt);
  };
  return (text) => {
    const lines = text.split("\n");
    const last = lines.pop();
    lines.forEach((line) => {
      print(line);
      container.insertBefore(document.createElement("br"), prompt);
    });
    print(last);
    container.scrollTop = container.scrollHeight;
  };
}

module.exports = (container, options) => {

  options = options || {};
  options.encoding = options.encoding || "utf8";
  options.greeting = options.greeting || "> ";
  options.colors = options.colors || {};
  options.colors.stdin = options.colors.stdin || "white";
  options.colors.stdout = options.colors.stdout || "white";
  options.colors.stderr = options.colors.stderr || "red";
  options.colors.background = options.colors.background || "black";

  var last = true;

  const stdins = [];

  const cursor = document.createElement("span");
  cursor.style.backgroundColor = options.colors.stdin;
  cursor.style.color = options.colors.background;
  cursor.textContent = "_";

  const greeting = document.createElement("span");
  greeting.textContent = options.greeting;

  const prompt = document.createElement("div");
  prompt.appendChild(greeting);
  prompt.appendChild(cursor);

  const panel = document.createElement("div");
  panel.tabIndex = 0;
  panel.style.overflow = "scroll";
  panel.style.whiteSpace = "nowrap";
  panel.style.height = "100%";
  panel.appendChild(prompt);

  const clear = document.createElement("div");
  clear.style.position = "absolute";
  clear.style.right = "30px";
  clear.textContent = "Clear";
  clear.style.cursor = "pointer";
  clear.onclick = () => {
    while (panel.firstChild)
      panel.removeChild(panel.firstChild);
    panel.appendChild(prompt);
  };

  container.className += " stdio-widget";
  container.style.overflow = "hidden";
  container.style.position = "relative";
  container.style.color = options.colors.stdin;
  container.style.fontFamily = "monospace";
  container.style.backgroundColor = options.colors.background;
  container.style.borderRadius = "20px";
  container.style.padding = "20px";
  container.appendChild(panel);
  container.appendChild(clear);

  panel.onkeydown = (event) => {
    if (event.ctrlKey) {
      if (event.key !== "Control") {
        const evt = new Event("ctrl");
        evt.key = event.key;
        container.dispatchEvent(evt);
      }
    } else if (event.keyCode === 8 && cursor.previousSibling !== greeting) {
      prompt.removeChild(cursor.previousSibling);
    } else if (event.keyCode === 37 && cursor.previousSibling !== greeting) {
      const current = cursor.textContent;
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
      let input = prompt.textContent.substring(options.greeting.length);
      if (last)
        input = input.substring(0, input.length-1);
      input += "\n";
      const div = document.createElement("div");
      div.textContent = options.greeting+input
      panel.insertBefore(div, prompt);
      stdins.forEach((stdin) => { stdin.write(input) });
      while (prompt.firstChild.nextSibling)
        prompt.removeChild(prompt.firstChild.nextSibling);
      prompt.append(cursor);
      cursor.textContent = "_";
      last = true;
    }
    panel.scrollTop = panel.scrollHeight;
  }

  panel.onkeypress = (event) => {
    if (!event.ctrlKey && event.charCode !== 8 && event.charCode !== 13) {
      prompt.insertBefore(document.createTextNode(String.fromCharCode(event.charCode)), cursor);
    }
  }

  return (stdin, stdout, stderr) => {
    stdins.push(stdin);
    const remove = () => {
      const index = stdins.indexOf(stdin);
      if (index !== -1) {
        stdins.splice(index, 1)
      }
    };
    stdin.on("close", remove);
    stdin.on("finish", remove);
    stdout.setEncoding(options.encoding);
    stdout.on("data", write(panel, prompt, options.colors.stdout));
    stderr.setEncoding(options.encoding);
    stderr.on("data", write(panel, prompt, options.colors.stderr));
  };

};
