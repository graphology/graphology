/**
 * Graph Cloner
 * =============
 *
 * @Yomguithereal
 *
 * Simple function whose goal is to return a clone of the given Graph object.
 */
export default function clone(graph) {
  return graph.createEmptyCopy().import(graph.export());
}
