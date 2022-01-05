/**
 * Graphology Force Layout Iteration
 * ==================================
 *
 * Function describing a single iteration of the force layout.
 */
const {
  createNodeValueGetter,
  createEdgeValueGetter
} = require('graphology-utils/getters');

// const EPSILON = -Infinity;

// function isVeryCloseToZero(x) {
//   return Math.abs(x) < EPSILON;
// }

module.exports = function iterate(graph, nodeStates, params) {
  const {nodeXAttribute: xKey, nodeYAttribute: yKey} = params;
  const {attraction, repulsion, gravity, inertia, maxMove} = params.settings;

  let {shouldSkipNode, shouldSkipEdge, isNodeFixed} = params;

  isNodeFixed = createNodeValueGetter(isNodeFixed);
  shouldSkipNode = createNodeValueGetter(shouldSkipNode, false);
  shouldSkipEdge = createEdgeValueGetter(shouldSkipEdge, false);

  const nodes = graph.filterNodes((n, attr) => {
    return !shouldSkipNode.fromEntry(n, attr);
  });

  const adjustedOrder = nodes.length;

  // Check nodeStatess and inertia
  for (let i = 0; i < adjustedOrder; i++) {
    const n = nodes[i];
    const attr = graph.getNodeAttributes(n);
    const nodeState = nodeStates[n];

    if (!nodeState)
      nodeStates[n] = {
        dx: 0,
        dy: 0,
        x: attr[xKey] || 0,
        y: attr[yKey] || 0
      };
    else
      nodeStates[n] = {
        dx: nodeState.dx * inertia,
        dy: nodeState.dy * inertia,
        x: attr[xKey] || 0,
        y: attr[yKey] || 0
      };
  }

  // Repulsion
  if (repulsion)
    for (let i = 0; i < adjustedOrder; i++) {
      const n1 = nodes[i];
      const n1State = nodeStates[n1];

      for (let j = i + 1; j < adjustedOrder; j++) {
        const n2 = nodes[j];
        const n2State = nodeStates[n2];

        // Compute distance:
        const dx = n2State.x - n1State.x;
        const dy = n2State.y - n1State.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        // Repulse nodes relatively to 1 / distance:
        const repulsionX = (repulsion / distance) * dx;
        const repulsionY = (repulsion / distance) * dy;
        n1State.dx -= repulsionX;
        n1State.dy -= repulsionY;
        n2State.dx += repulsionX;
        n2State.dy += repulsionY;
      }
    }

  // Attraction
  if (attraction)
    graph.forEachEdge(
      (edge, attr, source, target, sourceAttr, targetAttr, undirected) => {
        if (source === target) return;

        if (
          shouldSkipNode.fromEntry(source, sourceAttr) ||
          shouldSkipNode.fromEntry(target, targetAttr)
        )
          return;

        if (
          shouldSkipEdge.fromEntry(
            edge,
            attr,
            source,
            target,
            sourceAttr,
            targetAttr,
            undirected
          )
        )
          return;

        const n1State = nodeStates[source];
        const n2State = nodeStates[target];

        // Compute distance:
        const dx = n2State.x - n1State.x;
        const dy = n2State.y - n1State.y;

        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        // Attract nodes relatively to their distance:
        const attractionX = attraction * distance * dx;
        const attractionY = attraction * distance * dy;
        n1State.dx += attractionX;
        n1State.dy += attractionY;
        n2State.dx -= attractionX;
        n2State.dy -= attractionY;
      }
    );

  // Gravity
  if (gravity)
    for (let i = 0; i < adjustedOrder; i++) {
      const n = nodes[i];
      const nodeState = nodeStates[n];

      // Attract nodes to [0, 0] relatively to the distance:
      const {x, y} = nodeState;
      const distance = Math.sqrt(x * x + y * y) || 1;
      nodeStates[n].dx -= x * gravity * distance;
      nodeStates[n].dy -= y * gravity * distance;
    }

  // Apply forces
  const converged = false;

  for (let i = 0; i < adjustedOrder; i++) {
    const n = nodes[i];
    const nodeState = nodeStates[n];

    const distance = Math.sqrt(
      nodeState.dx * nodeState.dx + nodeState.dy * nodeState.dy
    );

    if (distance > maxMove) {
      nodeState.dx *= maxMove / distance;
      nodeState.dy *= maxMove / distance;
    }

    // if (!isVeryCloseToZero(nodeState.dx) || !isVeryCloseToZero(nodeState.dy)) {
    //   converged = false;
    // }

    if (!isNodeFixed.fromGraph(graph, n)) {
      nodeState.x += nodeState.dx;
      nodeState.y += nodeState.dy;
      nodeState.fixed = false;
    } else {
      nodeState.fixed = true;
    }

    // NOTE: possibility to assign here to save one loop in the future
  }

  return {converged};
};
