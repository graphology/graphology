/**
 * Graphology Operators To Mixed Caster
 * =====================================
 *
 * Function used to cast any graph to a mixed one.
 */
var isGraph = require('graphology-utils/is-graph');

module.exports = function toMixed(graph) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-operators/to-mixed: expecting a valid graphology instance.'
    );

  return graph.copy({type: 'mixed'});
};
