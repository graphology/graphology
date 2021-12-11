import Graph, {Attributes, NodeMapper, EdgeMapper} from 'graphology-types';

type ModularityOptions<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = {
  getNodeCommunity?:
    | keyof NodeAttributes
    | NodeMapper<string | number, NodeAttributes>;
  getEdgeWeight?:
    | keyof EdgeAttributes
    | EdgeMapper<number, NodeAttributes, EdgeAttributes>
    | null;
  resolution?: number;
};

interface IModularity {
  <
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: ModularityOptions<NodeAttributes, EdgeAttributes>
  ): number;

  dense<
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: ModularityOptions<NodeAttributes, EdgeAttributes>
  ): number;
  sparse<
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: ModularityOptions<NodeAttributes, EdgeAttributes>
  ): number;

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
