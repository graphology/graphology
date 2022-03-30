/**
 * Graphology Topological Sort
 * ============================
 *
 * Function performing topological sort over the given DAG using Kahn's
 * algorithm.
 *
 * This function also works on disconnected graphs.
 *
 * [Reference]:
 * https://en.wikipedia.org/wiki/Topological_sorting
 */
const isGraph = require('graphology-utils/is-graph');
const FixedDeque = require('mnemonist/fixed-deque');

function forEachNodeInTopologicalOrder(graph, callback) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-dag/topological-sort: the given graph is not a valid graphology instance.'
    );

  // NOTE: falsely mixed graph representing directed graphs will work
  if (graph.type === 'undirected' || graph.undirectedSize !== 0)
    throw new Error(
      'graphology-dag/topological-sort: cannot work if graph is not directed.'
    );

  if (graph.multi)
    throw new Error(
      'graphology-dag/topological-sort: cannot work with multigraphs.'
    );

  const queue = new FixedDeque(Array, graph.order);
  const inDegrees = {};
  let total = 0;

  graph.forEachNode((node, attr) => {
    const inDegree = graph.inDegree(node);

    if (inDegree === 0) {
      queue.push([node, attr]);
    } else {
      inDegrees[node] = inDegree;
      total += inDegree;
    }
  });

  function neighborCallback(neighbor, attr) {
    const neighborInDegree = --inDegrees[neighbor];

    total--;

    if (neighborInDegree === 0) queue.push([neighbor, attr]);

    inDegrees[neighbor] = neighborInDegree;

    // NOTE: key deletion is expensive in JS and in this case pointless so
    // we just skip it for performance reasons
  }

  while (queue.size !== 0) {
    const [node, attr] = queue.shift();

    callback(node, attr);

    graph.forEachOutNeighbor(node, neighborCallback);
  }

  if (total !== 0)
    throw new Error(
      'graphology-dag/topological-sort: given graph is not acyclic.'
    );
}

function topologicalSort(graph) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-dag/topological-sort: the given graph is not a valid graphology instance.'
    );

  const sortedNodes = new Array(graph.order);
  let i = 0;

  forEachNodeInTopologicalOrder(graph, node => {
    sortedNodes[i++] = node;
  });

  return sortedNodes;
}

/**
 * Exporting.
 */
exports.topologicalSort = topologicalSort;
exports.forEachNodeInTopologicalOrder = forEachNodeInTopologicalOrder;
