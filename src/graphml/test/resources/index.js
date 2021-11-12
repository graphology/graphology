/**
 * Graphology GRAPHML Unit Tests Resources
 * =====================================
 */
var fs = require('fs'),
  path = require('path');

var FILES = [
  'attributes',
  'basic',
  'miserables',
  'miserables_broken',
  'multigraph',
  'mixed_multigraph',
  'missing_nodes'
];

function loadFile(name) {
  return fs
    .readFileSync(path.join(__dirname, name + '.graphml'), 'utf-8')
    .trim();
}

var MAP = {};

FILES.forEach(function (file) {
  MAP[file] = loadFile(file);
});

module.exports = MAP;
