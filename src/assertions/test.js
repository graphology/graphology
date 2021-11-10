/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert');
var Graph = require('graphology');
var lib = require('./index.js');

var haveSameNodes = lib.haveSameNodes;
var haveSameNodesDeep = lib.haveSameNodesDeep;
var areSameGraphs = lib.areSameGraphs;
var areSameGraphsDeep = lib.areSameGraphsDeep;

var MultiGraph = Graph.MultiGraph;

function addNodesFrom(g, nodes) {
  nodes.forEach(function (node) {
    g.addNode(node);
  });
}

describe('graphology-utils', function () {
  describe('#.haveSameNodes', function () {
    it("should return `true` if both graphs' nodes are the same.", function () {
      var G = new Graph();
      var H = new Graph();

      addNodesFrom(G, ['John', 'Martha', 'Elvis']);
      addNodesFrom(H, ['Martha', 'Elvis']);

      assert.strictEqual(haveSameNodes(G, H), false);

      H.addNode('John');

      assert.strictEqual(haveSameNodes(G, H), true);

      H.addNode('Estelle');

      assert.strictEqual(haveSameNodes(G, H), false);
    });
  });

  describe('#.haveSameNodesDeep', function () {
    it("should return `true` if both graphs' nodes & their attributes are the same.", function () {
      var G = new Graph();
      var H = new Graph();

      addNodesFrom(G, ['John', 'Martha', 'Elvis']);
      addNodesFrom(H, ['Martha', 'Elvis']);

      assert.strictEqual(haveSameNodesDeep(G, H), false);

      H.addNode('John');

      assert.strictEqual(haveSameNodesDeep(G, H), true);

      H.setNodeAttribute('Martha', 'age', 45);

      assert.strictEqual(haveSameNodesDeep(G, H), false);

      G.setNodeAttribute('Martha', 'age', 45);

      assert.strictEqual(haveSameNodesDeep(G, H), true);
    });
  });

  describe('#.areSameGraphs', function () {
    it('should return `true` if both graph are the same.', function () {
      var G = new Graph();
      var H = new Graph();

      G.mergeEdge('Martha', 'Robert');
      H.mergeEdge('Martha', 'Robert');

      assert.strictEqual(areSameGraphs(G, H), true);

      H.mergeEdge('Martha', 'Evrard');

      assert.strictEqual(areSameGraphs(G, H), false);

      G.addNode('Evrard');

      assert.strictEqual(areSameGraphs(G, H), false);
    });

    it('should work with multi graphs.', function () {
      var G = new MultiGraph();
      G.mergeEdge(0, 1);
      G.mergeEdge(0, 1);
      G.mergeUndirectedEdge(0, 1);
      G.mergeEdge(2, 3);
      G.mergeUndirectedEdge(4, 5);

      var H = G.copy();

      assert.strictEqual(areSameGraphs(G, H), true);

      H.mergeEdge(0, 1);

      assert.strictEqual(areSameGraphs(G, H), false);

      H.dropEdge(H.edges(0, 1)[0]);

      assert.strictEqual(areSameGraphs(G, H), true);

      assert.strictEqual(areSameGraphsDeep(G, H), true);
    });

    it('should work with multi graphs when comparing attributes.', function () {
      var G = new MultiGraph();
      G.mergeEdge(0, 1, {hello: 'world'});
      G.mergeEdge(0, 1, {hello: 'world'});
      G.mergeEdge(0, 1, {color: 'red', hello: 'world'});
      G.mergeUndirectedEdge(0, 1);
      G.mergeEdge(2, 3);
      G.mergeUndirectedEdge(4, 5, {test: 'ok'});
      G.mergeUndirectedEdge(5, 4, {test: 'not-ok'});

      var H = G.copy();

      assert.strictEqual(areSameGraphsDeep(G, H), true);

      G.setEdgeAttribute(G.edges(0, 1)[0], 'hello', 'monde');

      assert.strictEqual(areSameGraphsDeep(G, H), false);

      H = G.copy();

      assert.strictEqual(areSameGraphsDeep(G, H), true);

      G.setNodeAttribute(0, 'name', 'John');

      assert.strictEqual(areSameGraphsDeep(G, H), false);

      H = G.copy();

      assert.strictEqual(areSameGraphsDeep(G, H), true);

      G.updateEachEdgeAttributes(function () {
        return {};
      });

      assert.strictEqual(areSameGraphsDeep(G, H), false);
    });
  });

  describe('#.areSameGraphsDeep', function () {
    it('should return `true` if both graph as well as their node & edge attributes are the same.', function () {
      var G = new Graph();
      var H = new Graph();

      G.mergeEdge('Martha', 'Robert', {weight: 34});
      H.mergeEdge('Martha', 'Robert', {weight: 45});

      assert.strictEqual(areSameGraphsDeep(G, H), false);

      H.setEdgeAttribute('Martha', 'Robert', 'weight', 34);

      assert.strictEqual(areSameGraphsDeep(G, H), true);

      H.mergeEdge('Martha', 'Evrard');

      assert.strictEqual(areSameGraphsDeep(G, H), false);

      G.addNode('Evrard');

      assert.strictEqual(areSameGraphsDeep(G, H), false);
    });
  });
});
