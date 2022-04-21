/**
 * Graphology Traversal BFS
 * =========================
 *
 * Breadth-First Search traversal function.
 */
var isGraph = require('graphology-utils/is-graph');
var BFSQueue = require('graphology-indices/bfs-queue');
var utils = require('./utils');

var TraversalRecord = utils.TraversalRecord;
var capitalize = utils.capitalize;

/**
 * BFS traversal in the given graph using a callback function
 *
 * @param {Graph}    graph        - Target graph.
 * @param {string}   startingNode - Optional Starting node.
 * @param {function} callback     - Iteration callback.
 * @param {object}   options      - Options:
 * @param {string}     mode         - Traversal mode.
 */
function abstractBfs(graph, startingNode, callback, options) {
  options = options || {};

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

  var queue = new BFSQueue(graph);

  var forEachNeighbor =
    graph['forEach' + capitalize(options.mode || 'outbound') + 'Neighbor'].bind(
      graph
    );

  var forEachNode;

  if (startingNode === null) {
    forEachNode = queue.forEachNodeYetUnseen.bind(queue);
  } else {
    forEachNode = function (fn) {
      startingNode = '' + startingNode;
      fn(startingNode, graph.getNodeAttributes(startingNode));
    };
  }

  var record, stop;

  function visit(neighbor, attr) {
    queue.pushWith(
      neighbor,
      new TraversalRecord(neighbor, attr, record.depth + 1)
    );
  }

  forEachNode(function (node, attr) {
    queue.pushWith(node, new TraversalRecord(node, attr, 0));

    while (queue.size !== 0) {
      record = queue.shift();

      stop = callback(record.node, record.attributes, record.depth);

      if (stop === true) continue;

      forEachNeighbor(record.node, visit);
    }
  });
}

exports.bfs = function (graph, callback, options) {
  return abstractBfs(graph, null, callback, options);
};
exports.bfsFromNode = abstractBfs;
