/**
 * Graphology Neighbor Iteration
 * ==============================
 *
 * Attaching some methods to the Graph class to be able to iterate over
 * neighbors.
 */
import Iterator from 'obliterator/iterator';
import chain from 'obliterator/chain';

import {NotFoundGraphError, InvalidArgumentsGraphError} from '../errors';

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
 * Helpers.
 */
function CompositeSetWrapper() {
  this.A = null;
  this.B = null;
}

CompositeSetWrapper.prototype.wrap = function (set) {
  if (this.A === null) this.A = set;
  else if (this.B === null) this.B = set;
};

CompositeSetWrapper.prototype.has = function (key) {
  if (this.A !== null && key in this.A) return true;
  if (this.B !== null && key in this.B) return true;
  return false;
};

/**
 * Function iterating over the given node's relevant neighbors to match
 * one of them using a predicated function.
 *
 * @param  {string}   type      - Type of neighbors.
 * @param  {string}   direction - Direction.
 * @param  {any}      nodeData  - Target node's data.
 * @param  {function} callback  - Callback to use.
 */
function forEachInObjectOnce(breakable, visited, nodeData, object, callback) {
  for (const k in object) {
    const edgeData = object[k];

    const sourceData = edgeData.source;
    const targetData = edgeData.target;

    const neighborData = sourceData === nodeData ? targetData : sourceData;

    if (visited && visited.has(neighborData.key)) continue;

    const shouldBreak = callback(neighborData.key, neighborData.attributes);

    if (breakable && shouldBreak) return neighborData.key;
  }

  return;
}

function forEachNeighbor(breakable, type, direction, nodeData, callback) {
  // If we want only undirected or in or out, we can roll some optimizations
  if (type !== 'mixed') {
    if (type === 'undirected')
      return forEachInObjectOnce(
        breakable,
        null,
        nodeData,
        nodeData.undirected,
        callback
      );

    if (typeof direction === 'string')
      return forEachInObjectOnce(
        breakable,
        null,
        nodeData,
        nodeData[direction],
        callback
      );
  }

  // Else we need to keep a set of neighbors not to return duplicates
  // We cheat by querying the other adjacencies
  const visited = new CompositeSetWrapper();

  let found;

  if (type !== 'undirected') {
    if (direction !== 'out') {
      found = forEachInObjectOnce(
        breakable,
        null,
        nodeData,
        nodeData.in,
        callback
      );

      if (breakable && found) return found;

      visited.wrap(nodeData.in);
    }
    if (direction !== 'in') {
      found = forEachInObjectOnce(
        breakable,
        visited,
        nodeData,
        nodeData.out,
        callback
      );

      if (breakable && found) return found;

      visited.wrap(nodeData.out);
    }
  }

  if (type !== 'directed') {
    found = forEachInObjectOnce(
      breakable,
      visited,
      nodeData,
      nodeData.undirected,
      callback
    );

    if (breakable && found) return found;
  }

  return;
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
    if (type === 'undirected') return Object.keys(nodeData.undirected);

    if (typeof direction === 'string') return Object.keys(nodeData[direction]);
  }

  const neighbors = [];

  forEachNeighbor(false, type, direction, nodeData, function (key) {
    neighbors.push(key);
  });

  return neighbors;
}

/**
 * Function returning an iterator over the given node's relevant neighbors.
 *
 * @param  {string}   type      - Type of neighbors.
 * @param  {string}   direction - Direction.
 * @param  {any}      nodeData  - Target node's data.
 * @return {Iterator}
 */
function createDedupedObjectIterator(visited, nodeData, object) {
  const keys = Object.keys(object);
  const l = keys.length;

  let i = 0;

  return new Iterator(function next() {
    let neighborData = null;

    do {
      if (i >= l) {
        if (visited) visited.wrap(object);
        return {done: true};
      }

      const edgeData = object[keys[i++]];

      const sourceData = edgeData.source;
      const targetData = edgeData.target;

      neighborData = sourceData === nodeData ? targetData : sourceData;

      if (visited && visited.has(neighborData.key)) {
        neighborData = null;
        continue;
      }
    } while (neighborData === null);

    return {
      done: false,
      value: {neighbor: neighborData.key, attributes: neighborData.attributes}
    };
  });
}

function createNeighborIterator(type, direction, nodeData) {
  // If we want only undirected or in or out, we can roll some optimizations
  if (type !== 'mixed') {
    if (type === 'undirected')
      return createDedupedObjectIterator(null, nodeData, nodeData.undirected);

    if (typeof direction === 'string')
      return createDedupedObjectIterator(null, nodeData, nodeData[direction]);
  }

  let iterator = Iterator.empty();

  // Else we need to keep a set of neighbors not to return duplicates
  // We cheat by querying the other adjacencies
  const visited = new CompositeSetWrapper();

  if (type !== 'undirected') {
    if (direction !== 'out') {
      iterator = chain(
        iterator,
        createDedupedObjectIterator(visited, nodeData, nodeData.in)
      );
    }
    if (direction !== 'in') {
      iterator = chain(
        iterator,
        createDedupedObjectIterator(visited, nodeData, nodeData.out)
      );
    }
  }

  if (type !== 'directed') {
    iterator = chain(
      iterator,
      createDedupedObjectIterator(visited, nodeData, nodeData.undirected)
    );
  }

  return iterator;
}

/**
 * Function attaching a neighbors array creator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachNeighborArrayCreator(Class, description) {
  const {name, type, direction} = description;

  /**
   * Function returning an array of certain neighbors.
   *
   * @param  {any}   node   - Target node.
   * @return {array} - The neighbors of neighbors.
   *
   * @throws {Error} - Will throw if node is not found in the graph.
   */
  Class.prototype[name] = function (node) {
    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type)
      return [];

    node = '' + node;

    const nodeData = this._nodes.get(node);

    if (typeof nodeData === 'undefined')
      throw new NotFoundGraphError(
        `Graph.${name}: could not find the "${node}" node in the graph.`
      );

    // Here, we want to iterate over a node's relevant neighbors
    return createNeighborArrayForNode(
      type === 'mixed' ? this.type : type,
      direction,
      nodeData
    );
  };
}

/**
 * Function attaching a neighbors callback iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachForEachNeighbor(Class, description) {
  const {name, type, direction} = description;

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
  Class.prototype[forEachName] = function (node, callback) {
    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return;

    node = '' + node;

    const nodeData = this._nodes.get(node);

    if (typeof nodeData === 'undefined')
      throw new NotFoundGraphError(
        `Graph.${forEachName}: could not find the "${node}" node in the graph.`
      );

    // Here, we want to iterate over a node's relevant neighbors
    forEachNeighbor(
      false,
      type === 'mixed' ? this.type : type,
      direction,
      nodeData,
      callback
    );
  };

  /**
   * Function mapping the relevant neighbors using a callback.
   *
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  const mapName = 'map' + name[0].toUpperCase() + name.slice(1);

  Class.prototype[mapName] = function (node, callback) {
    // TODO: optimize when size is known beforehand
    const result = [];

    this[forEachName](node, (n, a) => {
      result.push(callback(n, a));
    });

    return result;
  };

  /**
   * Function filtering the relevant neighbors using a callback.
   *
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  const filterName = 'filter' + name[0].toUpperCase() + name.slice(1);

  Class.prototype[filterName] = function (node, callback) {
    const result = [];

    this[forEachName](node, (n, a) => {
      if (callback(n, a)) result.push(n);
    });

    return result;
  };

  /**
   * Function reducing the relevant neighbors using a callback.
   *
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  const reduceName = 'reduce' + name[0].toUpperCase() + name.slice(1);

  Class.prototype[reduceName] = function (node, callback, initialValue) {
    if (arguments.length < 3)
      throw new InvalidArgumentsGraphError(
        `Graph.${reduceName}: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`
      );

    let accumulator = initialValue;

    this[forEachName](node, (n, a) => {
      accumulator = callback(accumulator, n, a);
    });

    return accumulator;
  };
}

/**
 * Function attaching a breakable neighbors callback iterator method to the
 * Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachFindNeighbor(Class, description) {
  const {name, type, direction} = description;

  const capitalizedSingular = name[0].toUpperCase() + name.slice(1, -1);

  const findName = 'find' + capitalizedSingular;

  /**
   * Function iterating over all the relevant neighbors using a callback.
   *
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  Class.prototype[findName] = function (node, callback) {
    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return;

    node = '' + node;

    const nodeData = this._nodes.get(node);

    if (typeof nodeData === 'undefined')
      throw new NotFoundGraphError(
        `Graph.${findName}: could not find the "${node}" node in the graph.`
      );

    // Here, we want to iterate over a node's relevant neighbors
    return forEachNeighbor(
      true,
      type === 'mixed' ? this.type : type,
      direction,
      nodeData,
      callback
    );
  };

  /**
   * Function iterating over all the relevant neighbors to find if any of them
   * matches the given predicate.
   *
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  const someName = 'some' + capitalizedSingular;

  Class.prototype[someName] = function (node, callback) {
    const found = this[findName](node, callback);

    if (found) return true;

    return false;
  };

  /**
   * Function iterating over all the relevant neighbors to find if all of them
   * matche the given predicate.
   *
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  const everyName = 'every' + capitalizedSingular;

  Class.prototype[everyName] = function (node, callback) {
    const found = this[findName](node, (n, a) => {
      return !callback(n, a);
    });

    if (found) return false;

    return true;
  };
}

/**
 * Function attaching a neighbors callback iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachNeighborIteratorCreator(Class, description) {
  const {name, type, direction} = description;

  const iteratorName = name.slice(0, -1) + 'Entries';

  /**
   * Function returning an iterator over all the relevant neighbors.
   *
   * @param  {any}      node     - Target node.
   * @return {Iterator}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  Class.prototype[iteratorName] = function (node) {
    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type)
      return Iterator.empty();

    node = '' + node;

    const nodeData = this._nodes.get(node);

    if (typeof nodeData === 'undefined')
      throw new NotFoundGraphError(
        `Graph.${iteratorName}: could not find the "${node}" node in the graph.`
      );

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
export default function attachNeighborIterationMethods(Graph) {
  NEIGHBORS_ITERATION.forEach(description => {
    attachNeighborArrayCreator(Graph, description);
    attachForEachNeighbor(Graph, description);
    attachFindNeighbor(Graph, description);
    attachNeighborIteratorCreator(Graph, description);
  });
}
