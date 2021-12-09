/**
 * Graphology Simmelian Strength
 * ==============================
 *
 * Function computing the Simmelian strength, i.e. the number of triangles in
 * which an edge stands, for each edge in a given graph.
 */
var isGraph = require('graphology-utils/is-graph');
var intersectionSize = require('mnemonist/set').intersectionSize;

function abstractSimmelianStrength(assign, graph) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-metrics/simmelian-strength: given graph is not a valid graphology instance.'
    );

  // Indexing neighborhoods
  var neighborhoods = {};

  graph.forEachNode(function (node) {
    neighborhoods[node] = new Set(graph.neighbors(node));
  });

  if (!assign) {
    var strengths = {};

    graph.forEachEdge(function (edge, _, source, target) {
      strengths[edge] = intersectionSize(
        neighborhoods[source],
        neighborhoods[target]
      );
    });

    return strengths;
  }

  graph.updateEachEdgeAttributes(
    function (_, attr, source, target) {
      attr.simmelianStrength = intersectionSize(
        neighborhoods[source],
        neighborhoods[target]
      );

      return attr;
    },
    {attributes: ['simmelianStrength']}
  );
}

var simmelianStrength = abstractSimmelianStrength.bind(null, false);
simmelianStrength.assign = abstractSimmelianStrength.bind(null, true);

module.exports = simmelianStrength;
