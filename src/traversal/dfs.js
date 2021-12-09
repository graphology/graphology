/**
 * Graphology Traversal DFS
 * =========================
 *
 * Depth-First Search traversal function.
 */
var isGraph = require('graphology-utils/is-graph');
var DFSStack = require('graphology-indices/dfs-stack');
var TraversalRecord = require('./utils').TraversalRecord;

/**
 * DFS traversal in the given graph using a callback function
 *
 * @param {Graph}    graph    - Target graph.
 * @param {function} callback - Iteration callback.
 */
function dfs(graph, callback) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-traversal/dfs: expecting a graphology instance.'
    );

  if (typeof callback !== 'function')
    throw new Error(
      'graphology-traversal/dfs: given callback is not a function.'
    );

  // Early termination
  if (graph.order === 0) return;

  var stack = new DFSStack(graph.order);
  var record, stop;

  function visit(neighbor, attr) {
    stack.pushWith(
      neighbor,
      new TraversalRecord(neighbor, attr, record.depth + 1)
    );
  }

  graph.forEachNode(function (node, attr) {
    if (stack.has(node)) return;

    stack.pushWith(node, new TraversalRecord(node, attr, 0));

    while (stack.size !== 0) {
      record = stack.pop();

      stop = callback(record.node, record.attributes, record.depth);

      if (stop === true) continue;

      graph.forEachOutboundNeighbor(record.node, visit);
    }
  });
}

/**
 * DFS traversal in the given graph, starting from the given node, using a
 * callback function.
 *
 * @param {Graph}    graph    - Target graph.
 * @param {string}   node     - Starting node.
 * @param {function} callback - Iteration callback.
 */
function dfsFromNode(graph, node, callback) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-traversal/dfs: expecting a graphology instance.'
    );

  if (typeof callback !== 'function')
    throw new Error(
      'graphology-traversal/dfs: given callback is not a function.'
    );

  // Early termination
  if (graph.order === 0) return;

  node = '' + node;

  var stack = new DFSStack(graph.order);
  var record, stop;

  function visit(neighbor, attr) {
    stack.pushWith(
      neighbor,
      new TraversalRecord(neighbor, attr, record.depth + 1)
    );
  }

  stack.pushWith(
    node,
    new TraversalRecord(node, graph.getNodeAttributes(node), 0)
  );

  while (stack.size !== 0) {
    record = stack.pop();

    stop = callback(record.node, record.attributes, record.depth);

    if (stop === true) continue;

    graph.forEachOutboundNeighbor(record.node, visit);
  }
}

exports.dfs = dfs;
exports.dfsFromNode = dfsFromNode;
