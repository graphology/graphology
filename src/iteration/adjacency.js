/**
 * Graphology Adjacency Iteration
 * ================================
 *
 * Attaching some methods to the Graph class to be able to iterate over a
 * graph's adjacency.
 */

/**
 * Function iterating over a simple graph's adjacency using a callback.
 *
 * @param {boolean}  breakable - Can we break?
 * @param {Graph}    graph     - Target Graph instance.
 * @param {callback} function  - Iteration callback.
 */
export function forEachAdjacencySimple(breakable, graph, callback) {
  const iterator = graph._nodes.values();

  const type = graph.type;

  let step, sourceData, neighbor, adj, edgeData, targetData, shouldBreak;

  while ((step = iterator.next(), step.done !== true)) {
    sourceData = step.value;

    if (type !== 'undirected') {
      adj = sourceData.out;

      for (neighbor in adj) {
        edgeData = adj[neighbor];
        targetData = edgeData.target;

        shouldBreak = callback(
          sourceData.key,
          targetData.key,
          sourceData.attributes,
          targetData.attributes,
          edgeData.key,
          edgeData.attributes,
          edgeData.undirected,
          edgeData.generatedKey
        );

        if (breakable && shouldBreak)
          return;
      }
    }

    if (type !== 'directed') {
      adj = sourceData.undirected;

      for (neighbor in adj) {
        edgeData = adj[neighbor];
        targetData = edgeData.target;

        if (targetData.key !== neighbor)
          targetData = edgeData.source;

        shouldBreak = callback(
          sourceData.key,
          targetData.key,
          sourceData.attributes,
          targetData.attributes,
          edgeData.key,
          edgeData.attributes,
          edgeData.undirected,
          edgeData.generatedKey
        );

        if (breakable && shouldBreak)
          return;
      }
    }
  }
}

/**
 * Function iterating over a multi graph's adjacency using a callback.
 *
 * @param {boolean}  breakable - Can we break?
 * @param {Graph}    graph    - Target Graph instance.
 * @param {callback} function - Iteration callback.
 */
export function forEachAdjacencyMulti(breakable, graph, callback) {
  const iterator = graph._nodes.values();

  const type = graph.type;

  let step, sourceData, neighbor, container, containerStep, adj, edgeData, targetData, shouldBreak;

  while ((step = iterator.next(), step.done !== true)) {
    sourceData = step.value;

    if (type !== 'undirected') {
      adj = sourceData.out;

      for (neighbor in adj) {
        container = adj[neighbor].values();

        while ((containerStep = container.next(), containerStep.done !== true)) {
          edgeData = containerStep.value;
          targetData = edgeData.target;

          shouldBreak = callback(
            sourceData.key,
            targetData.key,
            sourceData.attributes,
            targetData.attributes,
            edgeData.key,
            edgeData.attributes,
            edgeData.undirected,
            edgeData.generatedKey
          );

          if (breakable && shouldBreak)
            return;
        }
      }
    }

    if (type !== 'directed') {
      adj = sourceData.undirected;

      for (neighbor in adj) {
        container = adj[neighbor].values();

        while ((containerStep = container.next(), containerStep.done !== true)) {
          edgeData = containerStep.value;
          targetData = edgeData.target;

          if (targetData.key !== neighbor)
            targetData = edgeData.source;

          shouldBreak = callback(
            sourceData.key,
            targetData.key,
            sourceData.attributes,
            targetData.attributes,
            edgeData.key,
            edgeData.attributes,
            edgeData.undirected,
            edgeData.generatedKey
          );

          if (breakable && shouldBreak)
            return;
        }
      }
    }
  }
}
