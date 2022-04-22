import Graph from 'graphology-types';

export function allSimplePaths(
  graph: Graph,
  source: unknown,
  target: unknown,
  maxDepth?: number
): Array<Array<string>>;
export function allSimpleEdgePaths(
  graph: Graph,
  source: unknown,
  target: unknown,
  maxDepth?: number
): Array<Array<string>>;
export function allSimpleEdgeGroupPaths(
  graph: Graph,
  source: unknown,
  target: unknown,
  maxDepth?: number
): Array<Array<Array<string>>>;
