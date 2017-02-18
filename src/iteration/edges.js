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
  consumeIterator,
  isBunch,
  overBunch
} from '../utils';

/**
 * Definitions.
 */
const EDGES_ITERATION = [
  {
    name: 'edges',
    counter: 'countEdges',
    type: 'mixed'
  },
  {
    name: 'inEdges',
    counter: 'countInEdges',
    type: 'directed',
    direction: 'in'
  },
  {
    name: 'outEdges',
    counter: 'countOutEdges',
    type: 'directed',
    direction: 'out'
  },
  {
    name: 'inboundEdges',
    counter: 'countInboundEdges',
    type: 'mixed',
    direction: 'in'
  },
  {
    name: 'outboundEdges',
    counter: 'countOutboundEdges',
    type: 'mixed',
    direction: 'out'
  },
  {
    name: 'directedEdges',
    counter: 'countDirectedEdges',
    type: 'directed'
  },
  {
    name: 'undirectedEdges',
    counter: 'countUndirectedEdges',
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
 * Function counting edges from the given object.
 *
 * @param  {object|undefined} object - Target object.
 * @param  {mixed}            [key]  - Optional key.
 * @return {number}                  - The number of found edges.
 */
function count(object, key) {
  let nb = 0;

  const hasKey = arguments.length > 1;

  if (!object || (hasKey && !(key in object)))
    return nb;

  if (hasKey)
    return object[key] instanceof Set ? object[key].size : +!!object[key];

  for (const k in object)
    nb += (object[k] instanceof Set ? object[k].size : +!!object[k]);

  return nb;
}

/**
 * Function merging edges found in an object into the given set.
 *
 * @param {Set}              edges - Current set of edges.
 * @param {object|undefined} map   - Target object.
 * @param {string}           key   - Sub key.
 */
function merge(edges, object, key) {
  if (!object)
    return;

  if (key) {
    const target = object[key];

    if (target) {
      if (target instanceof Set)
        target.forEach(value => (edges.add(value)));
      else
        edges.add(target);
    }
  }
  else {
    for (const k in object) {
      if (object[k] instanceof Set)
        object[k].forEach(value => (edges.add(value)));
      else
        edges.add(object[k]);
    }
  }
}

/**
 * Function used to count the edges of the given type.
 *
 * @param  {Graph}  graph - Target Graph instance.
 * @param  {string} type  - Type of edges to retrieve.
 * @return {number}
 */
function countEdges(graph, type) {
  if (type === 'mixed')
    return graph.size;

  let nb = 0;

  graph._edges.forEach(data => {
    if (!!data.undirected === (type === 'undirected'))
      nb++;
  });

  return nb;
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
 * Function counting the number of edges for the given type & the given node.
 *
 * @param  {Graph}   graph     - Target Graph instance.
 * @param  {string}  type      - Type of edges to retrieve.
 * @param  {string}  direction - In or out?
 * @param  {any}     node      - Target node.
 * @return {number}
 */
function countEdgesForNode(graph, type, direction, node) {

  // For this, we need to compute the "structure" index
  graph.computeIndex('structure');

  let nb = 0;

  const nodeData = graph._nodes.get(node);

  if (type !== 'undirected') {

    if (direction !== 'out')
      nb += count(nodeData.in);
    if (direction !== 'in')
      nb += count(nodeData.out);
  }

  if (type !== 'directed') {

    if (direction !== 'out')
      nb += count(nodeData.undirectedIn);
    if (direction !== 'in')
      nb += count(nodeData.undirectedOut);
  }

  return nb;
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
  graph.computeIndex('structure');

  const edges = [];

  const nodeData = graph._nodes.get(node);

  if (type !== 'undirected') {

    if (direction !== 'out')
      collect(edges, nodeData.in);
    if (direction !== 'in')
      collect(edges, nodeData.out);
  }

  if (type !== 'directed') {

    if (direction !== 'out')
      collect(edges, nodeData.undirectedIn);
    if (direction !== 'in')
      collect(edges, nodeData.undirectedOut);
  }

  return edges;
}

/**
 * Function creating an array of edge for the given bunch of nodes.
 *
 * @param  {Graph}   graph     - Target Graph instance.
 * @param  {string}  type      - Type of edges to retrieve.
 * @param  {string}  direction - In or out?
 * @param  {bunch}   bunch     - Target bunch.
 * @return {array}             - Array of edges.
 */
function createEdgeArrayForBunch(name, graph, type, direction, bunch) {

  // For this, we need to compute the "structure" index
  graph.computeIndex('structure');

  const edges = new Set();

  // Iterating over the bunch
  overBunch(bunch, node => {
    if (!graph.hasNode(node))
      throw new NotFoundGraphError(`Graph.${name}: could not find the "${node}" node in the graph in the given bunch.`);

    const nodeData = graph._nodes.get(node);

    if (type !== 'undirected') {

      if (direction !== 'out')
        merge(edges, nodeData.in);
      if (direction !== 'in')
        merge(edges, nodeData.out);
    }

    if (type !== 'directed') {

      if (direction !== 'out')
        merge(edges, nodeData.undirectedIn);
      if (direction !== 'in')
        merge(edges, nodeData.undirectedOut);
    }
  });

  return consumeIterator(edges.size, edges.values());
}

/**
 * Function counting the number of edges for the given path.
 *
 * @param  {Graph}   graph  - Target Graph instance.
 * @param  {string}  type   - Type of edges to retrieve.
 * @param  {any}     source - Source node.
 * @param  {any}     target - Target node.
 * @return {array}          - Array of edges.
 */
function countEdgesForPath(graph, type, source, target) {

  // For this, we need to compute the "structure" index
  graph.computeIndex('structure');

  let nb = 0;

  const sourceData = graph._nodes.get(source);

  if (type !== 'undirected') {
    nb += count(sourceData.in, target);
    nb += count(sourceData.out, target);
  }

  if (type !== 'directed') {
    nb += count(sourceData.undirectedIn, target);
    nb += count(sourceData.undirectedOut, target);
  }

  return nb;
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
  graph.computeIndex('structure');

  const edges = [];

  const sourceData = graph._nodes.get(source);

  if (type !== 'undirected') {
    collect(edges, sourceData.in, target);
    collect(edges, sourceData.out, target);
  }

  if (type !== 'directed') {
    collect(edges, sourceData.undirectedIn, target);
    collect(edges, sourceData.undirectedOut, target);
  }

  return edges;
}

/**
 * Function attaching an edge array creator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {boolean}  counter     - Should we count or collect?
 * @param {object}   description - Method description.
 */
function attachEdgeArrayCreator(Class, counter, description) {
  const {
    type,
    direction
  } = description;

  const name = counter ? description.counter : description.name;

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
  Class.prototype[name] = function(...args) {
    if (!args.length)
      return counter ?
        countEdges(this, type) :
        createEdgeArray(this, type);

    if (args.length === 1) {
      const nodeOrBunch = args[0];

      if (this.hasNode(nodeOrBunch)) {

        // Iterating over a node's edges
        return counter ?
          countEdgesForNode(this, type, direction, nodeOrBunch) :
          createEdgeArrayForNode(this, type, direction, nodeOrBunch);
      }
      else if (isBunch(nodeOrBunch)) {

        // Iterating over the union of a node's edges

        // Note: since we need to keep track of the traversed values
        // to perform union, we can't optimize further and we have to
        // create this intermediary array and return its length when counting.
        const edges = createEdgeArrayForBunch(
          name,
          this,
          type,
          direction,
          nodeOrBunch
        );

        return counter ? edges.length : edges;
      }
      else {
        throw new NotFoundGraphError(`Graph.${name}: could not find the "${nodeOrBunch}" node in the graph.`);
      }
    }

    if (args.length === 2) {
      const [source, target] = args;

      if (!this.hasNode(source))
        throw new NotFoundGraphError(`Graph.${name}:  could not find the "${source}" source node in the graph.`);

      if (!this.hasNode(target))
        throw new NotFoundGraphError(`Graph.${name}:  could not find the "${target}" target node in the graph.`);

      // Iterating over the edges between source & target
      let hasEdge;

      if (type !== 'undirected')
        hasEdge = this.hasDirectedEdge(source, target);
      else
        hasEdge = this.hasUndirectedEdge(source, target);

      // If no such edge exist, we'll stop right there.
      if (!hasEdge)
        return counter ? 0 : [];

      return counter ?
        countEdgesForPath(this, type, source, target) :
        createEdgeArrayForPath(this, type, source, target);
    }

    throw new InvalidArgumentsGraphError(`Graph.${name}: too many arguments (expecting 0, 1 or 2 and got ${args.length}).`);
  };
}

/**
 * Function attaching every edge iteration method to the Graph class.
 *
 * @param {function} Graph - Graph class.
 */
export function attachEdgeIterationMethods(Graph) {
  EDGES_ITERATION.forEach(description => {
    attachEdgeArrayCreator(Graph, false, description);
    attachEdgeArrayCreator(Graph, true, description);
  });
}
