import Graph, {Attributes, EdgeMapper} from 'graphology-types';

export default function weightedSize<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  getEdgeWeight?: string | EdgeMapper<NodeAttributes, EdgeAttributes>
): number;
