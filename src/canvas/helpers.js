/**
 * Graphology Canvas Helpers
 * ==========================
 *
 * Micellaneous helper functions used throughout the library.
 */
var defaults = require('./defaults.js');

var CAMERA = {
  x: 0.5,
  y: 0.5,
  angle: 0,
  ratio: 1
};

function reduceNodes(graph, settings) {
  var containerWidth = settings.width,
      containerHeight = settings.height;

  var xMin = Infinity,
      xMax = -Infinity,
      yMin = Infinity,
      yMax = -Infinity;

  var data = {};

  graph.forEachNode(function(node, attr) {

    // Applying user's reducing logic
    if (typeof settings.nodes.reducer === 'function')
      attr = settings.nodes.reducer(settings, node, attr);

    attr = defaults.DEFAULT_NODE_REDUCER(settings, node, attr);
    data[node] = attr;

    // Finding bounds
    if (attr.x < xMin)
      xMin = attr.x;
    if (attr.x > xMax)
      xMax = attr.x;
    if (attr.y < yMin)
      yMin = attr.y;
    if (attr.y > yMax)
      yMax = attr.y;
  });

  var graphWidth = xMax - xMin,
      graphHeight = yMax - yMin;

  var ratio = Math.max(graphWidth, graphHeight) || 1;

  var dX = (xMax + xMin) / 2;
  var dY = (yMax + yMin) / 2;

  containerWidth -= settings.margin * 2;
  containerHeight -= settings.margin * 2;

  var smallest = Math.min(containerWidth, containerHeight);

  var dpX = smallest / containerWidth;
  var dpY = smallest / containerHeight;
  var dpRatio = CAMERA.ratio / smallest;

  var k, n;
  var x, y;

  for (k in data) {
    n = data[k];

    // Normalize
    x = 0.5 + (n.x - dX) / ratio;
    y = 0.5 + (n.y - dY) / ratio;

    // Align
    x = (x - CAMERA.x) / dpRatio;
    y = (CAMERA.y - y) / dpRatio;

    // Rotate
    x = x * Math.cos(CAMERA.angle) - y * Math.sin(CAMERA.angle);
    y = y * Math.cos(CAMERA.angle) + x * Math.sin(CAMERA.angle);

    n.x = settings.margin + x + smallest / 2 / dpX;
    n.y = settings.margin + y + smallest / 2 / dpY;
  }

  return data;
}

exports.reduceNodes = reduceNodes;
