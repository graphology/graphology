import Graph, {Attributes} from 'graphology-types';

interface ICoreNumber {
  (assign: boolean, graph: Graph, coreAttributes?: string): Record<
    string,
    number
  >;
  assign(assign: boolean, graph: Graph, coreAttributes?: string): void;
}

declare const coreNumber: ICoreNumber;
export {coreNumber};

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

interface IOnionLayers {
  (assign: boolean, graph: Graph, nodeOnionLayerAttribute?: string): Record<
    string,
    number
  >;
  assign(assign: boolean, graph: Graph, nodeOnionLayerAttribute?: string): void;
}

declare const onionLayers: IOnionLayers;
export {onionLayers};
