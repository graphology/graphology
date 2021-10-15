import Graph from 'graphology';

type RNGFunction = () => number;

type PointerArray = Uint8Array | Uint16Array | Uint32Array | Float64Array;

export type LouvainOptions = {
  attributes?: {
    community?: string;
    weight?: string;
  };
  fastLocalMoves?: boolean;
  randomWalk?: boolean;
  resolution?: number;
  rng?: RNGFunction;
  weighted?: boolean;
};

type LouvainMapping = {[key: string]: number};

export type DetailedLouvainOutput = {
  communities: LouvainMapping;
  count: number;
  deltaComputations: number;
  dendrogram: Array<PointerArray>;
  modularity: number;
  moves: Array<Array<number>> | Array<number>;
  nodesVisited: number;
  resolution: number;
};

declare const louvain: {
  (graph: Graph, options?: LouvainOptions): LouvainMapping;
  assign(graph: Graph, options?: LouvainOptions): void;
  detailed(graph: Graph, options?: LouvainOptions): DetailedLouvainOutput;
};

export default louvain;
