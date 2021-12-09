import Graph from 'graphology-types';

export type Extent = [number, number];
export type ExtentMapping = {[key: string]: Extent};

interface IExtent {
  (graph: Graph, attribute: string): Extent;
  (graph: Graph, attributes: Array<string>): ExtentMapping;

  nodeExtent(graph: Graph, attribute: string): Extent;
  nodeExtent(graph: Graph, attributes: Array<string>): ExtentMapping;

  edgeExtent(graph: Graph, attribute: string): Extent;
  edgeExtent(graph: Graph, attributes: Array<string>): ExtentMapping;
}

declare const extent: IExtent;

export default extent;
