/**
 * Graphology Layout Utilities
 * ============================
 *
 * Miscellaneous utility functions used by the library.
 */
var isGraph = require('graphology-utils/is-graph');

function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

var DEFAULT_DIMENSIONS = ['x', 'y'];

function collectLayout(graph, options) {
  options = options || {};

  var dimensions = options.dimensions;
  var exhaustive = options.exhaustive !== false;

  if (!dimensions) dimensions = DEFAULT_DIMENSIONS;

  if (!isGraph(graph))
    throw new Error(
      'graphology-layout/utils.collectLayout: the given graph is not a valid graphology instance.'
    );

  var layout = {};
  var l = dimensions.length;

  graph.forEachNode(function (node, attr) {
    var validCoordinates = 0;
    var position = {};

    var i;

    for (i = 0; i < l; i++) {
      var d = dimensions[i];
      var v = attr[d];

      if (isValidNumber(v)) {
        position[d] = v;
        validCoordinates++;
      }
    }

    if (exhaustive) {
      if (validCoordinates === l) layout[node] = position;
    } else if (validCoordinates) {
      layout[node] = position;
    }
  });

  return layout;
}

function assignLayout(graph, layout, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout/utils.assignLayout: the given graph is not a valid graphology instance.'
    );

  options = options || {};
  var dimensions = options.dimensions || DEFAULT_DIMENSIONS;

  var l = dimensions.length;
  var d;

  graph.updateEachNodeAttributes(
    function (node, attr) {
      var position = layout[node];

      if (!position) return attr;

      for (var i = 0; i < l; i++) {
        d = dimensions[i];
        attr[d] = position[d];
      }

      return attr;
    },
    {
      attributes: dimensions
    }
  );
}

// TODO: collect as flat array, fix missing positions

/**
 * Exports.
 */
exports.collectLayout = collectLayout;
exports.assignLayout = assignLayout;
