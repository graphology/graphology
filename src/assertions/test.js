/**
 * Graphology Utils Unit Tests
 * ============================
 */
var assert = require('assert'),
    Graph = require('graphology'),
    lib = require('./index.js');

var sameNodes = lib.sameNodes,
    sameNodesDeep = lib.sameNodesDeep;

function addNodesFrom(g, nodes) {
  nodes.forEach(function(node) {
    g.addNode(node);
  });
}

describe('graphology-utils', function() {

  describe('#.sameNodes', function() {

    it('should return `true` if both graphs\' nodes are the same.', function() {
      var G = new Graph(),
          H = new Graph();

      addNodesFrom(G, ['John', 'Martha', 'Elvis']);
      addNodesFrom(H, ['Martha', 'Elvis']);

      assert.strictEqual(sameNodes(G, H), false);

      H.addNode('John');

      assert.strictEqual(sameNodes(G, H), true);

      H.addNode('Estelle');

      assert.strictEqual(sameNodes(G, H), false);
    });
  });

  describe('#.sameNodesDeep', function() {

    it('should return `true` if both graphs\' nodes & their attributes are the same.', function() {
      var G = new Graph(),
          H = new Graph();

      addNodesFrom(G, ['John', 'Martha', 'Elvis']);
      addNodesFrom(H, ['Martha', 'Elvis']);

      assert.strictEqual(sameNodesDeep(G, H), false);

      H.addNode('John');

      assert.strictEqual(sameNodesDeep(G, H), true);

      H.setNodeAttribute('Martha', 'age', 45);

      assert.strictEqual(sameNodesDeep(G, H), false);

      G.setNodeAttribute('Martha', 'age', 45);

      assert.strictEqual(sameNodesDeep(G, H), true);
    });
  });
});
