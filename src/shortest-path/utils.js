/**
 * Graphology Shortest Path Utils
 * ===============================
 *
 * Miscellaneous shortest-path helper functions.
 */
var returnTrue = function () {
  return true;
};

exports.edgePathFromNodePath = function (graph, nodePath) {
  var l = nodePath.length;

  var i, source, target, edge;

  // Self loops
  if (l < 2) {
    source = nodePath[0];

    edge = graph.multi
      ? graph.findEdge(source, source, returnTrue)
      : graph.edge(source, source);

    if (edge) return [edge];

    return [];
  }

  l--;

  var edgePath = new Array(l);

  for (i = 0; i < l; i++) {
    source = nodePath[i];
    target = nodePath[i + 1];

    edge = graph.multi
      ? graph.findOutboundEdge(source, target, returnTrue)
      : graph.edge(source, target);

    if (edge === undefined)
      throw new Error(
        'graphology-shortest-path: given path is impossible in given graph.'
      );

    edgePath[i] = edge;
  }

  return edgePath;
};
