/**
 * Graphology Layout Quality - Connected-closeness
 * ================================================
 *
 * Function computing the layout quality metric named "connected-closeness",
 * designed to provide a quantified statement about the mediation of the topology
 * by the node placement.
 *
 * [Article]:
 * Jacomy, M. (2023). Connected-closeness: A Visual Quantification of Distances in
 * Network Layouts. Journal of Graph Algorithms and Applications, 27(5), 341-404.
 * https://www.jgaa.info/index.php/jgaa/article/view/paper626
 */
var isGraph = require('graphology-utils/is-graph');

function max(values, getter) {
  if (values.length < 1)
    throw new Error(
      'graphology-metrics/layout-quality/connected-closeness.max: not enough values!'
    );

  var m = undefined;
  var v;

  for (var i = 1, l = values.length; i < l; i++) {
    v = values[i];

    if (getter !== undefined) v = getter(v);

    if (m === undefined || v > m) m = v;
  }

  return m;
}

function min(values, getter) {
  if (values.length < 1)
    throw new Error(
      'graphology-metrics/layout-quality/connected-closeness.min: not enough values!'
    );

  var m = undefined;
  var v;

  for (var i = 1, l = values.length; i < l; i++) {
    v = values[i];

    if (getter !== undefined) v = getter(v);

    if (m === undefined || v < m) m = v;
  }

  return m;
}

module.exports = function connectedCloseness(g, settings) {
  if (!isGraph(g))
    throw new Error(
      'graphology-metrics/layout-quality/connected-closeness: given graph is not a valid graphology instance.'
    );

  if (g.size < 2)
    return {
      deltaMax: undefined,
      ePercentOfDeltaMax: undefined,
      pPercentOfDeltaMax: undefined,
      pEdgeOfDeltaMax: undefined,
      cMax: indicatorsOfDeltaMax.C
    };

  // Default settings
  // TODO: don't mutate the user's object
  // TODO: lint
  // TODO: fix directedness, infer types etc.
  // TODO: add non sampling option
  settings = settings || {};
  settings.epsilon = settings.epsilon || 0.03; // 3%
  settings.gridSize = settings.gridSize || 10; // This is an optimization thing, it's not the graphical grid

  var rng = settings.rng || Math.random;

  var pairsOfNodesSampled = samplePairsOfNodes();
  var connectedPairs = g.edges().map(function (eid) {
    var n1 = g.getNodeAttributes(g.source(eid));
    var n2 = g.getNodeAttributes(g.target(eid));
    var d = Math.sqrt(Math.pow(n1.x - n2.x, 2) + Math.pow(n1.y - n2.y, 2));
    return d;
  });

  // Grid search for CMax

  var range = [0, Math.max(max(pairsOfNodesSampled), max(connectedPairs) || 0)];

  var CMax = 0;
  var distancesIndex = {};
  var Delta, oldCMax, C, i, indicatorsOverDelta;
  var targetIndex = -1;
  do {
    for (i = 0; i <= settings.gridSize; i++) {
      Delta = range[0] + ((range[1] - range[0]) * i) / settings.gridSize;
      if (distancesIndex[Delta] === undefined) {
        distancesIndex[Delta] = computeIndicators(
          Delta,
          g,
          pairsOfNodesSampled,
          connectedPairs
        );
      }
    }
    oldCMax = CMax;
    CMax = 0;
    indicatorsOverDelta = Object.values(distancesIndex);
    indicatorsOverDelta.forEach(function (indicators, i) {
      C = indicators.C;
      if (C > CMax) {
        CMax = C;
        targetIndex = i;
      }
    });

    range = [
      indicatorsOverDelta[Math.max(0, targetIndex - 1)].Delta,
      indicatorsOverDelta[
        Math.min(indicatorsOverDelta.length - 1, targetIndex + 1)
      ].Delta
    ];
  } while ((CMax - oldCMax) / CMax >= settings.epsilon / 10);

  var deltaMax = findDeltaMax(indicatorsOverDelta, settings.epsilon);

  var indicatorsOfDeltaMax = computeIndicators(
    deltaMax,
    g,
    pairsOfNodesSampled,
    connectedPairs
  );

  // Resistance to misinterpretation
  if (indicatorsOfDeltaMax.C < 0.1) {
    return {
      deltaMax: undefined,
      ePercentOfDeltaMax: undefined,
      pPercentOfDeltaMax: undefined,
      pEdgeOfDeltaMax: undefined,
      cMax: indicatorsOfDeltaMax.C
    };
  } else {
    return {
      deltaMax: deltaMax,
      ePercentOfDeltaMax: indicatorsOfDeltaMax.ePercent,
      pPercentOfDeltaMax: indicatorsOfDeltaMax.pPercent,
      pEdgeOfDeltaMax: indicatorsOfDeltaMax.pEdge,
      cMax: indicatorsOfDeltaMax.C
    };
  }

  // Internal methods

  // Compute indicators given a distance Delta
  function computeIndicators(Delta, g, pairsOfNodesSampled, connectedPairs) {
    var connectedPairsBelowDelta = connectedPairs.filter(function (d) {
      return d <= Delta;
    });
    var pairsBelowDelta = pairsOfNodesSampled.filter(function (d) {
      return d <= Delta;
    });

    // Count of edges shorter than Delta
    // note: actual count
    var E = connectedPairsBelowDelta.length;

    // Proportion of edges shorter than Delta
    // note: actual count
    var ePercent = E / connectedPairs.length;

    // Count of node pairs closer than Delta
    // note: sampling-dependent
    var p = pairsBelowDelta.length;

    // Proportion of node pairs closer than Delta
    // note: sampling-dependent, but it cancels out
    var pPercent = p / pairsOfNodesSampled.length;

    // Connected closeness
    var C = ePercent - pPercent;

    // Probability that, considering two nodes closer than Delta, they are connected
    // note: p is sampling-dependent, so we have to normalize it here.
    var possibleEdgesPerPair = g.undirected ? 1 : 2;
    var pEdge =
      E /
      ((possibleEdgesPerPair * p * (g.order * (g.order - 1))) /
        pairsOfNodesSampled.length);

    return {
      Delta: Delta,
      ePercent: ePercent,
      pPercent: pPercent,
      pEdge: pEdge, // Note: pEdge is complentary information, not strictly necessary
      C: C
    };
  }

  function samplePairsOfNodes() {
    if (g.order < 2) return [];
    var samples = [];
    var node1, node2, n1, n2, d, c;
    var samplesCount = g.size; // We want as many samples as edges
    if (samplesCount < 1) return [];
    for (var i = 0; i < samplesCount; i++) {
      node1 = g.nodes()[Math.floor(rng() * g.order)];
      do {
        node2 = g.nodes()[Math.floor(rng() * g.order)];
      } while (node1 === node2);
      n1 = g.getNodeAttributes(node1);
      n2 = g.getNodeAttributes(node2);
      d = Math.sqrt(Math.pow(n1.x - n2.x, 2) + Math.pow(n1.y - n2.y, 2));
      samples.push(d);
    }
    return samples;
  }

  function findDeltaMax(indicatorsOverDelta, epsilon) {
    var CMax = max(indicatorsOverDelta, function (d) {
      return d.C;
    });

    var deltaMax = min(
      indicatorsOverDelta.filter(function (d) {
        return d.C >= (1 - epsilon) * CMax;
      }),
      function (d) {
        return d.Delta;
      }
    );
    return deltaMax;
  }
};
