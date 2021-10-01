/**
 * Graphology Circular Layout
 * ===========================
 *
 * Layout arranging the nodes in a circle.
 */
var defaults = require('lodash/defaultsDeep'),
    isGraph = require('graphology-utils/is-graph');

/**
 * Default options.
 */
var DEFAULTS = {
  attributes: {
    x: 'x',
    y: 'y'
  },
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
    throw new Error('graphology-layout/random: the given graph is not a valid graphology instance.');

  options = defaults(options, DEFAULTS);

  var positions = {},
      nodes = graph.nodes(),
      center = options.center,
      scale = options.scale,
      tau = Math.PI * 2;

  var l = nodes.length,
      node,
      x,
      y,
      i;

  for (i = 0; i < l; i++) {
    node = nodes[i];

    x = scale * Math.cos(i * tau / l);
    y = scale * Math.sin(i * tau / l);

    if (center !== 0.5) {
      x += center - 0.5 * scale;
      y += center - 0.5 * scale;
    }

    positions[node] = {
      x: x,
      y: y
    };

    if (assign) {
      graph.setNodeAttribute(node, options.attributes.x, x);
      graph.setNodeAttribute(node, options.attributes.y, y);
    }
  }

  return positions;
}

var circularLayout = genericCircularLayout.bind(null, false);
circularLayout.assign = genericCircularLayout.bind(null, true);

module.exports = circularLayout;
