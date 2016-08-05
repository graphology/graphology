/**
 * Graph Cloner
 * =============
 *
 * @Yomguithereal
 *
 * Simple function whose goal is to return a clone of the given Graph object.
 */
import Graph from 'graph';

export default function clone(graph) {
  return new Graph(graph);
}
