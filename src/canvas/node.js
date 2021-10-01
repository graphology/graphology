/**
 * Graphology Canvas for Node.js
 * ==============================
 *
 * Node.js-specific endpoint exposing some helpers relying on `node-canvas`.
 */
var fs = require('fs');
var canvasApi = require('canvas');
var lib = require('./');
var refineSettings = require('./defaults.js').refineSettings;

exports.renderToPNG = function renderToPNG(graph, outputPath, settings, callback) {
  if (arguments.length === 3) {
    callback = settings;
    settings = {};
  }

  settings = refineSettings(settings);

  // Creating context
  var canvas = canvasApi.createCanvas(settings.width, settings.height);
  var context = canvas.getContext('2d');

  lib.render(graph, context, settings);

  var out = fs.createWriteStream(outputPath);
  var pngStream = canvas.createPNGStream();

  pngStream.pipe(out);

  out.once('finish', function() {
    callback();
  });
};
