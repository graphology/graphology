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
  isBunch,
  overBunch
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

function mergeNeighborsFromMap(neighbors, map) {
  if (!map)
    return;

  map.forEach(function(_, neighbor) {
    neighbors.add(neighbor);
  });
}

function mergeNeighborsFromObject(neighbors, object) {
  if (!object)
    return;

  for (const neighbor in object)
    neighbors.add(neighbor);
}

function createNeighborSetForNode(graph, type, direction, node) {
  const mergeNeighbors = graph.map ? mergeNeighborsFromMap : mergeNeighborsFromObject;

  // For this, we need to compute the "relations" index
  graph.computeIndex('structure');

  const neighbors = graph.map ? new Set() : new BasicSet();

  const nodeData = graph.map ? graph._nodes.get(node) : graph._nodes[node];

  if (type === 'mixed' || type === 'directed') {

    if (!direction || direction === 'in') {
      mergeNeighbors(neighbors, nodeData.in);
    }
    if (!direction || direction === 'out') {
      mergeNeighbors(neighbors, nodeData.out);
    }
  }

  if (type === 'mixed' || type === 'undirected') {

    if (!direction || direction === 'in') {
      mergeNeighbors(neighbors, nodeData.undirectedIn);
    }
    if (!direction || direction === 'out') {
      mergeNeighbors(neighbors, nodeData.undirectedOut);
    }
  }

  return neighbors;
}

function createNeighborSetForBunch(name, graph, type, direction, bunch) {
  const mergeNeighbors = graph.map ? mergeNeighborsFromMap : mergeNeighborsFromObject;

  const neighbors = graph.map ? new Set() : new BasicSet();

  overBunch(bunch, (error, node) => {
    if (!graph.hasNode(node))
      throw new NotFoundGraphError(`Graph.${name}: could not find the "${node}" node in the graph in the given bunch.`);

  });
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

      if (counter)
        throw new InvalidArgumentsGraphError(`Graph.${name}: invalid arguments.`);

      if (!this.hasNode(node1))
        throw new NotFoundGraphError(`Graph.${name}: could not find the "${node1}" node in the graph.`);

      if (!this.hasNode(node2))
        throw new NotFoundGraphError(`Graph.${name}: could not find the "${node2}" node in the graph.`);

      // Here, we want to assess whether the two given nodes are neighbors
      const neighbors = createNeighborSetForNode(
        this,
        type,
        direction,
        node1
      );

      return neighbors.has(node2);
    }
    else if (args.length === 1) {
      const nodeOrBunch = args[0];

      if (this.hasNode(nodeOrBunch)) {

        // Here, we want to iterate over a node's relevant neighbors
        const neighbors = createNeighborSetForNode(
          this,
          type,
          direction,
          nodeOrBunch
        );

        if (counter)
          return neighbors.size;

        return this.map ? Array.from(neighbors) : neighbors.values();
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
