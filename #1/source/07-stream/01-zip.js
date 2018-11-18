const fs = require('fs');
const zlib = require('zlib');
const file = 'test.txt';

fs.readFile(file, (err, buffer) => {
  if (err) {
    console.log('Error: ', err);
    return;
  }
  zlib.gzip(buffer, (err, buffer) => {
    if (err) {
      console.log('Error: ', err);
      return;
    }
    fs.writeFile(file + '.gz', buffer, err => {
      if (err) {
        console.log('Error: ', err);
        return;
      }
      console.log('Compressed!');
    });
  });
});
