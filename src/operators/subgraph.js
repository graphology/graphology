/**
 * Graphology Sub Graph
 * =====================
 *
 * Function returning the subgraph composed of the nodes passed as parameters.
 */
var isGraph = require('graphology-utils/is-graph');
var copyNode = require('graphology-utils/add-node').copyNode;
var copyEdge = require('graphology-utils/add-edge').copyEdge;

module.exports = function subgraph(graph, nodes) {
  if (!isGraph(graph))
    throw new Error('graphology-operators/subgraph: invalid graph instance.');

  var S = graph.nullCopy();

  var filterNode = nodes;

  if (Array.isArray(nodes)) {
    if (nodes.length === 0) return S;

    nodes = new Set(nodes);
  }

  if (nodes instanceof Set) {
    if (nodes.size === 0) return S;

    filterNode = function (key) {
      return nodes.has(key);
    };

    // Ensuring given keys are casted to string
    var old = nodes;
    nodes = new Set();

    old.forEach(function (node) {
      nodes.add('' + node);
    });
  }

  if (typeof filterNode !== 'function')
    throw new Error(
      'graphology-operators/subgraph: invalid nodes. Expecting an array or a set or a filtering function.'
    );

  if (typeof nodes === 'function') {
    graph.forEachNode(function (key, attr) {
      if (!filterNode(key, attr)) return;

      copyNode(S, key, attr);
    });

    // Early termination
    if (S.order === 0) return S;
  } else {
    nodes.forEach(function (key) {
      if (!graph.hasNode(key))
        throw new Error(
          'graphology-operators/subgraph: the "' +
            key +
            '" node was not found in the graph.'
        );

      copyNode(S, key, graph.getNodeAttributes(key));
    });
  }

  graph.forEachEdge(function (
    key,
    attr,
    source,
    target,
    sourceAttr,
    targetAttr,
    undirected
  ) {
    if (!filterNode(source, sourceAttr)) return;

    if (target !== source && !filterNode(target, targetAttr)) return;

    copyEdge(S, undirected, key, source, target, attr);
  });

  return S;
};
