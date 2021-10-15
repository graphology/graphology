var DEFAULTS = {
  margin: 20,
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

exports.DEFAULT_NODE_REDUCER = function (settings, node, attr) {
  var reduced = {
    type: attr.type || 'circle',
    labelType: attr.labelType || 'default',
    label: attr.label || node,
    x: attr.x,
    y: attr.y,
    size: attr.size || 1,
    color: attr.color || settings.nodes.defaultColor
  };

  if (typeof reduced.x !== 'number' || typeof reduced.y !== 'number')
    throw new Error(
      'graphology-svg: the "' +
        node +
        '" node has no valid x or y position. Expecting a number.'
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
