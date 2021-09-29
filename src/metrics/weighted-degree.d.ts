import Graph, {NodeKey} from 'graphology-types';

type WeightedDegreeOptions = {
  attributes?: {
    weight?: string,
    weightedDegree?: string
  }
};

type WeightedDegreeMapping = {[key: string]: number};

interface IWeightedDegreeBase {
  (graph: Graph, options?: WeightedDegreeOptions): WeightedDegreeMapping;
  (graph: Graph, node: NodeKey, options?: WeightedDegreeOptions): number;

  assign(graph: Graph, options?: WeightedDegreeOptions): void;
  assign(graph: Graph, node: NodeKey, options?: WeightedDegreeOptions): void;
}

interface IWeightedDegree extends IWeightedDegreeBase {
  weightedDegree: IWeightedDegreeBase,
  weightedInDegree: IWeightedDegreeBase,
  weightedOutDegree: IWeightedDegreeBase
}

declare const weightedDegree: IWeightedDegree;

export default weightedDegree;
