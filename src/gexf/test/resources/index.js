/**
 * Graphology GEXF Unit Tests Resources
 * =====================================
 */
var fs = require('fs');
var path = require('path');

var FILES = [
  'arctic',
  'basic',
  'basic_formatted',
  'case',
  'celegans',
  'data',
  'edge_data',
  'edge_viz',
  'les_miserables',
  'liststring',
  'minimal',
  'missing_nodes',
  'undeclared_attribute',
  'mixed',
  'pedantic',
  'rio',
  'sanitized',
  'v1_3',
  'v1_3_writer',
  'yeast'
];

function loadFile(name) {
  return fs.readFileSync(path.join(__dirname, name + '.gexf'), 'utf-8').trim();
}

var MAP = {};

FILES.forEach(function (file) {
  MAP[file] = loadFile(file);
});

module.exports = MAP;
