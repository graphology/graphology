import Graph from 'graphology-types';

type CommunityMapping = {[key: string]: string | number};

type ModularityOptions = {
  attributes?: {
    community?: string,
    weight?: string
  },
  communities?: CommunityMapping,
  weighted?: boolean
};

interface IModularity {
  (graph: Graph, options?: ModularityOptions): number;

  dense(graph: Graph, options?: ModularityOptions): number;
  sparse(graph: Graph, options?: ModularityOptions): number;

  undirectedDelta(
    M: number,
    communityTotalWeight: number,
    nodeDegree: number,
    nodeCommunityDegree: number
  ): number;

  directedDelta(
    M: number,
    communityTotalInWeight: number,
    communityTotalOutWeight: number,
    nodeInDegree: number,
    nodeOutDegree: number,
    nodeCommunityDegree: number
  ): number;
}

declare const modularity: IModularity;

export default modularity;
