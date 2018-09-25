/**
 * Graphology Indexes Functions
 * =============================
 *
 * Bunch of functions used to compute or clear indexes.
 */

/**
 * Function updating the 'structure' index with the given edge's data.
 * Note that in the case of the multi graph, related edges are stored in a
 * set that is the same for A -> B & B <- A.
 *
 * @param {Graph}    graph      - Target Graph instance.
 * @param {EdgeData} edgeData   - Added edge's data.
 * @param {NodeData} sourceData - Source node's data.
 * @param {NodeData} targetData - Target node's data.
 */
export function updateStructureIndex(
  graph,
  undirected,
  edgeData,
  source,
  target,
  sourceData,
  targetData
) {
  const multi = graph.multi;

  const outKey = undirected ? 'undirected' : 'out',
        inKey = undirected ? 'undirected' : 'in';

  // Handling source
  let edgeOrSet = sourceData[outKey][target];

  if (typeof edgeOrSet === 'undefined') {
    edgeOrSet = multi ? new Set() : edgeData;
    sourceData[outKey][target] = edgeOrSet;
  }

  if (multi)
    edgeOrSet.add(edgeData);

  // If selfLoop, we break here
  if (source === target)
    return;

  // Handling target (we won't add the edge because it was already taken
  // care of with source above)
  if (typeof targetData[inKey][source] === 'undefined')
    targetData[inKey][source] = edgeOrSet;
}

/**
 * Function clearing the 'structure' index data related to the given edge.
 *
 * @param {Graph}    graph - Target Graph instance.
 * @param {EdgeData} edge  - Dropped edge's data.
 * @param {object}   data  - Attached data.
 */
export function clearEdgeFromStructureIndex(graph, undirected, edgeData, data) {
  const multi = graph.multi;

  const {source, target} = data;

  // NOTE: since the edge set is the same for source & target, we can only
  // affect source
  const sourceData = graph._nodes.get(source),
        outKey = undirected ? 'undirected' : 'out',
        sourceIndex = sourceData[outKey];

  // NOTE: possible to clear empty sets from memory altogether
  if (target in sourceIndex) {

    if (multi)
      sourceIndex[target].delete(edgeData);
    else
      delete sourceIndex[target];
  }

  if (multi)
    return;

  const targetData = graph._nodes.get(target),
        inKey = undirected ? 'undirected' : 'in',
        targetIndex = targetData[inKey];

  delete targetIndex[source];
}

/**
 * Function clearing the whole 'structure' index.
 *
 * @param {Graph} graph - Target Graph instance.
 */
export function clearStructureIndex(graph) {
  graph._nodes.forEach(data => {

    // Clearing now useless properties
    if (typeof data.in !== 'undefined') {
      data.in = {};
      data.out = {};
    }

    if (typeof data.undirected !== 'undefined') {
      data.undirected = {};
    }
  });
}

/**
 * Function used to upgrade a simple `structure` index to a multi on.
 *
 * @param {Graph}  graph - Target Graph instance.
 */
export function upgradeStructureIndexToMulti(graph) {
  graph._nodes.forEach((data, node) => {

    // Directed
    if (data.out) {

      for (const neighbor in data.out) {
        const edges = new Set();
        edges.add(data.out[neighbor]);
        data.out[neighbor] = edges;
        graph._nodes.get(neighbor).in[node] = edges;
      }
    }

    // Undirected
    if (data.undirected) {
      for (const neighbor in data.undirected) {
        if (neighbor > node)
          continue;

        const edges = new Set();
        edges.add(data.undirected[neighbor]);
        data.undirected[neighbor] = edges;
        graph._nodes.get(neighbor).undirected[node] = edges;
      }
    }
  });
}
