/**
 * Graphology Force Layout
 * ========================
 *
 * A simple force-directed layout algorithm for graphology.
 */
const isGraph = require('graphology-utils/is-graph');
const resolveDefaults = require('graphology-utils/defaults');

const iterate = require('./iterate.js');
const helpers = require('./helpers.js');

const DEFAULTS = require('./defaults.js');

/**
 * Asbtract function used to run the layout for a certain number of iterations.
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
      'graphology-layout-force: the given graph is not a valid graphology instance.'
    );

  if (typeof params === 'number') params = {maxIterations: params};
  else params = params || {};

  const maxIterations = params.maxIterations;

  params = resolveDefaults(params, DEFAULTS);

  if (typeof maxIterations !== 'number' || maxIterations <= 0)
    throw new Error(
      'graphology-layout-force: you should provide a positive number of maximum iterations.'
    );

  // Iteration state
  const nodeStates = {};
  let result = null;
  let i;

  // Iterating
  for (i = 0; i < maxIterations; i++) {
    result = iterate(graph, nodeStates, params);

    if (result.converged) break;
  }

  // Applying
  if (assign) {
    helpers.assignLayoutChanges(graph, nodeStates, params);
    return;
  }

  return helpers.collectLayoutChanges(nodeStates);
}

/**
 * Exporting.
 */
const synchronousLayout = abstractSynchronousLayout.bind(null, false);
synchronousLayout.assign = abstractSynchronousLayout.bind(null, true);

module.exports = synchronousLayout;
