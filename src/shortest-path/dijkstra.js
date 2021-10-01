/**
 * Graphology Dijkstra Shortest Path
 * ==================================
 *
 * Graphology implementation of Dijkstra shortest path for weighted graphs.
 */
var isGraph = require('graphology-utils/is-graph'),
    Heap = require('mnemonist/heap');

/**
 * Defaults & helpers.
 */
var DEFAULTS = {
  weightAttribute: 'weight'
};

function DIJKSTRA_HEAP_COMPARATOR(a, b) {
  if (a[0] > b[0])
    return 1;
  if (a[0] < b[0])
    return -1;

  if (a[1] > b[1])
    return 1;
  if (a[1] < b[1])
    return -1;

  if (a[2] > b[2])
    return 1;
  if (a[2] < b[2])
    return -1;

  return 0;
}

function BRANDES_DIJKSTRA_HEAP_COMPARATOR(a, b) {
  if (a[0] > b[0])
    return 1;
  if (a[0] < b[0])
    return -1;

  if (a[1] > b[1])
    return 1;
  if (a[1] < b[1])
    return -1;

  if (a[2] > b[2])
    return 1;
  if (a[2] < b[2])
    return -1;

  if (a[3] > b[3])
    return 1;
  if (a[3] < b[3])
    return - 1;

  return 0;
}

/**
 * Bidirectional Dijkstra shortest path between source & target node abstract.
 *
 * Note that this implementation was basically copied from networkx.
 *
 * @param  {Graph}  graph           - The graphology instance.
 * @param  {string} source          - Source node.
 * @param  {string} target          - Target node.
 * @param  {string} weightAttribute - Name of the weight attribute.
 * @param  {array}                  - The found path if any and its cost.
 */
function abstractBidirectionalDijkstra(graph, source, target, weightAttribute) {
  source = '' + source;
  target = '' + target;

  // Sanity checks
  if (!isGraph(graph))
    throw new Error('graphology-shortest-path/dijkstra: invalid graphology instance.');

  if (source && !graph.hasNode(source))
    throw new Error('graphology-shortest-path/dijkstra: the "' + source + '" source node does not exist in the given graph.');

  if (target && !graph.hasNode(target))
    throw new Error('graphology-shortest-path/dijkstra: the "' + target + '" target node does not exist in the given graph.');

  weightAttribute = weightAttribute || DEFAULTS.weightAttribute;

  var getWeight = function(edge) {
    var weight = graph.getEdgeAttribute(edge, weightAttribute);

    if (typeof weight !== 'number' || isNaN(weight))
      return 1;

    return weight;
  };

  if (source === target)
    return [0, [source]];

  var distances = [{}, {}],
      paths = [{}, {}],
      fringe = [new Heap(DIJKSTRA_HEAP_COMPARATOR), new Heap(DIJKSTRA_HEAP_COMPARATOR)],
      seen = [{}, {}];

  paths[0][source] = [source];
  paths[1][target] = [target];

  seen[0][source] = 0;
  seen[1][target] = 0;

  var finalPath = [],
      finalDistance = Infinity;

  var count = 0,
      dir = 1,
      item,
      edges,
      cost,
      d,
      v,
      u,
      e,
      i,
      l;

  fringe[0].push([0, count++, source]);
  fringe[1].push([0, count++, target]);

  while (fringe[0].size && fringe[1].size) {

    // Swapping direction
    dir = 1 - dir;

    item = fringe[dir].pop();
    d = item[0];
    v = item[2];

    if (v in distances[dir])
      continue;

    distances[dir][v] = d;

    // Shortest path is found?
    if (v in distances[1 - dir])
      return [finalDistance, finalPath];

    edges = dir === 1 ?
      graph.inboundEdges(v) :
      graph.outboundEdges(v);

    for (i = 0, l = edges.length; i < l; i++) {
      e = edges[i];
      u = graph.opposite(v, e);
      cost = distances[dir][v] + getWeight(e);

      if (u in distances[dir] && cost < distances[dir][u]) {
        throw Error('graphology-shortest-path/dijkstra: contradictory paths found. Do some of your edges have a negative weight?');
      }
      else if (!(u in seen[dir]) || cost < seen[dir][u]) {
        seen[dir][u] = cost;
        fringe[dir].push([cost, count++, u]);
        paths[dir][u] = paths[dir][v].concat(u);

        if (u in seen[0] && u in seen[1]) {
          d = seen[0][u] + seen[1][u];

          if (finalPath.length === 0 || finalDistance > d) {
            finalDistance = d;
            finalPath = paths[0][u].concat(paths[1][u].slice(0, -1).reverse());
          }
        }
      }
    }
  }

  // No path was found
  return [Infinity, null];
}

/**
 * Multisource Dijkstra shortest path abstract function. This function is the
 * basis of the algorithm that every other will use.
 *
 * Note that this implementation was basically copied from networkx.
 * TODO: it might be more performant to use a dedicated objet for the heap's
 * items.
 *
 * @param  {Graph}  graph           - The graphology instance.
 * @param  {array}  sources         - A list of sources.
 * @param  {string} weightAttribute - Name of the weight attribute.
 * @param  {number} cutoff          - Maximum depth of the search.
 * @param  {string} target          - Optional target to reach.
 * @param  {object} paths           - Optional paths object to maintain.
 * @return {object}                 - Returns the paths.
 */
function abstractDijkstraMultisource(
  graph,
  sources,
  weightAttribute,
  cutoff,
  target,
  paths
) {

  if (!isGraph(graph))
    throw new Error('graphology-shortest-path/dijkstra: invalid graphology instance.');

  if (target && !graph.hasNode(target))
    throw new Error('graphology-shortest-path/dijkstra: the "' + target + '" target node does not exist in the given graph.');

  weightAttribute = weightAttribute || DEFAULTS.weightAttribute;

  // Building necessary functions
  var getWeight = function(edge) {
    var weight = graph.getEdgeAttribute(edge, weightAttribute);

    if (typeof weight !== 'number' || isNaN(weight))
      return 1;

    return weight;
  };

  var distances = {},
      seen = {},
      fringe = new Heap(DIJKSTRA_HEAP_COMPARATOR);

  var count = 0,
      edges,
      item,
      cost,
      v,
      u,
      e,
      d,
      i,
      j,
      l,
      m;

  for (i = 0, l = sources.length; i < l; i++) {
    v = sources[i];
    seen[v] = 0;
    fringe.push([0, count++, v]);

    if (paths)
      paths[v] = [v];
  }

  while (fringe.size) {
    item = fringe.pop();
    d = item[0];
    v = item[2];

    if (v in distances)
      continue;

    distances[v] = d;

    if (v === target)
      break;

    edges = graph.outboundEdges(v);

    for (j = 0, m = edges.length; j < m; j++) {
      e = edges[j];
      u = graph.opposite(v, e);
      cost = getWeight(e) + distances[v];

      if (cutoff && cost > cutoff)
        continue;

      if (u in distances && cost < distances[u]) {
        throw Error('graphology-shortest-path/dijkstra: contradictory paths found. Do some of your edges have a negative weight?');
      }

      else if (!(u in seen) || cost < seen[u]) {
        seen[u] = cost;
        fringe.push([cost, count++, u]);

        if (paths)
          paths[u] = paths[v].concat(u);
      }
    }
  }

  return distances;
}

/**
 * Single source Dijkstra shortest path between given node & other nodes in
 * the graph.
 *
 * @param  {Graph}  graph           - The graphology instance.
 * @param  {string} source          - Source node.
 * @param  {string} weightAttribute - Name of the weight attribute.
 * @return {object}                 - An object of found paths.
 */
function singleSourceDijkstra(graph, source, weightAttribute) {
  var paths = {};

  abstractDijkstraMultisource(
    graph,
    [source],
    weightAttribute,
    0,
    null,
    paths
  );

  return paths;
}

function bidirectionalDijkstra(graph, source, target, weightAttribute) {
  return abstractBidirectionalDijkstra(graph, source, target, weightAttribute)[1];
}

/**
 * Function using Ulrik Brandes' method to map single source shortest paths
 * from selected node.
 *
 * [Reference]:
 * Ulrik Brandes: A Faster Algorithm for Betweenness Centrality.
 * Journal of Mathematical Sociology 25(2):163-177, 2001.
 *
 * @param  {Graph}  graph           - Target graph.
 * @param  {any}    source          - Source node.
 * @param  {string} weightAttribute - Name of the weight attribute.
 * @return {array}                  - [Stack, Paths, Sigma]
 */
function brandes(graph, source, weightAttribute) {
  source = '' + source;
  weightAttribute = weightAttribute || DEFAULTS.weightAttribute;

  var S = [],
      P = {},
      sigma = {};

  var nodes = graph.nodes(),
      edges,
      item,
      pred,
      dist,
      cost,
      v,
      w,
      e,
      i,
      l;

  for (i = 0, l = nodes.length; i < l; i++) {
    v = nodes[i];
    P[v] = [];
    sigma[v] = 0;
  }

  var D = {};

  sigma[source] = 1;

  var seen = {};
  seen[source] = 0;

  var count = 0;

  var Q = new Heap(BRANDES_DIJKSTRA_HEAP_COMPARATOR);
  Q.push([0, count++, source, source]);

  while (Q.size) {
    item = Q.pop();
    dist = item[0];
    pred = item[2];
    v = item[3];

    if (v in D)
      continue;

    sigma[v] += sigma[pred];
    S.push(v);
    D[v] = dist;

    edges = graph.outboundEdges(v);

    for (i = 0, l = edges.length; i < l; i++) {
      e = edges[i];
      w = graph.opposite(v, e);
      cost = dist + (graph.getEdgeAttribute(e, weightAttribute) || 1);

      if (!(w in D) && (!(w in seen) || cost < seen[w])) {
        seen[w] = cost;
        Q.push([cost, count++, v, w]);
        sigma[w] = 0;
        P[w] = [v];
      }
      else if (cost === seen[w]) {
        sigma[w] += sigma[v];
        P[w].push(v);
      }
    }
  }

  return [S, P, sigma];
}

/**
 * Exporting.
 */
module.exports = {
  bidirectional: bidirectionalDijkstra,
  singleSource: singleSourceDijkstra,
  brandes: brandes
};
