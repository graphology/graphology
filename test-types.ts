import Graph, {UndirectedGraph} from './src';

const graph: Graph = new Graph({type: 'directed'});

graph.addNode('one', {label: 'Hello'});

graph.forEachNode((node, attr) => {
  console.log(node, attr);
});

const undirectedGraph: UndirectedGraph = new UndirectedGraph();

undirectedGraph.clear();
