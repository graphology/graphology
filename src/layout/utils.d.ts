import Graph from 'graphology-types';

export type XYPosition = {x: number; y: number};
export type Position = {[dimension: string]: number};
export type LayoutMapping<P> = {[node: string]: P};

export type CollectLayoutOptions = {
  dimensions?: Array<string>;
  exhaustive?: boolean;
};

export function collectLayout(graph: Graph): LayoutMapping<XYPosition>;

export function collectLayout(
  graph: Graph,
  options: CollectLayoutOptions
): LayoutMapping<Position>;

export type AssignLayoutOptions = {
  dimensions?: Array<string>;
};

export function assignLayout(
  graph: Graph,
  layout: LayoutMapping<XYPosition>
): void;

export function assignLayout(
  graph: Graph,
  layout: LayoutMapping<Position>,
  options: AssignLayoutOptions
): void;
