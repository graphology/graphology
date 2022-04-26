import Graph from 'graphology-types';

export type AllSimplePathsOptions = {
  maxDepth?: number;
};

export function allSimplePaths(
  graph: Graph,
  source: unknown,
  target: unknown,
  options?: AllSimplePathsOptions
): Array<Array<string>>;
export function allSimpleEdgePaths(
  graph: Graph,
  source: unknown,
  target: unknown,
  options?: AllSimplePathsOptions
): Array<Array<string>>;
export function allSimpleEdgeGroupPaths(
  graph: Graph,
  source: unknown,
  target: unknown,
  options?: AllSimplePathsOptions
): Array<Array<Array<string>>>;
