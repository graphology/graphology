/**
 * Graphology ForceAtlas2 Layout
 * ==============================
 *
 * Library endpoint.
 */
var isGraph = require('graphology-utils/is-graph'),
    iterate = require('./iterate.js'),
    helpers = require('./helpers.js');

var DEFAULT_SETTINGS = require('./defaults.js');

/**
 * Asbtract function used to run a certain number of iterations.
 *
 * @param  {boolean}       assign       - Whether to assign positions.
 * @param  {Graph}         graph        - Target graph.
 * @param  {object|number} params       - If number, params.iterations, else:
 * @param  {number}          iterations - Number of iterations.
 * @param  {object}          [settings] - Settings.
 * @return {object|undefined}
 */
function abstractSynchronousLayout(assign, graph, params) {
  if (!isGraph(graph))
    throw new Error('graphology-layout-forceatlas2: the given graph is not a valid graphology instance.');

  if (typeof params === 'number')
    params = {iterations: params};

  var iterations = params.iterations;

  if (typeof iterations !== 'number')
    throw new Error('graphology-layout-forceatlas2: invalid number of iterations.');

  if (iterations <= 0)
    throw new Error('graphology-layout-forceatlas2: you should provide a positive number of iterations.');

  // Validating settings
  var settings = helpers.assign({}, DEFAULT_SETTINGS, params.settings),
      validationError = helpers.validateSettings(settings);

  if (validationError)
    throw new Error('graphology-layout-forceatlas2: ' + validationError.message);

  // Building matrices
  var matrices = helpers.graphToByteArrays(graph),
      i;

  // Iterating
  for (i = 0; i < iterations; i++)
    iterate(settings, matrices.nodes, matrices.edges);

  // Applying
  if (assign) {
    helpers.assignLayoutChanges(graph, matrices.nodes);
    return;
  }

  return helpers.collectLayoutChanges(graph, matrices.nodes);
}

/**
 * Function returning sane layout settings for the given graph.
 *
 * @param  {Graph|number} graph - Target graph or graph order.
 * @return {object}
 */
function inferSettings(graph) {
  var order = typeof graph === 'number' ? graph : graph.order;

  return {
    barnesHutOptimize: order > 2000,
    strongGravityMode: true,
    gravity: 0.05,
    scalingRatio: 10,
    slowDown: 1 + Math.log(order)
  };
}

/**
 * Exporting.
 */
var synchronousLayout = abstractSynchronousLayout.bind(null, false);
synchronousLayout.assign = abstractSynchronousLayout.bind(null, true);
synchronousLayout.inferSettings = inferSettings;

module.exports = synchronousLayout;
