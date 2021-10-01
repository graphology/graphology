import Graph from 'graphology-types';

type RNGFunction = () => number;

export type RandomLayoutOptions = {
  attributes?: {
    x: string,
    y: string
  },
  center?: number,
  rng?: RNGFunction,
  scale?: number
};

type LayoutMapping = {[key: string]: {x: number, y: number}};

interface IRandomLayout {
  (graph: Graph, options?: RandomLayoutOptions): LayoutMapping;
  assign(graph: Graph, options?: RandomLayoutOptions): void;
}

declare const random: IRandomLayout;

export default random;
