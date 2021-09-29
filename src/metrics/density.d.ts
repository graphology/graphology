import Graph from 'graphology-types';

interface IDensity {
  (graph: Graph): number;
  (order: number, size: number): number;

  directedDensity(graph: Graph): number;
  directedDensity(order: number, size: number): number;

  undirectedDensity(graph: Graph): number;
  undirectedDensity(order: number, size: number): number;

  mixedDensity(graph: Graph): number;
  mixedDensity(order: number, size: number): number;

  multiDirectedDensity(graph: Graph): number;
  multiDirectedDensity(order: number, size: number): number;

  multiUndirectedDensity(graph: Graph): number;
  multiUndirectedDensity(order: number, size: number): number;

  multiMixedDensity(graph: Graph): number;
  multiMixedDensity(order: number, size: number): number;
}

declare const density: IDensity;

export default density;
