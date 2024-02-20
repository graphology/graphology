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

function simpleInDegree(graph, node) {
  let degree = 0;

  graph.forEachInNeighbor(node, () => {
    degree++;
  });

  return degree;
}

function topologicalWalkFull(graph, callback) {
  const queue = new FixedDeque(Array, graph.order);
  const inDegrees = {};
  let total = 0;

  graph.forEachNode((node, attr) => {
    const inDegree = graph.multi
      ? simpleInDegree(graph, node)
      : graph.inDegree(node);

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

function topologicalWalkInternal(graph, root, callback) {
  const queue = new FixedDeque(Array, graph.order);
  const inDegrees = {};

  function waitForParentEdge(node) {
    if (node in inDegrees) {
      inDegrees[node]++;
    } else {
      inDegrees[node] = 1;
    }
  }

  graph.forEachNode((node, attr) => {
    if (node === root) {
      queue.push([node, attr, 0]);
      graph.forEachOutNeighbor(node, waitForParentEdge);
    }
  });

  let currentGeneration = 0;

  function neighborCallback(neighbor, attr) {
    const neighborInDegree = --inDegrees[neighbor];
    if (neighborInDegree === 0) {
      queue.push([neighbor, attr, currentGeneration + 1]);
      graph.forEachOutNeighbor(neighbor, waitForParentEdge);
    }

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
}

function forEachNodeInTopologicalOrder(graph, callback, root) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-dag/topological-sort: the given graph is not a valid graphology instance.'
    );

  // NOTE: falsely mixed graph representing directed graphs will work
  if (graph.type === 'undirected' || graph.undirectedSize !== 0)
    throw new Error(
      'graphology-dag/topological-sort: cannot work if graph is not directed.'
    );

  if (graph.order === 0) return;

  if (root === undefined) {
    topologicalWalkFull(graph, callback); // O(n * b)
  } else {
    topologicalWalkInternal(graph, '' + root, callback); // O(n * b^2) but n might be smaller
  }
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

function forEachTopologicalGeneration(graph, callback, root) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-dag/topological-generations: the given graph is not a valid graphology instance.'
    );

  if (graph.order === 0) return;

  let lastGenLevel = 0;
  let lastGen = [];

  function loopBody(node, _, gen) {
    if (gen > lastGenLevel) {
      callback(lastGen);
      lastGenLevel = gen;
      lastGen = [];
    }

    lastGen.push(node);
  }

  forEachNodeInTopologicalOrder(graph, loopBody, root);

  callback(lastGen);
}

function topologicalGenerations(graph, root) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-dag/topological-generations: the given graph is not a valid graphology instance.'
    );

  const generations = [];

  forEachTopologicalGeneration(graph, generations.push.bind(generations), root);

  return generations;
}

/**
 * Exporting.
 */
exports.topologicalSort = topologicalSort;
exports.forEachNodeInTopologicalOrder = forEachNodeInTopologicalOrder;
exports.topologicalGenerations = topologicalGenerations;
exports.forEachTopologicalGeneration = forEachTopologicalGeneration;
