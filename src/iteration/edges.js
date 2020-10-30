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

import {
  InvalidArgumentsGraphError,
  NotFoundGraphError
} from '../errors';

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
 * Function collecting edges from the given object.
 *
 * @param  {array}  edges  - Edges array to populate.
 * @param  {object} object - Target object.
 * @return {array}         - The found edges.
 */
function collectSimple(edges, object) {
  for (const k in object)
    edges.push(object[k].key);
}

function collectMulti(edges, object) {
  for (const k in object)
    object[k].forEach(edgeData => edges.push(edgeData.key));
}

/**
 * Function iterating over edges from the given object using a callback.
 *
 * @param {object}   object   - Target object.
 * @param {function} callback - Function to call.
 */
function forEachSimple(object, callback, avoid) {
  for (const k in object) {
    if (k === avoid)
      continue;

    const edgeData = object[k];

    callback(
      edgeData.key,
      edgeData.attributes,
      edgeData.source.key,
      edgeData.target.key,
      edgeData.source.attributes,
      edgeData.target.attributes,
      edgeData.undirected,
      edgeData.generatedKey
    );
  }
}

function forEachMulti(object, callback, avoid) {
  for (const k in object) {
    if (k === avoid)
      continue;

    object[k].forEach(edgeData => callback(
      edgeData.key,
      edgeData.attributes,
      edgeData.source.key,
      edgeData.target.key,
      edgeData.source.attributes,
      edgeData.target.attributes,
      edgeData.undirected,
      edgeData.generatedKey
    ));
  }
}

/**
 * Function iterating over edges from the given object using a callback until
 * the return value of the callback is truthy.
 *
 * @param {object}   object   - Target object.
 * @param {function} callback - Function to call.
 */
function forEachSimpleUntil(object, callback, avoid) {
  let shouldBreak = false;

  for (const k in object) {
    if (k === avoid)
      continue;

    const edgeData = object[k];

    shouldBreak = callback(
      edgeData.key,
      edgeData.attributes,
      edgeData.source.key,
      edgeData.target.key,
      edgeData.source.attributes,
      edgeData.target.attributes,
      edgeData.undirected,
      edgeData.generatedKey
    );

    if (shouldBreak)
      return true;
  }

  return false;
}

function forEachMultiUntil(object, callback, avoid) {
  let iterator, step, edgeData, source, target;

  let shouldBreak = false;

  for (const k in object) {
    if (k === avoid)
      continue;

    iterator = object[k].values();

    while ((step = iterator.next(), step.done !== true)) {
      edgeData = step.value;
      source = edgeData.source;
      target = edgeData.target;

      shouldBreak = callback(
        edgeData.key,
        edgeData.attributes,
        source.key,
        target.key,
        source.attributes,
        target.attributes,
        edgeData.undirected,
        edgeData.generatedKey
      );

      if (shouldBreak)
        return true;
    }
  }

  return false;
}

/**
 * Function returning an iterator over edges from the given object.
 *
 * @param  {object}   object - Target object.
 * @return {Iterator}
 */
function createIterator(object, avoid) {
  const keys = Object.keys(object),
        l = keys.length;

  let inner = null,
      i = 0;

  return new Iterator(function next() {
    let edgeData;

    if (inner) {
      const step = inner.next();

      if (step.done) {
        inner = null;
        i++;
        return next();
      }

      edgeData = step.value;
    }
    else {
      if (i >= l)
        return {done: true};

      const k = keys[i];

      if (k === avoid) {
        i++;
        return next();
      }

      edgeData = object[k];

      if (edgeData instanceof Set) {
        inner = edgeData.values();
        return next();
      }

      i++;
    }

    return {
      done: false,
      value: [
        edgeData.key,
        edgeData.attributes,
        edgeData.source.key,
        edgeData.target.key,
        edgeData.source.attributes,
        edgeData.target.attributes
      ]
    };
  });
}

/**
 * Function collecting edges from the given object at given key.
 *
 * @param  {array}  edges  - Edges array to populate.
 * @param  {object} object - Target object.
 * @param  {mixed}  k      - Neighbor key.
 * @return {array}         - The found edges.
 */
function collectForKeySimple(edges, object, k) {
  const edgeData = object[k];

  if (!edgeData)
    return;

  edges.push(edgeData.key);
}

function collectForKeyMulti(edges, object, k) {
  const edgesData = object[k];

  if (!edgesData)
    return;

  edgesData.forEach(edgeData => edges.push(edgeData.key));
}

/**
 * Function iterating over the egdes from the object at given key using
 * a callback.
 *
 * @param {object}   object   - Target object.
 * @param {mixed}    k        - Neighbor key.
 * @param {function} callback - Callback to use.
 */
function forEachForKeySimple(object, k, callback) {
  const edgeData = object[k];

  if (!edgeData)
    return;

  const sourceData = edgeData.source;
  const targetData = edgeData.target;

  callback(
    edgeData.key,
    edgeData.attributes,
    sourceData.key,
    targetData.key,
    sourceData.attributes,
    targetData.attributes,
    edgeData.undirected,
    edgeData.generatedKey
  );
}

function forEachForKeyMulti(object, k, callback) {
  const edgesData = object[k];

  if (!edgesData)
    return;

  edgesData.forEach(edgeData => callback(
    edgeData.key,
    edgeData.attributes,
    edgeData.source.key,
    edgeData.target.key,
    edgeData.source.attributes,
    edgeData.target.attributes,
    edgeData.undirected,
    edgeData.generatedKey
  ));
}

/**
 * Function iterating over the egdes from the object at given key using
 * a callback until it returns a truthy value to stop iteration.
 *
 * @param {object}   object   - Target object.
 * @param {mixed}    k        - Neighbor key.
 * @param {function} callback - Callback to use.
 */
function forEachForKeySimpleUntil(object, k, callback) {
  const edgeData = object[k];

  if (!edgeData)
    return;

  const sourceData = edgeData.source;
  const targetData = edgeData.target;

  return callback(
    edgeData.key,
    edgeData.attributes,
    sourceData.key,
    targetData.key,
    sourceData.attributes,
    targetData.attributes,
    edgeData.undirected,
    edgeData.generatedKey
  );
}

function forEachForKeyMultiUntil(object, k, callback) {
  const edgesData = object[k];

  if (!edgesData)
    return;

  let shouldBreak = false;

  const iterator = edgesData.values();
  let step, edgeData;

  while ((step = iterator.next(), step.done !== true)) {
    edgeData = step.value;

    shouldBreak = callback(
      edgeData.key,
      edgeData.attributes,
      edgeData.source.key,
      edgeData.target.key,
      edgeData.source.attributes,
      edgeData.target.attributes,
      edgeData.undirected,
      edgeData.generatedKey
    );

    if (shouldBreak)
      return true;
  }

  return false;
}

/**
 * Function returning an iterator over the egdes from the object at given key.
 *
 * @param  {object}   object   - Target object.
 * @param  {mixed}    k        - Neighbor key.
 * @return {Iterator}
 */
function createIteratorForKey(object, k) {
  const v = object[k];

  if (v instanceof Set) {
    const iterator = v.values();

    return new Iterator(function() {
      const step = iterator.next();

      if (step.done)
        return step;

      const edgeData = step.value;

      return {
        done: false,
        value: [
          edgeData.key,
          edgeData.attributes,
          edgeData.source.key,
          edgeData.target.key,
          edgeData.source.attributes,
          edgeData.target.attributes
        ]
      };
    });
  }

  return Iterator.of([
    v.key,
    v.attributes,
    v.source.key,
    v.target.key,
    v.source.attributes,
    v.target.attributes
  ]);
}

/**
 * Function creating an array of edges for the given type.
 *
 * @param  {Graph}   graph - Target Graph instance.
 * @param  {string}  type  - Type of edges to retrieve.
 * @return {array}         - Array of edges.
 */
function createEdgeArray(graph, type) {
  if (graph.size === 0)
    return [];

  if (type === 'mixed' || type === graph.type) {
    if (typeof Array.from === 'function')
      return Array.from(graph._edges.keys());

    return take(graph._edges.keys(), graph._edges.size);
  }

  const size = type === 'undirected' ?
    graph.undirectedSize :
    graph.directedSize;

  const list = new Array(size),
        mask = type === 'undirected';

  const iterator = graph._edges.values();

  let i = 0;
  let step, data;

  while ((step = iterator.next(), step.done !== true)) {
    data = step.value;

    if (data.undirected === mask)
      list[i++] = data.key;
  }

  return list;
}

/**
 * Function iterating over a graph's edges using a callback.
 *
 * @param  {Graph}    graph    - Target Graph instance.
 * @param  {string}   type     - Type of edges to retrieve.
 * @param  {function} callback - Function to call.
 */
function forEachEdge(graph, type, callback) {
  if (graph.size === 0)
    return;

  const shouldFilter = type !== 'mixed' && type !== graph.type;
  const mask = type === 'undirected';

  let step, data;
  const iterator = graph._edges.values();

  while ((step = iterator.next(), step.done !== true)) {
    data = step.value;

    if (shouldFilter && data.undirected !== mask)
      continue;

    const {key, attributes, source, target} = data;

    callback(
      key,
      attributes,
      source.key,
      target.key,
      source.attributes,
      target.attributes,
      data.undirected,
      data.generatedKey
    );
  }
}

/**
 * Function iterating over a graph's edges using a callback until it returns
 * a truthy value to stop iteration.
 *
 * @param  {Graph}    graph    - Target Graph instance.
 * @param  {string}   type     - Type of edges to retrieve.
 * @param  {function} callback - Function to call.
 */
function forEachEdgeUntil(graph, type, callback) {
  if (graph.size === 0)
    return;

  const shouldFilter = type !== 'mixed' && type !== graph.type;
  const mask = type === 'undirected';

  let step, data;
  let shouldBreak = false;
  const iterator = graph._edges.values();

  while ((step = iterator.next(), step.done !== true)) {
    data = step.value;

    if (shouldFilter && data.undirected !== mask)
      continue;

    const {key, attributes, source, target} = data;

    shouldBreak = callback(
      key,
      attributes,
      source.key,
      target.key,
      source.attributes,
      target.attributes,
      data.undirected,
      data.generatedKey
    );

    if (shouldBreak)
      break;
  }
}

/**
 * Function creating an iterator of edges for the given type.
 *
 * @param  {Graph}    graph - Target Graph instance.
 * @param  {string}   type  - Type of edges to retrieve.
 * @return {Iterator}
 */
function createEdgeIterator(graph, type) {
  if (graph.size === 0)
    return Iterator.empty();

  const shouldFilter = type !== 'mixed' && type !== graph.type;
  const mask = type === 'undirected';

  const iterator = graph._edges.values();

  return new Iterator(function next() {
    let step, data;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      step = iterator.next();

      if (step.done)
        return step;

      data = step.value;

      if (shouldFilter && data.undirected !== mask)
        continue;

      break;
    }

    const value = [
      data.key,
      data.attributes,
      data.source.key,
      data.target.key,
      data.source.attributes,
      data.target.attributes
    ];

    return {value, done: false};
  });
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
  const edges = [];

  const fn = multi ? collectMulti : collectSimple;

  if (type !== 'undirected') {
    if (direction !== 'out')
      fn(edges, nodeData.in);
    if (direction !== 'in')
      fn(edges, nodeData.out);

    // Handling self loop edge case
    if (!direction && nodeData.directedSelfLoops > 0)
      edges.splice(edges.lastIndexOf(nodeData.key), 1);
  }

  if (type !== 'directed') {
    fn(edges, nodeData.undirected);
  }

  return edges;
}

/**
 * Function iterating over a node's edges using a callback.
 *
 * @param  {boolean}  multi     - Whether the graph is multi or not.
 * @param  {string}   type      - Type of edges to retrieve.
 * @param  {string}   direction - In or out?
 * @param  {any}      nodeData  - Target node's data.
 * @param  {function} callback  - Function to call.
 */
function forEachEdgeForNode(multi, type, direction, nodeData, callback) {
  const fn = multi ? forEachMulti : forEachSimple;

  if (type !== 'undirected') {
    if (direction !== 'out')
      fn(nodeData.in, callback);
    if (direction !== 'in')
      fn(nodeData.out, callback, !direction ? nodeData.key : null);
  }

  if (type !== 'directed') {
    fn(nodeData.undirected, callback);
  }
}

/**
 * Function iterating over a node's edges using a callback until it returns
 * a truthy value to stop iteration.
 *
 * @param  {boolean}  multi     - Whether the graph is multi or not.
 * @param  {string}   type      - Type of edges to retrieve.
 * @param  {string}   direction - In or out?
 * @param  {any}      nodeData  - Target node's data.
 * @param  {function} callback  - Function to call.
 */
function forEachEdgeForNodeUntil(multi, type, direction, nodeData, callback) {
  const fn = multi ? forEachMultiUntil : forEachSimpleUntil;

  let shouldBreak = false;

  if (type !== 'undirected') {
    if (direction !== 'out') {
      shouldBreak = fn(nodeData.in, callback);

      if (shouldBreak)
        return;
    }
    if (direction !== 'in') {
      shouldBreak = fn(nodeData.out, callback, !direction ? nodeData.key : null);

      if (shouldBreak)
        return;
    }
  }

  if (type !== 'directed') {
    shouldBreak = fn(nodeData.undirected, callback);

    if (shouldBreak)
      return;
  }
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
      iterator = chain(iterator, createIterator(nodeData.out, !direction ? nodeData.key : null));
  }

  if (type !== 'directed' && typeof nodeData.undirected !== 'undefined') {
    iterator = chain(iterator, createIterator(nodeData.undirected));
  }

  return iterator;
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
  const fn = multi ? collectForKeyMulti : collectForKeySimple;

  const edges = [];

  if (type !== 'undirected') {

    if (typeof sourceData.in !== 'undefined' && direction !== 'out')
      fn(edges, sourceData.in, target);

    if (typeof sourceData.out !== 'undefined' && direction !== 'in')
      fn(edges, sourceData.out, target);

    // Handling self loop edge case
    if (!direction && sourceData.directedSelfLoops > 0)
      edges.splice(edges.lastIndexOf(sourceData.key), 1);
  }

  if (type !== 'directed') {
    if (typeof sourceData.undirected !== 'undefined')
      fn(edges, sourceData.undirected, target);
  }

  return edges;
}

/**
 * Function iterating over edges for the given path using a callback.
 *
 * @param  {string}   type       - Type of edges to retrieve.
 * @param  {boolean}  multi      - Whether the graph is multi.
 * @param  {string}   direction  - In or out?
 * @param  {NodeData} sourceData - Source node's data.
 * @param  {string}   target     - Target node.
 * @param  {function} callback   - Function to call.
 */
function forEachEdgeForPath(type, multi, direction, sourceData, target, callback) {
  const fn = multi ? forEachForKeyMulti : forEachForKeySimple;

  if (type !== 'undirected') {

    if (typeof sourceData.in !== 'undefined' && direction !== 'out')
      fn(sourceData.in, target, callback);

    if (sourceData.key !== target)
      if (typeof sourceData.out !== 'undefined' && direction !== 'in')
        fn(sourceData.out, target, callback);
  }

  if (type !== 'directed') {
    if (typeof sourceData.undirected !== 'undefined')
      fn(sourceData.undirected, target, callback);
  }
}

/**
 * Function iterating over edges for the given path using a callback until
 * it returns a truthy value to stop iteration.
 *
 * @param  {string}   type       - Type of edges to retrieve.
 * @param  {boolean}  multi      - Whether the graph is multi.
 * @param  {string}   direction  - In or out?
 * @param  {NodeData} sourceData - Source node's data.
 * @param  {string}   target     - Target node.
 * @param  {function} callback   - Function to call.
 */
function forEachEdgeForPathUntil(type, multi, direction, sourceData, target, callback) {
  const fn = multi ? forEachForKeyMultiUntil : forEachForKeySimpleUntil;

  let shouldBreak = false;

  if (type !== 'undirected') {

    if (typeof sourceData.in !== 'undefined' && direction !== 'out') {
      shouldBreak = fn(sourceData.in, target, callback);

      if (shouldBreak)
        return;
    }

    if (sourceData.key !== target)
      if (typeof sourceData.out !== 'undefined' && direction !== 'in') {
        shouldBreak = fn(sourceData.out, target, callback, !direction ? sourceData.key : null);

        if (shouldBreak)
          return;
      }
  }

  if (type !== 'directed') {
    if (typeof sourceData.undirected !== 'undefined') {
      shouldBreak = fn(sourceData.undirected, target, callback);

      if (shouldBreak)
        return;
    }
  }
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
      target in sourceData.out
    )
      iterator = chain(iterator, createIteratorForKey(sourceData.out, target));
  }

  if (type !== 'directed') {
    if (
      typeof sourceData.undirected !== 'undefined' &&
      target in sourceData.undirected
    )
      iterator = chain(iterator, createIteratorForKey(sourceData.undirected, target));
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
  const {
    name,
    type,
    direction
  } = description;

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
  Class.prototype[name] = function(source, target) {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type)
      return [];

    if (!arguments.length)
      return createEdgeArray(this, type);

    if (arguments.length === 1) {
      source = '' + source;

      const nodeData = this._nodes.get(source);

      if (typeof nodeData === 'undefined')
        throw new NotFoundGraphError(`Graph.${name}: could not find the "${source}" node in the graph.`);

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
        throw new NotFoundGraphError(`Graph.${name}:  could not find the "${source}" source node in the graph.`);

      if (!this._nodes.has(target))
        throw new NotFoundGraphError(`Graph.${name}:  could not find the "${target}" target node in the graph.`);

      // Iterating over the edges between source & target
      return createEdgeArrayForPath(type, this.multi, direction, sourceData, target);
    }

    throw new InvalidArgumentsGraphError(`Graph.${name}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`);
  };
}

/**
 * Function attaching a edge callback iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachForEachEdge(Class, description) {
  const {
    name,
    type,
    direction
  } = description;

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
  Class.prototype[forEachName] = function(source, target, callback) {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type)
      return;

    if (arguments.length === 1) {
      callback = source;
      return forEachEdge(this, type, callback);
    }

    if (arguments.length === 2) {
      source = '' + source;
      callback = target;

      const nodeData = this._nodes.get(source);

      if (typeof nodeData === 'undefined')
        throw new NotFoundGraphError(`Graph.${forEachName}: could not find the "${source}" node in the graph.`);

      // Iterating over a node's edges
      // TODO: maybe attach the sub method to the instance dynamically?
      return forEachEdgeForNode(
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
        throw new NotFoundGraphError(`Graph.${forEachName}:  could not find the "${source}" source node in the graph.`);

      if (!this._nodes.has(target))
        throw new NotFoundGraphError(`Graph.${forEachName}:  could not find the "${target}" target node in the graph.`);

      // Iterating over the edges between source & target
      return forEachEdgeForPath(type, this.multi, direction, sourceData, target, callback);
    }

    throw new InvalidArgumentsGraphError(`Graph.${forEachName}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`);
  };
}

/**
 * Function attaching a breakable edge callback iterator method to the Graph
 * prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachForEachEdgeUntil(Class, description) {
  const {
    name,
    type,
    direction
  } = description;

  const forEachUntilName = 'forEach' + name[0].toUpperCase() + name.slice(1, -1) + 'Until';

  /**
   * Function iterating over the graph's relevant edges by applying the given
   * callback and breaking as soon as the callback return a truthy value.
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
  Class.prototype[forEachUntilName] = function(source, target, callback) {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type)
      return;

    if (arguments.length === 1) {
      callback = source;
      return forEachEdgeUntil(this, type, callback);
    }

    if (arguments.length === 2) {
      source = '' + source;
      callback = target;

      const nodeData = this._nodes.get(source);

      if (typeof nodeData === 'undefined')
        throw new NotFoundGraphError(`Graph.${forEachUntilName}: could not find the "${source}" node in the graph.`);

      // Iterating over a node's edges
      // TODO: maybe attach the sub method to the instance dynamically?
      return forEachEdgeForNodeUntil(
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
        throw new NotFoundGraphError(`Graph.${forEachUntilName}:  could not find the "${source}" source node in the graph.`);

      if (!this._nodes.has(target))
        throw new NotFoundGraphError(`Graph.${forEachUntilName}:  could not find the "${target}" target node in the graph.`);

      // Iterating over the edges between source & target
      return forEachEdgeForPathUntil(type, this.multi, direction, sourceData, target, callback);
    }

    throw new InvalidArgumentsGraphError(`Graph.${forEachUntilName}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`);
  };
}

/**
 * Function attaching an edge iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
export function attachEdgeIteratorCreator(Class, description) {
  const {
    name: originalName,
    type,
    direction
  } = description;

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
  Class.prototype[name] = function(source, target) {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type)
      return Iterator.empty();

    if (!arguments.length)
      return createEdgeIterator(this, type);

    if (arguments.length === 1) {
      source = '' + source;

      const sourceData = this._nodes.get(source);

      if (!sourceData)
        throw new NotFoundGraphError(`Graph.${name}: could not find the "${source}" node in the graph.`);

      // Iterating over a node's edges
      return createEdgeIteratorForNode(type, direction, sourceData);
    }

    if (arguments.length === 2) {
      source = '' + source;
      target = '' + target;

      const sourceData = this._nodes.get(source);

      if (!sourceData)
        throw new NotFoundGraphError(`Graph.${name}:  could not find the "${source}" source node in the graph.`);

      if (!this._nodes.has(target))
        throw new NotFoundGraphError(`Graph.${name}:  could not find the "${target}" target node in the graph.`);

      // Iterating over the edges between source & target
      return createEdgeIteratorForPath(type, direction, sourceData, target);
    }

    throw new InvalidArgumentsGraphError(`Graph.${name}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`);
  };
}

/**
 * Function attaching every edge iteration method to the Graph class.
 *
 * @param {function} Graph - Graph class.
 */
export function attachEdgeIterationMethods(Graph) {
  EDGES_ITERATION.forEach(description => {
    attachEdgeArrayCreator(Graph, description);
    attachForEachEdge(Graph, description);
    attachForEachEdgeUntil(Graph, description);
    attachEdgeIteratorCreator(Graph, description);
  });
}
