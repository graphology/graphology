/**
 * Graphology Iteration Specs
 * ===========================
 *
 * Testing the iteration-related methods of the graph.
 */
import nodes from './nodes';
import edges from './edges';

export default function iteration(Graph) {
  return {
    Nodes: nodes(Graph),
    Edges: edges(Graph)
  };
}
