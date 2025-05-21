import Graph, {Attributes, EdgeMapper} from 'graphology-types';

export type EdgeWeightOption<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
> = keyof EdgeAttributes | EdgeMapper<number, NodeAttributes, EdgeAttributes>;

export type ChiGSquareMapping = {
  [edge: string]: number | undefined;
};

export interface Thresholds {
  0.5: number;
  0.1: number;
  0.05: number;
  0.025: number;
  0.01: number;
  0.005: number;
  0.001: number;
}

interface IChiGSquare {
  <
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    weight?: EdgeWeightOption<NodeAttributes, EdgeAttributes>
  ): ChiGSquareMapping;

  assign<
    NodeAttributes extends Attributes = Attributes,
    EdgeAttributes extends Attributes = Attributes
  >(
    graph: Graph<NodeAttributes, EdgeAttributes>,
    weight?: EdgeWeightOption<NodeAttributes, EdgeAttributes>
  ): void;

  thresholds: Thresholds;
}

declare const chiSquare: IChiGSquare;
declare const gSquare: IChiGSquare;

export {chiSquare, gSquare};
