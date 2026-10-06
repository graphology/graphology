import Graph, {Attributes, EdgeMergeResult} from 'graphology-types';

export function addEdge<EdgeAttributes extends Attributes = Attributes>(
  graph: Graph,
  undirected: boolean,
  key: string | number,
  source: string | number,
  target: string | number,
  attributes?: EdgeAttributes
): string;

export function copyEdge<EdgeAttributes extends Attributes = Attributes>(
  graph: Graph,
  undirected: boolean,
  key: string | number,
  source: string | number,
  target: string | number,
  attributes?: EdgeAttributes
): string;

export function mergeEdge<EdgeAttributes extends Attributes = Attributes>(
  graph: Graph,
  undirected: boolean,
  key: string | number,
  source: string | number,
  target: string | number,
  attributes?: EdgeAttributes
): EdgeMergeResult;

export function updateEdge<EdgeAttributes extends Attributes = Attributes>(
  graph: Graph,
  undirected: boolean,
  key: string | number,
  source: string | number,
  target: string | number,
  updater?: (attributes: EdgeAttributes | {}) => EdgeAttributes
): EdgeMergeResult;
