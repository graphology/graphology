/**
 * Graphology Rotation Layout Helper
 * ==================================
 *
 * Function rotating the coordinates of the graph.
 */
var resolveDefaults = require('graphology-utils/defaults');
var isGraph = require('graphology-utils/is-graph');

/**
 * Constants.
 */
var RAD_CONVERSION = Math.PI / 180;

/**
 * Default options.
 */
var DEFAULTS = {
  dimensions: ['x', 'y'],
  centeredOnZero: false,
  degrees: false
};

/**
 * Abstract function for rotating a graph's coordinates.
 *
 * @param  {Graph}    graph          - Target  graph.
 * @param  {number}   angle          - Rotation angle.
 * @param  {object}   [options]      - Options.
 * @return {object}                  - The positions by node.
 */
function genericRotation(assign, graph, angle, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout/rotation: the given graph is not a valid graphology instance.'
    );

  options = resolveDefaults(options, DEFAULTS);

  if (options.degrees) angle *= RAD_CONVERSION;

  var dimensions = options.dimensions;

  if (!Array.isArray(dimensions) || dimensions.length !== 2)
    throw new Error('graphology-layout/random: given dimensions are invalid.');

  // Handling null graph
  if (graph.order === 0) {
    if (assign) return;

    return {};
  }

  var xd = dimensions[0];
  var yd = dimensions[1];

  var xCenter = 0;
  var yCenter = 0;

  if (!options.centeredOnZero) {
    // Finding bounds of the graph
    var xMin = Infinity;
    var xMax = -Infinity;
    var yMin = Infinity;
    var yMax = -Infinity;

    graph.forEachNode(function (node, attr) {
      var x = attr[xd];
      var y = attr[yd];

      if (x < xMin) xMin = x;
      if (x > xMax) xMax = x;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    });

    xCenter = (xMin + xMax) / 2;
    yCenter = (yMin + yMax) / 2;
  }

  var cos = Math.cos(angle);
  var sin = Math.sin(angle);

  function assignPosition(target) {
    var x = target[xd];
    var y = target[yd];

    target[xd] = xCenter + (x - xCenter) * cos - (y - yCenter) * sin;
    target[yd] = yCenter + (x - xCenter) * sin + (y - yCenter) * cos;

    return target;
  }

  if (!assign) {
    var positions = {};

    graph.forEachNode(function (node, attr) {
      var o = {};
      o[xd] = attr[xd];
      o[yd] = attr[yd];
      positions[node] = assignPosition(o);
    });

    return positions;
  }

  graph.updateEachNodeAttributes(
    function (_, attr) {
      assignPosition(attr);
      return attr;
    },
    {
      attributes: dimensions
    }
  );
}

var rotation = genericRotation.bind(null, false);
rotation.assign = genericRotation.bind(null, true);

module.exports = rotation;
