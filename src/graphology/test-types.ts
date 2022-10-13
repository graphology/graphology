import Graph, {UndirectedGraph} from './src/endpoint.esm';

interface NodeAttributes {
  label: string;
}

interface EdgeAttributes {
  weight: number;
}

const graph: Graph<NodeAttributes, EdgeAttributes> = new Graph({
  type: 'directed'
});

graph.addNode('one', {label: 'Hello'});
graph.getNodeAttribute('one', 'label');

graph.forEachNode((node, attr) => {
  console.log(node, attr);
});

function listener({
  key,
  attributes
}: {
  key: string;
  attributes: NodeAttributes;
}) {
  console.log(key);
  console.log(attributes.label);
}

graph.on('nodeAdded', listener);
graph.off('nodeAdded', listener);

graph.updateEdge('one', 'two', attr => {
  return {weight: (attr.weight || 0) + 1};
});

const undirectedGraph: UndirectedGraph = new UndirectedGraph();
undirectedGraph.addNode('node', {hello: 'world'});
undirectedGraph.getNodeAttribute('node', 'hello');

undirectedGraph.clear();

const weighted = new Graph<{weight: number}>();

weighted.addNode('test', {weight: 34});
weighted.reduceNodes((x, node, attr) => x + attr.weight, 0);

weighted.on('edgeAttributesUpdated', payload => {
  console.log(payload.key.toUpperCase());

  if (payload.type === 'merge') {
    console.log(payload.data);
  }
});

weighted.emit('nodeAdded', {key: 'fake', attributes: {weight: 24}});
