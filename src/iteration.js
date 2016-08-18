/**
 * Graphology Iteration Description
 * =================================
 *
 * Some handy decriptions constants concerning the graph iteration methods.
 */

/**
 * Edge iteration.
 */
export const EDGES_ITERATION = [
  {
    name: 'edges',
    element: 'Edge',
    predicate: null
  },
  {
    name: 'inEdges',
    element: 'InEdge',
    predicate(edge) {
      return !edge.undirected;
    }
  },
  {
    name: 'outEdges',
    element: 'OutEdge',
    predicate(edge) {
      return !edge.undirected;
    }
  },
  {
    name: 'inboundEdges',
    element: 'InboundEdge',
    predicate: null
  },
  {
    name: 'outboundEdges',
    element: 'OutbounEdge',
    predicate: null
  },
  {
    name: 'directedEdges',
    element: 'DirectedEdge',
    predicate(edge) {
      return !edge.undirected;
    }
  },
  {
    name: 'undirectedEdges',
    element: 'UndirectedEdge',
    predicate(edge) {
      return edge.undirected;
    }
  }
];
