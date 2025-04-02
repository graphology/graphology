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

export interface Thresholds {
  'pValue<0.5': number;
  'pValue<0.1': number;
  'pValue<0.05': number;
  'pValue<0.025': number;
  'pValue<0.01': number;
  'pValue<0.005': number;
  'pValue<0.001': number;
}

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

  thresholds: Thresholds;
}

declare const chiSquareGSquare: IChiGSquare;

export default chiSquareGSquare;
