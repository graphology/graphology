/**
 * Graphology Edge Iteration
 * ==========================
 *
 * Attaching some methods to the Graph class to be able to iterate over a
 * graph's edges.
 */
import Iterator from 'obliterator/iterator';
import chain from 'obliterator/chain';
import take from 'obliterator/take';

import {InvalidArgumentsGraphError, NotFoundGraphError} from '../errors';

/**
 * Definitions.
 */
const EDGES_ITERATION = [
  {
    name: 'edges',
    type: 'mixed'
  },
  {
    name: 'inEdges',
    type: 'directed',
    direction: 'in'
  },
  {
    name: 'outEdges',
    type: 'directed',
    direction: 'out'
  },
  {
    name: 'inboundEdges',
    type: 'mixed',
    direction: 'in'
  },
  {
    name: 'outboundEdges',
    type: 'mixed',
    direction: 'out'
  },
  {
    name: 'directedEdges',
    type: 'directed'
  },
  {
    name: 'undirectedEdges',
    type: 'undirected'
  }
];

/**
 * Function iterating over edges from the given object to match one of them.
 *
 * @param {object}   object   - Target object.
 * @param {function} callback - Function to call.
 */
function forEachSimple(breakable, object, callback, avoid) {
  let shouldBreak = false;

  for (const k in object) {
    if (k === avoid) continue;

    const edgeData = object[k];

    shouldBreak = callback(
      edgeData.key,
      edgeData.attributes,
      edgeData.source.key,
      edgeData.target.key,
      edgeData.source.attributes,
      edgeData.target.attributes,
      edgeData.undirected
    );

    if (breakable && shouldBreak) return edgeData.key;
  }

  return;
}

function forEachMulti(breakable, object, callback, avoid) {
  let edgeData, source, target;

  let shouldBreak = false;

  for (const k in object) {
    if (k === avoid) continue;

    edgeData = object[k];

    do {
      source = edgeData.source;
      target = edgeData.target;

      shouldBreak = callback(
        edgeData.key,
        edgeData.attributes,
        source.key,
        target.key,
        source.attributes,
        target.attributes,
        edgeData.undirected
      );

      if (breakable && shouldBreak) return edgeData.key;

      edgeData = edgeData.next;
    } while (edgeData !== undefined);
  }

  return;
}

/**
 * Function returning an iterator over edges from the given object.
 *
 * @param  {object}   object - Target object.
 * @return {Iterator}
 */
function createIterator(object, avoid) {
  const keys = Object.keys(object);
  const l = keys.length;

  let edgeData;
  let i = 0;

  return new Iterator(function next() {
    do {
      if (!edgeData) {
        if (i >= l) return {done: true};

        const k = keys[i++];

        if (k === avoid) {
          edgeData = undefined;
          continue;
        }

        edgeData = object[k];
      } else {
        edgeData = edgeData.next;
      }
    } while (!edgeData);

    return {
      done: false,
      value: {
        edge: edgeData.key,
        attributes: edgeData.attributes,
        source: edgeData.source.key,
        target: edgeData.target.key,
        sourceAttributes: edgeData.source.attributes,
        targetAttributes: edgeData.target.attributes,
        undirected: edgeData.undirected
      }
    };
  });
}

/**
 * Function iterating over the egdes from the object at given key to match
 * one of them.
 *
 * @param {object}   object   - Target object.
 * @param {mixed}    k        - Neighbor key.
 * @param {function} callback - Callback to use.
 */
function forEachForKeySimple(breakable, object, k, callback) {
  const edgeData = object[k];

  if (!edgeData) return;

  const sourceData = edgeData.source;
  const targetData = edgeData.target;

  if (
    callback(
      edgeData.key,
      edgeData.attributes,
      sourceData.key,
      targetData.key,
      sourceData.attributes,
      targetData.attributes,
      edgeData.undirected
    ) &&
    breakable
  )
    return edgeData.key;
}

function forEachForKeyMulti(breakable, object, k, callback) {
  let edgeData = object[k];

  if (!edgeData) return;

  let shouldBreak = false;

  do {
    shouldBreak = callback(
      edgeData.key,
      edgeData.attributes,
      edgeData.source.key,
      edgeData.target.key,
      edgeData.source.attributes,
      edgeData.target.attributes,
      edgeData.undirected
    );

    if (breakable && shouldBreak) return edgeData.key;

    edgeData = edgeData.next;
  } while (edgeData !== undefined);

  return;
}

/**
 * Function returning an iterator over the egdes from the object at given key.
 *
 * @param  {object}   object   - Target object.
 * @param  {mixed}    k        - Neighbor key.
 * @return {Iterator}
 */
function createIteratorForKey(object, k) {
  let edgeData = object[k];

  if (edgeData.next !== undefined) {
    return new Iterator(function () {
      if (!edgeData) return {done: true};

      const value = {
        edge: edgeData.key,
        attributes: edgeData.attributes,
        source: edgeData.source.key,
        target: edgeData.target.key,
        sourceAttributes: edgeData.source.attributes,
        targetAttributes: edgeData.target.attributes,
        undirected: edgeData.undirected
      };

      edgeData = edgeData.next;

      return {
        done: false,
        value
      };
    });
  }

  return Iterator.of({
    edge: edgeData.key,
    attributes: edgeData.attributes,
    source: edgeData.source.key,
    target: edgeData.target.key,
    sourceAttributes: edgeData.source.attributes,
    targetAttributes: edgeData.target.attributes,
    undirected: edgeData.undirected
  });
}

/**
 * Function creating an array of edges for the given type.
 *
 * @param  {Graph}   graph - Target Graph instance.
 * @param  {string}  type  - Type of edges to retrieve.
 * @return {array}         - Array of edges.
 */
function createEdgeArray(graph, type) {
  if (graph.size === 0) return [];

  if (type === 'mixed' || type === graph.type) {
    if (typeof Array.from === 'function')
      return Array.from(graph._edges.keys());

    return take(graph._edges.keys(), graph._edges.size);
  }

  const size =
    type === 'undirected' ? graph.undirectedSize : graph.directedSize;

  const list = new Array(size),
    mask = type === 'undirected';

  const iterator = graph._edges.values();

  let i = 0;
  let step, data;

  while (((step = iterator.next()), step.done !== true)) {
    data = step.value;

    if (data.undirected === mask) list[i++] = data.key;
  }

  return list;
}

/**
 * Function iterating over a graph's edges using a callback to match one of
 * them.
 *
 * @param  {Graph}    graph    - Target Graph instance.
 * @param  {string}   type     - Type of edges to retrieve.
 * @param  {function} callback - Function to call.
 */
function forEachEdge(breakable, graph, type, callback) {
  if (graph.size === 0) return;

  const shouldFilter = type !== 'mixed' && type !== graph.type;
  const mask = type === 'undirected';

  let step, data;
  let shouldBreak = false;
  const iterator = graph._edges.values();

  while (((step = iterator.next()), step.done !== true)) {
    data = step.value;

    if (shouldFilter && data.undirected !== mask) continue;

    const {key, attributes, source, target} = data;

    shouldBreak = callback(
      key,
      attributes,
      source.key,
      target.key,
      source.attributes,
      target.attributes,
      data.undirected
    );

    if (breakable && shouldBreak) return key;
  }

  return;
}

/**
 * Function creating an iterator of edges for the given type.
 *
 * @param  {Graph}    graph - Target Graph instance.
 * @param  {string}   type  - Type of edges to retrieve.
 * @return {Iterator}
 */
function createEdgeIterator(graph, type) {
  if (graph.size === 0) return Iterator.empty();

  const shouldFilter = type !== 'mixed' && type !== graph.type;
  const mask = type === 'undirected';

  const iterator = graph._edges.values();

  return new Iterator(function next() {
    let step, data;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      step = iterator.next();

      if (step.done) return step;

      data = step.value;

      if (shouldFilter && data.undirected !== mask) continue;

      break;
    }

    const value = {
      edge: data.key,
      attributes: data.attributes,
      source: data.source.key,
      target: data.target.key,
      sourceAttributes: data.source.attributes,
      targetAttributes: data.target.attributes,
      undirected: data.undirected
    };

    return {value, done: false};
  });
}

/**
 * Function iterating over a node's edges using a callback to match one of them.
 *
 * @param  {boolean}  multi     - Whether the graph is multi or not.
 * @param  {string}   type      - Type of edges to retrieve.
 * @param  {string}   direction - In or out?
 * @param  {any}      nodeData  - Target node's data.
 * @param  {function} callback  - Function to call.
 */
function forEachEdgeForNode(
  breakable,
  multi,
  type,
  direction,
  nodeData,
  callback
) {
  const fn = multi ? forEachMulti : forEachSimple;

  let found;

  if (type !== 'undirected') {
    if (direction !== 'out') {
      found = fn(breakable, nodeData.in, callback);

      if (breakable && found) return found;
    }
    if (direction !== 'in') {
      found = fn(
        breakable,
        nodeData.out,
        callback,
        !direction ? nodeData.key : undefined
      );

      if (breakable && found) return found;
    }
  }

  if (type !== 'directed') {
    found = fn(breakable, nodeData.undirected, callback);

    if (breakable && found) return found;
  }

  return;
}

/**
 * Function creating an array of edges for the given type & the given node.
 *
 * @param  {boolean} multi     - Whether the graph is multi or not.
 * @param  {string}  type      - Type of edges to retrieve.
 * @param  {string}  direction - In or out?
 * @param  {any}     nodeData  - Target node's data.
 * @return {array}             - Array of edges.
 */
function createEdgeArrayForNode(multi, type, direction, nodeData) {
  const edges = []; // TODO: possibility to know size beforehand or factorize with map

  forEachEdgeForNode(false, multi, type, direction, nodeData, function (key) {
    edges.push(key);
  });

  return edges;
}

/**
 * Function iterating over a node's edges using a callback.
 *
 * @param  {string}   type      - Type of edges to retrieve.
 * @param  {string}   direction - In or out?
 * @param  {any}      nodeData  - Target node's data.
 * @return {Iterator}
 */
function createEdgeIteratorForNode(type, direction, nodeData) {
  let iterator = Iterator.empty();

  if (type !== 'undirected') {
    if (direction !== 'out' && typeof nodeData.in !== 'undefined')
      iterator = chain(iterator, createIterator(nodeData.in));
    if (direction !== 'in' && typeof nodeData.out !== 'undefined')
      iterator = chain(
        iterator,
        createIterator(nodeData.out, !direction ? nodeData.key : undefined)
      );
  }

  if (type !== 'directed' && typeof nodeData.undirected !== 'undefined') {
    iterator = chain(iterator, createIterator(nodeData.undirected));
  }

  return iterator;
}

/**
 * Function iterating over edges for the given path using a callback to match
 * one of them.
 *
 * @param  {string}   type       - Type of edges to retrieve.
 * @param  {boolean}  multi      - Whether the graph is multi.
 * @param  {string}   direction  - In or out?
 * @param  {NodeData} sourceData - Source node's data.
 * @param  {string}   target     - Target node.
 * @param  {function} callback   - Function to call.
 */
function forEachEdgeForPath(
  breakable,
  type,
  multi,
  direction,
  sourceData,
  target,
  callback
) {
  const fn = multi ? forEachForKeyMulti : forEachForKeySimple;

  let found;

  if (type !== 'undirected') {
    if (typeof sourceData.in !== 'undefined' && direction !== 'out') {
      found = fn(breakable, sourceData.in, target, callback);

      if (breakable && found) return found;
    }

    if (
      typeof sourceData.out !== 'undefined' &&
      direction !== 'in' &&
      (direction || sourceData.key !== target)
    ) {
      found = fn(breakable, sourceData.out, target, callback);

      if (breakable && found) return found;
    }
  }

  if (type !== 'directed') {
    if (typeof sourceData.undirected !== 'undefined') {
      found = fn(breakable, sourceData.undirected, target, callback);

      if (breakable && found) return found;
    }
  }

  return;
}

/**
 * Function creating an array of edges for the given path.
 *
 * @param  {string}   type       - Type of edges to retrieve.
 * @param  {boolean}  multi      - Whether the graph is multi.
 * @param  {string}   direction  - In or out?
 * @param  {NodeData} sourceData - Source node's data.
 * @param  {any}      target     - Target node.
 * @return {array}               - Array of edges.
 */
function createEdgeArrayForPath(type, multi, direction, sourceData, target) {
  const edges = []; // TODO: possibility to know size beforehand or factorize with map

  forEachEdgeForPath(
    false,
    type,
    multi,
    direction,
    sourceData,
    target,
    function (key) {
      edges.push(key);
    }
  );

  return edges;
}

/**
 * Function returning an iterator over edges for the given path.
 *
 * @param  {string}   type       - Type of edges to retrieve.
 * @param  {string}   direction  - In or out?
 * @param  {NodeData} sourceData - Source node's data.
 * @param  {string}   target     - Target node.
 * @param  {function} callback   - Function to call.
 */
function createEdgeIteratorForPath(type, direction, sourceData, target) {
  let iterator = Iterator.empty();

  if (type !== 'undirected') {
    if (
      typeof sourceData.in !== 'undefined' &&
      direction !== 'out' &&
      target in sourceData.in
    )
      iterator = chain(iterator, createIteratorForKey(sourceData.in, target));

    if (
      typeof sourceData.out !== 'undefined' &&
      direction !== 'in' &&
      target in sourceData.out &&
      (direction || sourceData.key !== target)
    )
      iterator = chain(iterator, createIteratorForKey(sourceData.out, target));
  }

  if (type !== 'directed') {
    if (
      typeof sourceData.undirected !== 'undefined' &&
      target in sourceData.undirected
    )
      iterator = chain(
        iterator,
        createIteratorForKey(sourceData.undirected, target)
      );
  }

  return iterator;
}

/**
 * Function attaching an edge array creator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachEdgeArrayCreator(Class, description) {
  const {name, type, direction} = description;

  /**
   * Function returning an array of certain edges.
   *
   * Arity 0: Return all the relevant edges.
   *
   * Arity 1: Return all of a node's relevant edges.
   * @param  {any}   node   - Target node.
   *
   * Arity 2: Return the relevant edges across the given path.
   * @param  {any}   source - Source node.
   * @param  {any}   target - Target node.
   *
   * @return {array|number} - The edges or the number of edges.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  Class.prototype[name] = function (source, target) {
    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type)
      return [];

    if (!arguments.length) return createEdgeArray(this, type);

    if (arguments.length === 1) {
      source = '' + source;

      const nodeData = this._nodes.get(source);

      if (typeof nodeData === 'undefined')
        throw new NotFoundGraphError(
          `Graph.${name}: could not find the "${source}" node in the graph.`
        );

      // Iterating over a node's edges
      return createEdgeArrayForNode(
        this.multi,
        type === 'mixed' ? this.type : type,
        direction,
        nodeData
      );
    }

    if (arguments.length === 2) {
      source = '' + source;
      target = '' + target;

      const sourceData = this._nodes.get(source);

      if (!sourceData)
        throw new NotFoundGraphError(
          `Graph.${name}:  could not find the "${source}" source node in the graph.`
        );

      if (!this._nodes.has(target))
        throw new NotFoundGraphError(
          `Graph.${name}:  could not find the "${target}" target node in the graph.`
        );

      // Iterating over the edges between source & target
      return createEdgeArrayForPath(
        type,
        this.multi,
        direction,
        sourceData,
        target
      );
    }

    throw new InvalidArgumentsGraphError(
      `Graph.${name}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`
    );
  };
}

/**
 * Function attaching a edge callback iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachForEachEdge(Class, description) {
  const {name, type, direction} = description;

  const forEachName = 'forEach' + name[0].toUpperCase() + name.slice(1, -1);

  /**
   * Function iterating over the graph's relevant edges by applying the given
   * callback.
   *
   * Arity 1: Iterate over all the relevant edges.
   * @param  {function} callback - Callback to use.
   *
   * Arity 2: Iterate over all of a node's relevant edges.
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * Arity 3: Iterate over the relevant edges across the given path.
   * @param  {any}      source   - Source node.
   * @param  {any}      target   - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  Class.prototype[forEachName] = function (source, target, callback) {
    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return;

    if (arguments.length === 1) {
      callback = source;
      return forEachEdge(false, this, type, callback);
    }

    if (arguments.length === 2) {
      source = '' + source;
      callback = target;

      const nodeData = this._nodes.get(source);

      if (typeof nodeData === 'undefined')
        throw new NotFoundGraphError(
          `Graph.${forEachName}: could not find the "${source}" node in the graph.`
        );

      // Iterating over a node's edges
      // TODO: maybe attach the sub method to the instance dynamically?
      return forEachEdgeForNode(
        false,
        this.multi,
        type === 'mixed' ? this.type : type,
        direction,
        nodeData,
        callback
      );
    }

    if (arguments.length === 3) {
      source = '' + source;
      target = '' + target;

      const sourceData = this._nodes.get(source);

      if (!sourceData)
        throw new NotFoundGraphError(
          `Graph.${forEachName}:  could not find the "${source}" source node in the graph.`
        );

      if (!this._nodes.has(target))
        throw new NotFoundGraphError(
          `Graph.${forEachName}:  could not find the "${target}" target node in the graph.`
        );

      // Iterating over the edges between source & target
      return forEachEdgeForPath(
        false,
        type,
        this.multi,
        direction,
        sourceData,
        target,
        callback
      );
    }

    throw new InvalidArgumentsGraphError(
      `Graph.${forEachName}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`
    );
  };

  /**
   * Function mapping the graph's relevant edges by applying the given
   * callback.
   *
   * Arity 1: Map all the relevant edges.
   * @param  {function} callback - Callback to use.
   *
   * Arity 2: Map all of a node's relevant edges.
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * Arity 3: Map the relevant edges across the given path.
   * @param  {any}      source   - Source node.
   * @param  {any}      target   - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  const mapName = 'map' + name[0].toUpperCase() + name.slice(1);

  Class.prototype[mapName] = function () {
    const args = Array.prototype.slice.call(arguments);
    const callback = args.pop();

    let result;

    // We know the result length beforehand
    if (args.length === 0) {
      let length = 0;

      if (type !== 'directed') length += this.undirectedSize;
      if (type !== 'undirected') length += this.directedSize;

      result = new Array(length);

      let i = 0;

      args.push((e, ea, s, t, sa, ta, u) => {
        result[i++] = callback(e, ea, s, t, sa, ta, u);
      });
    }

    // We don't know the result length beforehand
    // TODO: we can in some instances of simple graphs, knowing degree
    else {
      result = [];

      args.push((e, ea, s, t, sa, ta, u) => {
        result.push(callback(e, ea, s, t, sa, ta, u));
      });
    }

    this[forEachName].apply(this, args);

    return result;
  };

  /**
   * Function filtering the graph's relevant edges using the provided predicate
   * function.
   *
   * Arity 1: Filter all the relevant edges.
   * @param  {function} predicate - Predicate to use.
   *
   * Arity 2: Filter all of a node's relevant edges.
   * @param  {any}      node      - Target node.
   * @param  {function} predicate - Predicate to use.
   *
   * Arity 3: Filter the relevant edges across the given path.
   * @param  {any}      source    - Source node.
   * @param  {any}      target    - Target node.
   * @param  {function} predicate - Predicate to use.
   *
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  const filterName = 'filter' + name[0].toUpperCase() + name.slice(1);

  Class.prototype[filterName] = function () {
    const args = Array.prototype.slice.call(arguments);
    const callback = args.pop();

    const result = [];

    args.push((e, ea, s, t, sa, ta, u) => {
      if (callback(e, ea, s, t, sa, ta, u)) result.push(e);
    });

    this[forEachName].apply(this, args);

    return result;
  };

  /**
   * Function reducing the graph's relevant edges using the provided accumulator
   * function.
   *
   * Arity 1: Reduce all the relevant edges.
   * @param  {function} accumulator  - Accumulator to use.
   * @param  {any}      initialValue - Initial value.
   *
   * Arity 2: Reduce all of a node's relevant edges.
   * @param  {any}      node         - Target node.
   * @param  {function} accumulator  - Accumulator to use.
   * @param  {any}      initialValue - Initial value.
   *
   * Arity 3: Reduce the relevant edges across the given path.
   * @param  {any}      source       - Source node.
   * @param  {any}      target       - Target node.
   * @param  {function} accumulator  - Accumulator to use.
   * @param  {any}      initialValue - Initial value.
   *
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  const reduceName = 'reduce' + name[0].toUpperCase() + name.slice(1);

  Class.prototype[reduceName] = function () {
    let args = Array.prototype.slice.call(arguments);

    if (args.length < 2 || args.length > 4) {
      throw new InvalidArgumentsGraphError(
        `Graph.${reduceName}: invalid number of arguments (expecting 2, 3 or 4 and got ${args.length}).`
      );
    }

    if (
      typeof args[args.length - 1] === 'function' &&
      typeof args[args.length - 2] !== 'function'
    ) {
      throw new InvalidArgumentsGraphError(
        `Graph.${reduceName}: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.`
      );
    }

    let callback;
    let initialValue;

    if (args.length === 2) {
      callback = args[0];
      initialValue = args[1];
      args = [];
    } else if (args.length === 3) {
      callback = args[1];
      initialValue = args[2];
      args = [args[0]];
    } else if (args.length === 4) {
      callback = args[2];
      initialValue = args[3];
      args = [args[0], args[1]];
    }

    let accumulator = initialValue;

    args.push((e, ea, s, t, sa, ta, u) => {
      accumulator = callback(accumulator, e, ea, s, t, sa, ta, u);
    });

    this[forEachName].apply(this, args);

    return accumulator;
  };
}

/**
 * Function attaching a breakable edge callback iterator method to the Graph
 * prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachFindEdge(Class, description) {
  const {name, type, direction} = description;

  const findEdgeName = 'find' + name[0].toUpperCase() + name.slice(1, -1);

  /**
   * Function iterating over the graph's relevant edges in order to match
   * one of them using the provided predicate function.
   *
   * Arity 1: Iterate over all the relevant edges.
   * @param  {function} callback - Callback to use.
   *
   * Arity 2: Iterate over all of a node's relevant edges.
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * Arity 3: Iterate over the relevant edges across the given path.
   * @param  {any}      source   - Source node.
   * @param  {any}      target   - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  Class.prototype[findEdgeName] = function (source, target, callback) {
    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type)
      return false;

    if (arguments.length === 1) {
      callback = source;
      return forEachEdge(true, this, type, callback);
    }

    if (arguments.length === 2) {
      source = '' + source;
      callback = target;

      const nodeData = this._nodes.get(source);

      if (typeof nodeData === 'undefined')
        throw new NotFoundGraphError(
          `Graph.${findEdgeName}: could not find the "${source}" node in the graph.`
        );

      // Iterating over a node's edges
      // TODO: maybe attach the sub method to the instance dynamically?
      return forEachEdgeForNode(
        true,
        this.multi,
        type === 'mixed' ? this.type : type,
        direction,
        nodeData,
        callback
      );
    }

    if (arguments.length === 3) {
      source = '' + source;
      target = '' + target;

      const sourceData = this._nodes.get(source);

      if (!sourceData)
        throw new NotFoundGraphError(
          `Graph.${findEdgeName}:  could not find the "${source}" source node in the graph.`
        );

      if (!this._nodes.has(target))
        throw new NotFoundGraphError(
          `Graph.${findEdgeName}:  could not find the "${target}" target node in the graph.`
        );

      // Iterating over the edges between source & target
      return forEachEdgeForPath(
        true,
        type,
        this.multi,
        direction,
        sourceData,
        target,
        callback
      );
    }

    throw new InvalidArgumentsGraphError(
      `Graph.${findEdgeName}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`
    );
  };

  /**
   * Function iterating over the graph's relevant edges in order to assert
   * whether any one of them matches the provided predicate function.
   *
   * Arity 1: Iterate over all the relevant edges.
   * @param  {function} callback - Callback to use.
   *
   * Arity 2: Iterate over all of a node's relevant edges.
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * Arity 3: Iterate over the relevant edges across the given path.
   * @param  {any}      source   - Source node.
   * @param  {any}      target   - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  const someName = 'some' + name[0].toUpperCase() + name.slice(1, -1);

  Class.prototype[someName] = function () {
    const args = Array.prototype.slice.call(arguments);
    const callback = args.pop();

    args.push((e, ea, s, t, sa, ta, u) => {
      return callback(e, ea, s, t, sa, ta, u);
    });

    const found = this[findEdgeName].apply(this, args);

    if (found) return true;

    return false;
  };

  /**
   * Function iterating over the graph's relevant edges in order to assert
   * whether all of them matche the provided predicate function.
   *
   * Arity 1: Iterate over all the relevant edges.
   * @param  {function} callback - Callback to use.
   *
   * Arity 2: Iterate over all of a node's relevant edges.
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * Arity 3: Iterate over the relevant edges across the given path.
   * @param  {any}      source   - Source node.
   * @param  {any}      target   - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  const everyName = 'every' + name[0].toUpperCase() + name.slice(1, -1);

  Class.prototype[everyName] = function () {
    const args = Array.prototype.slice.call(arguments);
    const callback = args.pop();

    args.push((e, ea, s, t, sa, ta, u) => {
      return !callback(e, ea, s, t, sa, ta, u);
    });

    const found = this[findEdgeName].apply(this, args);

    if (found) return false;

    return true;
  };
}

/**
 * Function attaching an edge iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachEdgeIteratorCreator(Class, description) {
  const {name: originalName, type, direction} = description;

  const name = originalName.slice(0, -1) + 'Entries';

  /**
   * Function returning an iterator over the graph's edges.
   *
   * Arity 0: Iterate over all the relevant edges.
   *
   * Arity 1: Iterate over all of a node's relevant edges.
   * @param  {any}   node   - Target node.
   *
   * Arity 2: Iterate over the relevant edges across the given path.
   * @param  {any}   source - Source node.
   * @param  {any}   target - Target node.
   *
   * @return {array|number} - The edges or the number of edges.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  Class.prototype[name] = function (source, target) {
    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type)
      return Iterator.empty();

    if (!arguments.length) return createEdgeIterator(this, type);

    if (arguments.length === 1) {
      source = '' + source;

      const sourceData = this._nodes.get(source);

      if (!sourceData)
        throw new NotFoundGraphError(
          `Graph.${name}: could not find the "${source}" node in the graph.`
        );

      // Iterating over a node's edges
      return createEdgeIteratorForNode(type, direction, sourceData);
    }

    if (arguments.length === 2) {
      source = '' + source;
      target = '' + target;

      const sourceData = this._nodes.get(source);

      if (!sourceData)
        throw new NotFoundGraphError(
          `Graph.${name}:  could not find the "${source}" source node in the graph.`
        );

      if (!this._nodes.has(target))
        throw new NotFoundGraphError(
          `Graph.${name}:  could not find the "${target}" target node in the graph.`
        );

      // Iterating over the edges between source & target
      return createEdgeIteratorForPath(type, direction, sourceData, target);
    }

    throw new InvalidArgumentsGraphError(
      `Graph.${name}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`
    );
  };
}

/**
 * Function attaching every edge iteration method to the Graph class.
 *
 * @param {function} Graph - Graph class.
 */
export default function attachEdgeIterationMethods(Graph) {
  EDGES_ITERATION.forEach(description => {
    attachEdgeArrayCreator(Graph, description);
    attachForEachEdge(Graph, description);
    attachFindEdge(Graph, description);
    attachEdgeIteratorCreator(Graph, description);
  });
}
