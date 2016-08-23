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
  BasicSet,
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
    element: 'Edge',
    type: 'mixed'
  },
  {
    name: 'inEdges',
    counter: 'countInEdges',
    element: 'InEdge',
    type: 'directed',
    direction: 'in'
  },
  {
    name: 'outEdges',
    counter: 'countOutEdges',
    element: 'OutEdge',
    type: 'directed',
    direction: 'out'
  },
  {
    name: 'inboundEdges',
    counter: 'countInboundEdges',
    element: 'InboundEdge',
    type: 'mixed',
    direction: 'in'
  },
  {
    name: 'outboundEdges',
    counter: 'countOutboundEdges',
    element: 'OutbounEdge',
    type: 'mixed',
    direction: 'out'
  },
  {
    name: 'directedEdges',
    counter: 'countDirectedEdges',
    element: 'DirectedEdge',
    type: 'directed'
  },
  {
    name: 'undirectedEdges',
    counter: 'countUndirectedEdges',
    element: 'UndirectedEdge',
    type: 'undirected'
  }
];

function collectEdges(object, key) {
  const edges = [];

  const hasKey = arguments.length > 1;

  if (typeof Map === 'function' && object instanceof Map) {
    if (hasKey)
      return (object.get(key) || []);

    object.forEach(function(value) {
      edges.push.apply(edges, value);
    });
  }
  else {
    if (hasKey)
      return (object[key] || []);

    for (const node in object) {
      edges.push.apply(edges, object[node]);
    }
  }

  return edges;
}

function mergeEdges(set, object) {
  if (typeof Map === 'function' && object instanceof Map) {
    object.forEach(function(key, value) {
      for (let i = 0, l = value.length; i < l; i++)
        set.add(value[i]);
    });
  }
  else {
    for (const k in object) {
      for (let i = 0, l = object[k].length; i < l; i++)
        set.add(object[k][i]);
    }
  }
}

function countEdges(object, key) {
  let nb = 0;

  const hasKey = arguments.length > 1;

  if (typeof Map === 'function' && object instanceof Map) {
    if (hasKey)
      return (object.get(key) || []).length;
    nb += object.size;
  }
  else {
    if (hasKey)
      return (object[key] || []).length;
    nb += Object.keys(object).length;
  }

  return nb;
}

function createEdgeArray(count, graph, type) {
  if (count && type === 'mixed')
    return graph.size;

  const list = [];
  let nb = 0;

  if (graph.map) {
    if (type === 'mixed')
      return [...graph._edges.keys()];

    graph._edges.forEach((data, edge) => {

      if (data.undirected === (type === 'undirected')) {

        if (!count)
          list.push(edge);

        nb++;
      }
    });
  }
  else {
    if (type === 'mixed')
      return Object.keys(graph._edges);

    for (const edge in graph._edges) {
      const data = graph._edges[edge];

      if (data.undirected === (type === 'undirected')) {

        if (!count)
          list.push(edge);

        nb++;
      }
    }
  }

  return count ? nb : list;
}

function createEdgeArrayForNode(count, graph, type, direction, node) {

  // For this, we need to compute the "relations" index
  graph.computeIndex('structure');
  const indexData = graph._indexes.relations.data;

  let edges = [],
      nb = 0;

  let nodeData;

  if (graph.map) {
    if (!indexData.has(node))
      return count ? nb : edges;
    nodeData = indexData.get(node);
  }
  else {
    if (!(node in indexData))
      return count ? nb : edges;
    nodeData = indexData[node];
  }

  if (type === 'mixed' || type === 'directed') {

    if (!direction || direction === 'in') {
      if (count)
        nb += countEdges(nodeData.in);
      else
        edges = edges.concat(collectEdges(nodeData.in));
    }
    if (!direction || direction === 'out') {
      if (count)
        nb += countEdges(nodeData.out);
      else
        edges = edges.concat(collectEdges(nodeData.out));
    }
  }

  if (type === 'mixed' || type === 'undirected') {

    if (!direction || direction === 'in') {
      if (count)
        nb += countEdges(nodeData.undirectedIn);
      else
        edges = edges.concat(collectEdges(nodeData.undirectedIn));
    }
    if (!direction || direction === 'out') {
      if (count)
        nb += countEdges(nodeData.undirectedOut);
      else
        edges = edges.concat(collectEdges(nodeData.undirectedOut));
    }
  }

  return count ? nb : edges;
}

function createEdgeArrayForBunch(name, graph, type, direction, bunch) {

  // For this, we need to compute the "relations" index
  graph.computeIndex('structure');
  const indexData = graph._indexes.relations.data;

  const edges = graph.map ? new Set() : new BasicSet;

  // Iterating over the bunch
  overBunch(bunch, (error, node) => {
    if (!graph.hasNode(node))
      throw new NotFoundGraphError(`Graph.${name}: could not find the "${node}" node in the graph in the given bunch.`);

    let nodeData;

    if (graph.map) {
      if (!indexData.has(node))
        return false;
      nodeData = indexData.get(node);
    }
    else {
      if (!(node in indexData))
        return false;
      nodeData = indexData[node];
    }

    if (type === 'mixed' || type === 'directed') {

      if (!direction || direction === 'in')
        mergeEdges(edges, nodeData.in);
      if (!direction || direction === 'out')
        mergeEdges(edges, nodeData.out);
    }

    if (type === 'mixed' || type === 'undirected') {

      if (!direction || direction === 'in')
        mergeEdges(edges, nodeData.undirectedIn);
      if (!direction || direction === 'out')
        mergeEdges(edges, nodeData.undirectedOut);
    }
  });

  return edges.values();
}

function createEdgeArrayForPath(count, graph, type, source, target) {

  // For this, we need to compute the "relations" index
  graph.computeIndex('structure');
  const indexData = graph._indexes.relations.data;

  let edges = [],
      nb = 0;

  let sourceData;

  if (graph.map) {
    if (!indexData.has(source))
      return count ? nb : edges;
    sourceData = indexData.get(source);
  }
  else {
    if (!(source in indexData))
      return count ? nb : edges;
    sourceData = indexData[source];
  }

  if (type === 'mixed' || type === 'directed') {

    if (count) {
      nb += countEdges(sourceData.in, target);
      nb += countEdges(sourceData.out, target);
    }
    else {
      edges = edges
        .concat(collectEdges(sourceData.in, target))
        .concat(collectEdges(sourceData.out, target));
    }
  }

  if (type === 'mixed' || type === 'undirected') {
    if (count) {
      nb += countEdges(sourceData.undirectedIn, target);
      nb += countEdges(sourceData.undirectedOut, target);
    }
    else {
      edges = edges
        .concat(collectEdges(sourceData.undirectedIn, target))
        .concat(collectEdges(sourceData.undirectedOut, target));
    }
  }

  return count ? nb : edges;
}

function attachEdgeArrayCreator(Class, counter, description) {
  const {
    type,
    direction
  } = description;

  const name = counter ? description.counter : description.name;

  Class.prototype[name] = function(...args) {
    if (!args.length)
      return createEdgeArray(counter, this, type);

    if (args.length === 1) {
      const nodeOrBunch = args[0];

      if (this.hasNode(nodeOrBunch)) {

        // Iterating over a node's edges
        return createEdgeArrayForNode(
          counter,
          this,
          type,
          direction,
          nodeOrBunch
        );
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

      if (type === 'mixed' || type === 'directed')
        hasEdge = this.hasDirectedEdge(source, target);
      else
        hasEdge = this.hasUndirectedEdge(source, target);

      // If no such edge exist, we'll stop right there.
      if (!hasEdge)
        return counter ? 0 : [];

      return createEdgeArrayForPath(
        counter,
        this,
        type,
        source,
        target
      );
    }

    throw new InvalidArgumentsGraphError(`Graph.${name}: too many arguments (expecting 0, 1 or 2 and got ${args.length}).`);
  };
}

export function attachEdgeIterationMethods(Graph) {
  EDGES_ITERATION.forEach(description => {
    attachEdgeArrayCreator(Graph, false, description);
    attachEdgeArrayCreator(Graph, true, description);
  });
}
