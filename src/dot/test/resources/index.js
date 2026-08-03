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
  'directed_writer',
  'escaped_attrs',
  'boolean_attrs',
  'edge_chain',
  'subgraph',
  'default_attrs',
  'mixed',
  'implicit_nodes',
  'escaped_attrs_writer',
  'boolean_attrs_writer',
  'mixed_writer'
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
