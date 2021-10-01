exports.generateFigC1Graph = function generateFigC1Graph(Graph) {
  var graph = new Graph({type: 'undirected'});

  for (var i = 0; i <= 7; i++)
    graph.addNode(i);

  graph.addEdge(2, 3, {weight: 3});
  graph.addEdge(2, 4, {weight: 3});
  graph.addEdge(3, 4, {weight: 3});

  graph.addEdge(5, 6, {weight: 3});
  graph.addEdge(5, 7, {weight: 3});
  graph.addEdge(6, 7, {weight: 3});

  graph.addEdge(0, 1, {weight: 3});

  graph.addEdge(2, 0, {weight: 3 / 2});
  graph.addEdge(3, 0, {weight: 3 / 2});
  graph.addEdge(4, 0, {weight: 3 / 2});

  graph.addEdge(5, 1, {weight: 3 / 2});
  graph.addEdge(6, 1, {weight: 3 / 2});
  graph.addEdge(7, 1, {weight: 3 / 2});

  return graph;
};
