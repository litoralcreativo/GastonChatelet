let _console;
const cursor = "_";

const getConsole = () => {
  const domElement = document.getElementById("console");
  _console = {
    width: window.visualViewport.width,
    DOM_Element: domElement,
    active: true,
    listening: true,
    last_line: domElement.lastElementChild,
    blinking: true,
    actual_dir: data,
    tree: [0],
    folders_tree: [],
    print_header: true,
    line_header:
      "<strong class='console-header'>root@console<span class='console-normal'>:</span><span class='console-directory'>~</span><span class='console-normal'>$</span></strong> ",
    line_text: "",
    listed_commands: [],
    keyboard: {
      state: true,
      shifted: false,
      alternated: false,
    },
  };
  domElement.addEventListener("keydown", (e) => {
    getKey(e.key);
  });
  domElement.focus();
};

const toogleConsoleState = (state) => {
  if (!state) {
    _console.DOM_Element.classList.remove("listening");
  } else {
    _console.DOM_Element.classList.add("listening");
  }
  _console.active = state;
};

const blinking = async () => {
  if (!_console.active) return;

  const lineText = _console.last_line.innerHTML;
  if (_console.blinking) {
    if (lineText[lineText.length - 1] === cursor) {
      _console.last_line.innerHTML = lineText.slice(0, -1);
    } else {
      _console.last_line.innerHTML = lineText + cursor;
    }
    await new Promise((res) => setTimeout(res, 1000));
    blinking();
  } else {
    if (lineText[lineText.length - 1] !== cursor) {
      _console.last_line.innerHTML = lineText + cursor;
    }
  }
};

const getKey = (key) => {
  if (!_console.active) return;
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
  const wh = _console.print_header;
  _console.blinking = false;
  _console.line_text += key;
  // const text = _console.last_line.innerText;
  _console.last_line.innerHTML =
    (wh ? _console.line_header : "") + _console.line_text;
  _console.blinking = true;
};

const eraseLastChar = () => {
  if (!_console.active) return;
  if (_console.line_text !== " ") {
    _console.line_text = _console.line_text.slice(0, -1);
    _console.last_line.innerHTML =
      (_console.print_header ? _console.line_header : "") + _console.line_text;
  }
  _console.last_line.scrollIntoView();
};

const executeCommand = async () => {
  if (!_console.active) return;
  _console.listed_commands.push(_console.line_text);
  const commands = _console.line_text.split(" ");
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
      case "cd..":
        accesFolder("..");
        break;
      case "run":
        runProgram();
        break;
      case "kill":
        killProgram();
        break;
      case "open":
        openFile(commands[1]);
        break;
      case "exit":
        exitConsole();
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
  _console.line_text = "";

  const p = document.createElement("p");
  p.className = "active-line";
  p.innerHTML = `${_console.print_header ? _console.line_header : ""}${
    _console.line_text + cursor
  }`;
  _console.DOM_Element.appendChild(p);
  _console.last_line = _console.DOM_Element.lastElementChild;

  const children = _console.DOM_Element.children;
  if (children.length >= 2) {
    const textOfPrevLine = children[children.length - 2].innerHTML;
    if (textOfPrevLine[textOfPrevLine.length - 1] === cursor) {
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

const writeMultipleSentences = async (arr, typeVelocity = 10, pTime = 500) => {
  for (let i = 0; i < arr.length; i++) {
    const str = arr[i];
    await writeSentence(str, true, typeVelocity);
    await sleep(pTime);
  }
  return;
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
  if (_console.width < 600) {
    printInConsole("files/info_mobile.txt");
  } else {
    printInConsole("files/info.txt");
  }
};

const wrongCommand = (command) => {
  writeMultipleSentences(["\n" + `Command '${command}' not found..`], 0);
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
  writeMultipleSentences(["\n" + dirContent], 0);
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
          ["\n" + `Directory '${command}' not found..`],
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
  _console.line_header = `<strong class="console-header">root@console<span class='console-normal'>:</span><span class="console-directory">~${header}</span><span class='console-normal'>$</span></strong> `;
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

const killProgram = () => {
  const rightPanel = document.getElementById("right-main-container");
  if (rightPanel.classList.contains("active")) {
    rightPanel.classList.remove("active");
  }
  newLine();
};

const openFile = (command) => {
  if (command) {
    const file = _console.actual_dir.files.find((x) => x.name == `${command}`);
    console.log(command);
    if (file) {
      printInConsole(file.path);
    } else {
      writeMultipleSentences(["\n" + `File '${command}' not found..`], 0);
    }
  } else {
    newLine();
  }
};

const printInConsole = async (file, typeVelocity = 0, pVelocity = 0) => {
  let response = await fetch(file);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    lines = await await response.text();
    const wr = await writeMultipleSentences(
      ["\n" + lines],
      typeVelocity,
      pVelocity
    );
  }
};

const toogleHeader = () => {
  _console.print_header = !_console.print_header;
};

const exitConsole = () => {
  const console_dom = document.getElementById("console");
  const background = document.getElementById("console-background");
  const filter = document.getElementById("console-filter");

  console_dom.classList.add("console-p-off");
  background.classList.add("console-bg-off");
  filter.classList.add("console-filter-off");
  _console.blinking = false;
  _console.active = false;
  newLine();
};

const turnConsoleOn = async () => {
  if (_console.width > 600) {
    keyboard_toogleState();
  }
  if (_console.print_header) toogleHeader();
  toogleConsoleState(false);
  const date = new Date();
  const datetime = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  console.log(datetime);
  await writeMultipleSentences(
    ["Welcome to CreaLito terminal (v1.0.2)", datetime, "\n"],
    0,
    0
  );

  await writeSentence("Conectting with server.. ", false, 10);
  await sleep(1000);
  await writeSentence("OK ", true, 10);
  await writeSentence("Loading assets.. ", false, 10);
  await sleep(1000);
  await writeSentence("OK", true, 10);

  await sleep(500);
  toogleHeader();
  newLine();
  toogleConsoleState(true);
  wellcomeLines();
};

//#region KEYBOARD
const keyboard_shift = () => {
  _console.keyboard.shifted = !_console.keyboard.shifted;
  updateKeyboard();
};
const keyboard_alter = () => {
  _console.keyboard.alternated = !_console.keyboard.alternated;
  _console.keyboard.shifted = false;
  updateKeyboard();
};
const keyboard_toogleState = () => {
  _console.keyboard.state = !_console.keyboard.state;
  _console.keyboard.shifted = false;
  _console.keyboard.alternated = false;
  updateKeyboard();
};
const updateKeyboard = () => {
  const keyboard = document.getElementById("virtual-keyboard-container");
  const kb_normal = document.getElementById("virtual-keyboard-normal");
  const kb_uppercase = document.getElementById("virtual-keyboard-uppercase");
  const kb_nums = document.getElementById("virtual-keyboard-nums");
  const kb_alter = document.getElementById("virtual-keyboard-alter");

  if (_console.keyboard.state) {
    if (keyboard.classList.contains("hide")) {
      keyboard.classList.remove("hide");
    }
  } else {
    if (!keyboard.classList.contains("hide")) {
      keyboard.classList.add("hide");
    }
  }

  if (!kb_normal.classList.contains("hide")) kb_normal.classList.add("hide");
  if (!kb_uppercase.classList.contains("hide"))
    kb_uppercase.classList.add("hide");
  if (!kb_nums.classList.contains("hide")) kb_nums.classList.add("hide");
  if (!kb_alter.classList.contains("hide")) kb_alter.classList.add("hide");

  if (_console.keyboard.shifted) {
    if (_console.keyboard.alternated) {
      kb_alter.classList.remove("hide");
    } else {
      kb_uppercase.classList.remove("hide");
    }
  } else {
    if (_console.keyboard.alternated) {
      kb_nums.classList.remove("hide");
    } else {
      kb_normal.classList.remove("hide");
    }
  }
};
//#endregion

getConsole();
blinking();
turnConsoleOn();
