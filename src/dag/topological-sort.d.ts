import Graph, {Attributes} from 'graphology-types';

type NodeIterationWithGenerationCallback<
  NodeAttributes extends Attributes = Attributes
> = (node: string, attributes: NodeAttributes, generation: number) => void;

export function forEachNodeInTopologicalOrder<
  NodeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes>,
  callback: NodeIterationWithGenerationCallback<NodeAttributes>,
  root?: string
): void;
export function topologicalSort(graph: Graph): Array<string>;
export function forEachTopologicalGeneration<
  NodeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes>,
  callback: (generation: Array<string>) => void,
  root?: string
): void;
export function topologicalGenerations(
  graph: Graph,
  root?: string
): Array<Array<string>>;
