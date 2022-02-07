/**
 * Graphology Adjacency Iteration
 * ===============================
 *
 * Attaching some methods to the Graph class to be able to iterate over a
 * graph's adjacency.
 */

/**
 * Function iterating over a simple graph's adjacency using a callback.
 *
 * @param {boolean}  breakable         - Can we break?
 * @param {boolean}  assymetric        - Whether to emit undirected edges only once.
 * @param {boolean}  disconnectedNodes - Whether to emit disconnected nodes.
 * @param {Graph}    graph             - Target Graph instance.
 * @param {callback} function          - Iteration callback.
 */
export function forEachAdjacencySimple(
  breakable,
  assymetric,
  disconnectedNodes,
  graph,
  callback
) {
  const iterator = graph._nodes.values();

  const type = graph.type;

  let step, sourceData, neighbor, adj, edgeData, targetData, shouldBreak;

  while (((step = iterator.next()), step.done !== true)) {
    let hasEdges = false;

    sourceData = step.value;

    if (type !== 'undirected') {
      adj = sourceData.out;

      for (neighbor in adj) {
        edgeData = adj[neighbor];
        targetData = edgeData.target;

        hasEdges = true;
        shouldBreak = callback(
          sourceData.key,
          targetData.key,
          sourceData.attributes,
          targetData.attributes,
          edgeData.key,
          edgeData.attributes,
          edgeData.undirected
        );

        if (breakable && shouldBreak) return edgeData;
      }
    }

    if (type !== 'directed') {
      adj = sourceData.undirected;

      for (neighbor in adj) {
        if (assymetric && sourceData.key > neighbor) continue;

        edgeData = adj[neighbor];
        targetData = edgeData.target;

        if (targetData.key !== neighbor) targetData = edgeData.source;

        hasEdges = true;
        shouldBreak = callback(
          sourceData.key,
          targetData.key,
          sourceData.attributes,
          targetData.attributes,
          edgeData.key,
          edgeData.attributes,
          edgeData.undirected
        );

        if (breakable && shouldBreak) return edgeData;
      }
    }

    if (disconnectedNodes && !hasEdges) {
      shouldBreak = callback(
        sourceData.key,
        null,
        sourceData.attributes,
        null,
        null,
        null,
        null
      );

      if (breakable && shouldBreak) return null;
    }
  }

  return;
}

/**
 * Function iterating over a multi graph's adjacency using a callback.
 *
 * @param {boolean}  breakable         - Can we break?
 * @param {boolean}  assymetric        - Whether to emit undirected edges only once.
 * @param {boolean}  disconnectedNodes - Whether to emit disconnected nodes.
 * @param {Graph}    graph             - Target Graph instance.
 * @param {callback} function          - Iteration callback.
 */
export function forEachAdjacencyMulti(
  breakable,
  assymetric,
  disconnectedNodes,
  graph,
  callback
) {
  const iterator = graph._nodes.values();

  const type = graph.type;

  let step;
  let sourceData;
  let neighbor;
  let container;
  let containerStep;
  let adj;
  let edgeData;
  let targetData;
  let shouldBreak;

  while (((step = iterator.next()), step.done !== true)) {
    let hasEdges = false;

    sourceData = step.value;

    if (type !== 'undirected') {
      adj = sourceData.out;

      for (neighbor in adj) {
        container = adj[neighbor].values();

        while (
          ((containerStep = container.next()), containerStep.done !== true)
        ) {
          edgeData = containerStep.value;
          targetData = edgeData.target;

          hasEdges = true;
          shouldBreak = callback(
            sourceData.key,
            targetData.key,
            sourceData.attributes,
            targetData.attributes,
            edgeData.key,
            edgeData.attributes,
            edgeData.undirected
          );

          if (breakable && shouldBreak) return edgeData;
        }
      }
    }

    if (type !== 'directed') {
      adj = sourceData.undirected;

      for (neighbor in adj) {
        if (assymetric && sourceData.key > neighbor) continue;

        container = adj[neighbor].values();

        while (
          ((containerStep = container.next()), containerStep.done !== true)
        ) {
          edgeData = containerStep.value;
          targetData = edgeData.target;

          if (targetData.key !== neighbor) targetData = edgeData.source;

          hasEdges = true;
          shouldBreak = callback(
            sourceData.key,
            targetData.key,
            sourceData.attributes,
            targetData.attributes,
            edgeData.key,
            edgeData.attributes,
            edgeData.undirected
          );

          if (breakable && shouldBreak) return edgeData;
        }
      }
    }

    if (disconnectedNodes && !hasEdges) {
      shouldBreak = callback(
        sourceData.key,
        null,
        sourceData.attributes,
        null,
        null,
        null,
        null
      );

      if (breakable && shouldBreak) return null;
    }
  }

  return;
}
