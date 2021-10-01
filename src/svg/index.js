/**
 * Graphology SVG Endpoint
 * =======================
 */
var fs = require('fs');
var defaultsDeep = require('lodash/defaultsDeep');
var renderer = require('./renderer.js');

var DEFAULTS = require('./defaults.js').DEFAULTS;

module.exports = function render(graph, outputPath, settings, callback) {
  if (arguments.length === 3) {
    callback = settings;
    settings = {};
  }

  settings = defaultsDeep({}, DEFAULTS, settings);

  fs.writeFile(outputPath, renderer(graph, settings), function(err) {
    callback(err);
  });
};
