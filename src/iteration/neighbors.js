/**
 * Graphology Neighbor Iteration
 * ==============================
 *
 * Attaching some methods to the Graph class to be able to iterate over
 * neighbors.
 */
import take from 'obliterator/take';

import {
  InvalidArgumentsGraphError,
  NotFoundGraphError
} from '../errors';

/**
 * Definitions.
 */
const NEIGHBORS_ITERATION = [
  {
    name: 'neighbors',
    type: 'mixed'
  },
  {
    name: 'inNeighbors',
    type: 'directed',
    direction: 'in'
  },
  {
    name: 'outNeighbors',
    type: 'directed',
    direction: 'out'
  },
  {
    name: 'inboundNeighbors',
    type: 'mixed',
    direction: 'in'
  },
  {
    name: 'outboundNeighbors',
    type: 'mixed',
    direction: 'out'
  },
  {
    name: 'directedNeighbors',
    type: 'directed'
  },
  {
    name: 'undirectedNeighbors',
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
  if (typeof object === 'undefined')
    return;

  for (const neighbor in object)
    neighbors.add(neighbor);
}

/**
 * Function creating an array of relevant neighbors for the given node.
 *
 * @param  {string}       type      - Type of neighbors.
 * @param  {string}       direction - Direction.
 * @param  {any}          nodeData  - Target node's data.
 * @return {Array}                  - The list of neighbors.
 */
function createNeighborArrayForNode(type, direction, nodeData) {

  // If we want only undirected or in or out, we can roll some optimizations
  if (type !== 'mixed') {
    if (type === 'undirected')
      return Object.keys(nodeData.undirected);

    if (typeof direction === 'string')
      return Object.keys(nodeData[direction]);
  }

  // Else we need to keep a set of neighbors not to return duplicates
  const neighbors = new Set();

  if (type !== 'undirected') {

    if (direction !== 'out') {
      merge(neighbors, nodeData.in);
    }
    if (direction !== 'in') {
      merge(neighbors, nodeData.out);
    }
  }

  if (type !== 'directed') {
    merge(neighbors, nodeData.undirected);
  }

  return take(neighbors.values(), neighbors.size);
}

/**
 * Function iterating over the given node's relevant neighbors using a
 * callback.
 *
 * @param  {string}   type      - Type of neighbors.
 * @param  {string}   direction - Direction.
 * @param  {any}      nodeData  - Target node's data.
 * @param  {function} callback  - Callback to use.
 */
function forEachInObject(nodeData, object, callback) {
  for (const k in object) {
    let edgeData = object[k];

    if (edgeData instanceof Set)
      edgeData = edgeData.values().next().value;

    const sourceData = edgeData.source,
          targetData = edgeData.target;

    const neighborData = sourceData === nodeData ? targetData : sourceData;

    callback(
      neighborData.key,
      neighborData.attributes
    );
  }
}

function forEachInObjectOnce(visited, nodeData, object, callback) {
  for (const k in object) {
    let edgeData = object[k];

    if (edgeData instanceof Set)
      edgeData = edgeData.values().next().value;

    const sourceData = edgeData.source,
          targetData = edgeData.target;

    const neighborData = sourceData === nodeData ? targetData : sourceData;

    if (visited.has(neighborData.key))
      continue;

    visited.add(neighborData.key);

    callback(
      neighborData.key,
      neighborData.attributes
    );
  }
}

function forEachNeighborForNode(type, direction, nodeData, callback) {

  // If we want only undirected or in or out, we can roll some optimizations
  if (type !== 'mixed') {
    if (type === 'undirected')
      return forEachInObject(nodeData, nodeData.undirected, callback);

    if (typeof direction === 'string')
      return forEachInObject(nodeData, nodeData[direction], callback);
  }

  // Else we need to keep a set of neighbors not to return duplicates
  const visited = new Set();

  if (type !== 'undirected') {

    if (direction !== 'out') {
      forEachInObjectOnce(visited, nodeData, nodeData.in, callback);
    }
    if (direction !== 'in') {
      forEachInObjectOnce(visited, nodeData, nodeData.out, callback);
    }
  }

  if (type !== 'directed') {
    forEachInObjectOnce(visited, nodeData, nodeData.undirected, callback);
  }
}

/**
 * Function returning whether the given node has target neighbor.
 *
 * @param  {Graph}        graph     - Target graph.
 * @param  {string}       type      - Type of neighbor.
 * @param  {string}       direction - Direction.
 * @param  {any}          node      - Target node.
 * @param  {any}          neighbor  - Target neighbor.
 * @return {boolean}
 */
function nodeHasNeighbor(graph, type, direction, node, neighbor) {

  const nodeData = graph._nodes.get(node);

  if (type !== 'undirected') {

    if (direction !== 'out' && typeof nodeData.in !== 'undefined') {
      for (const k in nodeData.in)
        if (k === neighbor)
          return true;
    }
    if (direction !== 'in' && typeof nodeData.out !== 'undefined') {
      for (const k in nodeData.out)
        if (k === neighbor)
          return true;
    }
  }

  if (type !== 'directed' && typeof nodeData.undirected !== 'undefined') {
    for (const k in nodeData.undirected)
        if (k === neighbor)
          return true;
  }

  return false;
}

/**
 * Function attaching a neighbors array creator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachNeighborArrayCreator(Class, description) {
  const {
    name,
    type,
    direction
  } = description;

  /**
   * Function returning an array or the count of certain neighbors.
   *
   * Arity 1: Return all of a node's relevant neighbors.
   * @param  {any}   node   - Target node.
   *
   * Arity 2: Return whether the two nodes are indeed neighbors.
   * @param  {any}   source - Source node.
   * @param  {any}   target - Target node.
   *
   * @return {array|number} - The neighbors or the number of neighbors.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  Class.prototype[name] = function(node) {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type)
      return [];

    if (arguments.length === 2) {
      const node1 = '' + arguments[0],
            node2 = '' + arguments[1];

      if (!this._nodes.has(node1))
        throw new NotFoundGraphError(`Graph.${name}: could not find the "${node1}" node in the graph.`);

      if (!this._nodes.has(node2))
        throw new NotFoundGraphError(`Graph.${name}: could not find the "${node2}" node in the graph.`);

      // Here, we want to assess whether the two given nodes are neighbors
      return nodeHasNeighbor(
        this,
        type,
        direction,
        node1,
        node2
      );
    }
    else if (arguments.length === 1) {
      node = '' + node;

      const nodeData = this._nodes.get(node);

      if (typeof nodeData === 'undefined')
        throw new NotFoundGraphError(`Graph.${name}: could not find the "${node}" node in the graph.`);

      // Here, we want to iterate over a node's relevant neighbors
      const neighbors = createNeighborArrayForNode(
        type === 'mixed' ? this.type : type,
        direction,
        nodeData
      );

      return neighbors;
    }

    throw new InvalidArgumentsGraphError(`Graph.${name}: invalid number of arguments (expecting 1 or 2 and got ${arguments.length}).`);
  };
}

/**
 * Function attaching a neighbors callback iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachForEachNeighbor(Class, description) {
  const {
    name,
    type,
    direction
  } = description;

  const forEachName = 'forEach' + name[0].toUpperCase() + name.slice(1, -1);

  /**
   * Function iterating over all the relevant neighbors using a callback.
   *
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  Class.prototype[forEachName] = function(node, callback) {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type)
      return;

    node = '' + node;

    const nodeData = this._nodes.get(node);

    if (typeof nodeData === 'undefined')
      throw new NotFoundGraphError(`Graph.${forEachName}: could not find the "${node}" node in the graph.`);

    // Here, we want to iterate over a node's relevant neighbors
    forEachNeighborForNode(
      type === 'mixed' ? this.type : type,
      direction,
      nodeData,
      callback
    );
  };
}

/**
 * Function attaching every neighbor iteration method to the Graph class.
 *
 * @param {function} Graph - Graph class.
 */
export function attachNeighborIterationMethods(Graph) {
  NEIGHBORS_ITERATION.forEach(description => {
    attachNeighborArrayCreator(Graph, description);
    attachForEachNeighbor(Graph, description);
  });
}
