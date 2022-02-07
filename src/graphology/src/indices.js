/**
 * Graphology Indexes Functions
 * =============================
 *
 * Bunch of functions used to compute or clear indexes.
 */

/**
 * Function clearing the 'structure' index data related to the given edge.
 *
 * @param {Graph}    graph    - Target Graph instance.
 * @param {EdgeData} edgeData - Dropped edge's data.
 */
export function clearEdgeFromStructureIndex(graph, undirected, edgeData) {
  const multi = graph.multi;

  const {source: sourceData, target: targetData} = edgeData;

  const source = sourceData.key,
    target = targetData.key;

  // NOTE: since the edge set is the same for source & target, we can only
  // affect source
  const outKey = undirected ? 'undirected' : 'out',
    sourceIndex = sourceData[outKey];

  const inKey = undirected ? 'undirected' : 'in';

  if (target in sourceIndex) {
    if (multi) {
      const set = sourceIndex[target];

      if (set.size === 1) {
        delete sourceIndex[target];
        delete targetData[inKey][source];
      } else {
        set.delete(edgeData);
      }
    } else delete sourceIndex[target];
  }

  if (multi) return;

  const targetIndex = targetData[inKey];

  delete targetIndex[source];
}
