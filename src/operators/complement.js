/**
 * Graphology Complement Operator
 * ===============================
 *
 * Function returning the complement of an undirected simple graph.
 * The complement graph has the same nodes but edges exist between
 * two nodes if and only if they are not connected in the original graph.
 */
var isGraph = require('graphology-utils/is-graph');

/**
 * Function computing the complement of the given graph.
 *
 * @param  {Graph} graph - Target graph (must be undirected and simple).
 * @return {Graph}
 */
module.exports = function complement(graph) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-operators/complement: invalid graph instance.'
    );

  if (graph.type !== 'undirected')
    throw new Error(
      'graphology-operators/complement: the graph must be undirected.'
    );

  if (graph.multi)
    throw new Error(
      'graphology-operators/complement: the graph must be simple (not multi).'
    );

  var i, j, l, source, target, sourceAdj;

  // Use emptyCopy to efficiently copy all nodes (native level, no JS iteration)
  var complementGraph = graph.emptyCopy({ type: 'undirected' });

  var nodes = graph.nodes();
  l = nodes.length;

  // Early exit for small graphs
  if (l < 2)
    return complementGraph;

  // Pre-build adjacency objects for O(1) edge lookup without graph.hasEdge overhead
  var adjacency = {};

  for (i = 0; i < l; i++)
    adjacency[nodes[i]] = {};

  graph.forEachEdge(function (key, attr, s, t) {
    adjacency[s][t] = true;
    adjacency[t][s] = true;
  });

  // For each pair of distinct nodes, add an edge if not adjacent in original
  for (i = 0; i < l; i++) {
    source = nodes[i];
    sourceAdj = adjacency[source];

    for (j = i + 1; j < l; j++) {
      target = nodes[j];

      if (!sourceAdj[target])
        complementGraph.addEdge(source, target);
    }
  }

  return complementGraph;
};
