import Graph, {Attributes, EdgeMapper} from 'graphology-types';

type RNGFunction = () => number;

type PointerArray = Uint8Array | Uint16Array | Uint32Array | Float64Array;

export type LouvainOptions<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = {
  nodeCommunityAttribute?: string;
  getEdgeWeight?:
    | keyof EdgeAttributes
    | EdgeMapper<number, NodeAttributes, EdgeAttributes>
    | null;
  fastLocalMoves?: boolean;
  randomWalk?: boolean;
  resolution?: number;
  rng?: RNGFunction;
};

type LouvainMapping = {[node: string]: number};

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

interface ILouvain<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> {
  (
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: LouvainOptions<NodeAttributes, EdgeAttributes>
  ): LouvainMapping;
  assign(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: LouvainOptions<NodeAttributes, EdgeAttributes>
  ): void;
  detailed(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: LouvainOptions<NodeAttributes, EdgeAttributes>
  ): DetailedLouvainOutput;
}

declare const louvain: ILouvain;

export default louvain;
