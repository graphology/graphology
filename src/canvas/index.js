/**
 * Graphology Canvas Endpoint
 * ===========================
 *
 * Publicly-exposed routine used to render the given graph into an arbitrary
 * canvas context.
 */
var isGraph = require('graphology-utils/is-graph');
var lib = require('./renderer.js');
var refineSettings = require('./defaults.js').refineSettings;

exports.render = function render(graph, context, settings) {
  if (!isGraph(graph))
    throw new Error('graphology-canvas/render: expecting a valid graphology instance.');

  settings = refineSettings(settings);

  lib.renderSync(graph, context, settings);
};

exports.renderAsync = function renderAsync(graph, context, settings, callback) {
  if (arguments.length === 3) {
    callback = settings;
    settings = {};
  }

  settings = refineSettings(settings);

  lib.renderAsync(graph, context, settings, callback);
};
