const fs = require('fs');

const file = fs.createWriteStream('file-stream.txt');

function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // последний раз!
        writer.end(data, encoding, callback);
      } else {
        // смотрим, следует ли нам продолжать или ждать потому что цикл не до конца.
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // пришлось рано остановиться! напишите еще один раз, когда DRAIN!
      console.log('drain: ' + i);
      writer.once('drain', write);
    }
  }
}

writeOneMillionTimes(file, 'test ', 'utf-8', () => {
  console.log('callback');
});
