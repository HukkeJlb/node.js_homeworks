const fs = require("fs");
const path = require("path");
const newFolder = path.join(__dirname, "./newFolder");
const sourceFolder = path.join(__dirname, "./source");

if (!fs.existsSync(newFolder)) {
  fs.mkdirSync(newFolder);
}

const sortingFiles = (base, level) => {
  const content = fs.readdirSync(base);

  content.forEach(item => {
    let localBase = path.join(base, item);
    let state = fs.statSync(localBase);
    if (state.isDirectory()) {
      sortingFiles(localBase, level + 1);
    } else {
      copyFile(item, localBase);
    }
  });
};

const copyFile = (file, filePath) => {
  let firstFileLetter = file.substr(0, 1).toUpperCase();
  let destinationFolder = path.join(newFolder, firstFileLetter);
  let destinationPath = path.join(destinationFolder, file);

  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder);
  }

  fs.readFile(filePath, { encoding: "utf8" }, (err, data) => {
    if (err) {
      console.log("Error reading the file");
      process.exit(1);
    }

    var fileExistance = fs.existsSync(destinationPath);

    if (fileExistance) {
      var destinationPathNew = path.join(destinationFolder, generateHash(file));
    } else {
      var destinationPathNew = path.join(destinationFolder, file);
    }

    fs.writeFile(destinationPathNew, data, err => {
      if (err) {
        console.log("Error copying the file");
      }
    });
  });
};

const generateHash = filename => {
  var filenameArray = stringSplice(filename);
  var splicedFilename = filenameArray[0] + "_";
  var extension = filenameArray[1];
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++) {
    splicedFilename += possible.charAt(
      Math.floor(Math.random() * possible.length)
    );
  }

  var newFilename = splicedFilename + extension;

  return newFilename;
};

const stringSplice = string => {
  var extension = path.extname(string);
  var withoutExt = path.parse(string).name;

  return [withoutExt, extension];
};

sortingFiles(sourceFolder, 0);
