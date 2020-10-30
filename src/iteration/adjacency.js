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
 * @param {Graph}    graph    - Target Graph instance.
 * @param {callback} function - Iteration callback.
 */
export function forEachAdjacencySimple(graph, callback) {
  const iterator = graph._nodes.values();

  const type = graph.type;

  let step, sourceData, neighbor, adj, edgeData, targetData;

  while ((step = iterator.next(), step.done !== true)) {
    sourceData = step.value;

    if (type !== 'undirected') {
      adj = sourceData.out;

      for (neighbor in adj) {
        edgeData = adj[neighbor];
        targetData = edgeData.target;

        callback(
          sourceData.key,
          targetData.key,
          sourceData.attributes,
          targetData.attributes,
          edgeData.key,
          edgeData.attributes,
          edgeData.undirected,
          edgeData.generatedKey
        );
      }
    }

    if (type !== 'directed') {
      adj = sourceData.undirected;

      for (neighbor in adj) {
        edgeData = adj[neighbor];
        targetData = edgeData.target;

        if (targetData.key !== neighbor)
          targetData = edgeData.source;

        callback(
          sourceData.key,
          targetData.key,
          sourceData.attributes,
          targetData.attributes,
          edgeData.key,
          edgeData.attributes,
          edgeData.undirected,
          edgeData.generatedKey
        );
      }
    }
  }
}

/**
 * Function iterating over a multi graph's adjacency using a callback.
 *
 * @param {Graph}    graph    - Target Graph instance.
 * @param {callback} function - Iteration callback.
 */
export function forEachAdjacencyMulti(graph, callback) {
  const iterator = graph._nodes.values();

  const type = graph.type;

  let step, sourceData, neighbor, container, containerStep, adj, edgeData, targetData;

  while ((step = iterator.next(), step.done !== true)) {
    sourceData = step.value;

    if (type !== 'undirected') {
      adj = sourceData.out;

      for (neighbor in adj) {
        container = adj[neighbor].values();

        while ((containerStep = container.next(), containerStep.done !== true)) {
          edgeData = containerStep.value;
          targetData = edgeData.target;

          callback(
            sourceData.key,
            targetData.key,
            sourceData.attributes,
            targetData.attributes,
            edgeData.key,
            edgeData.attributes,
            edgeData.undirected,
            edgeData.generatedKey
          );
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

          callback(
            sourceData.key,
            targetData.key,
            sourceData.attributes,
            targetData.attributes,
            edgeData.key,
            edgeData.attributes,
            edgeData.undirected,
            edgeData.generatedKey
          );
        }
      }
    }
  }
}
