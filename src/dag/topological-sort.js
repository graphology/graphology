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

  const inDegrees = {};
  let generation = [];
  let generationLevel = 0;
  let total = 0;

  graph.forEachNode((node, attr) => {
    const inDegree = graph.inDegree(node);

    if (inDegree === 0) {
      generation.push([node, attr]);
    } else {
      inDegrees[node] = inDegree;
      total += inDegree;
    }
  });

  function neighborCallback(neighbor, attr) {
    const neighborInDegree = --inDegrees[neighbor];

    total--;

    if (neighborInDegree === 0) generation.push([neighbor, attr]);

    inDegrees[neighbor] = neighborInDegree;

    // NOTE: key deletion is expensive in JS and in this case pointless so
    // we just skip it for performance reasons
  }

  while (generation.length !== 0) {
    const currentGenerationLevel = generationLevel;
    const currentGeneration = generation
    generation = [];

    currentGeneration.forEach(nobject => {
        const [node, attr] = nobject;
        graph.forEachOutNeighbor(node, neighborCallback);
        callback(node, attr, currentGenerationLevel);
    });

    generationLevel++;
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

    let lastGenLevel = 0;
    let lastGen = new Set();

    forEachNodeInTopologicalOrder(graph, (node, _, gen) => {
      if (gen > lastGenLevel) {
        callback(lastGen);
        lastGenLevel = gen;
        lastGen = new Set();
      }

      lastGen.add(node);
    });

    callback(lastGen);
}

function topologicalGenerations(graph) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-dag/topological-generations: the given graph is not a valid graphology instance.'
    );

  const generations = [];

  let lastGenLevel = 0;
  let lastGen = new Set();

  forEachNodeInTopologicalOrder(graph, (node, _, gen) => {
    if (gen > lastGenLevel) {
      generations.push(lastGen);
      lastGenLevel = gen;
      lastGen = new Set();
    }

    lastGen.add(node);
  });

  generations.push(lastGen);
  return generations;
}

/**
 * Exporting.
 */
exports.topologicalSort = topologicalSort;
exports.forEachNodeInTopologicalOrder = forEachNodeInTopologicalOrder;
exports.topologicalGenerations = topologicalGenerations;
exports.forEachTopologicalGeneration = forEachTopologicalGeneration;
