const graphology = require('graphology');
const core = require('./index');
const assert = require('assert');

function prepareGraphG() {
  const G = new graphology.UndirectedGraph();
  G.mergeEdge(4, 1);
  G.mergeEdge(4, 2);
  G.mergeEdge(4, 3);
  G.mergeEdge(1, 2);
  G.mergeEdge(2, 3);
  G.mergeEdge(3, 1);

  G.mergeEdge(8, 5);
  G.mergeEdge(8, 6);
  G.mergeEdge(8, 7);
  G.mergeEdge(5, 6);
  G.mergeEdge(6, 7);
  G.mergeEdge(7, 5);

  G.mergeEdge(2, 11);
  G.mergeEdge(11, 5);

  G.mergeEdge(12, 5);
  G.mergeEdge(12, 11);
  G.mergeEdge(12, 18);
  G.mergeEdge(12, 19);

  G.mergeEdge(3, 7);
  G.mergeEdge(3, 9);
  G.mergeEdge(7, 9);
  G.mergeEdge(7, 10);
  G.mergeEdge(9, 10);
  G.mergeEdge(9, 20);

  G.mergeEdge(17, 13);
  G.mergeEdge(13, 14);
  G.mergeEdge(14, 15);
  G.mergeEdge(15, 16);
  G.mergeEdge(16, 13);

  G.addNode(21);

  return G;
}

function prepareGraphH() {
  const H = new graphology.UndirectedGraph();
  H.addNode(0);
  H.mergeEdge(1, 3);
  H.mergeEdge(3, 6);
  H.mergeEdge(6, 4);
  H.mergeEdge(6, 5);
  H.mergeEdge(4, 2);
  H.mergeEdge(5, 2);

  return H;
}

function prepareCycle() {
  const G = new graphology.UndirectedGraph();
  G.mergeEdge(1, 2);
  G.mergeEdge(2, 3);
  G.mergeEdge(3, 1);
  return G;
}

function prepareDiGraphI() {
  const I = new graphology.DirectedGraph();
  I.mergeEdge(1, 2);
  I.mergeEdge(2, 1);
  I.mergeEdge(2, 3);
  I.mergeEdge(2, 4);
  I.mergeEdge(3, 4);
  I.mergeEdge(4, 3);
  return I;
}

function range(s, e) {
  const set = new Set();
  for (let i = s; i < e; ++i) {
    set.add(i);
  }
  return set;
}

describe('graphology-cores', function () {
  it('should work on empty graph.', function () {
    const empty = new graphology.Graph();
    const coreNumber = core.coreNumber(empty);
    assert.deepEqual(coreNumber, {});
  });

  it('should return correct nodes by core.', function () {
    const graph = prepareGraphG();
    const coreNumber = core.coreNumber(graph);
    const byCores = Object.entries(coreNumber).reduce((obj, entry) => {
      const [k, v] = entry;
      if (obj[v] === undefined) obj[v] = new Set();
      obj[v].add(k);
      return obj;
    }, {});

    assert.deepEqual(byCores[0], new Set([21]));
    assert.deepEqual(byCores[1], new Set([17, 18, 19, 20]));
    assert.deepEqual(byCores[2], new Set([9, 10, 11, 12, 13, 14, 15, 16]));
    assert.deepEqual(byCores[3], new Set([1, 2, 3, 4, 5, 6, 7, 8]));
  });

  it('should return correct nodes by core again.', function () {
    const graph = prepareGraphH();
    const coreNumber = core.coreNumber(graph);
    const byCores = Object.entries(coreNumber).reduce(function (obj, entry) {
      const [k, v] = entry;
      if (obj[v] === undefined) obj[v] = new Set();
      obj[v].add(k);
      return obj;
    }, {});

    assert.deepEqual(byCores[0], new Set([0]));
    assert.deepEqual(byCores[1], new Set([1, 3]));
    assert.deepEqual(byCores[2], new Set([2, 4, 5, 6]));
  });

  it('should not work if the graph has self loops.', function () {
    const graph = prepareCycle();
    graph.mergeEdge(1, 1);
    assert.throws(function () {
      core.coreNumber(graph);
    }, /graphology/);
  });

  it('should return correct nodes by core with directed graph.', function () {
    const graph = prepareDiGraphI();
    let coreNumber = core.coreNumber(graph);

    assert.deepEqual(coreNumber, {
      1: 2,
      2: 2,
      3: 2,
      4: 2
    });

    // More edges
    graph.mergeEdge(1, 5);
    graph.mergeEdge(3, 5);
    graph.mergeEdge(4, 5);
    graph.mergeEdge(3, 6);
    graph.mergeEdge(4, 6);
    graph.mergeEdge(5, 6);
    coreNumber = core.coreNumber(graph);

    assert.deepEqual(coreNumber, {
      1: 3,
      2: 3,
      3: 3,
      4: 3,
      5: 3,
      6: 3
    });
  });

  it('should return the subgrah of the main core.', function () {
    const graph = prepareGraphH();
    const subgraph = core.kCore(graph);
    const nodes = subgraph.mapNodes(a => a);
    assert.deepEqual(new Set(nodes), new Set([2, 4, 5, 6]));
  });

  it('should return the subgraph of any k core.', function () {
    let graph = prepareGraphH();
    let subgraph = core.kCore(graph, 0);
    let nodes = subgraph.mapNodes(a => a);
    assert.deepEqual(new Set(nodes), new Set(graph.mapNodes(a => a)));

    graph = prepareGraphH();
    subgraph = core.kCore(graph, 1);
    nodes = subgraph.mapNodes(a => a);
    assert.deepEqual(new Set(nodes), new Set([1, 2, 3, 4, 5, 6]));

    graph = prepareGraphH();
    subgraph = core.kCore(graph, 2);
    nodes = subgraph.mapNodes(a => a);
    assert.deepEqual(new Set(nodes), new Set([2, 4, 5, 6]));
  });

  it('should return the subgraph of the main crust.', function () {
    const graph = prepareGraphH();
    const subgraph = core.kCrust(graph);
    const nodes = subgraph.mapNodes(a => a);
    assert.deepEqual(new Set(nodes), new Set([0, 1, 3]));
  });

  it('should return the subgraph of any k crust.', function () {
    let graph = prepareGraphH();
    let subgraph = core.kCrust(graph, 0);
    let nodes = subgraph.mapNodes(a => a);
    assert.deepEqual(new Set(nodes), new Set([0]));

    graph = prepareGraphH();
    subgraph = core.kCrust(graph, 1);
    nodes = subgraph.mapNodes(a => a);
    assert.deepEqual(new Set(nodes), new Set([0, 1, 3]));

    graph = prepareGraphH();
    subgraph = core.kCrust(graph, 2);
    nodes = subgraph.mapNodes(a => a);
    assert.deepEqual(new Set(nodes), new Set(graph.mapNodes(a => a)));
  });

  it('should return the subgraph of the main shell.', function () {
    const graph = prepareGraphH();
    const subgraph = core.kShell(graph);
    const nodes = subgraph.mapNodes(a => a);
    assert.deepEqual(new Set(nodes), new Set([2, 4, 5, 6]));
  });

  it('should return the subgraph of any k shell.', function () {
    let graph = prepareGraphH();
    let subgraph = core.kShell(graph, 0);
    let nodes = subgraph.mapNodes(a => a);
    assert.deepEqual(new Set(nodes), new Set([0]));

    graph = prepareGraphH();
    subgraph = core.kShell(graph, 1);
    nodes = subgraph.mapNodes(a => a);
    assert.deepEqual(new Set(nodes), new Set([1, 3]));

    graph = prepareGraphH();
    subgraph = core.kShell(graph, 2);
    nodes = subgraph.mapNodes(a => a);
    assert.deepEqual(new Set(nodes), new Set([2, 4, 5, 6]));
  });

  it('should return the subgraph of any k corona.', function () {
    let graph = prepareGraphH();
    let subgraph = core.kCorona(graph, 0);
    let nodes = subgraph.mapNodes(a => a);
    assert.deepEqual(new Set(nodes), new Set([0]));

    graph = prepareGraphH();
    subgraph = core.kCorona(graph, 1);
    nodes = subgraph.mapNodes(a => a);
    assert.deepEqual(new Set(nodes), new Set([1]));

    graph = prepareGraphH();
    subgraph = core.kCorona(graph, 2);
    nodes = subgraph.mapNodes(a => a);
    assert.deepEqual(new Set(nodes), new Set([2, 4, 5, 6]));
  });

  it('should return the subgraph of any k truss.', function () {
    const graph = prepareGraphG();

    let subgraph = undefined;
    let nodes = undefined;

    subgraph = core.kTruss(graph, -1);
    nodes = subgraph.nodes();
    assert.deepEqual(new Set(nodes), range(1, 21));

    subgraph = core.kTruss(graph, 0);
    nodes = subgraph.nodes();
    assert.deepEqual(new Set(nodes), range(1, 21));

    subgraph = core.kTruss(graph, 1);
    nodes = subgraph.nodes();
    assert.deepEqual(new Set(nodes), range(1, 21));

    subgraph = core.kTruss(graph, 2);
    nodes = subgraph.nodes();
    assert.deepEqual(new Set(nodes), range(1, 21));

    subgraph = core.kTruss(graph, 3);
    nodes = subgraph.nodes();
    assert.deepEqual(new Set(nodes), range(1, 13));

    subgraph = core.kTruss(graph, 4);
    nodes = subgraph.nodes();
    assert.deepEqual(new Set(nodes), range(1, 9));

    subgraph = core.kTruss(graph, 5);
    nodes = subgraph.nodes();
    assert.deepEqual(new Set(nodes), new Set());
  });

  it('should not return k truss if k is null.', function () {
    const graph = prepareGraphG();
    assert.throws(function () {
      core.kTruss(graph);
    }, /graphology/);
  });

  it('should not return k truss if the graph is directed or multigraph.', function () {
    const graphA = new graphology.DirectedGraph();
    assert.throws(function () {
      core.kTruss(graphA);
    }, /graphology/);

    const graphB = new graphology.MultiGraph();
    assert.throws(function () {
      core.kTruss(graphB);
    }, /graphology/);
  });

  it('should not calculate onion layers if the graph is directed.', function () {
    const graph = prepareDiGraphI();
    assert.throws(function () {
      core.onionLayers(graph);
    }, /graphology/);
  });

  it('should return correct onion layers.', function () {
    const graph = prepareGraphG();
    const onion = core.onionLayers(graph);
    const nodesByLayer = [];
    for (let i = 1; i < 7; ++i) {
      const layer = new Set();
      Object.keys(onion).forEach(node => {
        if (onion[node] === i) layer.add(node);
      });
      nodesByLayer.push(layer);
    }

    assert.deepEqual(nodesByLayer[0], new Set([21]));
    assert.deepEqual(nodesByLayer[1], new Set([17, 18, 19, 20]));
    assert.deepEqual(nodesByLayer[2], new Set([10, 12, 13, 14, 15, 16]));
    assert.deepEqual(nodesByLayer[3], new Set([9, 11]));
    assert.deepEqual(nodesByLayer[4], new Set([1, 2, 4, 5, 6, 8]));
    assert.deepEqual(nodesByLayer[5], new Set([3, 7]));
  });

  it('should assign onion layers for each node.', function () {
    const graph = prepareGraphG();
    const onion = core.onionLayers.assign(graph, 'onion');

    graph.forEachNode(node => {
      const layer = graph.getNodeAttribute(node, 'onion');
      assert.equal(layer, onion[node]);
    });
  });

  it('should assign core for each node.', function () {
    const graph = prepareGraphG();
    const degen = core.coreNumber.assign(graph, 'core');

    graph.forEachNode(node => {
      const layer = graph.getNodeAttribute(node, 'core');
      assert.equal(layer, degen[node]);
    });
  });
});
