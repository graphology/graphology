import SparseMap from 'mnemonist/sparse-map';
import {UndirectedLouvainIndex} from 'graphology-indices/neighborhood/louvain';

type TypedArray = Uint8Array | Uint16Array | Uint32Array | Float64Array;

type UndirectedLeidenAddendaOptions = {
  rng?: () => number;
};

export class UndirectedLeidenAddenda {
  B: number;
  C: number;
  resolution: number;
  randomness: number;
  index: UndirectedLouvainIndex;
  rng: () => number;

  communitiesOffsets: TypedArray;
  nodesSortedByCommunities: TypedArray;
  communitiesBounds: TypedArray;
  communityWeights: TypedArray;
  nonSingleton: TypedArray;
  externalEdgeWeightPerCommunity: TypedArray;
  belongings: TypedArray;
  neighboringCommunities: SparseMap<number>;
  cumulativeIncrement: Float64Array;
  degrees: TypedArray;

  constructor(index: UndirectedLeidenAddenda, options?: UndirectedLeidenAddendaOptions);
  groupByCommunities(): void;
  mergeNodesSubset(): void;
  refinePartition(): void;
}
