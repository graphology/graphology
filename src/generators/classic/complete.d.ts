import Graph, {Attributes, GraphConstructor} from 'graphology-types';

export default function complete<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  Graph: GraphConstructor<NodeAttributes, EdgeAttributes, GraphAttributes>,
  order: number
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;
