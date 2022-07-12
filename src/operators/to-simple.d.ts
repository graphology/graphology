import Graph, {Attributes} from 'graphology-types';

type MergeEdgeFunction<EdgeAttributes extends Attributes = Attributes> = (
  currentEdgeAttributes: EdgeAttributes,
  conflictingEdgeAttributes: EdgeAttributes
) => EdgeAttributes;

type ToSimpleOptions<EdgeAttributes extends Attributes = Attributes> = {
  mergeEdge: MergeEdgeFunction<EdgeAttributes>;
};

export default function toSimple<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>,
  mergeEdge?: MergeEdgeFunction<EdgeAttributes>
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;

export default function toSimple<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>,
  options?: ToSimpleOptions<EdgeAttributes>
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;
