/**
 * Graphology Circular Layout
 * ===========================
 *
 * Layout arranging the nodes in a circle.
 */
var resolveDefaults = require('graphology-utils/defaults');
var isGraph = require('graphology-utils/is-graph');

/**
 * Default options.
 */
var DEFAULTS = {
  dimensions: ['x', 'y'],
  center: 0.5,
  scale: 1
};

/**
 * Abstract function running the layout.
 *
 * @param  {Graph}    graph          - Target  graph.
 * @param  {object}   [options]      - Options:
 * @param  {object}     [attributes] - Attributes names to map.
 * @param  {number}     [center]     - Center of the layout.
 * @param  {number}     [scale]      - Scale of the layout.
 * @return {object}                  - The positions by node.
 */
function genericCircularLayout(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout/random: the given graph is not a valid graphology instance.'
    );

  options = resolveDefaults(options, DEFAULTS);

  var dimensions = options.dimensions;

  if (!Array.isArray(dimensions) || dimensions.length !== 2)
    throw new Error('graphology-layout/random: given dimensions are invalid.');

  var center = options.center;
  var scale = options.scale;
  var tau = Math.PI * 2;

  var offset = (center - 0.5) * scale;
  var l = graph.order;

  var x = dimensions[0];
  var y = dimensions[1];

  function assignPosition(i, target) {
    target[x] = scale * Math.cos((i * tau) / l) + offset;
    target[y] = scale * Math.sin((i * tau) / l) + offset;

    return target;
  }

  var i = 0;

  if (!assign) {
    var positions = {};

    graph.forEachNode(function (node) {
      positions[node] = assignPosition(i++, {});
    });

    return positions;
  }

  graph.updateEachNodeAttributes(
    function (_, attr) {
      assignPosition(i++, attr);
      return attr;
    },
    {
      attributes: dimensions
    }
  );
}

var circularLayout = genericCircularLayout.bind(null, false);
circularLayout.assign = genericCircularLayout.bind(null, true);

module.exports = circularLayout;
