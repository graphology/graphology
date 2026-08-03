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
  }
];
