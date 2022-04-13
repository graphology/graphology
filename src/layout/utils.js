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

  var mapping = {};

  graph.forEachNode(function (node, attr) {
    var validCoordinates = 0;
    var position = {};

    var i, l;

    for (i = 0, l = dimensions.length; i < l; i++) {
      var d = dimensions[i];
      var v = attr[d];

      if (isValidNumber(v)) {
        position[d] = v;
        validCoordinates++;
      }
    }

    if (exhaustive) {
      if (validCoordinates === l) mapping[node] = position;
    } else if (validCoordinates) {
      mapping[node] = position;
    }
  });

  return mapping;
}

/**
 * Exports.
 */
exports.collectLayout = collectLayout;
