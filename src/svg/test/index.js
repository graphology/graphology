/**
 * Graphology SVG Unit Tests
 * =========================
 */
var assert = require('chai').assert,
  renderSVG = require('../renderer'),
  helpers = require('../helpers'),
  DEFAULTS = require('../defaults').DEFAULTS,
  Graph = require('graphology');

function getBasicGraph() {
  var graph = new Graph();
  graph.addNode('John', {x: 1, y: 1, size: 1, color: 'red'});
  graph.addNode('Martha', {x: 2, y: 2, size: 1, color: 'blue'});
  graph.addEdge('John', 'Martha');

  return graph;
}

describe('renderer.js', function () {
  it('should generate a SVG string', function () {
    var graph = getBasicGraph();
    var svg = renderSVG(graph, DEFAULTS);

    assert.ok(svg);
  });
});

describe('helpers.js#reduceNodes', function () {
  it('should produce different output data when the graph is flipped (regression #3)', function () {
    var graph = getBasicGraph();
    var data = helpers.reduceNodes(graph, DEFAULTS);

    // Flip graph:
    graph.forEachNode(function (node) {
      graph.setNodeAttribute(node, 'x', -graph.getNodeAttribute(node, 'x'));
    });
    var dataFlipped1 = helpers.reduceNodes(graph, DEFAULTS);

    // Flip graph again:
    graph.forEachNode(function (node) {
      graph.setNodeAttribute(node, 'y', -graph.getNodeAttribute(node, 'y'));
    });
    var dataFlipped2 = helpers.reduceNodes(graph, DEFAULTS);

    [
      [data, dataFlipped1],
      [data, dataFlipped2],
      [dataFlipped1, dataFlipped2]
    ].forEach(function (arr) {
      var data0 = arr[0],
        data1 = arr[1];

      for (var k in data0) {
        var isXTooClose =
          Math.abs(data0[k].x - data1[k].x) < Math.abs(data0[k].x / 1000);
        var isYTooClose =
          Math.abs(data0[k].y - data1[k].y) < Math.abs(data0[k].y / 1000);

        // At least one coordinate should be different
        assert.ok(!isXTooClose || !isYTooClose);
      }
    });
  });
});
