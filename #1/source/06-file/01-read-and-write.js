const fs = require('fs');
const path = require('path');

const file = './test/test01.txt';

fs.readFile(file, (err, data) => {
  if (err) {
    console.error(err.message);
    return;
  }

  if (!fs.existsSync('./temp')) {
    fs.mkdirSync('./temp');
  }

  fs.writeFile('./temp/test.txt', `${data.toString()} + add text`, err => {
    if (err) {
      console.log(err);
      return;
    }
  });
});
