/**
 * Graphology Canvas Helpers
 * ==========================
 *
 * Micellaneous helper functions used throughout the library.
 */
var helpers = require('graphology-layout/conversion');
var defaults = require('./defaults.js');

var createGraphToViewportConversionFunction =
  helpers.createGraphToViewportConversionFunction;

function reduceNodes(graph, settings) {
  var containerWidth = settings.width;
  var containerHeight = settings.height;

  var xMin = Infinity;
  var xMax = -Infinity;
  var yMin = Infinity;
  var yMax = -Infinity;

  var data = {};

  graph.forEachNode(function (node, attr) {
    // Applying user's reducing logic
    if (typeof settings.nodes.reducer === 'function')
      attr = settings.nodes.reducer(settings, node, attr);

    attr = defaults.DEFAULT_NODE_REDUCER(settings, node, attr);
    data[node] = attr;

    // Finding bounds
    var x = attr.x;
    var y = attr.y;

    if (x < xMin) xMin = x;
    if (x > xMax) xMax = x;
    if (y < yMin) yMin = y;
    if (y > yMax) yMax = y;
  });

  var conversion = createGraphToViewportConversionFunction(
    {
      x: [xMin, xMax],
      y: [yMin, yMax]
    },
    {width: containerWidth, height: containerHeight},
    {padding: settings.padding}
  );

  for (var n in data) {
    conversion.assign(data[n]);
  }

  return data;
}

exports.reduceNodes = reduceNodes;
