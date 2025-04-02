import Graph, {Attributes, EdgeMapper} from 'graphology-types';

export type ChiGSquareOptions<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = {
  getEdgeWeight?:
    | keyof EdgeAttributes
    | EdgeMapper<number, NodeAttributes, EdgeAttributes>;
};

export type ChiGSquareMapping = {
  [edge: string]: {chiSquare: number | undefined; GSquare: number | undefined};
};

interface IChiGSquare {
  <
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: ChiGSquareOptions<NodeAttributes, EdgeAttributes>
  ): ChiGSquareMapping;

  assign<
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    options?: ChiGSquareOptions<NodeAttributes, EdgeAttributes>
  ): void;
}

declare const chiSquareGSquare: IChiGSquare;

export default chiSquareGSquare;
