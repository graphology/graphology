/**
 * Graphology GRAPHML Unit Tests Writer Definitions
 * =================================================
 *
 * Definitions of the GRAPHML files stored in `./resources` so we can test
 * that the writer works as expected.
 */
var Graph = require('graphology');

function createBasicGraph() {
  var graph = new Graph({type: 'undirected'});

  graph.setAttribute('id', 'G');
  graph.setAttribute('mode', 'static');

  graph.addNode('n0', {color: 'green'});
  graph.addNode('n1');
  graph.addNode('n2', {color: 'blue'});
  graph.addNode('n3', {color: 'red'});
  graph.addNode('n4');
  graph.addNode('n5', {color: 'turquoise'});

  graph.addEdgeWithKey('e0', 'n0', 'n2', {weight: 1.0});
  graph.addEdgeWithKey('e1', 'n0', 'n1', {weight: 1.0});
  graph.addEdgeWithKey('e2', 'n1', 'n3', {weight: 2.0});
  graph.addEdgeWithKey('e3', 'n3', 'n2');
  graph.addEdgeWithKey('e4', 'n2', 'n4');
  graph.addEdgeWithKey('e5', 'n3', 'n5');
  graph.addEdgeWithKey('e6', 'n5', 'n4', {weight: 1.1});

  return graph;
}

function createMixedGraph() {
  var graph = new Graph({type: 'mixed'});

  graph.addNode('n0');
  graph.addNode('n1');
  graph.addNode('n2');

  graph.addEdgeWithKey('e0', 'n0', 'n1');
  graph.addUndirectedEdgeWithKey('e1', 'n0', 'n2');

  return graph;
}

function createFormattedGraph() {
  var graph = new Graph({type: 'undirected'});

  graph.addNode('n0', {color: 'green', size: 12});
  graph.addNode('n1', {color: 'blue'});

  graph.addEdgeWithKey('e0', 'n0', 'n1', {weight: 2});

  return graph;
}

function createEscapingGraph() {
  var graph = new Graph({type: 'undirected'});

  graph.addNode('a', {name: 'Tom & Jerry'});
  graph.addNode('b', {name: '<b>bold</b>'});

  graph.addEdgeWithKey('e', 'a', 'b', {note: 'say "hi"'});

  return graph;
}

module.exports = [
  {
    title: 'Basic',
    graphml: 'basic_writer',
    graph: createBasicGraph
  },
  {
    title: 'Mixed',
    graphml: 'mixed_writer',
    graph: createMixedGraph
  },
  {
    title: 'Formatted',
    graphml: 'formatted_writer',
    graph: createFormattedGraph,
    options: {
      formatNode: function (key, attributes) {
        return {label: 'Node ' + key, color: attributes.color};
      },
      formatEdge: function (key, attributes) {
        return {weight: attributes.weight * 2};
      }
    },
    roundtrip: false
  },
  {
    title: 'Escaping',
    graphml: 'escaping_writer',
    graph: createEscapingGraph
  }
];
