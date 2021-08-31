/**
 * Graphology Neighbor Iteration
 * ==============================
 *
 * Attaching some methods to the Graph class to be able to iterate over
 * neighbors.
 */
import Iterator from 'obliterator/iterator';
import chain from 'obliterator/chain';
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

/**
 * Function iterating over the given node's relevant neighbors using a
 * callback until it returns a truthy value to stop iteration.
 *
 * @param  {string}   type      - Type of neighbors.
 * @param  {string}   direction - Direction.
 * @param  {any}      nodeData  - Target node's data.
 * @param  {function} callback  - Callback to use.
 */
function forEachInObjectUntil(nodeData, object, callback) {
  for (const k in object) {
    let edgeData = object[k];

    if (edgeData instanceof Set)
      edgeData = edgeData.values().next().value;

    const sourceData = edgeData.source,
          targetData = edgeData.target;

    const neighborData = sourceData === nodeData ? targetData : sourceData;

    const shouldBreak = callback(
      neighborData.key,
      neighborData.attributes
    );

    if (shouldBreak)
      return true;
  }

  return false;
}

function forEachInObjectOnceUntil(visited, nodeData, object, callback) {
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

    const shouldBreak = callback(
      neighborData.key,
      neighborData.attributes
    );

    if (shouldBreak)
      return true;
  }

  return false;
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

function forEachNeighborForNodeUntil(type, direction, nodeData, callback) {

  // If we want only undirected or in or out, we can roll some optimizations
  if (type !== 'mixed') {
    if (type === 'undirected')
      return forEachInObjectUntil(nodeData, nodeData.undirected, callback);

    if (typeof direction === 'string')
      return forEachInObjectUntil(nodeData, nodeData[direction], callback);
  }

  // Else we need to keep a set of neighbors not to return duplicates
  const visited = new Set();

  let shouldBreak = false;

  if (type !== 'undirected') {

    if (direction !== 'out') {
      shouldBreak = forEachInObjectOnceUntil(visited, nodeData, nodeData.in, callback);

      if (shouldBreak)
        return true;
    }
    if (direction !== 'in') {
      shouldBreak = forEachInObjectOnceUntil(visited, nodeData, nodeData.out, callback);

      if (shouldBreak)
        return true;
    }
  }

  if (type !== 'directed') {
    shouldBreak = forEachInObjectOnceUntil(visited, nodeData, nodeData.undirected, callback);

    if (shouldBreak)
      return true;
  }

  return false;
}

/**
 * Function returning an iterator over the given node's relevant neighbors.
 *
 * @param  {string}   type      - Type of neighbors.
 * @param  {string}   direction - Direction.
 * @param  {any}      nodeData  - Target node's data.
 * @return {Iterator}
 */
function createObjectIterator(nodeData, object) {
  const keys = Object.keys(object),
        l = keys.length;

  let i = 0;

  return new Iterator(function() {
    if (i >= l)
      return {done: true};

    let edgeData = object[keys[i++]];

    if (edgeData instanceof Set)
      edgeData = edgeData.values().next().value;

    const sourceData = edgeData.source,
          targetData = edgeData.target;

    const neighborData = sourceData === nodeData ? targetData : sourceData;

    return {
      done: false,
      value: [neighborData.key, neighborData.attributes]
    };
  });
}

function createDedupedObjectIterator(visited, nodeData, object) {
  const keys = Object.keys(object),
        l = keys.length;

  let i = 0;

  return new Iterator(function next() {
    if (i >= l)
      return {done: true};

    let edgeData = object[keys[i++]];

    if (edgeData instanceof Set)
      edgeData = edgeData.values().next().value;

    const sourceData = edgeData.source,
          targetData = edgeData.target;

    const neighborData = sourceData === nodeData ? targetData : sourceData;

    if (visited.has(neighborData.key))
      return next();

    visited.add(neighborData.key);

    return {
      done: false,
      value: [neighborData.key, neighborData.attributes]
    };
  });
}

function createNeighborIterator(type, direction, nodeData) {

  // If we want only undirected or in or out, we can roll some optimizations
  if (type !== 'mixed') {
    if (type === 'undirected')
      return createObjectIterator(nodeData, nodeData.undirected);

    if (typeof direction === 'string')
      return createObjectIterator(nodeData, nodeData[direction]);
  }

  let iterator = Iterator.empty();

  // Else we need to keep a set of neighbors not to return duplicates
  const visited = new Set();

  if (type !== 'undirected') {

    if (direction !== 'out') {
      iterator = chain(iterator, createDedupedObjectIterator(visited, nodeData, nodeData.in));
    }
    if (direction !== 'in') {
      iterator = chain(iterator, createDedupedObjectIterator(visited, nodeData, nodeData.out));
    }
  }

  if (type !== 'directed') {
    iterator = chain(iterator, createDedupedObjectIterator(visited, nodeData, nodeData.undirected));
  }

  return iterator;
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
 * Function attaching a breakable neighbors callback iterator method to the
 * Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachForEachNeighborUntil(Class, description) {
  const {
    name,
    type,
    direction
  } = description;

  const forEachUntilName = 'forEach' + name[0].toUpperCase() + name.slice(1, -1) + 'Until';

  /**
   * Function iterating over all the relevant neighbors using a callback.
   *
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  Class.prototype[forEachUntilName] = function(node, callback) {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type)
      return;

    node = '' + node;

    const nodeData = this._nodes.get(node);

    if (typeof nodeData === 'undefined')
      throw new NotFoundGraphError(`Graph.${forEachUntilName}: could not find the "${node}" node in the graph.`);

    // Here, we want to iterate over a node's relevant neighbors
    return forEachNeighborForNodeUntil(
      type === 'mixed' ? this.type : type,
      direction,
      nodeData,
      callback
    );
  };
}

/**
 * Function attaching a neighbors callback iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachNeighborIteratorCreator(Class, description) {
  const {
    name,
    type,
    direction
  } = description;

  const iteratorName = name.slice(0, -1) + 'Entries';

  /**
   * Function returning an iterator over all the relevant neighbors.
   *
   * @param  {any}      node     - Target node.
   * @return {Iterator}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  Class.prototype[iteratorName] = function(node) {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type)
      return Iterator.empty();

    node = '' + node;

    const nodeData = this._nodes.get(node);

    if (typeof nodeData === 'undefined')
      throw new NotFoundGraphError(`Graph.${iteratorName}: could not find the "${node}" node in the graph.`);

    // Here, we want to iterate over a node's relevant neighbors
    return createNeighborIterator(
      type === 'mixed' ? this.type : type,
      direction,
      nodeData
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
    attachForEachNeighborUntil(Graph, description);
    attachNeighborIteratorCreator(Graph, description);
  });
}
