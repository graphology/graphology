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

/**
 * Neighbors iteration.
 */
export const NEIGHBORS_ITERATION = [
  {
    name: 'neighbors',
    counter: 'countNeighbors',
    element: 'Neighbor',
    type: 'mixed'
  },
  {
    name: 'inNeighbors',
    counter: 'countInNeighbors',
    element: 'InNeighbor',
    type: 'directed',
    direction: 'in'
  },
  {
    name: 'outNeighbors',
    counter: 'countOutNeighbors',
    element: 'OutNeighbor',
    type: 'directed',
    direction: 'out'
  },
  {
    name: 'inboundNeighbors',
    counter: 'countInboundNeighbors',
    element: 'InboundNeighbor',
    type: 'mixed',
    direction: 'in'
  },
  {
    name: 'outboundNeighbors',
    counter: 'countOutboundNeighbors',
    element: 'OutboundNeighbor',
    type: 'mixed',
    direction: 'out'
  },
  {
    name: 'directedNeighbors',
    counter: 'countDirectedNeighbors',
    element: 'DirectedNeighbor',
    type: 'directed'
  },
  {
    name: 'undirectedNeighbors',
    counter: 'countUndirectedNeighbors',
    element: 'UndirectedNeighbor',
    type: 'undirected'
  }
];
