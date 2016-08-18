/**
 * Graphology Iteration Specs
 * ===========================
 *
 * Testing the iteration-related methods of the graph.
 */
import assert from 'assert';
import nodes from './nodes';
import edges from './edges';

export default function iteration(Graph) {
  return {
    Nodes: nodes(Graph),
    Edges: edges(Graph)
  };
}
