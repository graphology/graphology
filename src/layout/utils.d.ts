import Graph, {Attributes} from 'graphology-types';

export type XYPosition = {x: number; y: number};
export type Position = {[dimension: string]: number};
export type LayoutMapping<P> = {[node: string]: P};

export type CollectLayoutOptions = {
  dimensions?: Array<string>;
  exhaustive?: boolean;
};

export function collectLayout<NodeAttributes extends Attributes = Attributes>(
  graph: Graph<NodeAttributes>
): LayoutMapping<XYPosition>;

export function collectLayout<NodeAttributes extends Attributes = Attributes>(
  graph: Graph<NodeAttributes>,
  options: CollectLayoutOptions
): LayoutMapping<Position>;
