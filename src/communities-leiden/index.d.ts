import Graph from 'graphology';

type RNGFunction = () => number;

type PointerArray = Uint8Array | Uint16Array | Uint32Array | Float64Array;

export type LeidenOptions = {
  attributes?: {
    community?: string,
    weight?: string
  },
  randomWalk?: boolean,
  resolution?: number,
  rng?: RNGFunction,
  weighted?: boolean
};

type LeidenMapping = {[key: string]: number};

export type DetailedLeidenOutput = {
  communities: LeidenMapping,
  count: number,
  deltaComputations: number,
  dendrogram: Array<PointerArray>;
  modularity: number,
  moves: Array<Array<number>> | Array<number>,
  nodesVisited: number,
  resolution: number
};

declare const leiden: {
  (graph: Graph, options?: LeidenOptions): LeidenMapping;
  assign(graph: Graph, options?: LeidenOptions): void;
  detailed(graph: Graph, options?: LeidenOptions): DetailedLeidenOutput;
};

export default leiden;
