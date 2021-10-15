/* eslint no-console: 0 */
/**
 * Graphology Canvas Functional Tests
 * ===================================
 */
var fs = require('fs-extra');
var Graph = require('graphology');
var gexf = require('graphology-gexf');
var canvasApi = require('canvas');
var path = require('path');
var lib = require('../');
var renderToPNG = require('../node.js').renderToPNG;

var OUTPUT_PATH = path.join(__dirname, 'output');
var ARCTIC_PATH = path.join(__dirname, 'resources', 'arctic.gexf');
var RENDER_PATH = path.join(OUTPUT_PATH, 'arctic.png');

fs.ensureDirSync(OUTPUT_PATH);

var ARCTIC = gexf.parse(Graph, fs.readFileSync(ARCTIC_PATH, 'utf-8'));

console.log('Rendering arctic.gexf...');

renderToPNG(ARCTIC, RENDER_PATH, {width: 4096}, function () {
  console.log('Done rendering arctic!');
});

console.log('Rendering with default settings...');

renderToPNG(ARCTIC, path.join(OUTPUT_PATH, 'defaults.png'), function () {
  console.log('Done rendering with default settings!');
});

console.log('Rendering async...');

var canvas = canvasApi.createCanvas(4096, 2048);
var context = canvas.getContext('2d');

lib.renderAsync(ARCTIC, context, {width: 4096, height: 2048}, function () {
  console.log('Done rendering asynchronously!');

  var out = fs.createWriteStream(path.join(OUTPUT_PATH, 'async.png'));
  var pngStream = canvas.createPNGStream();

  pngStream.pipe(out);
});
