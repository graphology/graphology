import Graph, {Attributes, EdgeMapper} from 'graphology-types';

type HITSOptions<
  NodeAttributes extends Attributes,
  EdgeAttributes extends Attributes
> = {
  nodeAuthorityAttribute?: string;
  nodeHubAttribute?: string;
  getEdgeWeight?:
    | keyof EdgeAttributes
    | EdgeMapper<number, NodeAttributes, EdgeAttributes>
    | null;
  maxIterations?: number;
  normalize?: boolean;
  tolerance?: number;
};

type HITSResult = {
  authorities: {[node: string]: number};
  hubs: {[node: string]: number};
};

interface HITS {
  <
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: HITSOptions<NodeAttributes, EdgeAttributes>
  ): HITSResult;
  assign<
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph,
    options?: HITSOptions<NodeAttributes, EdgeAttributes>
  ): void;
}

declare const hits: HITS;

export default hits;
