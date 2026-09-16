/**
 * Graphology DOT Unit Tests Writer Definitions
 * =============================================
 *
 * Definitions of the DOT files stored in `./resources` so we can test
 * that the writer works as expected.
 */
var Graph = require('graphology');

function createBasicGraph() {
  var graph = new Graph({type: 'undirected'});

  graph.setAttribute('id', 'G');
  graph.setAttribute('mode', 'static');

  graph.addNode('n0');
  graph.addNode('n1');
  graph.addNode('n2');
  graph.addNode('n3');
  graph.addNode('n4');
  graph.addNode('n5');

  graph.addEdgeWithKey('e0', 'n0', 'n2');
  graph.addEdgeWithKey('e1', 'n0', 'n1');
  graph.addEdgeWithKey('e2', 'n1', 'n3');
  graph.addEdgeWithKey('e3', 'n3', 'n2');
  graph.addEdgeWithKey('e4', 'n2', 'n4');
  graph.addEdgeWithKey('e5', 'n3', 'n5');
  graph.addEdgeWithKey('e6', 'n5', 'n4');

  return graph;
}

function createDirectedGraph() {
  var graph = new Graph({type: 'directed'});

  graph.setAttribute('id', 'G');

  graph.addNode('n0');
  graph.addNode('n1');
  graph.addNode('n2');
  graph.addNode('n3');

  graph.addEdgeWithKey('e0', 'n0', 'n1');
  graph.addEdgeWithKey('e1', 'n0', 'n2');
  graph.addEdgeWithKey('e2', 'n1', 'n3');
  graph.addEdgeWithKey('e3', 'n2', 'n3');

  return graph;
}

function createEscapedAttrsGraph() {
  var graph = new Graph({type: 'undirected'});

  graph.setAttribute('id', 'G');

  graph.addNode('n0', {color: '#FF0000', label: 'say "hello"'});
  graph.addNode('n1', {path: 'C:\\Users\\test'});
  graph.addEdge('n0', 'n1', {note: 'File: "test.txt" #1'});

  return graph;
}

function createBooleanAttrsGraph() {
  var graph = new Graph({type: 'undirected'});

  graph.setAttribute('id', 'G');

  graph.addNode('n0', {active: true, visible: false, count: 0});
  graph.addNode('n1', {active: false});
  graph.addEdge('n0', 'n1', {highlighted: true, weight: 2});

  return graph;
}

function createMixedGraph() {
  var graph = new Graph({type: 'mixed'});

  graph.setAttribute('id', 'G');

  graph.addNode('n0');
  graph.addNode('n1');
  graph.addNode('n2');

  graph.addEdgeWithKey('e0', 'n0', 'n1');
  graph.addUndirectedEdgeWithKey('e1', 'n0', 'n2');

  return graph;
}

function createSpecialNodeIdsGraph() {
  var graph = new Graph({type: 'directed'});

  graph.setAttribute('id', 'G');

  graph.addNode('++_2036923609960', {node_kind: '++', is_named: false, text: '++'});
  graph.addNode(')_2036923547800', {node_kind: ')', is_named: false, text: ')'});
  graph.addNode('normal_node', {label: 'Normal'});

  graph.addEdge('++_2036923609960', ')_2036923547800');
  graph.addEdge('++_2036923609960', 'normal_node');

  return graph;
}

module.exports = [
  {
    title: 'Basic',
    dot: 'basic_writer',
    graph: createBasicGraph
  },
  {
    title: 'Directed',
    dot: 'directed_writer',
    graph: createDirectedGraph
  },
  {
    title: 'Escaped Attributes',
    dot: 'escaped_attrs_writer',
    graph: createEscapedAttrsGraph
  },
  {
    title: 'Boolean Attributes',
    dot: 'boolean_attrs_writer',
    graph: createBooleanAttrsGraph
  },
  {
    title: 'Mixed',
    dot: 'mixed_writer',
    graph: createMixedGraph
  },
  {
    title: 'Special Node IDs',
    dot: 'special_node_ids_writer',
    graph: createSpecialNodeIdsGraph
  }
];
