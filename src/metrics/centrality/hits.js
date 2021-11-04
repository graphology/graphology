/**
 * Graphology HITS Algorithm
 * ==========================
 *
 * Implementation of the HITS algorithm for the graphology specs.
 */
var resolveDefaults = require('graphology-utils/defaults');
var isGraph = require('graphology-utils/is-graph');

/**
 * Defaults.
 */
var DEFAULTS = {
  attributes: {
    authority: 'authority',
    hub: 'hub',
    weight: 'weight'
  },
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

  // Variables
  var order = graph.order,
    size = graph.size,
    nodes = graph.nodes(),
    edges = graph.edges(),
    hubs = dict(nodes, 1 / order),
    weights = {},
    converged = false,
    lastHubs,
    authorities;

  // Iteration variables
  var node, neighbor, edge, iteration, maxAuthority, maxHub, error, s, i, j, m;

  // Indexing weights
  for (i = 0; i < size; i++) {
    edge = edges[i];
    weights[edge] =
      graph.getEdgeAttribute(edge, options.attributes.weight) || 1;
  }

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
      edges = graph.outEdges(node).concat(graph.undirectedEdges(node));

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
      edges = graph.outEdges(node).concat(graph.undirectedEdges(node));

      for (j = 0, m = edges.length; j < m; j++) {
        edge = edges[j];
        neighbor = graph.opposite(node, edge);

        hubs[node] += authorities[neighbor] * weights[edge];

        if (hubs[neighbor] > maxHub) maxHub = hubs[neighbor];
      }
    }

    // Normalizing
    s = 1 / maxHub;

    for (node in hubs) hubs[node] *= s;

    s = 1 / maxAuthority;

    for (node in authorities) authorities[node] *= s;

    // Checking convergence
    error = 0;

    for (node in hubs) error += Math.abs(hubs[node] - lastHubs[node]);

    if (error < options.tolerance) {
      converged = true;
      break;
    }
  }

  // Should we normalize the result?
  if (options.normalize) {
    s = 1 / sum(authorities);

    for (node in authorities) authorities[node] *= s;

    s = 1 / sum(hubs);

    for (node in hubs) hubs[node] *= s;
  }

  // Should we assign the results to the graph?
  if (assign) {
    for (i = 0; i < order; i++) {
      node = nodes[i];
      graph.setNodeAttribute(
        node,
        options.attributes.authority,
        authorities[node]
      );
      graph.setNodeAttribute(node, options.attributes.hub, hubs[node]);
    }
  }

  return {converged: converged, hubs: hubs, authorities: authorities};
}

/**
 * Exporting.
 */
var main = hits.bind(null, false);
main.assign = hits.bind(null, true);

module.exports = main;
