import Graph, {Attributes} from 'graphology-types';
import {MinimalEdgeMapper} from 'graphology-utils/getters';
import FixedStack from 'mnemonist/fixed-stack';
import {
  NeighborhoodIndex,
  WeightedNeighborhoodIndex
} from 'graphology-indices/neighborhood';

type IndexedBrandesResult = [
  FixedStack<number>,
  Array<Array<number>>,
  Uint32Array
];

type IndexedBrandesFunction = (sourceIndex: number) => IndexedBrandesResult;

interface ICreateUnweightedIndexedBrandes {
  (graph: Graph): IndexedBrandesFunction;
  index: NeighborhoodIndex;
}

interface ICreateDijkstraIndexedBrandes<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> {
  (
    graph: Graph<NodeAttributes, EdgeAttributes>,
    getEdgeWeight?:
      | keyof EdgeAttributes
      | MinimalEdgeMapper<number, EdgeAttributes>
  ): IndexedBrandesFunction;
  index: WeightedNeighborhoodIndex;
}

declare const createUnweightedIndexedBrandes: ICreateUnweightedIndexedBrandes;
declare const createDijkstraIndexedBrandes: ICreateDijkstraIndexedBrandes;

export {createUnweightedIndexedBrandes, createDijkstraIndexedBrandes};
