/**
 * Graphology HITS Algorithm
 * ==========================
 *
 * Implementation of the HITS algorithm for the graphology specs.
 */
var resolveDefaults = require('graphology-utils/defaults');
var isGraph = require('graphology-utils/is-graph');
var createEdgeWeightGetter =
  require('graphology-utils/getters').createEdgeWeightGetter;

// TODO: optimize using NeighborhoodIndex

/**
 * Defaults.
 */
var DEFAULTS = {
  nodeAuthorityAttribute: 'authority',
  nodeHubAttribute: 'hub',
  getEdgeWeight: 'weight',
  maxIterations: 100,
  normalize: true,
  tolerance: 1e-8
};

/**
 * Function returning an object with the given keys set to the given value.
 *
 * @param  {array}  keys  - Keys to set.
 * @param  {number} value - Value to set.
 * @return {object}       - The created object.
 */
function dict(keys, value) {
  var o = Object.create(null);

  var i, l;

  for (i = 0, l = keys.length; i < l; i++) o[keys[i]] = value;

  return o;
}

/**
 * Function returning the sum of an object's values.
 *
 * @param  {object} o - Target object.
 * @return {number}   - The sum.
 */
function sum(o) {
  var nb = 0;

  for (var k in o) nb += o[k];

  return nb;
}

/**
 * HITS function taking a Graph instance & some options and returning a map
 * of nodes to their hubs & authorities.
 *
 * @param  {boolean} assign    - Should we assign the results as node attributes?
 * @param  {Graph}   graph     - A Graph instance.
 * @param  {object}  [options] - Options:
 * @param  {number}    [maxIterations] - Maximum number of iterations to perform.
 * @param  {boolean}   [normalize]     - Whether to normalize the results by the
 *                                       sum of all values.
 * @param  {number}    [tolerance]     - Error tolerance used to check
 *                                       convergence in power method iteration.
 */
function hits(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-hits: the given graph is not a valid graphology instance.'
    );

  if (graph.multi)
    throw new Error(
      'graphology-hits: the HITS algorithm does not work with MultiGraphs.'
    );

  options = resolveDefaults(options, DEFAULTS);

  var getEdgeWeight = createEdgeWeightGetter(options.getEdgeWeight).fromEntry;

  // Variables
  var order = graph.order;
  var nodes = graph.nodes();
  var edges;
  var hubs = dict(nodes, 1 / order);
  var weights = {};
  var converged = false;
  var lastHubs;
  var authorities;

  // Iteration variables
  var node, neighbor, edge, iteration, maxAuthority, maxHub, error, S, i, j, m;

  // Indexing weights
  graph.forEachEdge(function (e, a, s, t, sa, ta, u) {
    weights[e] = getEdgeWeight(e, a, s, t, sa, ta, u);
  });

  // Performing iterations
  for (iteration = 0; iteration < options.maxIterations; iteration++) {
    lastHubs = hubs;
    hubs = dict(nodes, 0);
    authorities = dict(nodes, 0);
    maxHub = 0;
    maxAuthority = 0;

    // Iterating over nodes to update authorities
    for (i = 0; i < order; i++) {
      node = nodes[i];
      edges = graph.outboundEdges(node);

      // Iterating over neighbors
      for (j = 0, m = edges.length; j < m; j++) {
        edge = edges[j];
        neighbor = graph.opposite(node, edge);

        authorities[neighbor] += lastHubs[node] * weights[edge];

        if (authorities[neighbor] > maxAuthority)
          maxAuthority = authorities[neighbor];
      }
    }

    // Iterating over nodes to update hubs
    for (i = 0; i < order; i++) {
      node = nodes[i];
      edges = graph.outboundEdges(node);

      for (j = 0, m = edges.length; j < m; j++) {
        edge = edges[j];
        neighbor = graph.opposite(node, edge);

        hubs[node] += authorities[neighbor] * weights[edge];

        if (hubs[neighbor] > maxHub) maxHub = hubs[neighbor];
      }
    }

    // Normalizing
    S = 1 / maxHub;

    for (node in hubs) hubs[node] *= S;

    S = 1 / maxAuthority;

    for (node in authorities) authorities[node] *= S;

    // Checking convergence
    error = 0;

    for (node in hubs) error += Math.abs(hubs[node] - lastHubs[node]);

    if (error < options.tolerance) {
      converged = true;
      break;
    }
  }

  if (!converged)
    throw Error('graphology-metrics/centrality/hits: failed to converge.');

  // Should we normalize the result?
  if (options.normalize) {
    S = 1 / sum(authorities);

    for (node in authorities) authorities[node] *= S;

    S = 1 / sum(hubs);

    for (node in hubs) hubs[node] *= S;
  }

  // Should we assign the results to the graph?
  if (assign) {
    graph.updateEachNodeAttributes(
      function (n, attr) {
        attr[options.nodeAuthorityAttribute] = authorities[n];
        attr[options.nodeHubAttribute] = hubs[n];

        return attr;
      },
      {
        attributes: [options.nodeAuthorityAttribute, options.nodeHubAttribute]
      }
    );

    return;
  }

  return {hubs: hubs, authorities: authorities};
}

/**
 * Exporting.
 */
var main = hits.bind(null, false);
main.assign = hits.bind(null, true);

module.exports = main;
