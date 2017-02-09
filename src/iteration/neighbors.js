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
    type: 'mixed'
  },
  {
    name: 'inNeighbors',
    counter: 'countInNeighbors',
    type: 'directed',
    direction: 'in'
  },
  {
    name: 'outNeighbors',
    counter: 'countOutNeighbors',
    type: 'directed',
    direction: 'out'
  },
  {
    name: 'inboundNeighbors',
    counter: 'countInboundNeighbors',
    type: 'mixed',
    direction: 'in'
  },
  {
    name: 'outboundNeighbors',
    counter: 'countOutboundNeighbors',
    type: 'mixed',
    direction: 'out'
  },
  {
    name: 'directedNeighbors',
    counter: 'countDirectedNeighbors',
    type: 'directed'
  },
  {
    name: 'undirectedNeighbors',
    counter: 'countUndirectedNeighbors',
    type: 'undirected'
  }
];

/**
 * Function merging neighbors into the given set iterating over the given object.
 *
 * @param {BasicSet} neighbors - Neighbors set.
 * @param {object}   object    - Target object.
 */
function merge(neighbors, object) {
  if (!object)
    return;

  for (const neighbor in object)
    neighbors.add(neighbor);
}

/**
 * Function creating a set of relevant neighbors for the given node.
 *
 * @param  {Graph}        graph     - Target graph.
 * @param  {string}       type      - Type of neighbors.
 * @param  {string}       direction - Direction.
 * @param  {any}          node      - Target node.
 * @return {Set|BasicSet}           - The neighbors set.
 */
function createNeighborSetForNode(graph, type, direction, node) {

  // For this, we need to compute the "structure" index
  graph.computeIndex('structure');

  const neighbors = new Set();

  const nodeData = graph._nodes.get(node);

  if (type === 'mixed' || type === 'directed') {

    if (!direction || direction === 'in') {
      merge(neighbors, nodeData.in);
    }
    if (!direction || direction === 'out') {
      merge(neighbors, nodeData.out);
    }
  }

  if (type === 'mixed' || type === 'undirected') {

    if (!direction || direction === 'in') {
      merge(neighbors, nodeData.undirectedIn);
    }
    if (!direction || direction === 'out') {
      merge(neighbors, nodeData.undirectedOut);
    }
  }

  return neighbors;
}

/**
 * Function creating a set of relevant neighbors for the given bunch of nodes.
 *
 * @param  {string}       name      - Name of the calling method.
 * @param  {Graph}        graph     - Target graph.
 * @param  {string}       type      - Type of neighbors.
 * @param  {string}       direction - Direction.
 * @param  {bunch}        bunch     - Target bunch.
 * @return {Set|BasicSet}           - The neighbors set.
 */
function createNeighborSetForBunch(name, graph, type, direction, bunch) {

  // For this, we need to compute the "structure" index
  graph.computeIndex('structure');

  const neighbors = new Set();

  overBunch(bunch, node => {
    if (!graph.hasNode(node))
      throw new NotFoundGraphError(`Graph.${name}: could not find the "${node}" node in the graph in the given bunch.`);

    const nodeData = graph._nodes.get(node);

    if (type === 'mixed' || type === 'directed') {

      if (!direction || direction === 'in') {
        merge(neighbors, nodeData.in);
      }
      if (!direction || direction === 'out') {
        merge(neighbors, nodeData.out);
      }
    }

    if (type === 'mixed' || type === 'undirected') {

      if (!direction || direction === 'in') {
        merge(neighbors, nodeData.undirectedIn);
      }
      if (!direction || direction === 'out') {
        merge(neighbors, nodeData.undirectedOut);
      }
    }
  });

  return neighbors;
}

/**
 * Function attaching a neighbors array creator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {boolean}  counter     - Should we count or collect?
 * @param {object}   description - Method description.
 */
function attachNeighborArrayCreator(Class, counter, description) {
    const {
    type,
    direction
  } = description;

  const name = counter ? description.counter : description.name;

  /**
   * Function returning an array or the count of certain neighbors.
   *
   * Arity 1a: Return all of a node's relevant neighbors.
   * @param  {any}   node   - Target node.
   *
   * Arity 1b: Return the union of the relevant neighbors of the given bunch of nodes.
   * @param  {bunch} bunch  - Bunch of nodes.
   *
   * Arity 2: Return whether the two nodes are indeed neighbors.
   * @param  {any}   source - Source node.
   * @param  {any}   target - Target node.
   *
   * @return {array|number} - The neighbors or the number of neighbors.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
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
      // NOTE: we could improve performance here
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

        return Array.from(neighbors);
      }
      else if (isBunch(nodeOrBunch)) {

        // Here, we want to iterate over the union of a bunch of nodes'
        // relevant neighbors

        // Note: since we need to keep track of the traversed values
        // to perform union, we can't optimize further and we have to
        // create this intermediary array and return its length when counting.
        const neighbors = createNeighborSetForBunch(
          name,
          this,
          type,
          direction,
          nodeOrBunch
        );

        if (counter)
          return neighbors.size;

        return Array.from(neighbors);
      }
      else {
        throw new NotFoundGraphError(`Graph.${name}: could not find the "${nodeOrBunch}" node in the graph.`);
      }
    }

    throw new InvalidArgumentsGraphError(`Graph.${name}: invalid number of arguments (expecting 1 or 2 and got ${args.length}).`);
  };
}

/**
 * Function attaching every neighbor iteration method to the Graph class.
 *
 * @param {function} Graph - Graph class.
 */
export function attachNeighborIterationMethods(Graph) {
  NEIGHBORS_ITERATION.forEach(description => {
    attachNeighborArrayCreator(Graph, false, description);
    attachNeighborArrayCreator(Graph, true, description);
  });
}
