/**
 * Graphology Assertions
 * ======================
 *
 * Various assertions concerning graphs.
 */
var deepEqual = require('fast-deep-equal/es6');
var objectHash = require('object-hash');

/**
 * Helpers.
 */
function countOutEdges(graph, node) {
  var counts = {};
  var c;

  graph.forEachOutEdge(node, function (_e, _ea, _s, target) {
    c = counts[target] || 0;
    c++;

    counts[target] = c;
  });

  return counts;
}

function countAssymetricUndirectedEdges(graph, node) {
  var counts = {};
  var c;

  graph.forEachUndirectedEdge(node, function (_e, _ea, source, target) {
    target = node === source ? target : source;

    if (node > target) return;

    c = counts[target] || 0;
    c++;

    counts[target] = c;
  });

  return counts;
}

function collectOutEdges(graph, node) {
  var entries = {};
  var c;

  graph.forEachOutEdge(node, function (_e, attr, _s, target) {
    c = entries[target];

    if (!c) {
      c = [];
      entries[target] = c;
    }

    c.push(objectHash(attr));
  });

  for (var k in entries) {
    entries[k].sort();
  }

  return entries;
}

function collectAssymetricUndirectedEdges(graph, node) {
  var entries = {};
  var c;

  graph.forEachUndirectedEdge(node, function (_e, attr, source, target) {
    target = node === source ? target : source;

    if (node > target) return;

    c = entries[target];

    if (!c) {
      c = [];
      entries[target] = c;
    }

    c.push(objectHash(attr));
  });

  for (var k in entries) {
    entries[k].sort();
  }

  return entries;
}

/**
 * Function returning whether the given graphs have the same nodes.
 *
 * @param  {boolean} deep - Whether to perform deep comparisons.
 * @param  {Graph}   G    - First graph.
 * @param  {Graph}   H    - Second graph.
 * @return {boolean}
 */
function abstractHaveSameNodes(deep, G, H) {
  if (G.order !== H.order) return false;

  return G.everyNode(function (node, attr) {
    if (!H.hasNode(node)) return false;

    if (!deep) return true;

    return deepEqual(attr, H.getNodeAttributes(node));
  });
}

/**
 * Function returning whether the given graphs are identical.
 *
 * @param  {boolean} deep - Whether to perform deep comparison.
 * @param  {Graph}   G    - First graph.
 * @param  {Graph}   H    - Second graph.
 * @return {boolean}
 */
function abstractAreSameGraphs(deep, G, H) {
  // If two graphs don't have the same settings they cannot be identical
  if (
    G.type !== H.type ||
    G.allowSelfLoops !== H.allowSelfLoops ||
    G.multi !== H.multi
  )
    return false;

  // If two graphs don't have the same number of typed edges, they cannot be identical
  if (
    G.directedSize !== H.directedSize ||
    G.undirectedSize !== H.undirectedSize
  )
    return false;

  // If two graphs don't have the same nodes they cannot be identical
  if (!abstractHaveSameNodes(deep, G, H)) return false;

  var sameDirectedEdges = false;
  var sameUndirectedEdges = false;

  // In the simple case we don't need refining
  if (!G.multi) {
    sameDirectedEdges = G.everyDirectedEdge(function (_e, _ea, source, target) {
      if (!H.hasDirectedEdge(source, target)) return false;

      if (!deep) return true;

      return deepEqual(
        G.getDirectedEdgeAttributes(source, target),
        H.getDirectedEdgeAttributes(source, target)
      );
    });

    if (!sameDirectedEdges) return false;

    sameUndirectedEdges = G.everyUndirectedEdge(function (
      _e,
      _ea,
      source,
      target
    ) {
      if (!H.hasUndirectedEdge(source, target)) return false;

      if (!deep) return true;

      return deepEqual(
        G.getUndirectedEdgeAttributes(source, target),
        H.getUndirectedEdgeAttributes(source, target)
      );
    });

    if (!sameUndirectedEdges) return false;
  }

  // In the multi case, things are a bit more complex
  else {
    var aggregationFunction = deep ? collectOutEdges : countOutEdges;

    sameDirectedEdges = G.everyNode(function (node) {
      var gCounts = aggregationFunction(G, node);
      var hCounts = aggregationFunction(H, node);

      return deepEqual(gCounts, hCounts);
    });

    if (!sameDirectedEdges) return false;

    aggregationFunction = deep
      ? collectAssymetricUndirectedEdges
      : countAssymetricUndirectedEdges;

    sameUndirectedEdges = G.everyNode(function (node) {
      var gCounts = aggregationFunction(G, node);
      var hCounts = aggregationFunction(H, node);

      return deepEqual(gCounts, hCounts);
    });

    if (!sameUndirectedEdges) return false;
  }

  return true;
}

/**
 * Exporting.
 */
exports.isGraph = require('graphology-utils/is-graph');
exports.isGraphConstructor = require('graphology-utils/is-graph-constructor');
exports.haveSameNodes = abstractHaveSameNodes.bind(null, false);
exports.haveSameNodesDeep = abstractHaveSameNodes.bind(null, true);
exports.areSameGraphs = abstractAreSameGraphs.bind(null, false);
exports.areSameGraphsDeep = abstractAreSameGraphs.bind(null, true);
