import Graph, {Attributes, EdgeMapper} from 'graphology-types';

type EdgeWeightGetter<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = keyof EdgeAttributes | EdgeMapper<number, NodeAttributes, EdgeAttributes>;

export function weightedDegree<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  node: unknown,
  getEdgeWeight?: EdgeWeightGetter<NodeAttributes, EdgeAttributes>
): number;

export function weightedInDegree<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  node: unknown,
  getEdgeWeight?: EdgeWeightGetter<NodeAttributes, EdgeAttributes>
): number;

export function weightedOutDegree<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  node: unknown,
  getEdgeWeight?: EdgeWeightGetter<NodeAttributes, EdgeAttributes>
): number;

export function weightedInboundDegree<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  node: unknown,
  getEdgeWeight?: EdgeWeightGetter<NodeAttributes, EdgeAttributes>
): number;

export function weightedOutboundDegree<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  node: unknown,
  getEdgeWeight?: EdgeWeightGetter<NodeAttributes, EdgeAttributes>
): number;

export function weightedUndirectedDegree<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  node: unknown,
  getEdgeWeight?: EdgeWeightGetter<NodeAttributes, EdgeAttributes>
): number;

export function weightedDirectedDegree<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  node: unknown,
  getEdgeWeight?: EdgeWeightGetter<NodeAttributes, EdgeAttributes>
): number;
