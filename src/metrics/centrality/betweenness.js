/**
 * Graphology Betweenness Centrality
 * ==================================
 *
 * Function computing betweenness centrality.
 */
var isGraph = require('graphology-utils/is-graph'),
    lib = require('graphology-shortest-path/indexed-brandes'),
    defaults = require('lodash/defaults');

var createUnweightedIndexedBrandes = lib.createUnweightedIndexedBrandes,
    createDijkstraIndexedBrandes = lib.createDijkstraIndexedBrandes;

/**
 * Defaults.
 */
var DEFAULTS = {
  attributes: {
    centrality: 'betweennessCentrality',
    weight: 'weight'
  },
  normalized: true,
  weighted: false
};

/**
 * Abstract function computing beetweenness centrality for the given graph.
 *
 * @param  {boolean} assign           - Assign the results to node attributes?
 * @param  {Graph}   graph            - Target graph.
 * @param  {object}  [options]        - Options:
 * @param  {object}    [attributes]   - Attribute names:
 * @param  {string}      [weight]     - Name of the weight attribute.
 * @param  {string}      [centrality] - Name of the attribute to assign.
 * @param  {boolean} [normalized]     - Should the centrality be normalized?
 * @param  {boolean} [weighted]       - Weighted graph?
 * @param  {object}
 */
function abstractBetweennessCentrality(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error('graphology-centrality/beetweenness-centrality: the given graph is not a valid graphology instance.');

  // Solving options
  options = defaults({}, options, DEFAULTS);

  var weightAttribute = options.attributes.weight,
      centralityAttribute = options.attributes.centrality,
      normalized = options.normalized,
      weighted = options.weighted;

  var brandes = weighted ?
    createDijkstraIndexedBrandes(graph, weightAttribute) :
    createUnweightedIndexedBrandes(graph);

  var N = graph.order;

  var result,
      S,
      P,
      sigma,
      coefficient,
      i,
      j,
      m,
      v,
      w;

  var delta = new Float64Array(N),
      centralities = new Float64Array(N);

  // Iterating over each node
  for (i = 0; i < N; i++) {
    result = brandes(i);

    S = result[0];
    P = result[1];
    sigma = result[2];

    // Accumulating
    j = S.size;

    while (j--)
      delta[S.items[S.size - j]] = 0;

    while (S.size !== 0) {
      w = S.pop();
      coefficient = (1 + delta[w]) / sigma[w];

      for (j = 0, m = P[w].length; j < m; j++) {
        v = P[w][j];
        delta[v] += sigma[v] * coefficient;
      }

      if (w !== i)
        centralities[w] += delta[w];
    }
  }

  // Rescaling
  var scale = null;

  if (normalized)
    scale = N <= 2 ? null : (1 / ((N - 1) * (N - 2)));
  else
    scale = graph.type === 'undirected' ? 0.5 : null;

  if (scale !== null) {
    for (i = 0; i < N; i++)
      centralities[i] *= scale;
  }

  if (assign)
    return brandes.index.assign(centralityAttribute, centralities);

  return brandes.index.collect(centralities);
}

/**
 * Exporting.
 */
var betweennessCentrality = abstractBetweennessCentrality.bind(null, false);
betweennessCentrality.assign = abstractBetweennessCentrality.bind(null, true);

module.exports = betweennessCentrality;
