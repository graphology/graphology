/**
 * Graphology Edge Iteration
 * ==========================
 *
 * Attaching some methods to the Graph class to be able to iterate over a
 * graph's edges.
 */
import {
  InvalidArgumentsGraphError,
  NotFoundGraphError
} from '../errors';

import {
  consumeIterator
} from '../utils';

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
 * Function collecting edges from the given object.
 *
 * @param  {array}            edges  - Edges array to populate.
 * @param  {object|undefined} object - Target object.
 * @param  {mixed}            [key]  - Optional key.
 * @return {array}                   - The found edges.
 */
function collect(edges, object, key) {
  const hasKey = arguments.length > 2;

  if (!object || (hasKey && !(key in object)))
    return;

  if (hasKey) {

    if (object[key] instanceof Set)
      edges.push.apply(edges, consumeIterator(object[key].size, object[key].values()));
    else
      edges.push(object[key]);

    return;
  }

  for (const k in object) {

    if (object[k] instanceof Set)
      edges.push.apply(edges, consumeIterator(object[k].size, object[k].values()));
    else
      edges.push(object[k]);
  }
}

/**
 * Function creating an array of edge for the given type.
 *
 * @param  {Graph}   graph - Target Graph instance.
 * @param  {string}  type  - Type of edges to retrieve.
 * @return {array}         - Array of edges.
 */
function createEdgeArray(graph, type) {
  if (type === 'mixed')
    return consumeIterator(graph._edges.size, graph._edges.keys());

  const list = [];

  graph._edges.forEach((data, edge) => {

    if (!!data.undirected === (type === 'undirected'))
      list.push(edge);
  });

  return list;
}

/**
 * Function creating an array of edge for the given type & the given node.
 *
 * @param  {Graph}   graph     - Target Graph instance.
 * @param  {string}  type      - Type of edges to retrieve.
 * @param  {string}  direction - In or out?
 * @param  {any}     node      - Target node.
 * @return {array}             - Array of edges.
 */
function createEdgeArrayForNode(graph, type, direction, node) {

  // For this, we need to compute the "structure" index
  graph.computeIndex();

  const edges = [];

  const nodeData = graph._nodes.get(node);

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
 * Function creating an array of edge for the given path.
 *
 * @param  {Graph}   graph  - Target Graph instance.
 * @param  {string}  type   - Type of edges to retrieve.
 * @param  {any}     source - Source node.
 * @param  {any}     target - Target node.
 * @return {array}          - Array of edges.
 */
function createEdgeArrayForPath(graph, type, source, target) {

  // For this, we need to compute the "structure" index
  graph.computeIndex();

  const edges = [];

  const sourceData = graph._nodes.get(source);

  if (type !== 'undirected') {
    collect(edges, sourceData.in, target);
    collect(edges, sourceData.out, target);
  }

  if (type !== 'directed') {
    collect(edges, sourceData.undirected, target);
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
   * Function returning an array or the count of certain edges.
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

      if (!this._nodes.has(source))
        throw new NotFoundGraphError(`Graph.${name}: could not find the "${source}" node in the graph.`);

      // Iterating over a node's edges
      return createEdgeArrayForNode(this, type, direction, source);
    }

    if (arguments.length === 2) {
      source = '' + source;
      target = '' + target;

      if (!this._nodes.has(source))
        throw new NotFoundGraphError(`Graph.${name}:  could not find the "${source}" source node in the graph.`);

      if (!this._nodes.has(target))
        throw new NotFoundGraphError(`Graph.${name}:  could not find the "${target}" target node in the graph.`);

      // Iterating over the edges between source & target
      let hasEdge;

      if (type !== 'undirected')
        hasEdge = this.hasDirectedEdge(source, target);
      else
        hasEdge = this.hasUndirectedEdge(source, target);

      // If no such edge exist, we'll stop right there.
      if (!hasEdge)
        return [];

      return createEdgeArrayForPath(this, type, source, target);
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
  });
}
