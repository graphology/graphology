/**
 * Graphology Force Layout
 * ========================
 *
 * A simple force-directed layout algorithm for graphology.
 */
function hashPair(s, t) {
  if (s < t) return s + '§' + t;
  return t + '§' + s;
}

module.exports = function iterate(graph, nodeStates, options) {
  const {shouldSkipNode, shouldSkipEdge, attributes} = options;
  const {x: xName, y: yName, fixed: fixedName} = attributes;
  const {attraction, repulsion, gravity, inertia, maxMove} = options.settings;

  const isNodeFixed =
    typeof fixedName === 'function' ? fixedName : (_, attr) => attr[fixedName];

  const nodes = graph.filterNodes((n, attr) => {
    return !shouldSkipNode(n, attr);
  });

  const adjustedOrder = nodes.length;

  // Check nodeStatess and inertia
  for (let i = 0; i < adjustedOrder; i++) {
    const n = nodes[i];
    const attr = graph.getNodeAttributes(n);

    if (!nodeStates[n])
      nodeStates[n] = {
        dx: 0,
        dy: 0,
        x: attr[xName] || 0,
        y: attr[yName] || 0
      };
    else
      nodeStates[n] = {
        dx: nodeStates[n].dx * inertia,
        dy: nodeStates[n].dy * inertia,
        x: attr[xName] || 0,
        y: attr[yName] || 0
      };
  }

  const distancesCache = {};

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

        distancesCache[hashPair(n1, n2)] = distance;

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
          shouldSkipNode(source, sourceAttr) ||
          shouldSkipNode(target, targetAttr)
        )
          return;

        if (
          shouldSkipEdge(
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
        const distance = distancesCache[hashPair(source, target)];

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
  let converged = true;

  graph.updateEachNodeAttributes(
    (n, attr) => {
      const nodeState = nodeStates[n];

      const distance = Math.sqrt(
        nodeState.dx * nodeState.dx + nodeState.dy * nodeState.dy
      );

      if (distance > maxMove) {
        converged = false;
        nodeState.dx *= maxMove / distance;
        nodeState.dy *= maxMove / distance;
      }

      if (isNodeFixed(n, attr)) {
        attr[xName] = nodeState.x + nodeState.dx;
        attr[yName] = nodeState.y + nodeState.dy;
      }

      return attr;
    },
    {attributes: ['x', 'y']}
  );

  return {converged};
};
