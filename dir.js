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
        this.files.push(new CustomFile(file.name, file.path));
      });
    }
  }
}

class CustomFile {
  name = "";
  path;
  constructor(name, path) {
    this.name = name;
    this.path = path;
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
          files: [{ name: "read.me", path: "files/readme.txt" }],
        },
        {
          name: "sha256",
          folders: [],
          files: [{ name: "read.me", path: "files/readme.txt" }],
        },
        {
          name: "colorChanger",
          folders: [],
          files: [{ name: "read.me", path: "files/readme.txt" }],
        },
      ],
    },
    {
      name: "journal",
      files: [
        { name: "2018_10.txt", path: "files/2018_10.txt" },
        { name: "2019_03.txt", path: "files/2019_03.txt" },
        { name: "2019_06.txt", path: "files/2019_06.txt" },
        { name: "2020_01.txt", path: "files/2020_01.txt" },
        { name: "2020_06.txt", path: "files/2020_06.txt" },
        { name: "2021_02.txt", path: "files/2021_02.txt" },
      ],
    },
  ],
  files: [
    { name: "aboutme.txt", path: "files/aboutme.txt" },
    { name: "contact.me", path: contactMe },
  ],
};

let data;
const createData = () => {
  data = new Directory(_data);
};

createData();
