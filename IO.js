const fs = require('fs').promises;
const readline = require('readline');

function readJSONFile(filename) {
  return fs.readFile(filename, 'utf8')
    .then(data => JSON.parse(data))
    .catch(error => {
      throw error;
    });
}

function writeJSONFile(filename, jsonData) {
  const jsonString = JSON.stringify(jsonData, null, 2);
  return fs.writeFile(filename, jsonString, 'utf8')
    .catch(error => {
      throw error;
    });
}

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}
module.exports = {
    readJSONFile,
    writeJSONFile,
    prompt
  };
  