import Graph from 'graphology-types';

type RNGFunction = () => number;

export type CirclePackLayoutOptions = {
  attributes?: {
    x: string;
    y: string;
  };
  center?: number;
  hierarchyAttributes?: string[];
  rng?: RNGFunction;
  scale?: number;
};

type LayoutMapping = {[key: string]: {x: number; y: number}};

interface ICirclePackLayout {
  (graph: Graph, options?: CirclePackLayoutOptions): LayoutMapping;
  assign(graph: Graph, options?: CirclePackLayoutOptions): void;
}

declare const circlepack: ICirclePackLayout;

export default circlepack;
