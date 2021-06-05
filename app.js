let _console;

const getConsole = () => {
  const domElement = document.getElementById("console");
  _console = {
    DOM_Element: domElement,
    active: true,
    last_line: domElement.lastElementChild,
    blinking: true,
    actual_dir: data,
    tree: [0],
    folders_tree: [],
    line_header:
      "<strong class='console-header'>root@console<span class='console-normal'>:</span><span class='console-directory'>~</span><span class='console-normal'>$</span></strong>",
    line_text: " ",
    listed_commands: [],
  };
  domElement.addEventListener("keydown", (e) => {
    getKey(e.key);
  });
  domElement.focus();
};

const toogleConsoleState = () => {
  if (_console.active) {
    cons.classList.remove("listening");
    active = true;
  } else {
    _console.domElement.classList.add("listening");
    active = true;
  }
};

const blinking = async () => {
  if (!_console.active) return;

  const lineText = _console.last_line.innerHTML;
  if (_console.blinking) {
    if (lineText[lineText.length - 1] === "█") {
      _console.last_line.innerHTML = lineText.slice(0, -1);
    } else {
      _console.last_line.innerHTML = lineText + "█";
    }
    await new Promise((res) => setTimeout(res, 1000));
    blinking();
  } else {
    if (lineText[lineText.length - 1] !== "█") {
      _console.last_line.innerHTML = lineText + "█";
    }
  }
};

const getKey = (key) => {
  if (key.length == 1) {
    writeChar(key);
  } else {
    switch (key) {
      case "Enter":
        executeCommand();
        break;
      case "Backspace":
        eraseLastChar();
        break;
    }
  }
};

const writeChar = (key) => {
  _console.blinking = false;
  _console.line_text += key;
  // const text = _console.last_line.innerText;
  _console.last_line.innerHTML = _console.line_header + _console.line_text;
  _console.blinking = true;
};

const eraseLastChar = () => {
  if (_console.line_text !== " ") {
    _console.line_text = _console.line_text.slice(0, -1);
    _console.last_line.innerHTML = _console.line_header + _console.line_text;
  }
  _console.last_line.scrollIntoView();
};

const executeCommand = async () => {
  _console.listed_commands.push(_console.line_text);
  const commands = _console.line_text.slice(1).split(" ");
  const lst = listeners.find((x) => x.state == true);
  if (lst) {
    switch (commands[0]) {
      case "y":
      case "Y":
        lst.yes();
        disableListener(lst.name);
        break;
      case "n":
      case "N":
        lst.no();
        disableListener(lst.name);
        break;
      case "":
        newLine();
        break;
      default:
        notAcceptValue(commands[0], "(y/n)");
        break;
    }
    // newLine();
  } else {
    // frecuent commands
    switch (commands[0]) {
      case "clear":
        clearConsole();
        newLine();
        break;
      case "info":
        if (commands.length == 1) showInfo();
        else wrongCommand(commands[1]);
        break;
      case "dir":
        showDir();
        break;
      case "cd":
        accesFolder(commands[1]);
        break;
      case "run":
        runProgram();
        break;
      case "close":
        closeProgram();
        break;
      case "":
        newLine();
        break;
      default:
        wrongCommand(commands[0]);
        break;
    }
    // newLine();
  }
};

const newLine = () => {
  _console.line_text = " ";

  const p = document.createElement("p");
  p.className = "active-line";
  p.innerHTML = `${_console.line_header}${_console.line_text}█`;
  _console.DOM_Element.appendChild(p);
  _console.last_line = _console.DOM_Element.lastElementChild;

  const children = _console.DOM_Element.children;
  if (children.length >= 2) {
    const textOfPrevLine = children[children.length - 2].innerHTML;
    if (textOfPrevLine[textOfPrevLine.length - 1] === "█") {
      children[children.length - 2].innerHTML = textOfPrevLine.slice(0, -1);
    }
  }
  _console.last_line.scrollIntoView();
};

const writeSentence = async (str, withNewLine = true, fast = 10) => {
  for (let i = 0; i < str.length; i++) {
    if (fast >= 1 && fast <= 5000) await sleep(fast);
    const _char = str[i];
    writeChar(_char);
  }
  if (withNewLine) newLine();
};

const writeMultipleSentences = async (arr, fast = 10) => {
  for (let i = 0; i < arr.length; i++) {
    const str = arr[i];
    await writeSentence(str, true, fast);
    await sleep(500);
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const clearConsole = () => {
  _console.DOM_Element.innerHTML = "";
};

const enableListener = (str) => {
  listeners.find((x) => x.name == str).state = true;
};

const disableListener = (str) => {
  listeners.find((x) => x.name == str).state = false;
};

const wellcomeLines = () => {
  writeMultipleSentences([
    "Hello! I'm Gaston..",
    "Do you want to use this console? (y/n)",
  ]);
  enableListener("useConsole");
};

const showHomeInfo = () => {
  newLine();
  writeMultipleSentences([
    "Nice..",
    "You can enter 'info' to get some useful commands",
  ]);
};

const dontShowHomeInfo = () => {
  newLine();
  writeMultipleSentences([
    "No problem..",
    "Let me take you to the boring page..",
  ]);
};

const showInfo = () => {
  writeMultipleSentences(
    [
      "\n" +
        "╔══════════════════════════════════════════════════╗\n" +
        "║ info       | bring info about frecuent commands  ║\n" +
        "║ clear      | clears the console buffer           ║\n" +
        "║ dir        | show this directory content         ║\n" +
        "║ cd         | access a specified directory        ║\n" +
        "║ exit       | turn off the console                ║\n" +
        "╚══════════════════════════════════════════════════╝ ",
    ],
    0
  );
};

const wrongCommand = (command) => {
  writeMultipleSentences(["\n\n" + `Command '${command}' not found..\n `], 0);
};

const notAcceptValue = (command, expected) => {
  writeMultipleSentences(
    ["\n" + `'${command}' is not a value, expecting ${expected}`],
    0
  );
};

const showDir = () => {
  const dir_folders = _console.actual_dir.folders;
  const dir_files = _console.actual_dir.files;
  dirContent = "";
  for (let i = 0; i < dir_files.length; i++) {
    const f = dir_files[i].name;
    const l = f.length;
    const wsp = span(" ", 20 - l);
    dirContent += `${f}\n`;
  }
  for (let i = 0; i < dir_folders.length; i++) {
    const f = dir_folders[i].name;
    const l = f.length;
    const wsp = span(" ", 20 - l);
    dirContent += `${f}${wsp}DIR\n`;
  }

  writeMultipleSentences(["\n" + dirContent + " "], 0);
};

const span = (char, times) => {
  let res = "";
  for (let i = 0; i < times; i++) {
    res += char;
  }
  return res;
};

const accesFolder = (command) => {
  if (command) {
    if (command == "..") {
      goBack();
    } else {
      const newFol = getDirectory(command);
      if (newFol[0] != -1) {
        changeFolders(newFol[0], newFol[1]);
      } else {
        writeMultipleSentences(
          ["\n\n" + `Directory '${command}' not found..\n `],
          0
        );
      }
    }
  } else {
    newLine();
  }
};

const getDirectory = (str) => {
  const folders = _console.actual_dir.folders;
  let i = 0;
  let found = false;
  let result = -1;
  while (i < folders.length && !found) {
    if (folders[i].name === str) {
      result = folders[i];
      found = true;
    } else {
    }
    i++;
  }
  return [result, i];
};

const changeFolders = (dir, index) => {
  _console.tree.push(index);
  _console.folders_tree.push(dir.name);
  _console.actual_dir = dir;
  let header = "";
  for (let i = 0; i < _console.folders_tree.length; i++) {
    header += "/" + _console.folders_tree[i];
  }
  _console.line_header = `<strong class="console-header">root@console<span class='console-normal'>:</span><span class="console-directory">~${header}</span><span class='console-normal'>$</span></strong>`;
  newLine();
};

const goBack = () => {
  if (_console.tree.length > 1) {
    console.log("here");
    _console.tree.pop();
    _console.folders_tree.pop();
    const arr = [..._console.tree];
    const obj = findFolderByTree(arr, data);
    _console.actual_dir = obj;
    let header = "";
    for (let i = 0; i < _console.folders_tree.length; i++) {
      header += _console.folders_tree[i] + "/";
    }
    if (_console.tree.length === 1) {
      _console.line_header = `<strong class="console-header">root@console<span class='console-normal'>:</span><span class="console-directory">~${header}</span><span class='console-normal'>$</span></strong>`;
    } else {
      _console.line_header = `<strong class="console-header">root@console<span class='console-normal'>:</span><span class="console-directory">~${header}</span><span class='console-normal'>$</span></strong>`;
    }
  }
  newLine();
};

const findFolderByTree = (arr, dir) => {
  let result = dir;
  if (arr.length !== 1) {
    const _dir = dir.folders[arr[0]];
    arr.shift();
    result = findFolderByTree(arr, _dir);
  }
  return result;
};

const listeners = [
  {
    name: "useConsole",
    yes: showHomeInfo,
    no: dontShowHomeInfo,
    state: false,
  },
];

const runProgram = () => {
  const rightPanel = document.getElementById("right-main-container");
  if (!rightPanel.classList.contains("active")) {
    rightPanel.classList.add("active");
  }
  newLine();
};

const closeProgram = () => {
  const rightPanel = document.getElementById("right-main-container");
  if (rightPanel.classList.contains("active")) {
    rightPanel.classList.remove("active");
  }
  newLine();
};

getConsole();
newLine();
blinking();
wellcomeLines();
