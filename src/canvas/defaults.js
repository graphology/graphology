var resolveDefaults = require('graphology-utils/defaults');

var DEFAULTS = {
  batchSize: 500,
  padding: 20,
  width: 2048,
  height: 2048,
  nodes: {
    reducer: null,
    defaultColor: '#999'
  },
  edges: {
    reducer: null,
    defaultColor: '#ccc'
  }
};

exports.DEFAULTS = DEFAULTS;

exports.refineSettings = function refineSettings(settings) {
  settings = settings || {};

  var widthWithFallback = settings.width;
  var heightWithFallback = settings.height;

  if (widthWithFallback && !heightWithFallback)
    heightWithFallback = widthWithFallback;

  if (heightWithFallback && !widthWithFallback)
    widthWithFallback = heightWithFallback;

  settings = resolveDefaults({
    ...settings,
    width: widthWithFallback,
    height: heightWithFallback,
  }, DEFAULTS);

  if (!settings.width && !settings.height)
    throw new Error(
      'graphology-canvas: need at least a valid width or height!'
    );

  return settings;
};

exports.DEFAULT_NODE_REDUCER = function (settings, node, attr) {
  var reduced = {
    type: attr.type || 'circle',
    label: attr.label || node,
    x: attr.x,
    y: attr.y,
    size: attr.size || 1,
    color: attr.color || settings.nodes.defaultColor
  };

  if (typeof reduced.x !== 'number' || typeof reduced.y !== 'number')
    throw new Error(
      'graphology-canvas: the "' + node + '" node has no valid x or y position.'
    );

  return reduced;
};

exports.DEFAULT_EDGE_REDUCER = function (settings, edge, attr) {
  var reduced = {
    type: attr.type || 'line',
    size: attr.size || 1,
    color: attr.color || settings.edges.defaultColor
  };

  return reduced;
};
