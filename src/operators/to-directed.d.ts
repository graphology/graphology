import Graph, {Attributes} from 'graphology-types';

type MergeEdgeFunction<EdgeAttributes extends Attributes = Attributes> = (
  currentEdgeAttributes: EdgeAttributes,
  conflictingEdgeAttributes: EdgeAttributes
) => EdgeAttributes;

type ToDirectedOptions<EdgeAttributes extends Attributes = Attributes> = {
  mergeEdge: MergeEdgeFunction<EdgeAttributes>;
};

export default function toDirected<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>,
  mergeEdge?: MergeEdgeFunction<EdgeAttributes>
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;

export default function toDirected<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>,
  options?: ToDirectedOptions<EdgeAttributes>
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;
