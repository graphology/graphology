import Graph, {Attributes, GraphConstructor} from 'graphology-types';

export default function ladder<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  Graph: GraphConstructor<NodeAttributes, EdgeAttributes, GraphAttributes>,
  length: number
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;
