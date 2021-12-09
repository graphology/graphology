import Graph, {GraphType} from 'graphology-types';

export function abstractDensity(
  type: GraphType,
  multi: boolean,
  graph: Graph
): number;
export function abstractDensity(
  type: GraphType,
  multi: boolean,
  order: number,
  size: number
): number;

export function density(graph: Graph): number;
export function density(order: number, size: number): number;

export function directedDensity(graph: Graph): number;
export function directedDensity(order: number, size: number): number;

export function undirectedDensity(graph: Graph): number;
export function undirectedDensity(order: number, size: number): number;

export function mixedDensity(graph: Graph): number;
export function mixedDensity(order: number, size: number): number;

export function multiDirectedDensity(graph: Graph): number;
export function multiDirectedDensity(order: number, size: number): number;

export function multiUndirectedDensity(graph: Graph): number;
export function multiUndirectedDensity(order: number, size: number): number;

export function multiMixedDensity(graph: Graph): number;
export function multiMixedDensity(order: number, size: number): number;
