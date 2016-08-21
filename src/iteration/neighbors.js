/**
 * Graphology Neighbor Iteration
 * ==============================
 *
 * Attaching some methods to the Graph class to be able to iterate over
 * neighbors.
 */
import {
  InvalidArgumentsGraphError,
  NotFoundGraphError
} from '../errors';

import {
  BasicSet,
  isBunch
} from '../utils';

/**
 * Definitions.
 */
const NEIGHBORS_ITERATION = [
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

function countNeighbors(object) {
  if (typeof Map === 'function' && object instanceof Map)
    return [...object.keys()].length;
  else
    return Object.keys(object).length;
}

function collectNeighbors(object) {

  if (typeof Map === 'function' && object instanceof Map)
    return [...object.keys()];
  else
    return Object.keys(object);
}

function createNeighborArrayForNode(count, graph, type, direction, node) {

  // For this, we need to compute the "relations" index
  graph.computeIndex('relations');
  const indexData = graph._indexes.relations.data;

  let neighbors = [],
      nb = 0;

  let nodeData;

  if (graph.map) {
    if (!indexData.has(node))
      return count ? nb : neighbors;
    nodeData = indexData.get(node);
  }
  else {
    if (!(node in indexData))
      return count ? nb : neighbors;
    nodeData = indexData[node];
  }

  if (type === 'mixed' || type === 'directed') {

    if (!direction || direction === 'in') {
      if (count)
        nb += countNeighbors(nodeData.in);
      else
        neighbors = neighbors.concat(collectNeighbors(nodeData.in));
    }
    if (!direction || direction === 'out') {
      if (count)
        nb += countNeighbors(nodeData.out);
      else
        neighbors = neighbors.concat(collectNeighbors(nodeData.out));
    }
  }

  if (type === 'mixed' || type === 'undirected') {

    if (!direction || direction === 'in') {
      if (count)
        nb += countNeighbors(nodeData.undirectedIn);
      else
        neighbors = neighbors.concat(collectNeighbors(nodeData.undirectedIn));
    }
    if (!direction || direction === 'out') {
      if (count)
        nb += countNeighbors(nodeData.undirectedOut);
      else
        neighbors = neighbors.concat(collectNeighbors(nodeData.undirectedOut));
    }
  }

  return count ? nb : neighbors;
}

function attachNeighborArrayCreator(Class, counter, description) {
    const {
    type,
    direction
  } = description;

  const name = counter ? description.counter : description.name;

  Class.prototype[name] = function(...args) {

    if (args.length === 2) {
      const [node1, node2] = args;

      // Here, we want to assess whether the two given nodes are neighbors
    }
    else if (args.length === 1) {
      const nodeOrBunch = args[0];

      if (this.hasNode(nodeOrBunch)) {

        // Here, we want to iterate over a node's relevant neighbors
        return createNeighborArrayForNode(
          counter,
          this,
          type,
          direction,
          nodeOrBunch
        );
      }
      else if (isBunch(nodeOrBunch)) {

        // Here, we want to iterate over the union of a bunch of nodes'
        // relevant neighbors

        // Note: since we need to keep track of the traversed values
        // to perform union, we can't optimize further and we have to
        // create this intermediary array and return its length when counting.
      }
      else {
        throw new NotFoundGraphError(`Graph.${name}: could not find the "${nodeOrBunch}" node in the graph.`);
      }
    }

    throw new InvalidArgumentsGraphError(`Graph.${name}: invalid number of arguments (expecting 1 or 2 and got ${args.length}).`);
  };
}

export function attachNeighborIterationMethods(Graph) {
  NEIGHBORS_ITERATION.forEach(description => {
    attachNeighborArrayCreator(Graph, false, description);
    attachNeighborArrayCreator(Graph, true, description);
  });
}
