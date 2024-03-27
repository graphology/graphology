/**
 * Graphology Cores
 * =================
 *
 * Functions computing the metrics related to the k-cores
 * of a given graph.
 */
const isGraph = require('graphology-utils/is-graph');
const subgraph = require('graphology-operators/subgraph');

function coreNumber(assign, graph, coreAttribute) {
  coreAttribute = coreAttribute || 'core';

  if (!isGraph(graph))
    throw new Error(
      'graphology-cores: the given graph is not a valid graphology instance.'
    );

  if (graph.selfLoopCount > 0)
    throw new Error(
      'graphology-cores: the given graph has self loops which is not permitted.'
    );

  // NOTE: keeping neighbors in lists means deletion is O(n)
  // This looks hardly optimal, I am sure we can do better than networkx' implementation
  const core = {};
  const neighbors = {};
  let maxDegree = 0;

  graph.forEachNode(node => {
    const n = [];
    const d = graph.degree(node);

    if (graph.type !== 'undirected') {
      graph.forEachInNeighbor(node, nbr => {
        n.push(nbr);
      });
      graph.forEachOutNeighbor(node, nbr => {
        n.push(nbr);
      });
    }

    if (graph.type !== 'directed') {
      graph.forEachUndirectedNeighbor(node, nbr => {
        n.push(nbr);
      });
    }

    core[node] = d;
    if (d > maxDegree) maxDegree = d;

    neighbors[node] = n;
  });

  const nodes = graph.nodes().sort((a, b) => graph.degree(a) - graph.degree(b));

  const binBoundaries = new Array(nodes.length * maxDegree);
  binBoundaries[0] = 0;

  const nodePos = {};

  // Preparing binBoundaries
  let currDegree = 0;
  let bi = 1;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    nodePos[node] = i;

    const nd = core[node];

    if (nd > currDegree) {
      let l = nd - currDegree;
      while (l--) binBoundaries[bi++] = i;
      currDegree = nd;
    }
  }

  nodes.forEach(node => {
    const n = neighbors[node];
    const nd = core[node];

    for (let i = 0, l = n.length; i < l; i++) {
      const nbr = n[i];
      const nbrd = core[nbr];

      if (nbrd <= nd) continue;

      const nbrnbr = neighbors[nbr];
      nbrnbr.splice(nbrnbr.indexOf(node), 1);

      const pos = nodePos[nbr];
      const binStart = binBoundaries[nbrd];
      nodePos[nbr] = binStart;
      nodePos[nodes[binStart]] = pos;

      const stemp = nodes[binStart];
      nodes[binStart] = nodes[pos];
      nodes[pos] = stemp;

      binBoundaries[nbrd] += 1;
      core[nbr] -= 1;
    }
  });

  if (assign) {
    graph.updateEachNodeAttributes(
      (node, attr) => {
        attr[coreAttribute] = core[node];
        return attr;
      },
      {attributes: [coreAttribute]}
    );
  }

  return core;
}

function coreSubgraph(graph, filter, k, customCore) {
  if (customCore === undefined) {
    customCore = coreNumber(false, graph);
  }
  if (k === undefined) {
    k = 0;
    for (const field in customCore) {
      if (customCore[field] > k) k = customCore[field];
    }
  }
  const nodes = [];
  for (const field in customCore) {
    if (filter(field, k, customCore)) {
      nodes.push(field);
    }
  }
  return subgraph(graph, nodes);
}

// ===== Filters =====

function kCore(graph, k, customCore) {
  return coreSubgraph(
    graph,
    (node, resultK, resultCore) => {
      return resultCore[node] >= resultK;
    },
    k,
    customCore
  );
}

function kShell(graph, k, customCore) {
  return coreSubgraph(
    graph,
    (node, resultK, resultCore) => {
      return resultCore[node] === resultK;
    },
    k,
    customCore
  );
}

function kCrust(graph, k, customCore) {
  if (customCore === undefined) {
    customCore = coreNumber(false, graph);
  }
  if (k === undefined) {
    k = 0;
    for (const field in customCore) {
      if (customCore[field] - 1 > k) k = customCore[field] - 1;
    }
  }

  return subgraph(graph, node => {
    const ccf = customCore[node];

    return ccf <= k;
  });
}

function kCorona(graph, k, customCore) {
  // TODO: can be optimized to leverage the AND short-circuit
  return coreSubgraph(
    graph,
    (node, resultK, resultCore) => {
      let nbrsSum = null;
      if (graph.type === 'directed') {
        nbrsSum =
          graph.inNeighbors(node).reduce((acc, nb) => {
            return resultCore[nb] >= resultK ? acc + 1 : acc;
          }, 0) +
          graph.outNeighbors(node).reduce((acc, nb) => {
            return resultCore[nb] >= resultK ? acc + 1 : acc;
          }, 0);
      } else {
        nbrsSum = graph.neighbors(node).reduce((acc, nb) => {
          return resultCore[nb] >= resultK ? acc + 1 : acc;
        }, 0);
      }
      return resultCore[node] === resultK && resultK === nbrsSum;
    },
    k,
    customCore
  );
}

// TODO: can be wildly optimized
function kTruss(graph, k) {
  if (!isGraph(graph)) {
    throw new Error(
      'graphology-cores: the given graph is not a valid graphology instance.'
    );
  }

  if (k === undefined) {
    throw Error('graphology-cores : missing parameter k.');
  }

  if (graph.type === 'directed' || graph.multi) {
    throw Error(
      'graphology-cores : unimplemented metric for directed graphs and multigraphs.'
    );
  }

  if (graph.selfLoopCount > 0) {
    throw Error(
      'graphology-cores : onion loyers not available for graphs with self-loops.'
    );
  }

  const H = graph.copy();
  let nDropped = 1;
  while (nDropped > 0) {
    nDropped = 0;
    const toDrop = [];
    const seen = new Set();

    H.forEachNode(node => {
      const nbrs = new Set(H.neighbors(node));
      seen.add(node);
      const newNbrs = [...nbrs].reduce((acc, v) => {
        if (!seen.has(v)) acc.push(v);
        return acc;
      }, []);

      newNbrs.forEach(nbr => {
        const nbrNbrs = new Set(H.neighbors(nbr));
        const intersection = new Set();

        for (const x of nbrs) if (nbrNbrs.has(x)) intersection.add(x);
        if (intersection.size < k - 2) {
          toDrop.push(graph.edge(node, nbr));
        }
      });
    });

    toDrop.forEach(edge => {
      if (edge) H.dropEdge(edge);
    });
    nDropped = toDrop.length;
    H.forEachNode(node => {
      if (H.degree(node) === 0) {
        H.dropNode(node);
      }
    });
  }
  return H;
}

// TODO: can be wildly optimized
function onionLayers(assign, graph, nodeOnionLayerAttribute) {
  nodeOnionLayerAttribute = nodeOnionLayerAttribute || 'onionLayer';

  const remove = function (degrees, key) {
    const newDegrees = {};
    for (const k in degrees) if (k !== key) newDegrees[k] = degrees[k];
    return newDegrees;
  };

  const lengthOf = function (dict) {
    let size = 0;
    // eslint-disable-next-line
    for (const _ in dict) size++;
    return size;
  };

  if (graph.type === 'directed' || graph.multi) {
    throw Error(
      'graphology-cores : unimplemented metric for directed graphs and multigraphs.'
    );
  }

  if (graph.selfLoopCount > 0) {
    throw Error(
      'graphology-cores : onion layers not available for graphs with self-loops.'
    );
  }

  let degrees = {};
  const neighbors = {};
  const isolatedNodes = [];
  graph.forEachNode(node => {
    // Adding degrees
    const deg = graph.degree(node);
    degrees[node] = deg;
    // Adding isolated nodes
    if (deg === 0) isolatedNodes.push(node);
    // Setting up neighbors
    neighbors[node] = graph.neighbors(node);
  });

  const odLayers = {};
  let currentCore = 1;
  let currentLayer = 1;

  // Isolated nodes
  if (isolatedNodes.length > 0) {
    isolatedNodes.forEach(node => {
      odLayers[node] = currentLayer;
      degrees = remove(degrees, node);
    });
    currentLayer += 1;
  }

  // Others
  const compareDegrees = (a, b) => {
    return degrees[a] - degrees[b];
  };

  while (lengthOf(degrees) > 0) {
    const degreeSize = lengthOf(degrees);
    let n = 0;
    const nodes = new Array(degreeSize);
    for (const k in degrees) nodes[n++] = k;

    nodes.sort(compareDegrees);

    const minDegree = degrees[nodes[0]];
    if (minDegree > currentCore) currentCore = minDegree;

    const thisLayer = [];
    for (let i = 0; i < nodes.length; i++) {
      if (degrees[nodes[i]] > currentCore) break;
      thisLayer.push(nodes[i]);
    }
    for (let i = 0; i < thisLayer.length; i++) {
      const node = thisLayer[i];
      odLayers[node] = currentLayer;
      for (let nb = 0; nb < neighbors[node].length; ++nb) {
        const nbr = neighbors[node][nb];
        neighbors[nbr].splice(neighbors[nbr].indexOf(node), 1);
        degrees[nbr] -= 1;
      }
      degrees = remove(degrees, node);
    }

    currentLayer++;
  }

  if (assign) {
    graph.updateEachNodeAttributes((node, attr) => {
      attr[nodeOnionLayerAttribute] = odLayers[node];
      return attr;
    });
  }

  return odLayers;
}

exports.coreNumber = coreNumber.bind(null, false);
exports.coreNumber.assign = coreNumber.bind(null, true);
exports.onionLayers = onionLayers.bind(null, false);
exports.onionLayers.assign = onionLayers.bind(null, true);

exports.kCore = kCore;
exports.kShell = kShell;
exports.kCrust = kCrust;
exports.kCorona = kCorona;
exports.kTruss = kTruss;
