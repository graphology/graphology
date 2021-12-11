/**
 * Graphology Sparsification Utils
 * ================================
 *
 * Miscellaneous utils used by graphology-sparsification.
 */
exports.createAssignFunction = function (fn, optionsGetter) {
  return function assign() {
    const name =
      (optionsGetter.apply(null, arguments) || {}).edgeRedundantAttribute ||
      'redundant';

    const edges = fn.apply(null, arguments);
    const graph = arguments[0];

    for (let i = 0, l = edges.length; i < l; i++) {
      graph.setEdgeAttribute(edges[i], name, true);
    }
  };
};

exports.createPruneFunction = function (fn) {
  return function prune() {
    const edges = fn.apply(null, arguments);
    const graph = arguments[0];

    for (let i = 0, l = edges.length; i < l; i++) {
      graph.dropEdge(edges[i]);
    }
  };
};
