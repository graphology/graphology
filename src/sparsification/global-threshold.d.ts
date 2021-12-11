import Graph, {Attributes, EdgeMapper} from 'graphology-types';

export type GlobalThresholdOptions<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = {
  edgeRedundantAttribute?: string;
  getEdgeWeight?:
    | keyof EdgeAttributes
    | EdgeMapper<number, NodeAttributes, EdgeAttributes>;
};

interface IGlobalThreshold {
  <
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    threshold: number,
    options?: GlobalThresholdOptions<NodeAttributes, EdgeAttributes>
  ): Array<string>;

  assign<
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    threshold: number,
    options?: GlobalThresholdOptions<NodeAttributes, EdgeAttributes>
  ): void;

  prune<
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    threshold: number,
    options?: GlobalThresholdOptions<NodeAttributes, EdgeAttributes>
  ): void;
}

declare const globalThreshold: IGlobalThreshold;

export default globalThreshold;
