import Graph, {Attributes, NodeIterationCallback, NodeIterationCallbackWithGeneration} from 'graphology-types';

export function forEachNodeInTopologicalOrder<
  NodeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes>,
  callback: NodeIterationCallback<NodeAttributes>
): void;
export function topologicalSort(graph: Graph): Array<string>;
export function forEachTopologicalGeneration<
  NodeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes>,
  callback: Array<string>
): void;
export function topologicalGenerations(graph: Graph): Array<string>;
