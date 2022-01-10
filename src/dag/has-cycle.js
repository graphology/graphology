/**
 * Graphology Cycle Detection
 * ===========================
 *
 * Function returning whether the given graph contains at least one cycle.
 *
 * This function also works on disconnected graphs.
 *
 * [Reference]:
 * https://newbedev.com/how-to-detect-cycles-in-a-directed-graph-using-the-iterative-version-of-dfs
 */
const isGraph = require('graphology-utils/is-graph');

const WHITE = undefined;
const GREY = 0;
const BLACK = 1;

module.exports = function hasCycle(graph) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-dag/has-cycle: the given graph is not a valid graphology instance.'
    );

  // Early exit
  if (graph.size === 0) return false;

  // If the graph has a self loop, it contains a cycle by definition
  if (graph.selfLoopCount !== 0) return true;

  const labels = {};
  const stack = [];

  function neighborCallback(neighbor) {
    const neighborLabel = labels[neighbor];

    if (neighborLabel === WHITE) stack.push(neighbor);
    else if (neighborLabel === GREY) return true;

    return false;
  }

  // We iterate over all nodes to be able to handle disconnected graphs
  // NOTE: possibility to early exit when we know that all nodes have already
  // been traversed
  return graph.someNode(node => {
    // Node was already seen
    if (labels[node] === BLACK) return false;

    stack.push(node);

    while (stack.length !== 0) {
      const current = stack[stack.length - 1]; // peek
      const currentLabel = labels[current];

      if (currentLabel !== GREY) {
        labels[current] = GREY;

        const shouldStop = graph.someOutboundNeighbor(
          current,
          neighborCallback
        );

        if (shouldStop) return true;
      } else if (currentLabel === GREY) {
        stack.pop();
        labels[current] = BLACK;
      }
    }

    return false;
  });
};
