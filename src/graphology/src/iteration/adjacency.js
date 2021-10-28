/**
 * Graphology Adjacency Iteration
 * ================================
 *
 * Attaching some methods to the Graph class to be able to iterate over a
 * graph's adjacency.
 */
import Iterator from 'obliterator/iterator';

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

  while (((step = iterator.next()), step.done !== true)) {
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
          edgeData.undirected
        );

        if (breakable && shouldBreak) return edgeData.key;
      }
    }

    if (type !== 'directed') {
      adj = sourceData.undirected;

      for (neighbor in adj) {
        edgeData = adj[neighbor];
        targetData = edgeData.target;

        if (targetData.key !== neighbor) targetData = edgeData.source;

        shouldBreak = callback(
          sourceData.key,
          targetData.key,
          sourceData.attributes,
          targetData.attributes,
          edgeData.key,
          edgeData.attributes,
          edgeData.undirected
        );

        if (breakable && shouldBreak) return edgeData.key;
      }
    }
  }

  return;
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

  let step,
    sourceData,
    neighbor,
    container,
    containerStep,
    adj,
    edgeData,
    targetData,
    shouldBreak;

  while (((step = iterator.next()), step.done !== true)) {
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

          shouldBreak = callback(
            sourceData.key,
            targetData.key,
            sourceData.attributes,
            targetData.attributes,
            edgeData.key,
            edgeData.attributes,
            edgeData.undirected
          );

          if (breakable && shouldBreak) return edgeData.key;
        }
      }
    }

    if (type !== 'directed') {
      adj = sourceData.undirected;

      for (neighbor in adj) {
        container = adj[neighbor].values();

        while (
          ((containerStep = container.next()), containerStep.done !== true)
        ) {
          edgeData = containerStep.value;
          targetData = edgeData.target;

          if (targetData.key !== neighbor) targetData = edgeData.source;

          shouldBreak = callback(
            sourceData.key,
            targetData.key,
            sourceData.attributes,
            targetData.attributes,
            edgeData.key,
            edgeData.attributes,
            edgeData.undirected
          );

          if (breakable && shouldBreak) return edgeData.key;
        }
      }
    }
  }

  return;
}

export function createAdjacencyIteratorSimple(graph) {
  const iterator = graph._nodes.values();

  const type = graph.type;

  let state = 'outer',
    sourceData,
    neighbors,
    adj,
    offset;

  return new Iterator(function next() {
    let step;

    if (state === 'outer') {
      step = iterator.next();

      if (step.done === true) return step;

      sourceData = step.value;

      state = 'directed';
      return next();
    }

    if (state === 'directed') {
      if (type === 'undirected') {
        state = 'undirected';
        return next();
      }

      adj = sourceData.out;
      neighbors = Object.keys(sourceData.out);
      offset = 0;
      state = 'inner-directed';

      return next();
    }

    if (state === 'undirected') {
      if (type === 'directed') {
        state = 'outer';
        return next();
      }

      adj = sourceData.undirected;
      neighbors = Object.keys(sourceData.undirected);
      offset = 0;
      state = 'inner-undirected';
    }

    // Inner
    if (offset >= neighbors.length) {
      if (state === 'inner-undirected') state = 'outer';
      else state = 'undirected';

      return next();
    }

    const neighbor = neighbors[offset++];
    const edgeData = adj[neighbor];
    let targetData = edgeData.target;

    if (state === 'inner-undirected' && targetData.key === sourceData.key)
      targetData = edgeData.source;

    return {
      done: false,
      value: {
        source: sourceData.key,
        target: targetData.key,
        sourceAttributes: sourceData.attributes,
        targetAttributes: targetData.attributes,
        edgeKey: edgeData.key,
        edgeAttributes: edgeData.attributes,
        undirected: edgeData.undirected
      }
    };
  });
}

export function createAdjacencyIteratorMulti(graph) {
  const iterator = graph._nodes.values();

  const type = graph.type;

  let state = 'outer',
    sourceData,
    neighbors,
    container = null,
    adj,
    offset;

  return new Iterator(function next() {
    let step;

    if (state === 'outer') {
      step = iterator.next();

      if (step.done === true) return step;

      sourceData = step.value;

      state = 'directed';
      return next();
    }

    if (state === 'directed') {
      if (type === 'undirected') {
        state = 'undirected';
        return next();
      }

      adj = sourceData.out;
      neighbors = Object.keys(sourceData.out);
      offset = 0;
      state = 'inner-directed';

      return next();
    }

    if (state === 'undirected') {
      if (type === 'directed') {
        state = 'outer';
        return next();
      }

      adj = sourceData.undirected;
      neighbors = Object.keys(sourceData.undirected);
      offset = 0;
      state = 'inner-undirected';
    }

    // Inner
    if (!container && offset >= neighbors.length) {
      if (state === 'inner-undirected') state = 'outer';
      else state = 'undirected';

      return next();
    }

    if (!container) {
      const neighbor = neighbors[offset++];
      container = adj[neighbor].values();
      return next();
    }

    step = container.next();

    if (step.done) {
      container = null;
      return next();
    }

    const edgeData = step.value;
    let targetData = edgeData.target;

    if (state === 'inner-undirected' && targetData.key === sourceData.key)
      targetData = edgeData.source;

    return {
      done: false,
      value: {
        source: sourceData.key,
        target: targetData.key,
        sourceAttributes: sourceData.attributes,
        targetAttributes: targetData.attributes,
        edge: edgeData.key,
        edgeAttributes: edgeData.attributes,
        undirected: edgeData.undirected
      }
    };
  });
}
