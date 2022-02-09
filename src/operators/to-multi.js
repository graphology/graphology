/**
 * Graphology Operators To Multi Caster
 * =====================================
 *
 * Function used to cast any graph to a multi one.
 */
var isGraph = require('graphology-utils/is-graph');

module.exports = function toMulti(graph) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-operators/to-multi: expecting a valid graphology instance.'
    );

  return graph.copy({multi: true});
};
