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
    type: 'mixed'
  },
  {
    name: 'inEdges',
    element: 'InEdge',
    type: 'directed',
    direction: 'in'
  },
  {
    name: 'outEdges',
    element: 'OutEdge',
    type: 'directed',
    direction: 'out'
  },
  {
    name: 'inboundEdges',
    element: 'InboundEdge',
    type: 'mixed',
    direction: 'in'
  },
  {
    name: 'outboundEdges',
    element: 'OutbounEdge',
    type: 'mixed',
    direction: 'out'
  },
  {
    name: 'directedEdges',
    element: 'DirectedEdge',
    type: 'directed'
  },
  {
    name: 'undirectedEdges',
    element: 'UndirectedEdge',
    type: 'undirected'
  }
];
