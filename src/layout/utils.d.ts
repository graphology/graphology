import Graph from 'graphology-types';

export type XYPosition = {x: number; y: number};
export type Position = {[dimension: string]: number};
export type LayoutMapping<P> = {[node: string]: P};

type FlatArrayLayout =
  | Array<number>
  | Uint8ClampedArray
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | Int8Array
  | Int16Array
  | Int32Array
  | Float32Array
  | Float64Array;

export type CollectLayoutOptions = {
  dimensions?: Array<string>;
  exhaustive?: boolean;
};

export function collectLayout(graph: Graph): LayoutMapping<XYPosition>;
export function collectLayout(
  graph: Graph,
  options: CollectLayoutOptions
): LayoutMapping<Position>;

export type CollectLayoutAsFlatArrayOptions = {
  dimensions?: Array<string>;
  type?: new () => FlatArrayLayout;
};

export function collectLayoutAsFlatArray(graph: Graph): Float64Array;
export function collectLayoutAsFlatArray(
  graph: Graph,
  options: CollectLayoutAsFlatArrayOptions
): FlatArrayLayout;

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

export function assignLayoutAsFlatArray(
  graph: Graph,
  layout: FlatArrayLayout,
  options?: AssignLayoutOptions
): void;
