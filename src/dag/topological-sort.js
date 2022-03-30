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

module.exports = function topologicalSort(graph) {
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

  const sortedNodes = new Array(graph.order);
  const queue = new FixedDeque(Array, graph.order);
  const inDegrees = {};
  let total = 0;

  graph.forEachNode(node => {
    const inDegree = graph.inDegree(node);

    if (inDegree === 0) {
      queue.push(node);
    } else {
      inDegrees[node] = inDegree;
      total += inDegree;
    }
  });

  let i = 0;

  function neighborCallback(neighbor) {
    const neighborInDegree = --inDegrees[neighbor];

    total--;

    if (neighborInDegree === 0) queue.push(neighbor);

    inDegrees[neighbor] = neighborInDegree;

    // NOTE: key deletion is expensive in JS and in this case pointless so
    // we just skip it for performance reasons
  }

  while (queue.size !== 0) {
    const node = queue.shift();
    sortedNodes[i++] = node;

    graph.forEachOutNeighbor(node, neighborCallback);
  }

  if (total !== 0)
    throw new Error(
      'graphology-dag/topological-sort: given graph is not acyclic.'
    );

  return sortedNodes;
};
