const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const {getNextUniqueId} = require('./counter');

const getFilePath = (id) => {
  return `/${exports.dataDir}/${id}.txt`;
};

exports.create = (text, callback) => {
  getNextUniqueId((err, id) => {
    fs.writeFile(getFilePath(id), text, () => {
      callback(null, {id, text});
    });
  });
};

exports.readAll = (callback) => {
  new Promise((res, rej) => {
    fs.readdir(exports.dataDir, (err, data) => {
      err ? rej(err) : res(data);
    });
  })
    .catch((err) => {
      console.log('Caught an error!');
    })
    .then((data) => {
      return data.map((fileName) => {
        const text = fs.readFileSync(`/${exports.dataDir}/${fileName}`, 'utf8');
        const id = fileName.slice(0, -4);
        return {id, text};
      });
    })
    .then((result) => {
      callback(null, result);
    });
};

exports.readOne = (id, callback) => {
  fs.readFile(getFilePath(id), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: data.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(getFilePath(id), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(getFilePath(id), text, () => {
        callback(null, {id, text});
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(getFilePath(id), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
