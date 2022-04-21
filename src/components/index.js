/**
 * Graphology Components
 * ======================
 *
 * Basic connected components-related functions.
 */
var isGraph = require('graphology-utils/is-graph');
var copyNode = require('graphology-utils/add-node').copyNode;
var copyEdge = require('graphology-utils/add-edge').copyEdge;
var DFSStack = require('graphology-indices/dfs-stack');

/**
 * Function iterating over a graph's connected component using a callback.
 *
 * @param {Graph}    graph    - Target graph.
 * @param {function} callback - Iteration callback.
 */
function forEachConnectedComponent(graph, callback) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-components: the given graph is not a valid graphology instance.'
    );

  // A null graph has no connected components by definition
  if (!graph.order) return;

  var stack = new DFSStack(graph);
  var push = stack.push.bind(stack);

  stack.forEachNodeYetUnseen(function (node) {
    var component = [];

    stack.push(node);

    var source;

    while (stack.size !== 0) {
      source = stack.pop();

      component.push(source);

      graph.forEachNeighbor(source, push);
    }

    callback(component);
  });
}

function forEachConnectedComponentOrder(graph, callback) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-components: the given graph is not a valid graphology instance.'
    );

  // A null graph has no connected components by definition
  if (!graph.order) return;

  var stack = new DFSStack(graph);
  var push = stack.push.bind(stack);

  stack.forEachNodeYetUnseen(function (node) {
    var order = 0;

    stack.push(node);

    var source;

    while (stack.size !== 0) {
      source = stack.pop();

      order++;

      graph.forEachNeighbor(source, push);
    }

    callback(order);
  });
}

function forEachConnectedComponentOrderWithEdgeFilter(
  graph,
  edgeFilter,
  callback
) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-components: the given graph is not a valid graphology instance.'
    );

  // A null graph has no connected components by definition
  if (!graph.order) return;

  var stack = new DFSStack(graph);

  var source;

  function push(e, a, s, t, sa, ta, u) {
    if (source === t) t = s;

    if (!edgeFilter(e, a, s, t, sa, ta, u)) return;

    stack.push(t);
  }

  stack.forEachNodeYetUnseen(function (node) {
    var order = 0;

    stack.push(node);

    while (stack.size !== 0) {
      source = stack.pop();

      order++;

      graph.forEachEdge(source, push);
    }

    callback(order);
  });
}

function countConnectedComponents(graph) {
  var n = 0;

  forEachConnectedComponentOrder(graph, function () {
    n++;
  });

  return n;
}

/**
 * Function returning a list of a graph's connected components as arrays
 * of node keys.
 *
 * @param  {Graph} graph - Target graph.
 * @return {array}
 */
function connectedComponents(graph) {
  var components = [];

  forEachConnectedComponent(graph, function (component) {
    components.push(component);
  });

  return components;
}

/**
 * Function returning the largest component of the given graph.
 *
 * @param  {Graph} graph - Target graph.
 * @return {array}
 */
function largestConnectedComponent(graph) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-components: the given graph is not a valid graphology instance.'
    );

  if (!graph.order) return [];

  var stack = new DFSStack(graph);
  var push = stack.push.bind(stack);

  var largestComponent = [];
  var component;

  stack.forEachNodeYetUnseen(function (node) {
    component = [];

    stack.push(node);

    var source;

    while (stack.size !== 0) {
      source = stack.pop();

      component.push(source);

      graph.forEachNeighbor(source, push);
    }

    if (component.length > largestComponent.length)
      largestComponent = component;

    // Early exit condition:
    // If current largest component's size is larger than the number of
    // remaining nodes to visit, we can safely assert we found the
    // overall largest component already.
    if (largestComponent.length > stack.countUnseenNodes()) return true;

    return false;
  });

  return largestComponent;
}

/**
 * Function returning a subgraph composed of the largest component of the given graph.
 *
 * @param  {Graph} graph - Target graph.
 * @return {Graph}
 */
function largestConnectedComponentSubgraph(graph) {
  var component = largestConnectedComponent(graph);

  var S = graph.nullCopy();

  component.forEach(function (key) {
    copyNode(S, key, graph.getNodeAttributes(key));
  });

  graph.forEachEdge(function (
    key,
    attr,
    source,
    target,
    sourceAttr,
    targetAttr,
    undirected
  ) {
    if (S.hasNode(source)) {
      copyEdge(S, undirected, key, source, target, attr);
    }
  });

  return S;
}

/**
 * Function mutating a graph in order to drop every node and edge that does
 * not belong to its largest connected component.
 *
 * @param  {Graph} graph - Target graph.
 */
function cropToLargestConnectedComponent(graph) {
  var component = new Set(largestConnectedComponent(graph));

  graph.forEachNode(function (key) {
    if (!component.has(key)) {
      graph.dropNode(key);
    }
  });
}

/**
 * Function returning a list of strongly connected components.
 *
 * @param  {Graph} graph - Target directed graph.
 * @return {array}
 */
function stronglyConnectedComponents(graph) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-components: the given graph is not a valid graphology instance.'
    );

  if (!graph.order) return [];

  if (graph.type === 'undirected')
    throw new Error('graphology-components: the given graph is undirected');

  var nodes = graph.nodes(),
    components = [],
    i,
    l;

  if (!graph.size) {
    for (i = 0, l = nodes.length; i < l; i++) components.push([nodes[i]]);
    return components;
  }

  var count = 1,
    P = [],
    S = [],
    preorder = new Map(),
    assigned = new Set(),
    component,
    pop,
    vertex;

  var DFS = function (node) {
    var neighbor;
    var neighbors = graph.outboundNeighbors(node);
    var neighborOrder;

    preorder.set(node, count++);
    P.push(node);
    S.push(node);

    for (var k = 0, n = neighbors.length; k < n; k++) {
      neighbor = neighbors[k];

      if (preorder.has(neighbor)) {
        neighborOrder = preorder.get(neighbor);
        if (!assigned.has(neighbor))
          while (preorder.get(P[P.length - 1]) > neighborOrder) P.pop();
      } else {
        DFS(neighbor);
      }
    }

    if (preorder.get(P[P.length - 1]) === preorder.get(node)) {
      component = [];
      do {
        pop = S.pop();
        component.push(pop);
        assigned.add(pop);
      } while (pop !== node);
      components.push(component);
      P.pop();
    }
  };

  for (i = 0, l = nodes.length; i < l; i++) {
    vertex = nodes[i];
    if (!assigned.has(vertex)) DFS(vertex);
  }

  return components;
}

/**
 * Exporting.
 */
exports.forEachConnectedComponent = forEachConnectedComponent;
exports.forEachConnectedComponentOrder = forEachConnectedComponentOrder;
exports.forEachConnectedComponentOrderWithEdgeFilter =
  forEachConnectedComponentOrderWithEdgeFilter;
exports.countConnectedComponents = countConnectedComponents;
exports.connectedComponents = connectedComponents;
exports.largestConnectedComponent = largestConnectedComponent;
exports.largestConnectedComponentSubgraph = largestConnectedComponentSubgraph;
exports.cropToLargestConnectedComponent = cropToLargestConnectedComponent;
exports.stronglyConnectedComponents = stronglyConnectedComponents;
