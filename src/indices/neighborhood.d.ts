import Graph from 'graphology-types';

type PointerArray = Uint8Array | Uint16Array | Uint32Array | Float64Array;

export class OutboundNeighborhoodIndex {
  constructor(graph: Graph);

  graph: Graph;
  neighborhood: PointerArray;
  starts: PointerArray;
  nodes: Array<string>;

  bounds(index: number): [number, number];
  project(): {[key: string]: Array<string>};
  collect<T>(results: Array<T>): {[key: string]: T};
  assign<T>(name: string, results: Array<T>): void;
}

export class WeightedOutboundNeighborhoodIndex extends OutboundNeighborhoodIndex {
  constructor(graph: Graph, weightAttribute?: string);

  weights: Float64Array;
  outDegrees: Float64Array;
}
