import Graph, {Attributes, NodeIterationCallback} from 'graphology-types';

export function forEachNodeInTopologicalOrder<
  NodeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes>,
  callback: NodeIterationCallback<NodeAttributes>
): void;
export function topologicalSort(graph: Graph): Array<string>;
