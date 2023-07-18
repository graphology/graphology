import Graph, {Attributes} from 'graphology-types';

export function coreNumber<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  assign: boolean,
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>,
  coreAttributes?: string
): Record<string, number>;

export function kCore<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<EdgeAttributes, NodeAttributes, GraphAttributes>,
  k?: number,
  customCore?: Record<string, number>
): Graph<EdgeAttributes, NodeAttributes, GraphAttributes>;

export function kShell<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<EdgeAttributes, NodeAttributes, GraphAttributes>,
  k?: number,
  customCore?: Record<string, number>
): Graph<EdgeAttributes, NodeAttributes, GraphAttributes>;

export function kCrust<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<EdgeAttributes, NodeAttributes, GraphAttributes>,
  k?: number,
  customCore?: Record<string, number>
): Graph<EdgeAttributes, NodeAttributes, GraphAttributes>;

export function kCorona<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<EdgeAttributes, NodeAttributes, GraphAttributes>,
  k?: number,
  customCore?: Record<string, number>
): Graph<EdgeAttributes, NodeAttributes, GraphAttributes>;

export function onionLayers<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  assign: boolean,
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>,
  onionLayerAttribute?: string
): Record<string, number>;
