import Graph, {Attributes} from 'graphology-types';

export default function memoizedForEach<
  MemoizedValue,
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  cacher: (node: string, attributes: NodeAttributes) => MemoizedValue,
  callback: (
    source: string,
    target: string,
    sourceAttributes: NodeAttributes,
    targetAttributes: NodeAttributes,
    edge: string,
    edgeAttributes: EdgeAttributes,
    undirected: boolean,
    generatedKey: boolean
  ) => void
): void;
