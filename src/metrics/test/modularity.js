/**
 * Graphology Modularity Unit Tests
 * =================================
 */
var assert = require('chai').assert,
    Graph = require('graphology'),
    modularity = require('../modularity.js'),
    toDirected = require('graphology-operators/to-directed');

var UndirectedGraph = Graph.UndirectedGraph,
    DirectedGraph = Graph.DirectedGraph,
    MultiGraph = Graph.MultiGraph;

/**
 * Datasets.
 */
var clique3 = Graph.from(require('./datasets/clique3.json'), {type: 'directed'});
var directed500 = Graph.from(require('./datasets/directed500.json'), {type: 'directed'});
var undirected500 = Graph.from(require('./datasets/undirected500.json'), {type: 'undirected'});

/**
 * Helpers.
 */
function cleanLoops(G) {
  G.forEachEdge(function(edge, _, source, target) {
    if (source === target)
      G.dropEdge(edge);
  });
}

cleanLoops(directed500);
cleanLoops(undirected500);

function fromData(G, nodes, edges) {
  var g = new G();

  nodes.forEach(function(node) {
    g.addNode(node[0], {community: node[1]});
  });

  edges.forEach(function(edge) {
    var attr = {};

    if (edge.length > 2)
      attr.weight = edge[2];

    g.mergeEdge(edge[0], edge[1], attr);
  });

  return g;
}

function closeTo(A, B) {
  assert.closeTo(A, B, 0.001);
}

/**
 * Actual unit tests.
 */
describe('modularity', function() {
  it('should throw if given graph is invalid.', function() {
    assert.throws(function() {
      modularity(null);
    }, /graphology/);
  });

  it('should throw if given graph is multi.', function() {
    assert.throws(function() {
      var graph = new MultiGraph();
      graph.mergeEdge(1, 2);
      modularity(graph);
    }, /multi/);
  });

  it('should throw if the given graph has no edges.', function() {
    var graph = new Graph();
    graph.addNode(1);
    graph.addNode(2);

    assert.throws(function() {
      modularity(graph);
    }, /empty/);
  });

  it('should throw if the given graph is truly mixed.', function() {
    var graph = new Graph();
    graph.mergeDirectedEdge(1, 2);
    graph.mergeUndirectedEdge(2, 3);

    assert.throws(function() {
      modularity(graph);
    }, /mixed/);
  });

  it('should work for trivial cases.', function() {

    // Undirected, two nodes, different communities
    var graph = new UndirectedGraph();
    graph.addNode(1, {community: 1});
    graph.addNode(2, {community: 2});
    graph.addEdge(1, 2);

    assert.strictEqual(modularity(graph), -0.5);
    assert.strictEqual(modularity.dense(graph), modularity.sparse(graph));

    // Undirected, two nodes, same community
    graph = new UndirectedGraph();
    graph.addNode(1, {community: 1});
    graph.addNode(2, {community: 1});
    graph.addEdge(1, 2);

    assert.strictEqual(modularity(graph), 0);
    assert.strictEqual(modularity.dense(graph), modularity.sparse(graph));

    // Directed, two nodes, different communities
    graph = new DirectedGraph();
    graph.addNode(1, {community: 1});
    graph.addNode(2, {community: 2});
    graph.addEdge(1, 2);

    assert.strictEqual(modularity(graph), 0);
    assert.strictEqual(modularity.dense(graph), modularity.sparse(graph));

    // Directed, two nodes, same community
    graph = new DirectedGraph();
    graph.addNode(1, {community: 1});
    graph.addNode(2, {community: 1});
    graph.addEdge(1, 2);

    assert.strictEqual(modularity(graph), 0);
    assert.strictEqual(modularity.dense(graph), modularity.sparse(graph));

    // Directed, two nodes, same community, mutual edge
    graph = new DirectedGraph();
    graph.addNode(1, {community: 1});
    graph.addNode(2, {community: 1});
    graph.addEdge(1, 2);
    graph.addEdge(2, 1);

    assert.strictEqual(modularity(graph), 0);
    assert.strictEqual(modularity.dense(graph), modularity.sparse(graph));
  });

  it('should work properly with a simple case.', function() {
    var nodes = [
      [1, 1], // id, community
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 1],
      [6, 2]
    ];

    var edges = [
      [1, 2], // source, target
      [1, 5],
      [2, 3],
      [3, 4],
      [4, 2],
      [5, 1],
      [6, 3]
    ];

    // Undirected case
    var graph = fromData(UndirectedGraph, nodes, edges);

    closeTo(modularity(graph), 0.2083, 0.001);
    closeTo(modularity.dense(graph), modularity.sparse(graph));

    // Directed case
    graph = fromData(DirectedGraph, nodes, edges);

    closeTo(modularity(graph), 0.3265, 0.001);
    closeTo(modularity.dense(graph), modularity.sparse(graph));
  });

  it('should throw if a node is not in the given partition.', function() {
    var graph = new UndirectedGraph();
    graph.mergeEdge(1, 2);
    graph.mergeEdge(1, 3);
    graph.mergeEdge(2, 3);

    assert.throws(function() {
      modularity(graph, {communities: {1: 0, 2: 0}});
    }, /partition/);
  });

  it('should handle unique partitions of cliques.', function() {
    var graph = new UndirectedGraph();
    graph.mergeEdge(1, 2);
    graph.mergeEdge(1, 3);
    graph.mergeEdge(2, 3);

    closeTo(modularity(graph, {communities: {1: 0, 2: 0, 3: 0}}), 0);
  });

  it('should handle tiny weighted graphs (5 nodes).', function() {

    // Undirected case
    var graph = new UndirectedGraph();

    graph.mergeEdge(1, 2, {weight: 30});
    graph.mergeEdge(1, 5);
    graph.mergeEdge(2, 3, {weight: 15});
    graph.mergeEdge(2, 4, {weight: 10});
    graph.mergeEdge(2, 5);
    graph.mergeEdge(3, 4, {weight: 5});
    graph.mergeEdge(4, 5, {weight: 100});

    closeTo(modularity(graph, {communities: {1: 0, 2: 0, 3: 0, 4: 1, 5: 1}}), 0.337);

    graph = new DirectedGraph();

    graph.mergeEdge(1, 2, {weight: 30});
    graph.mergeEdge(1, 5);
    graph.mergeEdge(2, 3, {weight: 15});
    graph.mergeEdge(2, 4, {weight: 10});
    graph.mergeEdge(2, 5);
    graph.mergeEdge(3, 4, {weight: 5});
    graph.mergeEdge(4, 5, {weight: 100});

    closeTo(modularity(graph, {communities: {1: 0, 2: 0, 3: 0, 4: 1, 5: 1}}), 0.342);
  });

  it('should be possible to compute the unweighted modularity of a weighted graph.', function() {
    var communities = {1: 0, 2: 0, 3: 0, 4: 1, 5: 1};

    var graph = new UndirectedGraph();

    graph.mergeEdge(1, 2, {weight: 30});
    graph.mergeEdge(1, 5);
    graph.mergeEdge(2, 3, {weight: 15});
    graph.mergeEdge(2, 4, {weight: 10});
    graph.mergeEdge(2, 5);
    graph.mergeEdge(3, 4, {weight: 5});
    graph.mergeEdge(4, 5, {weight: 100});

    closeTo(modularity(graph, {communities: communities, weighted: false}), -0.081);

    var unweighted = new UndirectedGraph();

    unweighted.mergeEdge(1, 2);
    unweighted.mergeEdge(1, 5);
    unweighted.mergeEdge(2, 3);
    unweighted.mergeEdge(2, 4);
    unweighted.mergeEdge(2, 5);
    unweighted.mergeEdge(3, 4);
    unweighted.mergeEdge(4, 5);

    assert.strictEqual(
      modularity(graph, {communities: communities, weighted: false}),
      modularity(unweighted, {communities: communities})
    );
  });

  it('should be possible to indicate the weight attribute name.', function() {
    var graph = new UndirectedGraph();

    graph.mergeEdge(1, 2, {customWeight: 30});
    graph.mergeEdge(1, 5);
    graph.mergeEdge(2, 3, {customWeight: 15});
    graph.mergeEdge(2, 4, {customWeight: 10});
    graph.mergeEdge(2, 5);
    graph.mergeEdge(3, 4, {customWeight: 5});
    graph.mergeEdge(4, 5, {customWeight: 100});

    var options = {
      attributes: {
        weight: 'customWeight'
      },
      communities: {1: 0, 2: 0, 3: 0, 4: 1, 5: 1}
    };

    closeTo(modularity(graph, options), 0.337);
  });

  it('should be possible to read the communities from the graph', function() {
    var graph = new UndirectedGraph();

    var data = {
      1: {
        community: 0
      },
      2: {
        community: 0
      },
      3: {
        community: 0
      },
      4: {
        community: 1
      },
      5: {
        community: 1
      }
    };

    for (var node in data)
      graph.addNode(node, data[node]);

    graph.addEdge(1, 2, {weight: 30});
    graph.addEdge(1, 5);
    graph.addEdge(2, 3, {weight: 15});
    graph.addEdge(2, 4, {weight: 10});
    graph.addEdge(2, 5);
    graph.addEdge(3, 4, {weight: 5});
    graph.addEdge(4, 5, {weight: 100});

    closeTo(modularity(graph), 0.337);
  });

  it('should handle tiny directed graphs (5 nodes).', function() {
    var graph = new DirectedGraph();

    graph.mergeEdge(1, 2);
    graph.mergeEdge(1, 5);
    graph.mergeEdge(2, 3);
    graph.mergeEdge(3, 4);
    graph.mergeEdge(4, 2);
    graph.mergeEdge(5, 1);

    closeTo(modularity(graph, {communities: {1: 0, 5: 0, 2: 1, 3: 1, 4: 1}}), 0.333);
  });

  it('should handle tiny undirected graphs (12 nodes).', function() {
    closeTo(modularity(clique3), 0.524);
  });

  it('should handle heavy-sized undirected graphs (500 nodes).', function() {
    closeTo(modularity(undirected500), 0.404);
  });

  it('should handle heavy-sized directed graphs (500 nodes).', function() {
    closeTo(modularity(directed500), 0.408);
  });

  it('undirected modularity should be the same as equivalent directed mutual one.', function() {
    var nodes = [
      [1, 1], // id, community
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 1],
      [6, 2]
    ];

    var edges = [
      [1, 2], // source, target
      [1, 5],
      [2, 3],
      [3, 4],
      [4, 2],
      [6, 3]
    ];

    var undirectedGraph = fromData(UndirectedGraph, nodes, edges);
    var directedGraph = toDirected(undirectedGraph);

    closeTo(
      modularity(undirectedGraph),
      modularity(directedGraph)
    );
  });

  it('should be possible to perform delta computations for the undirected case.', function() {
    var nodes = [
      [1, 1], // id, community
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 1],
      [6, 2]
    ];

    var edges = [
      [1, 2], // source, target
      [1, 5],
      [2, 3],
      [3, 4],
      [4, 2],
      [5, 1],
      [6, 3]
    ];

    var graph = fromData(UndirectedGraph, nodes, edges);

    // Node = 2 to other community
    var delta = modularity.undirectedDelta(
      graph.size,
      3,
      3,
      1
    );

    closeTo(delta, -1 / 24);

    // Node = 1 to other community
    delta = modularity.undirectedDelta(
      graph.size,
      9,
      2,
      1
    );

    closeTo(delta, -1 / 6);
  });

  it('should be possible to perform delta computations for the directed case.', function() {
    var nodes = [
      [1, 1], // id, community
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 1],
      [6, 2]
    ];

    var edges = [
      [1, 2], // source, target
      [1, 5],
      [2, 3],
      [3, 4],
      [4, 2],
      [5, 1],
      [6, 3]
    ];

    var graph = fromData(DirectedGraph, nodes, edges);

    // Node = 2 to other community
    var delta = modularity.directedDelta(
      graph.size,
      2,
      3,
      2,
      1,
      1
    );

    closeTo(delta, -1 / 49);

    // Node = 1 to other community
    delta = modularity.directedDelta(
      graph.size,
      5,
      4,
      1,
      2,
      1
    );

    closeTo(delta, -1 / 7);
  });

  it('should work with self-loops in the undirected case.', function() {
    var nodes = [
      [1, 1], // id, community
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 1],
      [6, 2]
    ];

    var edges = [
      [1, 2], // source, target
      [1, 5],
      [2, 3],
      [3, 4],
      [4, 2],
      [6, 3]
    ];

    var graph = fromData(UndirectedGraph, nodes, edges);
    graph.addEdge(1, 1);

    closeTo(modularity.dense(graph), 0.3163);
    closeTo(modularity.sparse(graph), 0.3163);
  });

  it('should work with self-loops in the directed case.', function() {
    var nodes = [
      [1, 1], // id, community
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 1],
      [6, 2]
    ];

    var edges = [
      [1, 2], // source, target
      [1, 5],
      [2, 3],
      [3, 4],
      [4, 2],
      [5, 1],
      [6, 3]
    ];

    var graph = fromData(DirectedGraph, nodes, edges);
    graph.addEdge(1, 1);

    closeTo(modularity.dense(graph), 0.375);
    closeTo(modularity.sparse(graph), 0.375);
  });

  it('the k-clique equivalency should hold.', function() {
    var nodes = [
      [1, 1], // id, community
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 1],
      [6, 2]
    ];

    var edges = [
      [1, 2], // source, target
      [1, 5],
      [2, 3],
      [3, 4],
      [4, 2],
      [6, 3]
    ];

    var undirectedGraph = fromData(UndirectedGraph, nodes, edges);
    var mutualGraph = toDirected(undirectedGraph);

    // Modularity with community losing an edge and gaining a loop should
    // be equivalent
    var UQ = modularity(undirectedGraph);
    var DQ = modularity(mutualGraph);

    closeTo(UQ, DQ);

    undirectedGraph.dropEdge(1, 5);
    undirectedGraph.addEdge(1, 1);

    closeTo(UQ, modularity(undirectedGraph));

    mutualGraph.dropEdge(1, 5);
    mutualGraph.addEdge(1, 1);

    closeTo(DQ, modularity(mutualGraph));

    // Modularity of mutual graph with community losing an edge and gaining
    // a loop should be the same as the undirected one
    undirectedGraph = fromData(UndirectedGraph, nodes, edges);
    mutualGraph = toDirected(undirectedGraph);

    mutualGraph.dropEdge(1, 5);
    mutualGraph.addEdge(1, 1);

    closeTo(modularity(undirectedGraph), modularity(mutualGraph));
  });

  it('should work with resolution.', function() {
    var nodes = [
      [1, 1], // id, community
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 1],
      [6, 2]
    ];

    var edges = [
      [1, 2], // source, target
      [1, 5],
      [2, 3],
      [3, 4],
      [4, 2],
      [5, 1],
      [6, 3]
    ];

    var undirectedGraph = fromData(UndirectedGraph, nodes, edges);

    closeTo(modularity.dense(undirectedGraph, {resolution: 0.5}), 0.5208);
    closeTo(modularity.dense(undirectedGraph, {resolution: 2}), -0.4166);

    closeTo(
      modularity.dense(undirectedGraph, {resolution: 0.5}),
      modularity.sparse(undirectedGraph, {resolution: 0.5})
    );
    closeTo(
      modularity.dense(undirectedGraph, {resolution: 2}),
      modularity.sparse(undirectedGraph, {resolution: 2})
    );

    var directedGraph = fromData(DirectedGraph, nodes, edges);

    closeTo(modularity.dense(directedGraph, {resolution: 0.5}), 0.5918);
    closeTo(modularity.dense(directedGraph, {resolution: 2}), -0.2040);

    closeTo(
      modularity.dense(directedGraph, {resolution: 0.5}),
      modularity.sparse(directedGraph, {resolution: 0.5})
    );
    closeTo(
      modularity.dense(directedGraph, {resolution: 2}),
      modularity.sparse(directedGraph, {resolution: 2})
    );
  });
});
