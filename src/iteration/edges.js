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

import {UndirectedEdgeData} from '../data';

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
function collect(edges, object) {
  for (const k in object) {
    if (object[k] instanceof Set)
      object[k].forEach(edgeData => edges.push(edgeData.key));
    else
      edges.push(object[k].key);
  }
}

/**
 * Function iterating over edges from the given object using a callback.
 *
 * @param {object}   object   - Target object.
 * @param {function} callback - Function to call.
 */
function forEach(object, callback) {
  for (const k in object) {
    if (object[k] instanceof Set)
      object[k].forEach(edgeData => callback(
        edgeData.key,
        edgeData.attributes,
        edgeData.source.key,
        edgeData.target.key,
        edgeData.source.attributes,
        edgeData.target.attributes
      ));
    else {
      const edgeData = object[k];

      callback(
        edgeData.key,
        edgeData.attributes,
        edgeData.source.key,
        edgeData.target.key,
        edgeData.source.attributes,
        edgeData.target.attributes
      );
    }
  }
}

/**
 * Function returning an iterator over edges from the given object.
 *
 * @param  {object}   object - Target object.
 * @return {Iterator}
 */
function createIterator(object) {
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
function collectForKey(edges, object, k) {

  if (!(k in object))
    return;

  if (object[k] instanceof Set)
    object[k].forEach(edgeData => edges.push(edgeData.key));
  else
    edges.push(object[k].key);

  return;
}

/**
 * Function iterating over the egdes from the object at given key using
 * a callback.
 *
 * @param {object}   object   - Target object.
 * @param {mixed}    k        - Neighbor key.
 * @param {function} callback - Callback to use.
 */
function forEachForKey(object, k, callback) {

  if (!(k in object))
    return;

  if (object[k] instanceof Set)
    object[k].forEach(edgeData => callback(
      edgeData.key,
      edgeData.attributes,
      edgeData.source.key,
      edgeData.target.key,
      edgeData.source.attributes,
      edgeData.target.attributes
    ));
  else {
    const edgeData = object[k];

    callback(
      edgeData.key,
      edgeData.attributes,
      edgeData.source.key,
      edgeData.target.key,
      edgeData.source.attributes,
      edgeData.target.attributes
    );
  }

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

  if (type === 'mixed' || type === graph.type)
    return take(graph._edges.keys(), graph._edges.size);

  const size = type === 'undirected' ?
    graph.undirectedSize :
    graph.directedSize;

  const list = new Array(size),
        mask = type === 'undirected';

  let i = 0;

  graph._edges.forEach((data, edge) => {

    if ((data instanceof UndirectedEdgeData) === mask)
      list[i++] = edge;
  });

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

  if (type === 'mixed' || type === graph.type) {
    graph._edges.forEach((data, key) => {

      const {attributes, source, target} = data;

      callback(
        key,
        attributes,
        source.key,
        target.key,
        source.attributes,
        target.attributes
      );
    });
  }
  else {
    const mask = type === 'undirected';

    graph._edges.forEach((data, key) => {
      if ((data instanceof UndirectedEdgeData) === mask) {

        const {attributes, source, target} = data;

        callback(
          key,
          attributes,
          source.key,
          target.key,
          source.attributes,
          target.attributes
        );
      }
    });
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

  let iterator;

  if (type === 'mixed') {
    iterator = graph._edges.entries();

    return new Iterator(function next() {
      const step = iterator.next();

      if (step.done)
        return step;

      const [edge, data] = step.value;

      const value = [
        edge,
        data.attributes,
        data.source.key,
        data.target.key,
        data.source.attributes,
        data.target.attributes
      ];

      return {value, done: false};
    });
  }

  iterator = graph._edges.entries();

  return new Iterator(function next() {
    const step = iterator.next();

    if (step.done)
      return step;

    const [edge, data] = step.value;

    if ((data instanceof UndirectedEdgeData) === (type === 'undirected')) {
      const value = [
        edge,
        data.attributes,
        data.source.key,
        data.target.key,
        data.source.attributes,
        data.target.attributes
      ];

      return {value, done: false};
    }

    return next();
  });
}

/**
 * Function creating an array of edges for the given type & the given node.
 *
 * @param  {string}  type      - Type of edges to retrieve.
 * @param  {string}  direction - In or out?
 * @param  {any}     nodeData  - Target node's data.
 * @return {array}             - Array of edges.
 */
function createEdgeArrayForNode(type, direction, nodeData) {
  const edges = [];

  if (type !== 'undirected') {
    if (direction !== 'out')
      collect(edges, nodeData.in);
    if (direction !== 'in')
      collect(edges, nodeData.out);
  }

  if (type !== 'directed') {
    collect(edges, nodeData.undirected);
  }

  return edges;
}

/**
 * Function iterating over a node's edges using a callback.
 *
 * @param  {string}   type      - Type of edges to retrieve.
 * @param  {string}   direction - In or out?
 * @param  {any}      nodeData  - Target node's data.
 * @param  {function} callback  - Function to call.
 */
function forEachEdgeForNode(type, direction, nodeData, callback) {

  if (type !== 'undirected') {
    if (direction !== 'out')
      forEach(nodeData.in, callback);
    if (direction !== 'in')
      forEach(nodeData.out, callback);
  }

  if (type !== 'directed') {
    forEach(nodeData.undirected, callback);
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
      iterator = chain(iterator, createIterator(nodeData.out));
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
 * @param  {string}   direction  - In or out?
 * @param  {NodeData} sourceData - Source node's data.
 * @param  {any}      target     - Target node.
 * @return {array}               - Array of edges.
 */
function createEdgeArrayForPath(type, direction, sourceData, target) {
  const edges = [];

  if (type !== 'undirected') {

    if (typeof sourceData.in !== 'undefined' && direction !== 'out')
      collectForKey(edges, sourceData.in, target);

    if (typeof sourceData.out !== 'undefined' && direction !== 'in')
      collectForKey(edges, sourceData.out, target);
  }

  if (type !== 'directed') {
    if (typeof sourceData.undirected !== 'undefined')
      collectForKey(edges, sourceData.undirected, target);
  }

  return edges;
}

/**
 * Function iterating over edges for the given path using a callback.
 *
 * @param  {string}   type       - Type of edges to retrieve.
 * @param  {string}   direction  - In or out?
 * @param  {NodeData} sourceData - Source node's data.
 * @param  {string}   target     - Target node.
 * @param  {function} callback   - Function to call.
 */
function forEachEdgeForPath(type, direction, sourceData, target, callback) {
  if (type !== 'undirected') {

    if (typeof sourceData.in !== 'undefined' && direction !== 'out')
      forEachForKey(sourceData.in, target, callback);

    if (typeof sourceData.out !== 'undefined' && direction !== 'in')
      forEachForKey(sourceData.out, target, callback);
  }

  if (type !== 'directed') {
    if (typeof sourceData.undirected !== 'undefined')
      forEachForKey(sourceData.undirected, target, callback);
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
      return createEdgeArrayForPath(type, direction, sourceData, target);
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
      return forEachEdgeForNode(
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
      return forEachEdgeForPath(type, direction, sourceData, target, callback);
    }

    throw new InvalidArgumentsGraphError(`Graph.${forEachName}: too many arguments (expecting 1, 2 or 3 and got ${arguments.length}).`);
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
    attachEdgeIteratorCreator(Graph, description);
  });
}
