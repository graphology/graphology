/**
 * Graphology Canvas Renderer
 * ===========================
 *
 * Function taking a canvas context and rendering the given graph.
 */
var helpers = require('./helpers.js');
var defaults = require('./defaults.js');
var fillBackground = require('./components/background.js');

var components = {
  nodes: {
    circle: require('./components/nodes/circle.js')
  },
  edges: {
    line: require('./components/edges/line.js')
  }
};

exports.renderSync = function renderSync(graph, context, settings) {

  // Reducing nodes
  var nodeData = helpers.reduceNodes(graph, settings);

  // Filling background
  fillBackground(context, 'white', settings.width, settings.height);

  // Drawing edges
  var sourceData, targetData;
  graph.forEachEdge(function(edge, attr, source, target) {

    // Reducing edge
    if (typeof settings.edges.reducer === 'function')
      attr = settings.edges.reducer(settings, edge, attr);

    attr = defaults.DEFAULT_EDGE_REDUCER(settings, edge, attr);

    sourceData = nodeData[source];
    targetData = nodeData[target];

    components.edges[attr.type](settings, context, attr, sourceData, targetData);
  });

  // Drawing nodes
  var k, d;

  for (k in nodeData) {
    d = nodeData[k];
    components.nodes[d.type](settings, context, d);
  }
};

var raf = function(fn) {
  return setTimeout(fn, 16);
};

if (typeof requestAnimationFrame !== 'undefined')
  raf = requestAnimationFrame;

function asyncWhile(condition, task, callback) {
  if (condition()) {
    task();

    // Early termination to avoid delay
    if (!condition())
      return callback();

    return raf(function() {
      asyncWhile(condition, task, callback);
    });
  }

  return callback();
}

exports.renderAsync = function renderAsync(graph, context, settings, callback) {

  // Reducing nodes
  var nodeData = helpers.reduceNodes(graph, settings);

  // Filling background
  fillBackground(context, 'white', settings.width, settings.height);

  // Drawing edges asynchronously
  var edges = graph.edges();

  var edgesDone = 0;

  function renderEdgeBatch() {
    var l;
    var edge, attr, extremities, source, target, sourceData, targetData;

    for (l = Math.min(edgesDone + settings.batchSize, edges.length); edgesDone < l; edgesDone++) {
      edge = edges[edgesDone];
      attr = graph.getEdgeAttributes(edge);
      extremities = graph.extremities(edge);
      source = extremities[0];
      target = extremities[1];

      // Reducing edge
      if (typeof settings.edges.reducer === 'function')
        attr = settings.edges.reducer(settings, edge, attr);

      attr = defaults.DEFAULT_EDGE_REDUCER(settings, edge, attr);

      sourceData = nodeData[source];
      targetData = nodeData[target];

      components.edges[attr.type](settings, context, attr, sourceData, targetData);
    }
  }

  var nodes = new Array(graph.order);
  var step = 0;

  for (var k in nodeData)
    nodes[step++] = nodeData[k];

  var nodesDone = 0;

  function renderNodeBatch() {
    var l;
    var node;

    for (l = Math.min(nodesDone + settings.batchSize, nodes.length); nodesDone < l; nodesDone++) {
      node = nodes[nodesDone];
      components.nodes[node.type](settings, context, node);
    }
  }

  // Async logic
  function edgesCondition() {
    return edgesDone < edges.length;
  }

  function nodesCondition() {
    return nodesDone < nodes.length;
  }

  asyncWhile(edgesCondition, renderEdgeBatch, function() {
    asyncWhile(nodesCondition, renderNodeBatch, function() {
      return callback();
    });
  });
};
