import Graph, {NodeKey, Attributes} from 'graphology-types';

type SubGraphFilter<NodeAttributes extends Attributes = Attributes> = (key: NodeKey, attributes: NodeAttributes) => boolean;
type SubGraphNodes<NodeAttributes extends Attributes = Attributes> = Array<NodeKey> | Set<NodeKey> | SubGraphFilter<NodeAttributes>;

export default function subgraph<
  NodeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes>,
  nodes: SubGraphNodes<NodeAttributes>
): Graph<NodeAttributes>;
