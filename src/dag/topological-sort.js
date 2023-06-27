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

  if (graph.order === 0) return;

  const queue = new FixedDeque(Array, graph.order);
  const inDegrees = {};
  let total = 0;

  graph.forEachNode((node, attr) => {
    const inDegree = graph.inDegree(node);

    if (inDegree === 0) {
      queue.push([node, attr, 0]);
    } else {
      inDegrees[node] = inDegree;
      total += inDegree;
    }
  });

  let currentGeneration = 0;

  function neighborCallback(neighbor, attr) {
    const neighborInDegree = --inDegrees[neighbor];

    total--;

    if (neighborInDegree === 0)
      queue.push([neighbor, attr, currentGeneration + 1]);

    inDegrees[neighbor] = neighborInDegree;

    // NOTE: key deletion is expensive in JS and in this case pointless so
    // we just skip it for performance reasons
  }

  while (queue.size !== 0) {
    const [node, attr, gen] = queue.shift();
    currentGeneration = gen;

    callback(node, attr, gen);

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

function forEachTopologicalGeneration(graph, callback) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-dag/topological-generations: the given graph is not a valid graphology instance.'
    );

  if (graph.order === 0) return;

  let lastGenLevel = 0;
  let lastGen = [];

  forEachNodeInTopologicalOrder(graph, (node, _, gen) => {
    if (gen > lastGenLevel) {
      callback(lastGen);
      lastGenLevel = gen;
      lastGen = [];
    }

    lastGen.push(node);
  });

  callback(lastGen);
}

function topologicalGenerations(graph) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-dag/topological-generations: the given graph is not a valid graphology instance.'
    );

  const generations = [];

  forEachTopologicalGeneration(graph, generation => {
    generations.push(generation);
  });

  return generations;
}

/**
 * Exporting.
 */
exports.topologicalSort = topologicalSort;
exports.forEachNodeInTopologicalOrder = forEachNodeInTopologicalOrder;
exports.topologicalGenerations = topologicalGenerations;
exports.forEachTopologicalGeneration = forEachTopologicalGeneration;
