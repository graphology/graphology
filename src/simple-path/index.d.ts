import Graph from 'graphology-types';

export type AllSimplePathsOptions = {
  maxDepth?: number;
};

export function allSimplePaths(
  graph: Graph,
  source: string | number,
  target: string | number,
  options?: AllSimplePathsOptions
): Array<Array<string>>;
export function allSimpleEdgePaths(
  graph: Graph,
  source: string | number,
  target: string | number,
  options?: AllSimplePathsOptions
): Array<Array<string>>;
export function allSimpleEdgeGroupPaths(
  graph: Graph,
  source: string | number,
  target: string | number,
  options?: AllSimplePathsOptions
): Array<Array<Array<string>>>;
