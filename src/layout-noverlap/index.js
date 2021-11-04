/**
 * Graphology Noverlap Layout
 * ===========================
 *
 * Library endpoint.
 */
var isGraph = require('graphology-utils/is-graph');
var iterate = require('./iterate.js');
var helpers = require('./helpers.js');

var DEFAULT_SETTINGS = require('./defaults.js');
var DEFAULT_MAX_ITERATIONS = 500;

/**
 * Asbtract function used to run a certain number of iterations.
 *
 * @param  {boolean}       assign       - Whether to assign positions.
 * @param  {Graph}         graph        - Target graph.
 * @param  {object|number} params       - If number, params.maxIterations, else:
 * @param  {number}          maxIterations - Maximum number of iterations.
 * @param  {object}          [settings] - Settings.
 * @return {object|undefined}
 */
function abstractSynchronousLayout(assign, graph, params) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout-noverlap: the given graph is not a valid graphology instance.'
    );

  if (typeof params === 'number') params = {maxIterations: params};
  else params = params || {};

  var maxIterations = params.maxIterations || DEFAULT_MAX_ITERATIONS;

  if (typeof maxIterations !== 'number' || maxIterations <= 0)
    throw new Error(
      'graphology-layout-force: you should provide a positive number of maximum iterations.'
    );

  // Validating settings
  var settings = Object.assign({}, DEFAULT_SETTINGS, params.settings),
    validationError = helpers.validateSettings(settings);

  if (validationError)
    throw new Error('graphology-layout-noverlap: ' + validationError.message);

  // Building matrices
  var matrix = helpers.graphToByteArray(graph, params.inputReducer),
    converged = false,
    i;

  // Iterating
  for (i = 0; i < maxIterations && !converged; i++)
    converged = iterate(settings, matrix).converged;

  // Applying
  if (assign) {
    helpers.assignLayoutChanges(graph, matrix, params.outputReducer);
    return;
  }

  return helpers.collectLayoutChanges(graph, matrix, params.outputReducer);
}

/**
 * Exporting.
 */
var synchronousLayout = abstractSynchronousLayout.bind(null, false);
synchronousLayout.assign = abstractSynchronousLayout.bind(null, true);

module.exports = synchronousLayout;
