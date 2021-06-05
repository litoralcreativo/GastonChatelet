class Directory {
  name = "";
  folders = [];
  files = [];
  constructor(obj) {
    this.name = obj.name;
    this.GetFolders(obj.folders);
    this.GetFiles(obj.files);
  }
  GetFolders(f) {
    if (f) {
      f.forEach((fold) => {
        this.folders.push(new Directory(fold));
      });
    }
  }
  GetFiles(f) {
    if (f) {
      f.forEach((file) => {
        this.files.push(new CustomFile(file));
      });
    }
  }
}

class CustomFile {
  name = "";
  constructor(name) {
    this.name = name;
  }
}

const _data = {
  name: "root",
  parent: "root",
  folders: [
    {
      name: "projects",
      folders: [
        {
          name: "radialGraph",
          folders: [],
          files: ["read.me"],
        },
        {
          name: "sha256",
          folders: [],
          files: ["read.me"],
        },
        {
          name: "colorChanger",
          folders: [],
          files: ["read.me"],
        },
      ],
    },
    {
      name: "journal",
      files: [
        "2018_10.txt",
        "2019_03.txt",
        "2019_06.txt",
        "2020_01.txt",
        "2020_06.txt",
        "2021_02.txt",
      ],
    },
  ],
  files: ["about.me", "contact.me"],
};

let data;
const createData = () => {
  data = new Directory(_data);
};

createData();
