import Graph from 'graphology-types';

export type CircularLayoutOptions = {
  attributes?: {
    x: string,
    y: string
  },
  center?: number,
  scale?: number
};

type LayoutMapping = {[key: string]: {x: number, y: number}};

interface ICircularLayout {
  (graph: Graph, options?: CircularLayoutOptions): LayoutMapping;
  assign(graph: Graph, options?: CircularLayoutOptions): void;
}

declare const circular: ICircularLayout;

export default circular;
