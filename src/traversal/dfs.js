/**
 * Graphology Traversal DFS
 * =========================
 *
 * Depth-First Search traversal function.
 */
var isGraph = require('graphology-utils/is-graph');
var TraversalRecord = require('./utils').TraversalRecord;

/**
 * DFS traversal in the given graph using a callback function
 *
 * @param {Graph}    graph    - Target graph.
 * @param {function} callback - Iteration callback.
 */
function dfs(graph, callback) {
  if (!isGraph(graph))
    throw new Error('graphology-traversal/dfs: expecting a graphology instance.');

  if (typeof callback !== 'function')
    throw new Error('graphology-traversal/dfs: given callback is not a function.');

  // Early termination
  if (graph.order === 0)
    return;

  var seen = new Set();
  var stack = [];
  var depth, record;

  function neighborCallback(neighbor, attr) {
    if (seen.has(neighbor))
      return;

    seen.add(neighbor);
    stack.push(new TraversalRecord(neighbor, attr, depth + 1));
  }

  graph.forEachNode(function(node, attr) {
    if (seen.has(node))
      return;

    seen.add(node);
    stack.push(new TraversalRecord(node, attr, 0));

    while (stack.length !== 0) {
      record = stack.pop();
      depth = record.depth;

      callback(record.node, record.attributes, depth);

      graph.forEachOutboundNeighbor(record.node, neighborCallback);
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
    throw new Error('graphology-traversal/dfs: expecting a graphology instance.');

  if (typeof callback !== 'function')
    throw new Error('graphology-traversal/dfs: given callback is not a function.');

  // Early termination
  if (graph.order === 0)
    return;

  node = '' + node;

  var seen = new Set();
  var stack = [];
  var depth, record;

  function neighborCallback(neighbor, attr) {
    if (seen.has(neighbor))
      return;

    seen.add(neighbor);
    stack.push(new TraversalRecord(neighbor, attr, depth + 1));
  }

  seen.add(node);
  stack.push(new TraversalRecord(node, graph.getNodeAttributes(node), 0));

  while (stack.length !== 0) {
    record = stack.pop();
    depth = record.depth;

    callback(record.node, record.attributes, depth);

    graph.forEachOutboundNeighbor(record.node, neighborCallback);
  }
}

exports.dfs = dfs;
exports.dfsFromNode = dfsFromNode;
