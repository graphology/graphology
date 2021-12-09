/**
 * Graphology HITS Unit Tests
 * ===========================
 */
var assert = require('chai').assert;
var Graph = require('graphology');
var hits = require('../../centrality/hits');

var EDGES = [
  [1, 3],
  [1, 5],
  [2, 1],
  [3, 5],
  [5, 4],
  [5, 3],
  [6, 5]
];

var HITS_GRAPH = new Graph();
[1, 2, 3, 4, 5, 6].forEach(function (node) {
  HITS_GRAPH.addNode(node);
});
EDGES.forEach(function (pair) {
  HITS_GRAPH.addEdge(pair[0], pair[1]);
});

var AUTHORITIES = {
  1: 0,
  2: 0,
  3: 0.366025,
  4: 0.133975,
  5: 0.5,
  6: 0
};

var HUBS = {
  1: 0.366025,
  2: 0,
  3: 0.211325,
  4: 0,
  5: 0.211325,
  6: 0.211325
};

describe('hits', function () {
  it('should throw if provided with something which is not a graph.', function () {
    assert.throws(function () {
      hits({hello: 'world'});
    }, /graphology/);
  });

  it('should throw if provided with a MultiGraph.', function () {
    assert.throws(function () {
      var graph = new Graph({multi: true});
      hits(graph);
    }, /multi/i);
  });

  it('should return correct hubs & authorities.', function () {
    var result = hits(HITS_GRAPH, {tolerance: 1e-8}),
      node;

    for (node in result.authorities) {
      assert.approximately(result.authorities[node], AUTHORITIES[node], 0.0001);
    }

    for (node in result.hubs) {
      assert.approximately(result.hubs[node], HUBS[node], 0.0001);
    }
  });

  it("should be possible to assign results directly to the nodes' attributes.", function () {
    var graph = HITS_GRAPH.copy();

    hits.assign(graph);

    var nodes = graph.nodes(),
      node,
      l = graph.order,
      i;

    for (i = 0; i < l; i++) {
      node = nodes[i];
      assert.approximately(
        graph.getNodeAttribute(node, 'authority'),
        AUTHORITIES[node],
        0.0001
      );
    }

    for (i = 0; i < l; i++) {
      node = nodes[i];
      assert.approximately(
        graph.getNodeAttribute(node, 'hub'),
        HUBS[node],
        0.0001
      );
    }
  });

  it('should be possible to customize the target attributes.', function () {
    var graph = HITS_GRAPH.copy();

    hits.assign(graph, {nodeAuthorityAttribute: 'a', nodeHubAttribute: 'h'});

    var nodes = graph.nodes(),
      node,
      l = graph.order,
      i;

    for (i = 0; i < l; i++) {
      node = nodes[i];
      assert.approximately(
        graph.getNodeAttribute(node, 'a'),
        AUTHORITIES[node],
        0.0001
      );
    }

    for (i = 0; i < l; i++) {
      node = nodes[i];
      assert.approximately(
        graph.getNodeAttribute(node, 'h'),
        HUBS[node],
        0.0001
      );
    }
  });
});
