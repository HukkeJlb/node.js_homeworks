const stream = require('stream');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

class ToFileStream extends stream.Writable {
  constructor(options) {
    super(options);
  }
  _write(chunk, encoding, callback) {
    mkdirp(path.dirname(chunk.path), err => {
      if (err) {
        callback(err);
      }
      fs.writeFile(chunk.path, chunk.content, callback);
    });
  }
}

/**
highWaterMark <number> Default: 16384 (16kb), or 16 for objectMode streams.
decodeStrings <boolean> Default: true.
defaultEncoding <string> Default: 'utf8'.
objectMode <boolean> Default: false.
emitClose <boolean> Default: true.
write <Function> Implementation for the stream._write() method.
writev <Function> Implementation for the stream._writev() method.
destroy <Function> Implementation for the stream._destroy() method.
final <Function> Implementation for the stream._final() method.
 */
const tfs = new ToFileStream({ objectMode: true });

const content = fs.readFileSync('01-write-stream.js');

tfs.write({ path: './temp/file.txt', content });
tfs.on('error', err => {});
tfs.end(() => {
  console.log('Done!');
});
