const fs = require('fs');
const path = require('path');

fs.unlink('temp/test.txt', err => {
  if (err) {
    console.log(err);
    return;
  }

  fs.unlinkSync('temp/newFile.txt');

  fs.rmdir('temp', err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Delete done!');
  });
});
