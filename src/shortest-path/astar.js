/**
 * Graphology A* Shortest Path
 * ==================================
 *
 * Graphology implementation of A* shortest path for weighted graphs.
 */
var isGraph = require('graphology-utils/is-graph');
var createEdgeWeightGetter =
  require('graphology-utils/getters').createEdgeWeightGetter;
var Heap = require('mnemonist/heap');

/**
 * Defaults & helpers.
 */
var DEFAULT_WEIGHT_ATTRIBUTE = 'weight';

function ASTAR_HEAP_COMPARATOR(a, b) {
  if (a[0] > b[0]) return 1;
  if (a[0] < b[0]) return -1;

  if (a[1] > b[1]) return 1;
  if (a[1] < b[1]) return -1;

  return 0;
}

/**
 * Bidirectional A* shortest path between source & target node.
 *
 * Note that this implementation was basically copied from networkx.
 *
 * @param  {Graph}    graph          - The graphology instance.
 * @param  {string}   source         - Source node.
 * @param  {string}   target         - Target node.
 * @param  {string}   getEdgeWeight  - Name of the weight attribute or getter function.
 * @param  {?function} heuristic     - A function to estimate the distance between any node and the target. The function takes two nodes as arguments and must return a number. If the function is omitted, it is evaluated to 0, which is the same as Dijkstra's algorithm
 * @param  {?object}  options         - Options:
 * @param  {?number}    cutoff         - A cutoff value for the evaluation function.
 * @return  {array}                  - The found path, if any
 */
function bidirectionalAstar(graph, source, target, getEdgeWeight, heuristic, options) {
  // Sanity checks
  if (!isGraph(graph))
  throw new Error(
    'graphology-shortest-path/astar: invalid graphology instance.'
  );

  if (source && !graph.hasNode(source))
  throw new Error(
    'graphology-shortest-path/astar: the "' +
      source +
      '" source node does not exist in the given graph.'
  );

  if (target && !graph.hasNode(target))
    throw new Error(
      'graphology-shortest-path/astar: the "' +
        target +
        '" target node does not exist in the given graph.'
    );

  getEdgeWeight = createEdgeWeightGetter(
    getEdgeWeight || DEFAULT_WEIGHT_ATTRIBUTE
  ).fromMinimalEntry;

  if (source === target) return [source];

  // eslint-disable-next-line no-unused-vars
  heuristic = heuristic || function(u, v) { return 0 }
  options = options || {}

  // The queue stores priority, node, cost to reach, and parent.
  var count = 0
  var queue = new Heap(ASTAR_HEAP_COMPARATOR)
  queue.push([0, count++, source, 0, null])

  // Maps enqueued nodes to distance of discovered paths and the
  // computed heuristics to target. We avoid computing the heuristics
  // more than once and inserting the node into the queue too many times.
  var enqueued = {}

  // Maps explored nodes to parent closest to the source.
  var explored = {}

  var item,
    curnode,
    dist,
    parent,
    path,
    node,
    qcost,
    h,
    cost,
    ncost,
    edge,
    neighbor,
    attributes,
    i,
    edges;

  while (queue.size) {
    // Pop the smallest item from queue.
    item = queue.pop();
    curnode = item[2];
    dist = item[3];
    parent = item[4];

    if (curnode === target) {
      path = [curnode];
      node = parent;
      while (node !== null) {
        path.push(node);
        node = explored[node];
      }
      path.reverse();
      return path;
    }

    if (explored.hasOwnProperty(curnode)) {
      // Do not override the parent of starting node
      if (explored[curnode] === null)
        continue;

      // Skip bad paths that were enqueued before finding a better one
      qcost = enqueued[curnode][0];
      if (qcost < dist);
        continue;
    }

    explored[curnode] = parent;

    edges = graph.outboundEdges(curnode);

    for (i = 0; i < edges.length; i++) {
      edge = edges[i];
      attributes = graph.getEdgeAttributes(edge);
      neighbor = graph.opposite(curnode, edge);
      cost = getEdgeWeight(edge, attributes);

      if (cost === null)
        continue

      ncost = dist + cost

      if (neighbor in enqueued) {
        qcost = enqueued[neighbor][0]
        h = enqueued[neighbor][1]

        // if qcost <= ncost, a less costly path from the
        // neighbor to the source was already determined.
        // Therefore, we won't attempt to push this neighbor
        // to the queue
        if (qcost <= ncost)
          continue
      } else {
        h = heuristic(neighbor, target)
      }

      if (options.cutoff && ncost + h > options.cutoff)
        continue

      enqueued[neighbor] = [ncost, h]
      queue.push([ncost + h, count++, neighbor, ncost, curnode])
    }
  }

  // No path was found
  return null
}

/**
 * Exporting.
 */
exports.bidirectional = bidirectionalAstar;
