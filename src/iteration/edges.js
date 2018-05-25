/**
 * Graphology Edge Iteration
 * ==========================
 *
 * Attaching some methods to the Graph class to be able to iterate over a
 * graph's edges.
 */
import Iterator from 'obliterator/iterator';
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
    name: 'directedEdges',
    type: 'directed'
  },
  {
    name: 'undirectedEdges',
    type: 'undirected'
  }
];

/**
 * Helper classes.
 */
class EdgesIterator extends Iterator {}

/**
 * Function collecting edges from the given object.
 *
 * @param  {array}            edges  - Edges array to populate.
 * @param  {object|undefined} object - Target object.
 * @return {array}                   - The found edges.
 */
function collect(edges, object) {
  for (const k in object) {
    if (object[k] instanceof Set)
      edges.push.apply(edges, take(object[k].values(), object[k].size));
    else
      edges.push(object[k]);
  }
}

/**
 * Function collecting edges from the given object at given key.
 *
 * @param  {array}            edges  - Edges array to populate.
 * @param  {object|undefined} object - Target object.
 * @param  {mixed}            key    - Neighbor key.
 * @return {array}                   - The found edges.
 */
function collectForKey(edges, object, key) {

  if (!(key in object))
    return;

  if (object[key] instanceof Set)
    edges.push.apply(edges, take(object[key].values(), object[key].size));
  else
    edges.push(object[key]);

  return;
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
 * Function creating an iterator of edges for the given type.
 *
 * @param  {Graph}    graph - Target Graph instance.
 * @param  {string}   type  - Type of edges to retrieve.
 * @return {Iterator}       - Edge iterator.
 */
function createEdgeIterator(graph, type) {
  if (graph.size === 0)
    return EdgesIterator.empty();

  let inner;

  if (type === 'mixed') {
    inner = graph._edges.keys();
    return new EdgesIterator(inner.next.bind(inner));
  }

  inner = graph._edges.entries();

  return new EdgesIterator(function next() {
    const step = inner.next();

    if (step.done)
      return step;

    const data = step.value[1];

    if ((data instanceof UndirectedEdgeData) === (type === 'undirected'))
      return {value: step.value[0]};

    return next();
  });
}

/**
 * Function creating an array of edges for the given type & the given node.
 *
 * @param  {Graph}   graph     - Target Graph instance.
 * @param  {string}  type      - Type of edges to retrieve.
 * @param  {string}  direction - In or out?
 * @param  {any}     nodeData  - Target node's data.
 * @return {array}             - Array of edges.
 */
function createEdgeArrayForNode(graph, type, direction, nodeData) {
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
 * Function creating an array of edges for the given path.
 *
 * @param  {Graph}   graph  - Target Graph instance.
 * @param  {string}  type   - Type of edges to retrieve.
 * @param  {any}     source - Source node.
 * @param  {any}     target - Target node.
 * @return {array}          - Array of edges.
 */
function createEdgeArrayForPath(graph, type, source, target) {
  const edges = [];

  const sourceData = graph._nodes.get(source);

  if (type !== 'undirected') {

    if (typeof sourceData.in !== 'undefined')
      collectForKey(edges, sourceData.in, target);

    if (typeof sourceData.out !== 'undefined')
      collectForKey(edges, sourceData.out, target);
  }

  if (type !== 'directed') {
    if (typeof sourceData.undirected !== 'undefined')
      collectForKey(edges, sourceData.undirected, target);
  }

  return edges;
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
   * Arity 1a: Return all of a node's relevant edges.
   * @param  {any}   node   - Target node.
   *
   * Arity 1b: Return the union of the relevant edges of the given bunch of nodes.
   * @param  {bunch} bunch  - Bunch of nodes.
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
      return createEdgeArrayForNode(this, type, direction, nodeData);
    }

    if (arguments.length === 2) {
      source = '' + source;
      target = '' + target;

      if (!this._nodes.has(source))
        throw new NotFoundGraphError(`Graph.${name}:  could not find the "${source}" source node in the graph.`);

      if (!this._nodes.has(target))
        throw new NotFoundGraphError(`Graph.${name}:  could not find the "${target}" target node in the graph.`);

      // Iterating over the edges between source & target
      return createEdgeArrayForPath(this, type, source, target);
    }

    throw new InvalidArgumentsGraphError(`Graph.${name}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`);
  };
}

/**
 * Function attaching an edge array iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
export function attachEdgeIteratorCreator(Class, description) {
  const {
    name: originalName,
    type,
    // direction
  } = description;

  const name = originalName + 'Iterator';

  /**
   * Function returning an iterator over the graph's edges.
   *
   * Arity 0: Return all the relevant edges.
   *
   * Arity 1a: Return all of a node's relevant edges.
   * @param  {any}   node   - Target node.
   *
   * Arity 1b: Return the union of the relevant edges of the given bunch of nodes.
   * @param  {bunch} bunch  - Bunch of nodes.
   *
   * Arity 2: Return the relevant edges across the given path.
   * @param  {any}   source - Source node.
   * @param  {any}   target - Target node.
   *
   * @return {array|number} - The edges or the number of edges.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  Class.prototype[name] = function() {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type)
      return Iterator.empty();

    if (!arguments.length)
      return createEdgeIterator(this, type);

    // TODO: complete here...
    // if (arguments.length === 1) {
    //   source = '' + source;

    //   if (!this._nodes.has(source))
    //     throw new NotFoundGraphError(`Graph.${name}: could not find the "${source}" node in the graph.`);

    //   // Iterating over a node's edges
    //   return createEdgeArrayForNode(this, type, direction, source);
    // }

    // if (arguments.length === 2) {
    //   source = '' + source;
    //   target = '' + target;

    //   if (!this._nodes.has(source))
    //     throw new NotFoundGraphError(`Graph.${name}:  could not find the "${source}" source node in the graph.`);

    //   if (!this._nodes.has(target))
    //     throw new NotFoundGraphError(`Graph.${name}:  could not find the "${target}" target node in the graph.`);

    //   // Iterating over the edges between source & target
    //   return createEdgeArrayForPath(this, type, source, target);
    // }

    // throw new InvalidArgumentsGraphError(`Graph.${name}: too many arguments (expecting 0, 1 or 2 and got ${arguments.length}).`);
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
    attachEdgeIteratorCreator(Graph, description);
  });
}
