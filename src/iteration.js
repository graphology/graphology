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
    counter: 'countEdges',
    element: 'Edge',
    type: 'mixed'
  },
  {
    name: 'inEdges',
    counter: 'countInEdges',
    element: 'InEdge',
    type: 'directed',
    direction: 'in'
  },
  {
    name: 'outEdges',
    counter: 'countOutEdges',
    element: 'OutEdge',
    type: 'directed',
    direction: 'out'
  },
  {
    name: 'inboundEdges',
    counter: 'countInboundEdges',
    element: 'InboundEdge',
    type: 'mixed',
    direction: 'in'
  },
  {
    name: 'outboundEdges',
    counter: 'countOutboundEdges',
    element: 'OutbounEdge',
    type: 'mixed',
    direction: 'out'
  },
  {
    name: 'directedEdges',
    counter: 'countDirectedEdges',
    element: 'DirectedEdge',
    type: 'directed'
  },
  {
    name: 'undirectedEdges',
    counter: 'countUndirectedEdges',
    element: 'UndirectedEdge',
    type: 'undirected'
  }
];
