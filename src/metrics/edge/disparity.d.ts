import Graph, {Attributes, EdgeMapper} from 'graphology-types';

export type DisparityOptions<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = {
  edgeDisparityAttribute?: string;
  getEdgeWeight?:
    | keyof EdgeAttributes
    | EdgeMapper<number, NodeAttributes, EdgeAttributes>;
};

export type DisparityMapping = {[edge: string]: number};

interface IDisparity {
  <
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: DisparityOptions<NodeAttributes, EdgeAttributes>
  ): DisparityMapping;

  assign<
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: DisparityOptions<NodeAttributes, EdgeAttributes>
  ): void;
}

declare const disparity: IDisparity;

export default disparity;
