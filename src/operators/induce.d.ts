import Graph, {Attributes, NodeMapper} from 'graphology-types';

type MergeEdgeFunction<EdgeAttributes extends Attributes = Attributes> = (
  currentEdgeAttributes: EdgeAttributes,
  conflictingEdgeAttributes: EdgeAttributes
) => EdgeAttributes;

type MergeNodeFunction<NodeAttributes extends Attributes = Attributes> = (
  currentNodeAttributes: NodeAttributes,
  conflictingNodeAttributes: NodeAttributes
) => NodeAttributes;

type induceOptions<
  EdgeAttributes,
  NodeAttributes extends Attributes = Attributes
> = {
  mergeEdge: MergeEdgeFunction<EdgeAttributes>;
  mergeNode: MergeNodeFunction<NodeAttributes>;
};

export default function induce<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>,
  getNodePartition: string | NodeMapper<string>,
  keepSelfLoops: boolean
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;

export default function induce<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>,
  getNodePartition: string | NodeMapper<string>,
  keepSelfLoops: boolean,
  options?: induceOptions<EdgeAttributes, NodeAttributes>
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;
