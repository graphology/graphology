/**
 * Graphology Traversal BFS
 * =========================
 *
 * Breadth-First Search traversal function.
 */
var isGraph = require('graphology-utils/is-graph');
var FixedDeque = require('mnemonist/fixed-deque');
var TraversalRecord = require('./utils').TraversalRecord;

/**
 * BFS traversal in the given graph using a callback function
 *
 * @param {Graph}    graph    - Target graph.
 * @param {function} callback - Iteration callback.
 */
function bfs(graph, callback) {
  if (!isGraph(graph))
    throw new Error('graphology-traversal/bfs: expecting a graphology instance.');

  if (typeof callback !== 'function')
    throw new Error('graphology-traversal/bfs: given callback is not a function.');

  // Early termination
  if (graph.order === 0)
    return;

  var seen = new Set();
  var queue = new FixedDeque(Array, graph.order);
  var record, depth;

  function neighborCallback(neighbor, attr) {
    if (seen.has(neighbor))
      return;

    seen.add(neighbor);
    queue.push(new TraversalRecord(neighbor, attr, depth + 1));
  }

  graph.forEachNode(function(node, attr) {
    if (seen.has(node))
      return;

    seen.add(node);
    queue.push(new TraversalRecord(node, attr, 0));

    while (queue.size !== 0) {
      record = queue.shift();
      depth = record.depth;

      callback(record.node, record.attributes, depth);

      graph.forEachOutboundNeighbor(record.node, neighborCallback);
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
    throw new Error('graphology-traversal/dfs: expecting a graphology instance.');

  if (typeof callback !== 'function')
    throw new Error('graphology-traversal/dfs: given callback is not a function.');

  // Early termination
  if (graph.order === 0)
    return;

  node = '' + node;

  var seen = new Set();
  var queue = new FixedDeque(Array, graph.order);
  var depth, record;

  function neighborCallback(neighbor, attr) {
    if (seen.has(neighbor))
      return;

    seen.add(neighbor);
    queue.push(new TraversalRecord(neighbor, attr, depth + 1));
  }

  seen.add(node);
  queue.push(new TraversalRecord(node, graph.getNodeAttributes(node), 0));

  while (queue.size !== 0) {
    record = queue.shift();
    depth = record.depth;

    callback(record.node, record.attributes, depth);

    graph.forEachOutboundNeighbor(record.node, neighborCallback);
  }
}

exports.bfs = bfs;
exports.bfsFromNode = bfsFromNode;
