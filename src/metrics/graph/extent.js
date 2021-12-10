/**
 * Graphology Extent
 * ==================
 *
 * Simple function returning the extent of selected attributes of the graph.
 */
var isGraph = require('graphology-utils/is-graph');

/**
 * Function returning the extent of the selected node attributes.
 *
 * @param  {Graph}        graph     - Target graph.
 * @param  {string|array} attribute - Single or multiple attributes.
 * @return {array|object}
 */
function nodeExtent(graph, attribute) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/extent: the given graph is not a valid graphology instance.'
    );

  var attributes = [].concat(attribute);

  var value, key, a;

  var results = {};

  for (a = 0; a < attributes.length; a++) {
    key = attributes[a];

    results[key] = [Infinity, -Infinity];
  }

  graph.forEachNode(function (node, data) {
    for (a = 0; a < attributes.length; a++) {
      key = attributes[a];
      value = data[key];

      if (value < results[key][0]) results[key][0] = value;

      if (value > results[key][1]) results[key][1] = value;
    }
  });

  return typeof attribute === 'string' ? results[attribute] : results;
}

/**
 * Function returning the extent of the selected edge attributes.
 *
 * @param  {Graph}        graph     - Target graph.
 * @param  {string|array} attribute - Single or multiple attributes.
 * @return {array|object}
 */
function edgeExtent(graph, attribute) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/extent: the given graph is not a valid graphology instance.'
    );

  var attributes = [].concat(attribute);

  var value, key, a;

  var results = {};

  for (a = 0; a < attributes.length; a++) {
    key = attributes[a];

    results[key] = [Infinity, -Infinity];
  }

  graph.forEachEdge(function (edge, data) {
    for (a = 0; a < attributes.length; a++) {
      key = attributes[a];
      value = data[key];

      if (value < results[key][0]) results[key][0] = value;

      if (value > results[key][1]) results[key][1] = value;
    }
  });

  return typeof attribute === 'string' ? results[attribute] : results;
}

/**
 * Exporting.
 */
exports.nodeExtent = nodeExtent;
exports.edgeExtent = edgeExtent;
