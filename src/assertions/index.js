/**
 * Graphology Assertions
 * ======================
 *
 * Various assertions concerning graphs.
 */
var deepEqual = require('fast-deep-equal/es6');

/**
 * Constants.
 */
var SIZE = Symbol('size');

/**
 * Helpers.
 */
function areUnorderedCollectionsOfAttributesIdentical(a1, a2) {
  var l1 = a1.length;
  var l2 = a2.length;

  if (l1 !== l2) return false;

  var o1, o2;
  var i, j;
  var matches = new Set();

  outside: for (i = 0; i < l1; i++) {
    o1 = a1[i];

    for (j = 0; j < l2; j++) {
      if (matches.has(j)) continue;

      o2 = a2[j];

      if (deepEqual(o1, o2)) {
        matches.add(j);
        continue outside;
      }
    }

    return false;
  }

  return true;
}

function compareNeighborEntries(entries1, entries2) {
  if (entries1[SIZE] !== entries2[SIZE]) return false;

  for (var k in entries1) {
    if (!areUnorderedCollectionsOfAttributesIdentical(entries1[k], entries2[k]))
      return false;
  }

  return true;
}

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
  entries[SIZE] = 0;
  var c;

  graph.forEachOutEdge(node, function (_e, attr, _s, target) {
    c = entries[target];

    if (!c) {
      c = [];
      entries[SIZE] += 1;
      entries[target] = c;
    }

    c.push(attr);
  });

  return entries;
}

function collectAssymetricUndirectedEdges(graph, node) {
  var entries = {};
  entries[SIZE] = 0;
  var c;

  graph.forEachUndirectedEdge(node, function (_e, attr, source, target) {
    target = node === source ? target : source;

    if (node > target) return;

    c = entries[target];

    if (!c) {
      c = [];
      entries[SIZE] += 1;
      entries[target] = c;
    }

    c.push(attr);
  });

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
  if (G === H) return true;

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
 * @param  {boolean} deep    - Whether to perform deep comparison.
 * @param  {boolean} relaxed - Whether to allow graph options to differ.
 * @param  {Graph}   G       - First graph.
 * @param  {Graph}   H       - Second graph.
 * @return {boolean}
 */
function abstractAreSameGraphs(deep, relaxed, G, H) {
  if (G === H) return true;

  // If two graphs have incompatible settings they cannot be identical
  if (relaxed) {
    if (
      (G.type === 'directed' && H.type === 'undirected') ||
      (G.type === 'undirected' && H.type === 'directed')
    )
      return false;
  }

  // If two graphs don't have the same settings they cannot be identical
  else {
    if (
      G.type !== H.type ||
      G.allowSelfLoops !== H.allowSelfLoops ||
      G.multi !== H.multi
    )
      return false;
  }

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
  if (!G.multi && !H.multi) {
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
    var comparisonFunction = deep ? compareNeighborEntries : deepEqual;

    sameDirectedEdges = G.everyNode(function (node) {
      var gCounts = aggregationFunction(G, node);
      var hCounts = aggregationFunction(H, node);

      return comparisonFunction(gCounts, hCounts);
    });

    if (!sameDirectedEdges) return false;

    aggregationFunction = deep
      ? collectAssymetricUndirectedEdges
      : countAssymetricUndirectedEdges;

    sameUndirectedEdges = G.everyNode(function (node) {
      var gCounts = aggregationFunction(G, node);
      var hCounts = aggregationFunction(H, node);

      return comparisonFunction(gCounts, hCounts);
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
exports.areSameGraphs = abstractAreSameGraphs.bind(null, false, false);
exports.areSameGraphsDeep = abstractAreSameGraphs.bind(null, true, false);
exports.haveSameEdges = abstractAreSameGraphs.bind(null, false, true);
exports.haveSameEdgesDeep = abstractAreSameGraphs.bind(null, true, true);
