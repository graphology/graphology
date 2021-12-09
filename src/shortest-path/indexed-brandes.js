/**
 * Graphology Indexed Brandes Routine
 * ===================================
 *
 * Indexed version of the famous Brandes routine aiming at computing
 * betweenness centrality efficiently.
 */
var FixedDeque = require('mnemonist/fixed-deque');
var FixedStack = require('mnemonist/fixed-stack');
var Heap = require('mnemonist/heap');
var typed = require('mnemonist/utils/typed-arrays');
var neighborhoodIndices = require('graphology-indices/neighborhood');

var NeighborhoodIndex = neighborhoodIndices.NeighborhoodIndex;
var WeightedNeighborhoodIndex = neighborhoodIndices.WeightedNeighborhoodIndex;

/**
 * Indexed unweighted Brandes routine.
 *
 * [Reference]:
 * Ulrik Brandes: A Faster Algorithm for Betweenness Centrality.
 * Journal of Mathematical Sociology 25(2):163-177, 2001.
 *
 * @param  {Graph}    graph - The graphology instance.
 * @return {function}
 */
exports.createUnweightedIndexedBrandes =
  function createUnweightedIndexedBrandes(graph) {
    var neighborhoodIndex = new NeighborhoodIndex(graph);

    var neighborhood = neighborhoodIndex.neighborhood,
      starts = neighborhoodIndex.starts;

    var order = graph.order;

    var S = new FixedStack(typed.getPointerArray(order), order),
      sigma = new Uint32Array(order),
      P = new Array(order),
      D = new Int32Array(order);

    var Q = new FixedDeque(Uint32Array, order);

    var brandes = function (sourceIndex) {
      var Dv, sigmav, start, stop, j, v, w;

      for (v = 0; v < order; v++) {
        P[v] = [];
        sigma[v] = 0;
        D[v] = -1;
      }

      sigma[sourceIndex] = 1;
      D[sourceIndex] = 0;

      Q.push(sourceIndex);

      while (Q.size !== 0) {
        v = Q.shift();
        S.push(v);

        Dv = D[v];
        sigmav = sigma[v];

        start = starts[v];
        stop = starts[v + 1];

        for (j = start; j < stop; j++) {
          w = neighborhood[j];

          if (D[w] === -1) {
            Q.push(w);
            D[w] = Dv + 1;
          }

          if (D[w] === Dv + 1) {
            sigma[w] += sigmav;
            P[w].push(v);
          }
        }
      }

      return [S, P, sigma];
    };

    brandes.index = neighborhoodIndex;

    return brandes;
  };

function BRANDES_DIJKSTRA_HEAP_COMPARATOR(a, b) {
  if (a[0] > b[0]) return 1;
  if (a[0] < b[0]) return -1;

  if (a[1] > b[1]) return 1;
  if (a[1] < b[1]) return -1;

  if (a[2] > b[2]) return 1;
  if (a[2] < b[2]) return -1;

  if (a[3] > b[3]) return 1;
  if (a[3] < b[3]) return -1;

  return 0;
}

/**
 * Indexed Dijkstra Brandes routine.
 *
 * [Reference]:
 * Ulrik Brandes: A Faster Algorithm for Betweenness Centrality.
 * Journal of Mathematical Sociology 25(2):163-177, 2001.
 *
 * @param  {Graph}    graph         - The graphology instance.
 * @param  {string}   getEdgeWeight - Name of the weight attribute or getter function.
 * @return {function}
 */
exports.createDijkstraIndexedBrandes = function createDijkstraIndexedBrandes(
  graph,
  getEdgeWeight
) {
  var neighborhoodIndex = new WeightedNeighborhoodIndex(
    graph,
    getEdgeWeight || 'weight'
  );

  var neighborhood = neighborhoodIndex.neighborhood,
    weights = neighborhoodIndex.weights,
    starts = neighborhoodIndex.starts;

  var order = graph.order;

  var S = new FixedStack(typed.getPointerArray(order), order),
    sigma = new Uint32Array(order),
    P = new Array(order),
    D = new Float64Array(order),
    seen = new Float64Array(order);

  // TODO: use fixed-size heap
  var Q = new Heap(BRANDES_DIJKSTRA_HEAP_COMPARATOR);

  var brandes = function (sourceIndex) {
    var start, stop, item, dist, pred, cost, j, v, w;

    var count = 0;

    for (v = 0; v < order; v++) {
      P[v] = [];
      sigma[v] = 0;
      D[v] = -1;
      seen[v] = -1;
    }

    sigma[sourceIndex] = 1;
    seen[sourceIndex] = 0;

    Q.push([0, count++, sourceIndex, sourceIndex]);

    while (Q.size !== 0) {
      item = Q.pop();
      dist = item[0];
      pred = item[2];
      v = item[3];

      if (D[v] !== -1) continue;

      S.push(v);
      D[v] = dist;
      sigma[v] += sigma[pred];

      start = starts[v];
      stop = starts[v + 1];

      for (j = start; j < stop; j++) {
        w = neighborhood[j];
        cost = dist + weights[j];

        if (D[w] === -1 && (seen[w] === -1 || cost < seen[w])) {
          seen[w] = cost;
          Q.push([cost, count++, v, w]);
          sigma[w] = 0;
          P[w] = [v];
        } else if (cost === seen[w]) {
          sigma[w] += sigma[v];
          P[w].push(v);
        }
      }
    }

    return [S, P, sigma];
  };

  brandes.index = neighborhoodIndex;

  return brandes;
};
