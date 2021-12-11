/**
 * Graphology Sparsification Global Threshold
 * ===========================================
 *
 * Very simple sparsification scheme that prunes edges whose weight is lower
 * than some given global threshold.
 */
const isGraph = require('graphology-utils/is-graph');
const resolveDefault = require('graphology-utils/defaults');
const createEdgeWeightGetter =
  require('graphology-utils/getters').createEdgeWeightGetter;
const utils = require('./utils.js');

const DEFAULTS = {
  edgeRedundantAttribute: 'redundant',
  getEdgeWeight: 'weight'
};

function globalThreshold(graph, threshold, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-sparsification/global-threshold: invalid graph instance.'
    );

  if (typeof threshold !== 'number')
    throw new Error(
      'graphology-sparsification/global-threshold: expecting a numerical threshold.'
    );

  options = resolveDefault(options, DEFAULTS);

  const getEdgeWeight = createEdgeWeightGetter(options.getEdgeWeight).fromEntry;

  const pruned = [];

  graph.forEachEdge(function (e, a, s, t, sa, ta, u) {
    const weight = getEdgeWeight(e, a, s, t, sa, ta, u);

    if (weight < threshold) pruned.push(e);
  });

  return pruned;
}

/**
 * Exports.
 */
globalThreshold.assign = utils.createAssignFunction(
  globalThreshold,
  (_g, _t, options) => options
);
globalThreshold.prune = utils.createPruneFunction(globalThreshold);

module.exports = globalThreshold;
