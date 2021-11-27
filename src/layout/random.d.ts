import Graph from 'graphology-types';

type RNGFunction = () => number;

export type RandomLayoutOptions = {
  dimensions?: string[];
  center?: number;
  rng?: RNGFunction;
  scale?: number;
};

type LayoutMapping = {[node: string]: {[dimension: string]: number}};

interface IRandomLayout {
  (graph: Graph, options?: RandomLayoutOptions): LayoutMapping;
  assign(graph: Graph, options?: RandomLayoutOptions): void;
}

declare const random: IRandomLayout;

export default random;
