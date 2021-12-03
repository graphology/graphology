import Graph, {Attributes, NodeMapper} from 'graphology-types';

type MergeEdgeFunction<EdgeAttributes extends Attributes = Attributes> = (
  currentEdgeAttributes: EdgeAttributes,
  conflictingEdgeAttributes: EdgeAttributes
) => EdgeAttributes;

type MergeNodeFunction<NodeAttributes extends Attributes = Attributes> = (
  currentNodeAttributes: NodeAttributes,
  conflictingNodeAttributes: NodeAttributes
) => NodeAttributes;

type InduceOptions<
  EdgeAttributes,
  NodeAttributes extends Attributes = Attributes
> = {
  mergeEdge: MergeEdgeFunction<EdgeAttributes>;
  mergeNode: MergeNodeFunction<NodeAttributes>;
  createSelfLoops: boolean;
};

export default function induce<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>,
  getNodePartition: string | NodeMapper<string>
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;

export default function induce<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>,
  getNodePartition: string | NodeMapper<string>,
  options?: InduceOptions<EdgeAttributes, NodeAttributes>
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;
