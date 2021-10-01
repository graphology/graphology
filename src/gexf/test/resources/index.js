/**
 * Graphology GEXF Unit Tests Resources
 * =====================================
 */
var fs = require('fs'),
    path = require('path');

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
  'mixed',
  'rio',
  'sanitized',
  'yeast'
];

function loadFile(name) {
  return fs.readFileSync(
    path.join(__dirname, name + '.gexf'),
    'utf-8'
  ).trim();
}

var MAP = {};

FILES.forEach(function(file) {
  MAP[file] = loadFile(file);
});

module.exports = MAP;
