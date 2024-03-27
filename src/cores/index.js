/**
 * Graphology Core Metrics
 * ===========================
 *
 * Functions computing the metrics related to the core
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

  const degrees = {};
  let maxDegree = 0;
  graph.forEachNode(node => {
    const nd = graph.degree(node);
    degrees[node] = nd;
    if (nd > maxDegree) maxDegree = nd;
  });

  const nodes = graph.nodes().sort((a, b) => graph.degree(a) - graph.degree(b));

  const binBoundaries = new Array(nodes.length * maxDegree);
  binBoundaries[0] = 0;

  let currDegree = 0;

  // Preparing binBoundaries
  let bi = 1;
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    const nd = degrees[node];
    if (nd > currDegree) {
      let l = nd - currDegree;
      while (l--) binBoundaries[bi++] = i;
      currDegree = nd;
    }
  }

  // Node positions
  const nodePos = {};

  for (let i = 0; i < nodes.length; ++i) {
    const nd = nodes[i];
    nodePos[nd] = i;
  }

  // Neighbors
  const nbrs = {};
  nodes.forEach(node => {
    nbrs[node] = [];
    if (graph.type === 'directed') {
      graph.forEachInNeighbor(node, nbr => {
        nbrs[node].push(nbr);
      });
      graph.forEachOutNeighbor(node, nbr => {
        nbrs[node].push(nbr);
      });
    } else {
      graph.forEachNeighbor(node, nbr => {
        nbrs[node].push(nbr);
      });
    }
  });

  const removed = new Set();
  const core = degrees;
  nodes.forEach(node => {
    nbrs[node].forEach(nbr => {
      if (core[nbr] > core[node]) {
        if (removed.has([node, nbr])) return;
        removed.add([nbr, node]);
        const pos = nodePos[nbr];
        const binStart = binBoundaries[core[nbr]];
        nodePos[nbr] = binStart;
        nodePos[nodes[binStart]] = pos;

        const stemp = nodes[binStart];
        nodes[binStart] = nodes[pos];
        nodes[pos] = stemp;

        binBoundaries[core[nbr]] += 1;
        core[nbr] -= 1;
      }
    });
  });

  if (assign) {
    graph.updateEachNodeAttributes((node, attr) => {
      attr[coreAttribute] = core[node];
      return attr;
    });
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
  const nodes = [];
  for (const field in customCore) {
    const ccf = customCore[field];
    if (ccf <= k) nodes.push(field);
  }
  return subgraph(graph, nodes);
}

function kCorona(graph, k, customCore) {
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
    for (let i = 0; i < nodes.length; ++i) {
      if (degrees[nodes[i]] > currentCore) break;
      thisLayer.push(nodes[i]);
    }
    for (let i = 0; i < thisLayer.length; ++i) {
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
