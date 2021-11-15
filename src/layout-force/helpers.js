/**
 * Graphology Force Layout Helpers
 * ================================
 *
 * Miscellaneous helper functions related to the force layout.
 */
exports.assignLayoutChanges = function (graph, nodeStates, params) {
  const {nodeXAttribute: x, nodeYAttribute: y} = params;

  graph.updateEachNodeAttributes(
    (n, attr) => {
      const state = nodeStates[n];

      if (!state || state.fixed) return attr;

      attr[x] = state.x;
      attr[y] = state.y;

      return attr;
    },
    {attributes: ['x', 'y']}
  );
};

exports.collectLayoutChanges = function (nodeStates) {
  const mapping = {};

  for (const n in nodeStates) {
    const state = nodeStates[n];

    mapping[n] = {x: state.x, y: state.y};
  }

  return mapping;
};
