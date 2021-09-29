import Graph, {NodeKey, Attributes} from 'graphology-types';

export function copyNode<NodeAttributes extends Attributes = Attributes>(
  graph: Graph,
  key: NodeKey,
  attributes?: NodeAttributes
): void;
