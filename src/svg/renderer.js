/**
 * Graphology SVG Renderer
 * =======================
 *
 * Function rendering the given graph.
 */
var isGraph = require('graphology-utils/is-graph');
var helpers = require('./helpers.js');
var defaults = require('./defaults.js');

var components = {
  nodes: {
    circle: require('./components/nodes/circle.js')
  },
  edges: {
    line: require('./components/edges/line.js')
  },
  nodeLabels: {
    default: require('./components/nodeLabels/default.js')
  }
};

function renderer(graph, settings) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-svg/renderer: expecting a valid graphology instance.'
    );

  // Reducing nodes
  var nodeData = helpers.reduceNodes(graph, settings);

  // Drawing edges
  var edgesStrings = [];
  graph.forEachEdge(function (edge, attr, source, target) {
    // Reducing edge
    if (typeof settings.edges.reducer === 'function')
      attr = settings.edges.reducer(settings, edge, attr);

    attr = defaults.DEFAULT_EDGE_REDUCER(settings, edge, attr);

    edgesStrings.push(
      components.edges[attr.type](
        settings,
        attr,
        nodeData[source],
        nodeData[target]
      )
    );
  });

  // Drawing nodes and labels
  // TODO: should we draw in size order to avoid weird overlaps? Should we run noverlap?
  var nodesStrings = [];
  var nodeLabelsStrings = [];
  var k;
  for (k in nodeData) {
    nodesStrings.push(
      components.nodes[nodeData[k].type](settings, nodeData[k])
    );
    nodeLabelsStrings.push(
      components.nodeLabels[nodeData[k].labelType](settings, nodeData[k])
    );
  }

  return (
    '<?xml version="1.0" encoding="utf-8"?>' +
    '<svg width="' +
    settings.width +
    '" height=" ' +
    settings.height +
    '" ' +
    'viewBox="0 0 ' +
    settings.width +
    ' ' +
    settings.height +
    '" ' +
    'version="1.1" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<g>' +
    edgesStrings.join('') +
    '</g>' +
    '<g>' +
    nodesStrings.join('') +
    '</g>' +
    '<g>' +
    nodeLabelsStrings.join('') +
    '</g>' +
    '</svg>'
  );
}

module.exports = renderer;
