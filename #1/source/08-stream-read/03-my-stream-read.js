const stream = require('stream');
const Chance = require('chance');

const chance = new Chance();

class RandomStream extends stream.Readable {
  constructor(options) {
    super(options);
  }
  _read(size) {
    const chunk = chance.string();
    this.push(chunk, 'utf8');
    if (chance.bool({ likelihood: 5 })) {
      this.push(null);
    }
  }
}

/**
highWaterMark - Default: 16384 (16kb), or 16 for objectMode streams.
encoding - Default: null.
objectMode - Default: false.
read <Function> Implementation for the stream._read() method.
destroy <Function> Implementation for the stream._destroy() method.
*/

const rs = new RandomStream();

rs.on('readable', () => {
  let chunk;
  while ((chunk = rs.read()) !== null) {
    console.log(`Block read: size(${chunk.length}) - ${chunk.toString()}`);
  }
});
