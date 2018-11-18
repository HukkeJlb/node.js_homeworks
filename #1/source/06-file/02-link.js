const fs = require('fs');
const path = require('path');

const file = './test/test01.txt';

fs.link(file, './temp/newFile.txt', err => {
  if (err) {
    console.error(err.message);
    return;
  }
  // ...
});
