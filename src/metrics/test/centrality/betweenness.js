/**
 * Graphology Betweenness Centrality Unit Tests
 * =============================================
 */
var assert = require('chai').assert,
    Graph = require('graphology'),
    generators = require('graphology-generators'),
    mergePath = require('graphology-utils/merge-path'),
    betweenness = require('../../centrality/betweenness');

var UndirectedGraph = Graph.UndirectedGraph,
    DirectedGraph = Graph.DirectedGraph;

var complete = generators.classic.complete.bind(null, UndirectedGraph),
    path = generators.classic.path.bind(null, UndirectedGraph),
    directedPath = generators.classic.path.bind(null, DirectedGraph),
    ladder = generators.classic.ladder.bind(null, UndirectedGraph);

function deepApproximatelyEqual(t, o, precision) {
  for (var k in t)
    assert.approximately(t[k], o[k], precision);
}

function getWeightedGraph1() {
  var graph = new UndirectedGraph();

  var edges = [
    [0, 1, 3],
    [0, 2, 2],
    [0, 3, 6],
    [0, 4, 4],
    [1, 3, 5],
    [1, 5, 5],
    [2, 4, 1],
    [3, 4, 2],
    [3, 5, 1],
    [4, 5, 4]
  ];

  edges.forEach(function(edge) {
    graph.mergeEdge(edge[0], edge[1], {weight: edge[2]});
  });

  return graph;
}

function getWeightedGraph2(w) {
  var graph = new DirectedGraph();

  var edges = [
    ['s', 'u', 10],
    ['s', 'x', 5],
    ['u', 'v', 1],
    ['u', 'x', 2],
    ['v', 'y', 1],
    ['x', 'u', 3],
    ['x', 'v', 5],
    ['x', 'y', 2],
    ['y', 's', 7],
    ['y', 'v', 6]
  ];

  edges.forEach(function(edge) {
    graph.mergeEdge(edge[0], edge[1], {[w || 'weight']: edge[2]});
  });

  return graph;
}

describe('betweenness centrality', function() {
  it('should throw if passed an invalid graph.', function() {
    assert.throws(function() {
      betweenness(null);
    }, /graphology/);
  });

  it('Complete graph', function() {
    var graph = complete(5);

    var centralities = betweenness(graph, {normalized: false});

    assert.deepEqual(centralities, {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0
    });

    centralities = betweenness(graph, {weighted: true, normalized: false});

    assert.deepEqual(centralities, {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0
    });
  });

  it('Path', function() {
    var graph = path(3);

    var centralities = betweenness(graph, {normalized: false});

    assert.deepEqual(centralities, {
      0: 0,
      1: 1,
      2: 0
    });

    centralities = betweenness(graph, {normalized: false, weighted: true});

    assert.deepEqual(centralities, {
      0: 0,
      1: 1,
      2: 0
    });

    graph = new UndirectedGraph();
    graph.mergeEdge('John', 'Jane');
    graph.mergeEdge('Jane', 'Edna');

    centralities = betweenness(graph, {normalized: false});

    assert.deepEqual(centralities, {
      John: 0,
      Jane: 1,
      Edna: 0
    });
  });

  it('Path normalized', function() {
    var graph = path(3);

    var centralities = betweenness(graph, {normalized: true});

    assert.deepEqual(centralities, {
      0: 0,
      1: 1,
      2: 0
    });

    centralities = betweenness(graph, {normalized: true, weighted: true});

    assert.deepEqual(centralities, {
      0: 0,
      1: 1,
      2: 0
    });
  });

  it('Krackhardt kite', function() {
    var graph = generators.small.krackhardtKite(UndirectedGraph);

    var centralities = betweenness(graph, {normalized: false});

    var test = {
      Andre: 0.833,
      Beverley: 0.833,
      Carol: 0,
      Diane: 3.666,
      Fernando: 8.333,
      Ed: 0,
      Garth: 8.333,
      Heather: 14,
      Ike: 8,
      Jane: 0
    };

    deepApproximatelyEqual(centralities, test, 1e-3);

    centralities = betweenness(graph, {normalized: false, weighted: true});

    deepApproximatelyEqual(centralities, test, 1e-3);
  });

  it('Krackhardt kite normalized', function() {
    var graph = generators.small.krackhardtKite(UndirectedGraph);

    var centralities = betweenness(graph, {normalized: true});

    var test = {
      Andre: 0.023,
      Beverley: 0.023,
      Carol: 0,
      Diane: 0.102,
      Fernando: 0.231,
      Ed: 0,
      Garth: 0.231,
      Heather: 0.389,
      Ike: 0.222,
      Jane: 0
    };

    deepApproximatelyEqual(centralities, test, 1e-3);

    centralities = betweenness(graph, {weighted: true});

    deepApproximatelyEqual(centralities, test, 1e-3);
  });

  it('Florentine families', function() {
    var graph = generators.social.florentineFamilies(UndirectedGraph);

    var centralities = betweenness(graph);

    var test = {
      Acciaiuoli: .000,
      Albizzi: .212,
      Barbadori: .093,
      Bischeri: .104,
      Castellani: .055,
      Ginori: .000,
      Guadagni: .255,
      Lamberteschi: .000,
      Medici: .522,
      Pazzi: .000,
      Peruzzi: .022,
      Ridolfi: .114,
      Salviati: .143,
      Strozzi: .103,
      Tornabuoni: .092
    };

    deepApproximatelyEqual(centralities, test, 1e-3);

    centralities = betweenness(graph, {weighted: true});

    deepApproximatelyEqual(centralities, test, 1e-3);
  });

  it('Ladder graph', function() {
    var graph = ladder(3);

    var centralities = betweenness(graph, {normalized: false});

    var test = {
      0: 0.833,
      1: 3.333,
      2: 0.833,
      3: 0.833,
      4: 3.333,
      5: 0.833
    };

    deepApproximatelyEqual(centralities, test, 1e-3);

    centralities = betweenness(graph, {normalized: false, weighted: true});

    deepApproximatelyEqual(centralities, test, 1e-3);
  });

  it('Disconnected path', function() {
    var graph = new UndirectedGraph();
    mergePath(graph, [0, 1, 2]);
    mergePath(graph, [3, 4, 5, 6]);

    var centralities = betweenness(graph, {normalized: false});

    assert.deepEqual(centralities, {
      0: 0,
      1: 1,
      2: 0,
      3: 0,
      4: 2,
      5: 2,
      6: 0
    });
  });

  it('Directed path', function() {
    var graph = directedPath(3);

    var centralities = betweenness(graph, {normalized: false});

    assert.deepEqual(centralities, {
      0: 0,
      1: 1,
      2: 0
    });
  });

  it('Directed path normalized', function() {
    var graph = directedPath(3);

    var centralities = betweenness(graph, {normalized: true});

    assert.deepEqual(centralities, {
      0: 0,
      1: 0.5,
      2: 0
    });
  });

  it('Weighted graph 1', function() {
    var graph = getWeightedGraph1();

    var centralities = betweenness(graph, {normalized: false, weighted: true});

    assert.deepEqual(centralities, {
      0: 2,
      1: 0,
      2: 4,
      3: 3,
      4: 4,
      5: 0
    });
  });

  it('Weighted graph 2', function() {
    var graph = getWeightedGraph2();

    var centralities = betweenness(graph, {normalized: false, weighted: true});

    assert.deepEqual(centralities, {
      y: 5,
      x: 5,
      s: 4,
      u: 2,
      v: 2
    });
  });

  it('Assining', function() {
    var graph = getWeightedGraph2('w');

    betweenness.assign(graph, {
      normalized: false,
      weighted: true,
      attributes: {
        centrality: 'centrality',
        weight: 'w'
      }
    });

    var test = {
      y: 5,
      x: 5,
      s: 4,
      u: 2,
      v: 2
    };

    graph.nodes().forEach(function(node) {
      assert.strictEqual(
        graph.getNodeAttribute(node, 'centrality'),
        test[node]
      );
    });
  });
});
