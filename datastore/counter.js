const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

exports.getNextUniqueId = (callback) => {
  readCounter((err, count) => {
    writeCounter(++count, (err, paddedID) => {
      callback(null, paddedID);
    });
  });
};

exports.counterFile = path.join(__dirname, 'counter.txt');
