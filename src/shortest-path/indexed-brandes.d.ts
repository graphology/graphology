import Graph from 'graphology-types';
import FixedStack from 'mnemonist/fixed-stack';
import {OutboundNeighborhoodIndex, WeightedOutboundNeighborhoodIndex} from 'graphology-indices/neighborhood/outbound';

type IndexedBrandesResult = [
  FixedStack<number>,
  Array<Array<number>>,
  Uint32Array
];

type IndexedBrandesFunction = (sourceIndex: number) => IndexedBrandesResult;

interface ICreateUnweightedIndexedBrandes {
  (graph: Graph): IndexedBrandesFunction;
  index: OutboundNeighborhoodIndex;
}

interface ICreateDijkstraIndexedBrandes {
  (graph: Graph, weightAttribute?: string): IndexedBrandesFunction;
  index: WeightedOutboundNeighborhoodIndex;
}

declare const createUnweightedIndexedBrandes: ICreateUnweightedIndexedBrandes;
declare const createDijkstraIndexedBrandes: ICreateDijkstraIndexedBrandes;

export {
  createUnweightedIndexedBrandes,
  createDijkstraIndexedBrandes
};
