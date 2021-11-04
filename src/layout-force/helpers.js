/**
 * Graphology Force Layout Helpers
 * ================================
 *
 * Miscellaneous helper functions related to the force layout.
 */
exports.initializeNodeStates = function (graph, attributes) {
  const {x, y} = attributes;

  const nodeStates = {};

  graph.forEachNode((n, attr) => {
    nodeStates[n] = {
      dx: 0,
      dy: 0,
      x: attr[x] || 0,
      y: attr[y] || 0
    };
  });

  return nodeStates;
};

exports.assignLayoutChanges = function (graph, nodeStates, attributes) {
  const {x, y} = attributes;

  graph.updateEachNodeAttributes(
    (n, attr) => {
      const state = nodeStates[n];

      if (!state) return attr;

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
