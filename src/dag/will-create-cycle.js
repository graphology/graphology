/**
 * Graphology Cycle Creation Checker
 * ==================================
 *
 * Function returning whether adding the given directed edge to a DAG will
 * create a cycle.
 *
 * Note that this function requires the given graph to be a valid DAG forest
 * and will not check it beforehand for performance reasons.
 */
const isGraph = require('graphology-utils/is-graph');

module.exports = function willCreateCycle(graph, source, target) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-dag/will-create-cycle: the given graph is not a valid graphology instance.'
    );

  source = '' + source;
  target = '' + target;

  // If the edge is a self loop, it will obviously add a cycle
  if (source === target) return true;

  // If any of the pointed nodes isn't in the graph yet,
  // then no cycle can be created by adding this edge
  if (!graph.hasNode(source) || !graph.hasNode(target)) return false;

  // Early exit for existing edge or mutual one
  if (graph.hasDirectedEdge(source, target)) return false;
  if (graph.hasDirectedEdge(target, source)) return true;

  // Else, we need to assess whether a directed path between target and source
  // can be found. We will use DFS traversal because it is usually less
  // costly than BFS (stack vs. queue).
  const stack = graph.outNeighbors(target);

  function push(neighbor) {
    // NOTE: we don't check whether pushed neighbors have not been seen
    // because this is not necessary in a DAG. This could result in
    // undefined behavior for cyclic graphs, ranging from infinite loop to
    // overkill memory usage.
    stack.push(neighbor);
  }

  while (stack.length !== 0) {
    const node = stack.pop();

    if (node === source) return true;

    graph.forEachOutNeighbor(node, push);
  }

  return false;
};
