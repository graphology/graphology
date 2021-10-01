import Graph from 'graphology-types';

type PointerArray = Uint8Array | Uint16Array | Uint32Array | Float64Array;

export class OutboundNeighborhoodIndex {
  constructor(graph: Graph);

  graph: Graph;
  neighborhood: PointerArray;
  starts: PointerArray;
  stops: PointerArray;
  nodes: Array<string>;

  bounds(index: number): [number, number];
  project(): {[key: string]: Array<string>}
  collect<T>(results: Array<T>): {[key: string]: T}
  assign<T>(results: Array<T>): void;
}

export class WeightedOutboundNeighborhoodIndex {
  constructor(graph: Graph, weightAttribute?: string);

  graph: Graph;
  weights: Float64Array;
  neighborhood: PointerArray;
  starts: PointerArray;
  stops: PointerArray;
  nodes: Array<string>;

  bounds(index: number): [number, number];
  project(): {[key: string]: Array<string>}
  collect<T>(results: Array<T>): {[key: string]: T}
  assign<T>(results: Array<T>): void;
}
