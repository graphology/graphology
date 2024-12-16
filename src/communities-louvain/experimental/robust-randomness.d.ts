import Graph, {Attributes, EdgeMapper} from 'graphology-types';

type RNGFunction = () => number;

type PointerArray = Uint8Array | Uint16Array | Uint32Array | Float64Array;

export type RobustRandomnessLouvainOptions<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = {
  nodeCommunityAttribute?: string;
  getEdgeWeight?:
    | keyof EdgeAttributes
    | EdgeMapper<number, NodeAttributes, EdgeAttributes>
    | null;
  resolution?: number;
  rng?: RNGFunction;
};

type RobustRandomnessLouvainMapping = {[node: string]: number};

export type DetailedRobustRandomnessLouvainOutput = {
  communities: RobustRandomnessLouvainMapping;
  count: number;
  deltaComputations: number;
  dendrogram: Array<PointerArray>;
  modularity: number;
  moves: Array<Array<number>> | Array<number>;
  nodesVisited: number;
  resolution: number;
};

interface IRobustRandomnessLouvain<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> {
  (
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: RobustRandomnessLouvainOptions<NodeAttributes, EdgeAttributes>
  ): RobustRandomnessLouvainMapping;
  assign(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: RobustRandomnessLouvainOptions<NodeAttributes, EdgeAttributes>
  ): void;
  detailed(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: RobustRandomnessLouvainOptions<NodeAttributes, EdgeAttributes>
  ): DetailedRobustRandomnessLouvainOutput;
}

declare const robustRandomnessLouvain: IRobustRandomnessLouvain;

export default robustRandomnessLouvain;
