const {readdir, writeFile, readFileSync, readFile, existsSync, mkdirSync, unlink} = require('fs');
const path = require('path');
const {getNextUniqueId} = require('./counter');

const getFilePath = (id) => {
  return `/${exports.dataDir}/${id}.txt`;
};

exports.create = (text, callback) => {
  getNextUniqueId((err, id) => {
    writeFile(getFilePath(id), text, () => {
      callback(null, {id, text});
    });
  });
};

exports.readAll = (callback) => {
  new Promise((resolve, reject) => {
    readdir(exports.dataDir, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  })
    .catch((err) => {
      console.log('Caught an error!');
    })
    .then((data) => {
      return data.map((fileName) => {
        const text = readFileSync(`/${exports.dataDir}/${fileName}`, 'utf8');
        const id = fileName.slice(0, -4);
        return {id, text};
      });
    })
    .then((result) => {
      callback(null, result);
    });
};

exports.readOne = (id, callback) => {
  readFile(getFilePath(id), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: data.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  readFile(getFilePath(id), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      writeFile(getFilePath(id), text, () => {
        callback(null, {id, text});
      });
    }
  });
};

exports.delete = (id, callback) => {
  unlink(getFilePath(id), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!existsSync(exports.dataDir)) {
    mkdirSync(exports.dataDir);
  }
};
