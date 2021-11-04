/**
 * Graphology SVG Endpoint
 * =======================
 */
var fs = require('fs');
var resolveDefaults = require('graphology-utils/defaults');
var renderer = require('./renderer.js');

var DEFAULTS = require('./defaults.js').DEFAULTS;

module.exports = function render(graph, outputPath, settings, callback) {
  if (arguments.length === 3) {
    callback = settings;
    settings = {};
  }

  settings = resolveDefaults(settings, DEFAULTS);

  fs.writeFile(outputPath, renderer(graph, settings), function (err) {
    callback(err);
  });
};
