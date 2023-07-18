/**
 * Graphology Edge Betweenness Centrality Unit Tests
 * =============================================
 */
var assert = require('chai').assert;
var Graph = require('graphology');
var generators = require('graphology-generators');
var mergePath = require('graphology-utils/merge-path');
var edgeBetweenness = require('../../centrality/edge-betweenness');

var UndirectedGraph = Graph.UndirectedGraph;
var DirectedGraph = Graph.DirectedGraph;

var complete = generators.classic.complete.bind(null, UndirectedGraph);
var path = generators.classic.path.bind(null, UndirectedGraph);
var directedPath = generators.classic.path.bind(null, DirectedGraph);
var ladder = generators.classic.ladder.bind(null, UndirectedGraph);

function deepApproximatelyEqual(t, o, precision) {
  for (var k in t) assert.approximately(t[k], o[k], precision);
}

function getEdgeKey(n1, n2) {
  return n1 + '->' + n2;
}

function labelizeEdgeCentrality(graph, edgeCentrality) {
  var labelizedCentrality = {};

  graph.forEachEdge(function (edge, _, src, trg) {
    var centrality = edgeCentrality[edge];
    var label = getEdgeKey(src, trg);
    labelizedCentrality[label] = centrality;
  });

  return labelizedCentrality;
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

  edges.forEach(function (edge) {
    var key = getEdgeKey(edge[0], edge[1]);
    graph.mergeEdgeWithKey(key, edge[0], edge[1], {weight: edge[2]});
  });

  return graph;
}

function getWeightedGraph2(w) {
  w = w || 'weight';

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

  edges.forEach(function (edge) {
    var attr = {};
    attr[w] = edge[2];

    var key = getEdgeKey(edge[0], edge[1]);
    graph.mergeEdgeWithKey(key, edge[0], edge[1], attr);
  });

  return graph;
}

describe('edge betweenness centrality', function () {
  it('should throw if passed an invalid graph.', function () {
    assert.throws(function () {
      edgeBetweenness(null);
    }, /graphology/);
  });

  it('Complete graph', function () {
    var graph = complete(5);

    var centralities = edgeBetweenness(graph, {
      normalized: false
    });

    assert.deepEqual(labelizeEdgeCentrality(graph, centralities), {
      '0->1': 1,
      '0->2': 1,
      '0->3': 1,
      '0->4': 1,
      '1->2': 1,
      '1->3': 1,
      '1->4': 1,
      '2->3': 1,
      '2->4': 1,
      '3->4': 1
    });

    centralities = edgeBetweenness(graph, {
      normalized: false
    });

    assert.deepEqual(labelizeEdgeCentrality(graph, centralities), {
      '0->1': 1,
      '0->2': 1,
      '0->3': 1,
      '0->4': 1,
      '1->2': 1,
      '1->3': 1,
      '1->4': 1,
      '2->3': 1,
      '2->4': 1,
      '3->4': 1
    });
  });

  it('Path', function () {
    var graph = path(3);

    var centralities = edgeBetweenness(graph, {
      normalized: false
    });

    assert.deepEqual(labelizeEdgeCentrality(graph, centralities), {
      '0->1': 2,
      '1->2': 2
    });

    centralities = edgeBetweenness(graph, {
      normalized: false
    });

    assert.deepEqual(labelizeEdgeCentrality(graph, centralities), {
      '0->1': 2,
      '1->2': 2
    });

    graph = new UndirectedGraph();
    graph.mergeEdge('John', 'Jane');
    graph.mergeEdge('Jane', 'Edna');

    centralities = edgeBetweenness(graph, {
      normalized: false
    });

    assert.deepEqual(labelizeEdgeCentrality(graph, centralities), {
      'John->Jane': 2,
      'Jane->Edna': 2
    });
  });

  it('Path normalized', function () {
    var graph = path(3);

    var centralities = edgeBetweenness(graph, {
      normalized: true
    });

    assert.deepEqual(labelizeEdgeCentrality(graph, centralities), {
      '0->1': 0.6666666666666666,
      '1->2': 0.6666666666666666
    });

    centralities = edgeBetweenness(graph, {
      normalized: true
    });

    assert.deepEqual(labelizeEdgeCentrality(graph, centralities), {
      '0->1': 0.6666666666666666,
      '1->2': 0.6666666666666666
    });
  });

  it('Krackhardt kite', function () {
    var graph = generators.small.krackhardtKite(UndirectedGraph);

    var centralities = edgeBetweenness(graph, {
      normalized: false
    });

    var test = {
      'Andre->Beverley': 2.666,
      'Andre->Carol': 1.5,
      'Andre->Diane': 1.833,
      'Andre->Fernando': 4.666,
      'Beverley->Ed': 1.5,
      'Beverley->Garth': 4.666,
      'Carol->Diane': 3,
      'Carol->Fernando': 4.5,
      'Diane->Beverley': 1.833,
      'Diane->Ed': 3,
      'Diane->Fernando': 3.333,
      'Diane->Garth': 3.333,
      'Ed->Garth': 4.5,
      'Fernando->Garth': 2.666,
      'Fernando->Heather': 10.5,
      'Garth->Heather': 10.5,
      'Heather->Ike': 16,
      'Ike->Jane': 9
    };

    deepApproximatelyEqual(
      labelizeEdgeCentrality(graph, centralities),
      test,
      1e-3
    );

    centralities = edgeBetweenness(graph, {
      normalized: false
    });

    deepApproximatelyEqual(
      labelizeEdgeCentrality(graph, centralities),
      test,
      1e-3
    );
  });

  it('Krackhardt kite normalized', function () {
    var graph = generators.small.krackhardtKite(UndirectedGraph);

    var centralities = edgeBetweenness(graph, {
      normalized: true
    });

    var test = {
      'Andre->Beverley': 0.059,
      'Andre->Carol': 0.033,
      'Andre->Diane': 0.040740740740740744,
      'Andre->Fernando': 0.103,
      'Beverley->Ed': 0.033,
      'Beverley->Garth': 0.103,
      'Carol->Diane': 0.066,
      'Carol->Fernando': 0.1,
      'Diane->Beverley': 0.040740740740740744,
      'Diane->Ed': 0.066,
      'Diane->Fernando': 0.07407407407407408,
      'Diane->Garth': 0.07407407407407407,
      'Ed->Garth': 0.1,
      'Fernando->Garth': 0.059,
      'Fernando->Heather': 0.233,
      'Garth->Heather': 0.233,
      'Heather->Ike': 0.355,
      'Ike->Jane': 0.2
    };

    deepApproximatelyEqual(
      labelizeEdgeCentrality(graph, centralities),
      test,
      1e-3
    );

    centralities = edgeBetweenness(graph);

    deepApproximatelyEqual(
      labelizeEdgeCentrality(graph, centralities),
      test,
      1e-3
    );
  });

  it('Florentine families', function () {
    var graph = generators.social.florentineFamilies(UndirectedGraph);

    var centralities = edgeBetweenness(graph);

    var test = {
      'Acciaiuoli->Medici': 0.133,
      'Castellani->Peruzzi': 0.057,
      'Castellani->Strozzi': 0.052,
      'Castellani->Barbadori': 0.119,
      'Medici->Barbadori': 0.176,
      'Medici->Ridolfi': 0.146,
      'Medici->Tornabuoni': 0.122,
      'Medici->Albizzi': 0.212,
      'Medici->Salviati': 0.247,
      'Salviati->Pazzi': 0.133,
      'Peruzzi->Strozzi': 0.042,
      'Peruzzi->Bischeri': 0.071,
      'Strozzi->Ridolfi': 0.136,
      'Strozzi->Bischeri': 0.079,
      'Ridolfi->Tornabuoni': 0.047,
      'Tornabuoni->Guadagni': 0.122,
      'Albizzi->Ginori': 0.133,
      'Albizzi->Guadagni': 0.155,
      'Bischeri->Guadagni': 0.163,
      'Guadagni->Lamberteschi': 0.133
    };

    deepApproximatelyEqual(
      labelizeEdgeCentrality(graph, centralities),
      test,
      1e-3
    );

    centralities = edgeBetweenness(graph);

    deepApproximatelyEqual(
      labelizeEdgeCentrality(graph, centralities),
      test,
      1e-3
    );
  });

  it('Ladder graph', function () {
    var graph = ladder(3);

    var centralities = edgeBetweenness(graph, {
      normalized: false
    });

    var test = {
      '0->1': 3.999,
      '1->2': 4,
      '3->4': 3.999,
      '4->5': 4,
      '0->3': 2.666,
      '1->4': 3.666,
      '2->5': 2.666
    };

    deepApproximatelyEqual(
      labelizeEdgeCentrality(graph, centralities),
      test,
      1e-3
    );

    centralities = edgeBetweenness(graph, {
      normalized: false
    });

    deepApproximatelyEqual(
      labelizeEdgeCentrality(graph, centralities),
      test,
      1e-3
    );
  });

  it('Disconnected path', function () {
    var graph = new UndirectedGraph();
    mergePath(graph, [0, 1, 2]);
    mergePath(graph, [3, 4, 5, 6]);

    var centralities = edgeBetweenness(graph, {
      normalized: false
    });

    assert.deepEqual(labelizeEdgeCentrality(graph, centralities), {
      '0->1': 2,
      '1->2': 2,
      '3->4': 3,
      '4->5': 4,
      '5->6': 3
    });
  });

  it('Directed path', function () {
    var graph = directedPath(3);

    var centralities = edgeBetweenness(graph, {
      normalized: false
    });

    assert.deepEqual(labelizeEdgeCentrality(graph, centralities), {
      '0->1': 2,
      '1->2': 2
    });
  });

  it('Directed path normalized', function () {
    var graph = directedPath(3);

    var centralities = edgeBetweenness(graph, {
      normalized: true
    });

    var test = {
      '0->1': 0.333,
      '1->2': 0.333
    };

    deepApproximatelyEqual(
      labelizeEdgeCentrality(graph, centralities),
      test,
      1e-3
    );
  });

  it('Weighted graph 1', function () {
    var graph = getWeightedGraph1();

    var centralities = edgeBetweenness(graph, {
      normalized: false
    });

    assert.deepEqual(labelizeEdgeCentrality(graph, centralities), {
      '0->1': 3,
      '0->2': 6,
      '0->3': 0,
      '0->4': 0,
      '1->3': 1,
      '1->5': 1,
      '2->4': 7,
      '3->4': 6,
      '3->5': 4,
      '4->5': 0
    });
  });

  it('Unweighted graph 1', function () {
    var graph = getWeightedGraph1();

    var centralities = edgeBetweenness(graph, {
      getEdgeWeight: null
    });

    deepApproximatelyEqual(
      labelizeEdgeCentrality(graph, centralities),
      {
        '0->1': 0.177,
        '0->2': 0.166,
        '0->3': 0.122,
        '0->4': 0.111,
        '1->3': 0.088,
        '1->5': 0.111,
        '2->4': 0.166,
        '3->4': 0.122,
        '3->5': 0.088,
        '4->5': 0.177
      },
      1e-3
    );
  });

  it('Weighted graph 2', function () {
    var graph = getWeightedGraph2();

    var centralities = edgeBetweenness(graph, {
      normalized: false
    });

    assert.deepEqual(labelizeEdgeCentrality(graph, centralities), {
      's->u': 0,
      's->x': 8,
      'u->v': 5,
      'u->x': 1,
      'v->y': 6,
      'x->u': 6,
      'x->v': 0,
      'x->y': 3,
      'y->s': 8,
      'y->v': 1
    });
  });

  it('Assining', function () {
    var graph = getWeightedGraph2('w');

    edgeBetweenness.assign(graph, {
      normalized: false,
      getEdgeWeight: 'w',
      edgeCentralityAttribute: 'centrality'
    });

    var test = {
      's->u': 0,
      's->x': 8,
      'u->v': 5,
      'u->x': 1,
      'v->y': 6,
      'x->u': 6,
      'x->v': 0,
      'x->y': 3,
      'y->s': 8,
      'y->v': 1
    };

    graph.forEachEdge(function (edge, _, src, trg) {
      var key = getEdgeKey(src, trg);
      assert.strictEqual(graph.getEdgeAttribute(edge, 'centrality'), test[key]);
    });
  });
});
