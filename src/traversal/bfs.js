/**
 * Graphology Traversal BFS
 * =========================
 *
 * Breadth-First Search traversal function.
 */
var isGraph = require('graphology-utils/is-graph');
var BFSQueue = require('graphology-indices/bfs-queue');
var TraversalRecord = require('./utils').TraversalRecord;

/**
 * BFS traversal in the given graph using a callback function
 *
 * @param {Graph}    graph    - Target graph.
 * @param {function} callback - Iteration callback.
 */
function bfs(graph, callback) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-traversal/bfs: expecting a graphology instance.'
    );

  if (typeof callback !== 'function')
    throw new Error(
      'graphology-traversal/bfs: given callback is not a function.'
    );

  // Early termination
  if (graph.order === 0) return;

  var queue = new BFSQueue(graph.order);
  var record, stop;

  function visit(neighbor, attr) {
    queue.pushWith(
      neighbor,
      new TraversalRecord(neighbor, attr, record.depth + 1)
    );
  }

  graph.forEachNode(function (node, attr) {
    if (queue.has(node)) return;

    queue.pushWith(node, new TraversalRecord(node, attr, 0));

    while (queue.size !== 0) {
      record = queue.shift();

      stop = callback(record.node, record.attributes, record.depth);

      if (stop === true) continue;

      graph.forEachOutboundNeighbor(record.node, visit);
    }
  });
}

/**
 * BFS traversal in the given graph, starting from the given node, using a
 * callback function.
 *
 * @param {Graph}    graph    - Target graph.
 * @param {string}   node     - Starting node.
 * @param {function} callback - Iteration callback.
 */
function bfsFromNode(graph, node, callback) {
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

  var queue = new BFSQueue(graph.order);
  var record, stop;

  function visit(neighbor, attr) {
    queue.pushWith(
      neighbor,
      new TraversalRecord(neighbor, attr, record.depth + 1)
    );
  }

  queue.pushWith(
    node,
    new TraversalRecord(node, graph.getNodeAttributes(node), 0)
  );

  while (queue.size !== 0) {
    record = queue.shift();

    stop = callback(record.node, record.attributes, record.depth);

    if (stop === true) continue;

    graph.forEachOutboundNeighbor(record.node, visit);
  }
}

exports.bfs = bfs;
exports.bfsFromNode = bfsFromNode;
