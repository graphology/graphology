/**
 * Graphology Canvas for the Browser
 * ==================================
 *
 * Browser-specific endpoint exposing some helpers relying on `node-canvas`.
 */
var lib = require('./');
var refineSettings = require('./defaults.js').refineSettings;

function abstractRenderToNewCanvas(asyncVersion, graph, settings, callback) {
  if (arguments.length === 3) {
    callback = settings;
    settings = {};
  }

  settings = refineSettings(settings);

  // Creating context
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', settings.width);
  canvas.setAttribute('height', settings.height);
  canvas.style.width = settings.width;
  canvas.style.height = settings.height;

  var context = canvas.getContext('2d');

  if (!asyncVersion) {
    lib.render(graph, context, settings);
    return canvas;
  }

  return lib.renderAsync(graph, context, settings, function() {
    return callback(null, canvas);
  });
}

exports.renderToNewCanvas = abstractRenderToNewCanvas.bind(null, false);
exports.renderToNewCanvasAsync = abstractRenderToNewCanvas.bind(null, true);
