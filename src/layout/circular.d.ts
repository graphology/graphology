import Graph from 'graphology-types';

export type CircularLayoutOptions = {
  dimensions?: string[];
  center?: number;
  scale?: number;
};

type LayoutMapping = {[node: string]: {[dimension: string]: number}};

interface ICircularLayout {
  (graph: Graph, options?: CircularLayoutOptions): LayoutMapping;
  assign(graph: Graph, options?: CircularLayoutOptions): void;
}

declare const circular: ICircularLayout;

export default circular;
