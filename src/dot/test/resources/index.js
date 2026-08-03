/**
 * Graphology DOT Unit Tests Resources
 * ====================================
 */
var fs = require('fs'),
  path = require('path');

var FILES = [
  'basic',
  'directed',
  'attributes',
  'basic_writer',
  'directed_writer'
];

function loadFile(name) {
  return fs
    .readFileSync(path.join(__dirname, name + '.dot'), 'utf-8')
    .trim();
}

var MAP = {};

FILES.forEach(function (file) {
  MAP[file] = loadFile(file);
});

module.exports = MAP;
