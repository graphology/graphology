/**
 * Graphology Louvain Algorithm
 * =============================
 *
 * JavaScript implementation of the famous Louvain community detection
 * algorithm for graphology.
 *
 * [Articles]
 * M. E. J. Newman, « Modularity and community structure in networks »,
 * Proc. Natl. Acad. Sci. USA, vol. 103, no 23, 2006, p. 8577–8582
 * https://dx.doi.org/10.1073%2Fpnas.0601602103
 *
 * Newman, M. E. J. « Community detection in networks: Modularity optimization
 * and maximum likelihood are equivalent ». Physical Review E, vol. 94, no 5,
 * novembre 2016, p. 052315. arXiv.org, doi:10.1103/PhysRevE.94.052315.
 * https://arxiv.org/pdf/1606.02319.pdf
 *
 * Blondel, Vincent D., et al. « Fast unfolding of communities in large
 * networks ». Journal of Statistical Mechanics: Theory and Experiment,
 * vol. 2008, no 10, octobre 2008, p. P10008. DOI.org (Crossref),
 * doi:10.1088/1742-5468/2008/10/P10008.
 * https://arxiv.org/pdf/0803.0476.pdf
 *
 * Nicolas Dugué, Anthony Perez. Directed Louvain: maximizing modularity in
 * directed networks. [Research Report] Université d’Orléans. 2015. hal-01231784
 * https://hal.archives-ouvertes.fr/hal-01231784
 *
 * R. Lambiotte, J.-C. Delvenne and M. Barahona. Laplacian Dynamics and
 * Multiscale Modular Structure in Networks,
 * doi:10.1109/TNSE.2015.2391998.
 * https://arxiv.org/abs/0812.1770
 *
 * Traag, V. A., et al. « From Louvain to Leiden: Guaranteeing Well-Connected
 * Communities ». Scientific Reports, vol. 9, no 1, décembre 2019, p. 5233.
 * DOI.org (Crossref), doi:10.1038/s41598-019-41695-z.
 * https://arxiv.org/abs/1810.08473
 */
var resolveDefaults = require('graphology-utils/defaults');
var isGraph = require('graphology-utils/is-graph');
var inferType = require('graphology-utils/infer-type');
var SparseMap = require('mnemonist/sparse-map');
var SparseQueueSet = require('mnemonist/sparse-queue-set');
var createRandomIndex = require('pandemonium/random-index').createRandomIndex;

var indices = require('graphology-indices/louvain');

var UndirectedLouvainIndex = indices.UndirectedLouvainIndex;
var DirectedLouvainIndex = indices.DirectedLouvainIndex;

var DEFAULTS = {
  attributes: {
    community: 'community',
    weight: 'weight'
  },
  fastLocalMoves: true,
  randomWalk: true,
  resolution: 1,
  rng: Math.random,
  weighted: false
};

function addWeightToCommunity(map, community, weight) {
  var currentWeight = map.get(community);

  if (typeof currentWeight === 'undefined') currentWeight = 0;

  currentWeight += weight;

  map.set(community, currentWeight);
}

var EPSILON = 1e-10;

function tieBreaker(
  bestCommunity,
  currentCommunity,
  targetCommunity,
  delta,
  bestDelta
) {
  if (Math.abs(delta - bestDelta) < EPSILON) {
    if (bestCommunity === currentCommunity) {
      return false;
    } else {
      return targetCommunity > bestCommunity;
    }
  } else if (delta > bestDelta) {
    return true;
  }

  return false;
}

function undirectedLouvain(detailed, graph, options) {
  var index = new UndirectedLouvainIndex(graph, {
    attributes: {
      weight: options.attributes.weight
    },
    keepDendrogram: detailed,
    resolution: options.resolution,
    weighted: options.weighted
  });

  var randomIndex = createRandomIndex(options.rng);

  // State variables
  var moveWasMade = true,
    localMoveWasMade = true;

  // Communities
  var currentCommunity, targetCommunity;
  var communities = new SparseMap(Float64Array, index.C);

  // Traversal
  var queue, start, end, weight, ci, ri, s, i, j, l;

  // Metrics
  var degree, targetCommunityDegree;

  // Moves
  var bestCommunity, bestDelta, deltaIsBetter, delta;

  // Details
  var deltaComputations = 0,
    nodesVisited = 0,
    moves = [],
    localMoves,
    currentMoves;

  if (options.fastLocalMoves) queue = new SparseQueueSet(index.C);

  while (moveWasMade) {
    l = index.C;

    moveWasMade = false;
    localMoveWasMade = true;

    if (options.fastLocalMoves) {
      currentMoves = 0;

      // Traversal of the graph
      ri = options.randomWalk ? randomIndex(l) : 0;

      for (s = 0; s < l; s++, ri++) {
        i = ri % l;
        queue.enqueue(i);
      }

      while (queue.size !== 0) {
        i = queue.dequeue();
        nodesVisited++;

        degree = 0;
        communities.clear();

        currentCommunity = index.belongings[i];

        start = index.starts[i];
        end = index.starts[i + 1];

        // Traversing neighbors
        for (; start < end; start++) {
          j = index.neighborhood[start];
          weight = index.weights[start];

          targetCommunity = index.belongings[j];

          // Incrementing metrics
          degree += weight;
          addWeightToCommunity(communities, targetCommunity, weight);
        }

        // Finding best community to move to
        bestDelta = index.fastDeltaWithOwnCommunity(
          i,
          degree,
          communities.get(currentCommunity) || 0,
          currentCommunity
        );
        bestCommunity = currentCommunity;

        for (ci = 0; ci < communities.size; ci++) {
          targetCommunity = communities.dense[ci];

          if (targetCommunity === currentCommunity) continue;

          targetCommunityDegree = communities.vals[ci];

          deltaComputations++;

          delta = index.fastDelta(
            i,
            degree,
            targetCommunityDegree,
            targetCommunity
          );

          deltaIsBetter = tieBreaker(
            bestCommunity,
            currentCommunity,
            targetCommunity,
            delta,
            bestDelta
          );

          if (deltaIsBetter) {
            bestDelta = delta;
            bestCommunity = targetCommunity;
          }
        }

        // Should we move the node?
        if (bestDelta < 0) {
          // NOTE: this is to allow nodes to move back to their own singleton
          // This code however only deals with modularity (e.g. the condition
          // about bestDelta < 0, which is the delta for moving back to
          // singleton wrt. modularity). Indeed, rarely, the Louvain
          // algorithm can produce such cases when a node would be better in
          // a singleton that in its own community when considering self loops
          // or a resolution != 1. In this case, delta with your own community
          // is indeed less than 0. To handle different metrics, one should
          // consider computing the delta for going back to singleton because
          // it might not be 0.
          bestCommunity = index.isolate(i, degree);

          // If the node was already in a singleton community, we don't consider
          // a move was made
          if (bestCommunity === currentCommunity) continue;
        } else {
          // If no move was made, we continue to next node
          if (bestCommunity === currentCommunity) {
            continue;
          } else {
            // Actually moving the node to a new community
            index.move(i, degree, bestCommunity);
          }
        }

        moveWasMade = true;
        currentMoves++;

        // Adding neighbors from other communities to the queue
        start = index.starts[i];
        end = index.starts[i + 1];

        for (; start < end; start++) {
          j = index.neighborhood[start];
          targetCommunity = index.belongings[j];

          if (targetCommunity !== bestCommunity) queue.enqueue(j);
        }
      }

      moves.push(currentMoves);
    } else {
      localMoves = [];
      moves.push(localMoves);

      // Traditional Louvain iterative traversal of the graph
      while (localMoveWasMade) {
        localMoveWasMade = false;
        currentMoves = 0;

        ri = options.randomWalk ? randomIndex(l) : 0;

        for (s = 0; s < l; s++, ri++) {
          i = ri % l;

          nodesVisited++;

          degree = 0;
          communities.clear();

          currentCommunity = index.belongings[i];

          start = index.starts[i];
          end = index.starts[i + 1];

          // Traversing neighbors
          for (; start < end; start++) {
            j = index.neighborhood[start];
            weight = index.weights[start];

            targetCommunity = index.belongings[j];

            // Incrementing metrics
            degree += weight;
            addWeightToCommunity(communities, targetCommunity, weight);
          }

          // Finding best community to move to
          bestDelta = index.fastDeltaWithOwnCommunity(
            i,
            degree,
            communities.get(currentCommunity) || 0,
            currentCommunity
          );
          bestCommunity = currentCommunity;

          for (ci = 0; ci < communities.size; ci++) {
            targetCommunity = communities.dense[ci];

            if (targetCommunity === currentCommunity) continue;

            targetCommunityDegree = communities.vals[ci];

            deltaComputations++;

            delta = index.fastDelta(
              i,
              degree,
              targetCommunityDegree,
              targetCommunity
            );

            deltaIsBetter = tieBreaker(
              bestCommunity,
              currentCommunity,
              targetCommunity,
              delta,
              bestDelta
            );

            if (deltaIsBetter) {
              bestDelta = delta;
              bestCommunity = targetCommunity;
            }
          }

          // Should we move the node?
          if (bestDelta < 0) {
            // NOTE: this is to allow nodes to move back to their own singleton
            // This code however only deals with modularity (e.g. the condition
            // about bestDelta < 0, which is the delta for moving back to
            // singleton wrt. modularity). Indeed, rarely, the Louvain
            // algorithm can produce such cases when a node would be better in
            // a singleton that in its own community when considering self loops
            // or a resolution != 1. In this case, delta with your own community
            // is indeed less than 0. To handle different metrics, one should
            // consider computing the delta for going back to singleton because
            // it might not be 0.
            bestCommunity = index.isolate(i, degree);

            // If the node was already in a singleton community, we don't consider
            // a move was made
            if (bestCommunity === currentCommunity) continue;
          } else {
            // If no move was made, we continue to next node
            if (bestCommunity === currentCommunity) {
              continue;
            } else {
              // Actually moving the node to a new community
              index.move(i, degree, bestCommunity);
            }
          }

          localMoveWasMade = true;
          currentMoves++;
        }

        localMoves.push(currentMoves);

        moveWasMade = localMoveWasMade || moveWasMade;
      }
    }

    // We continue working on the induced graph
    if (moveWasMade) index.zoomOut();
  }

  var results = {
    index: index,
    deltaComputations: deltaComputations,
    nodesVisited: nodesVisited,
    moves: moves
  };

  return results;
}

function directedLouvain(detailed, graph, options) {
  var index = new DirectedLouvainIndex(graph, {
    attributes: {
      weight: options.attributes.weight
    },
    keepDendrogram: detailed,
    resolution: options.resolution,
    weighted: options.weighted
  });

  var randomIndex = createRandomIndex(options.rng);

  // State variables
  var moveWasMade = true,
    localMoveWasMade = true;

  // Communities
  var currentCommunity, targetCommunity;
  var communities = new SparseMap(Float64Array, index.C);

  // Traversal
  var queue, start, end, offset, out, weight, ci, ri, s, i, j, l;

  // Metrics
  var inDegree, outDegree, targetCommunityDegree;

  // Moves
  var bestCommunity, bestDelta, deltaIsBetter, delta;

  // Details
  var deltaComputations = 0,
    nodesVisited = 0,
    moves = [],
    localMoves,
    currentMoves;

  if (options.fastLocalMoves) queue = new SparseQueueSet(index.C);

  while (moveWasMade) {
    l = index.C;

    moveWasMade = false;
    localMoveWasMade = true;

    if (options.fastLocalMoves) {
      currentMoves = 0;

      // Traversal of the graph
      ri = options.randomWalk ? randomIndex(l) : 0;

      for (s = 0; s < l; s++, ri++) {
        i = ri % l;
        queue.enqueue(i);
      }

      while (queue.size !== 0) {
        i = queue.dequeue();
        nodesVisited++;

        inDegree = 0;
        outDegree = 0;
        communities.clear();

        currentCommunity = index.belongings[i];

        start = index.starts[i];
        end = index.starts[i + 1];
        offset = index.offsets[i];

        // Traversing neighbors
        for (; start < end; start++) {
          out = start < offset;
          j = index.neighborhood[start];
          weight = index.weights[start];

          targetCommunity = index.belongings[j];

          // Incrementing metrics
          if (out) outDegree += weight;
          else inDegree += weight;

          addWeightToCommunity(communities, targetCommunity, weight);
        }

        // Finding best community to move to
        bestDelta = index.deltaWithOwnCommunity(
          i,
          inDegree,
          outDegree,
          communities.get(currentCommunity) || 0,
          currentCommunity
        );
        bestCommunity = currentCommunity;

        for (ci = 0; ci < communities.size; ci++) {
          targetCommunity = communities.dense[ci];

          if (targetCommunity === currentCommunity) continue;

          targetCommunityDegree = communities.vals[ci];

          deltaComputations++;

          delta = index.delta(
            i,
            inDegree,
            outDegree,
            targetCommunityDegree,
            targetCommunity
          );

          deltaIsBetter = tieBreaker(
            bestCommunity,
            currentCommunity,
            targetCommunity,
            delta,
            bestDelta
          );

          if (deltaIsBetter) {
            bestDelta = delta;
            bestCommunity = targetCommunity;
          }
        }

        // Should we move the node?
        if (bestDelta < 0) {
          // NOTE: this is to allow nodes to move back to their own singleton
          // This code however only deals with modularity (e.g. the condition
          // about bestDelta < 0, which is the delta for moving back to
          // singleton wrt. modularity). Indeed, rarely, the Louvain
          // algorithm can produce such cases when a node would be better in
          // a singleton that in its own community when considering self loops
          // or a resolution != 1. In this case, delta with your own community
          // is indeed less than 0. To handle different metrics, one should
          // consider computing the delta for going back to singleton because
          // it might not be 0.
          bestCommunity = index.isolate(i, inDegree, outDegree);

          // If the node was already in a singleton community, we don't consider
          // a move was made
          if (bestCommunity === currentCommunity) continue;
        } else {
          // If no move was made, we continue to next node
          if (bestCommunity === currentCommunity) {
            continue;
          } else {
            // Actually moving the node to a new community
            index.move(i, inDegree, outDegree, bestCommunity);
          }
        }

        moveWasMade = true;
        currentMoves++;

        // Adding neighbors from other communities to the queue
        start = index.starts[i];
        end = index.starts[i + 1];

        for (; start < end; start++) {
          j = index.neighborhood[start];
          targetCommunity = index.belongings[j];

          if (targetCommunity !== bestCommunity) queue.enqueue(j);
        }
      }

      moves.push(currentMoves);
    } else {
      localMoves = [];
      moves.push(localMoves);

      // Traditional Louvain iterative traversal of the graph
      while (localMoveWasMade) {
        localMoveWasMade = false;
        currentMoves = 0;

        ri = options.randomWalk ? randomIndex(l) : 0;

        for (s = 0; s < l; s++, ri++) {
          i = ri % l;

          nodesVisited++;

          inDegree = 0;
          outDegree = 0;
          communities.clear();

          currentCommunity = index.belongings[i];

          start = index.starts[i];
          end = index.starts[i + 1];
          offset = index.offsets[i];

          // Traversing neighbors
          for (; start < end; start++) {
            out = start < offset;
            j = index.neighborhood[start];
            weight = index.weights[start];

            targetCommunity = index.belongings[j];

            // Incrementing metrics
            if (out) outDegree += weight;
            else inDegree += weight;

            addWeightToCommunity(communities, targetCommunity, weight);
          }

          // Finding best community to move to
          bestDelta = index.deltaWithOwnCommunity(
            i,
            inDegree,
            outDegree,
            communities.get(currentCommunity) || 0,
            currentCommunity
          );
          bestCommunity = currentCommunity;

          for (ci = 0; ci < communities.size; ci++) {
            targetCommunity = communities.dense[ci];

            if (targetCommunity === currentCommunity) continue;

            targetCommunityDegree = communities.vals[ci];

            deltaComputations++;

            delta = index.delta(
              i,
              inDegree,
              outDegree,
              targetCommunityDegree,
              targetCommunity
            );

            deltaIsBetter = tieBreaker(
              bestCommunity,
              currentCommunity,
              targetCommunity,
              delta,
              bestDelta
            );

            if (deltaIsBetter) {
              bestDelta = delta;
              bestCommunity = targetCommunity;
            }
          }

          // Should we move the node?
          if (bestDelta < 0) {
            // NOTE: this is to allow nodes to move back to their own singleton
            // This code however only deals with modularity (e.g. the condition
            // about bestDelta < 0, which is the delta for moving back to
            // singleton wrt. modularity). Indeed, rarely, the Louvain
            // algorithm can produce such cases when a node would be better in
            // a singleton that in its own community when considering self loops
            // or a resolution != 1. In this case, delta with your own community
            // is indeed less than 0. To handle different metrics, one should
            // consider computing the delta for going back to singleton because
            // it might not be 0.
            bestCommunity = index.isolate(i, inDegree, outDegree);

            // If the node was already in a singleton community, we don't consider
            // a move was made
            if (bestCommunity === currentCommunity) continue;
          } else {
            // If no move was made, we continue to next node
            if (bestCommunity === currentCommunity) {
              continue;
            } else {
              // Actually moving the node to a new community
              index.move(i, inDegree, outDegree, bestCommunity);
            }
          }

          localMoveWasMade = true;
          currentMoves++;
        }

        localMoves.push(currentMoves);

        moveWasMade = localMoveWasMade || moveWasMade;
      }
    }

    // We continue working on the induced graph
    if (moveWasMade) index.zoomOut();
  }

  var results = {
    index: index,
    deltaComputations: deltaComputations,
    nodesVisited: nodesVisited,
    moves: moves
  };

  return results;
}

/**
 * Function returning the communities mapping of the graph.
 *
 * @param  {boolean} assign             - Assign communities to nodes attributes?
 * @param  {boolean} detailed           - Whether to return detailed information.
 * @param  {Graph}   graph              - Target graph.
 * @param  {object}  options            - Options:
 * @param  {object}    attributes         - Attribute names:
 * @param  {string}      community          - Community node attribute name.
 * @param  {string}      weight             - Weight edge attribute name.
 * @param  {string}    deltaComputation   - Method to use to compute delta computations.
 * @param  {boolean}   fastLocalMoves     - Whether to use the fast local move optimization.
 * @param  {boolean}   randomWalk         - Whether to traverse the graph in random order.
 * @param  {number}    resolution         - Resolution parameter.
 * @param  {function}  rng                - RNG function to use.
 * @param  {boolean}   weighted           - Whether to compute the weighted version.
 * @return {object}
 */
function louvain(assign, detailed, graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-communities-louvain: the given graph is not a valid graphology instance.'
    );

  var type = inferType(graph);

  if (type === 'mixed')
    throw new Error(
      'graphology-communities-louvain: cannot run the algorithm on a true mixed graph.'
    );

  // Attributes name
  options = resolveDefaults(options, DEFAULTS);

  // Empty graph case
  var c = 0;

  if (graph.size === 0) {
    if (assign) {
      graph.forEachNode(function (node) {
        graph.setNodeAttribute(node, options.attributes.communities, c++);
      });

      return;
    }

    var communities = {};

    graph.forEachNode(function (node) {
      communities[node] = c++;
    });

    if (!detailed) return communities;

    return {
      communities: communities,
      count: graph.order,
      deltaComputations: 0,
      dendrogram: null,
      level: 0,
      modularity: NaN,
      moves: null,
      nodesVisited: 0,
      resolution: options.resolution
    };
  }

  var fn = type === 'undirected' ? undirectedLouvain : directedLouvain;

  var results = fn(detailed, graph, options);

  var index = results.index;

  // Standard output
  if (!detailed) {
    if (assign) {
      index.assign(options.attributes.community);
      return;
    }

    return index.collect();
  }

  // Detailed output
  var output = {
    count: index.C,
    deltaComputations: results.deltaComputations,
    dendrogram: index.dendrogram,
    level: index.level,
    modularity: index.modularity(),
    moves: results.moves,
    nodesVisited: results.nodesVisited,
    resolution: options.resolution
  };

  if (assign) {
    index.assign(options.attributes.community);
    return output;
  }

  output.communities = index.collect();

  return output;
}

/**
 * Exporting.
 */
var fn = louvain.bind(null, false, false);
fn.assign = louvain.bind(null, true, false);
fn.detailed = louvain.bind(null, false, true);
fn.defaults = DEFAULTS;

module.exports = fn;
