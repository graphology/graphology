import Graph, {Attributes, GraphConstructor} from 'graphology-types';

export default function connectedCaveman<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  Graph: GraphConstructor<NodeAttributes, EdgeAttributes, GraphAttributes>,
  l: number,
  k: number
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;
