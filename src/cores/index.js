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
      'graphology-metrics/core: the given graph is not a valid graphology instance.'
    );

  if (graph.selfLoopCount > 0)
    throw new Error(
      'graphology-metrics/core: the given graph has self loops which is not permitted.'
    );

  const degrees = {};
  graph.forEachNode(node => {
    degrees[node] = graph.degree(node);
  });

  // Sort nodes by degree
  const nodes = Object.entries(degrees)
    .sort((a, b) => {
      const d1 = a[1];
      const d2 = b[1];
      return d1 - d2;
    })
    .map(a => {
      return a[0];
    });

  const binBounderie = [0];
  let currDegree = 0;

  // Preparing bin_bounderie
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    const nd = degrees[node];
    if (nd > currDegree) {
      let l = nd - currDegree;
      while (l--) binBounderie.push(i);
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
    graph.forEachInboundNeighbor(node, nbr => {
      nbrs[node].push(nbr);
    });
    graph.forEachOutboundNeighbor(node, nbr => {
      nbrs[node].push(nbr);
    });
  });

  const removed = new Set();
  const core = degrees;
  nodes.forEach(node => {
    nbrs[node].forEach(nbr => {
      if (core[nbr] > core[node]) {
        if (removed.has([node, nbr])) return;
        removed.add([nbr, node]);
        const pos = nodePos[nbr];
        const binStart = binBounderie[core[nbr]];
        nodePos[nbr] = binStart;
        nodePos[nodes[binStart]] = pos;

        const stemp = nodes[binStart];
        nodes[binStart] = nodes[pos];
        nodes[pos] = stemp;

        binBounderie[core[nbr]] += 1;
        core[nbr] -= 1;
      }
    });
  });

  if (assign) {
    graph.forEachNode(node => {
      graph.setNodeAttribute(node, coreAttribute, core[node]);
    });
  }

  return core;
}

function coreSubgraph(graph, filter, k, customCore) {
  if (customCore === undefined) {
    customCore = coreNumber(false, graph);
  }
  if (k === undefined) {
    k = Math.max.apply(Math, Object.values(customCore));
  }
  const nodes = [];
  Object.entries(customCore).forEach(pair => {
    const node = pair[0];
    if (filter(node, k, customCore)) {
      nodes.push(node);
    }
  });
  return subgraph(graph, nodes);
}

// ===== Filters =====

function kCore(graph, k, customCore) {
  return coreSubgraph(
    graph,
    (cv, ck, cc) => {
      return cc[cv] >= ck;
    },
    k,
    customCore
  );
}

function kShell(graph, k, customCore) {
  return coreSubgraph(
    graph,
    (cv, ck, cc) => {
      return cc[cv] === ck;
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
    k = Math.max.apply(Math, Object.values(customCore)) - 1;
  }
  const nodes = [];
  Object.entries(customCore).forEach(pair => {
    const [node, cn] = pair;
    if (cn <= k) nodes.push(node);
  });
  return subgraph(graph, nodes);
}

function kCorona(graph, k, customCore) {
  return coreSubgraph(
    graph,
    (cv, ck, cc) => {
      const nbrsSum =
        graph.inboundNeighbors(cv).reduce((acc, nb) => {
          return cc[nb] >= ck ? acc + 1 : acc;
        }, 0) +
        graph.outboundNeighbors(cv).reduce((acc, nb) => {
          return cc[nb] >= ck ? acc + 1 : acc;
        }, 0);
      return cc[cv] === ck && ck === nbrsSum;
    },
    k,
    customCore
  );
}

function onionLayers(assign, graph, onionLayerAttribute) {
  onionLayerAttribute = onionLayerAttribute || 'onionLayer';

  const remove = function (degrees, key) {
    return Object.keys(degrees).reduce((acc, k) => {
      if (k !== key) acc[k] = degrees[k];
      return acc;
    }, {});
  };

  if (graph.type === 'directed' || graph.multi) {
    throw Error(
      'graphology-metrics/core : unimplemented metric for directed graphs and multigraphs.'
    );
  }

  if (graph.selfLoopCount > 0) {
    throw Error(
      'graphology-metrics/core : onion loyers not available for graphs with self-loops.'
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
  let degreesEntries = null;
  while ((degreesEntries = Object.entries(degrees)).length > 0) {
    const nodes = degreesEntries
      .sort((a, b) => {
        const d1 = a[1];
        const d2 = b[1];
        return d1 - d2;
      })
      .map(a => {
        const n = a[0];
        return n;
      });

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
      for (let n = 0; n < neighbors[node].length; ++n) {
        const nbr = neighbors[node][n];
        neighbors[nbr].splice(neighbors[nbr].indexOf(node), 1);
        degrees[nbr] -= 1;
      }
      degrees = remove(degrees, node);
    }

    currentLayer++;
  }

  if (assign) {
    graph.forEachNode(node => {
      graph.setNodeAttribute(node, onionLayerAttribute, odLayers[node]);
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
