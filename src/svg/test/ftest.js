/* eslint no-console: 0 */
/**
 * Graphology SVG Functional Tests
 * ===============================
 */
var fs = require('fs-extra');
var Graph = require('graphology');
var gexf = require('graphology-gexf');
var path = require('path');
var render = require('../');

var OUTPUT_PATH = path.join(__dirname, 'output');
var ARCTIC_PATH = path.join(__dirname, 'resources', 'arctic.gexf');
var RENDER_PATH = path.join(OUTPUT_PATH, 'arctic.svg');

fs.removeSync(OUTPUT_PATH);
fs.ensureDirSync(OUTPUT_PATH);

var ARCTIC = gexf.parse(Graph, fs.readFileSync(ARCTIC_PATH, 'utf-8'));

console.log('Rendering arctic.gexf...');

render(ARCTIC, RENDER_PATH, {width: 4096, height: 4096}, function () {
  console.log('Done!');
});
