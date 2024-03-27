import Graph, {Attributes} from 'graphology-types';

export function coreNumber(
  assign: boolean,
  graph: Graph,
  coreAttributes?: string
): Record<string, number>;

export function kCore<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>,
  k?: number,
  customCore?: Record<string, number>
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;

export function kShell<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>,
  k?: number,
  customCore?: Record<string, number>
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;

export function kCrust<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>,
  k?: number,
  customCore?: Record<string, number>
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;

export function kCorona<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>,
  k?: number,
  customCore?: Record<string, number>
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;

export function kTruss<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>,
  k: number
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;

export function onionLayers(
  assign: boolean,
  graph: Graph,
  nodeOnionLayerAttribute?: string
): Record<string, number>;
