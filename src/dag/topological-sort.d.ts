import Graph, {Attributes, NodeIterationCallback, NodeIterationCallbackWithGenerations} from 'graphology-types';

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
  callback: NodeIterationCallbackWithGenerations<NodeAttributes>
): void;
export function topologicalGenerations(graph: Graph): string[];
