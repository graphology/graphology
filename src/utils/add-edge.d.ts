import Graph, {Attributes} from 'graphology-types';

export function addEdge<EdgeAttributes extends Attributes = Attributes>(
  graph: Graph,
  undirected: boolean,
  key: unknown,
  source: unknown,
  target: unknown,
  attributes?: EdgeAttributes
): void;

export function copyEdge<EdgeAttributes extends Attributes = Attributes>(
  graph: Graph,
  undirected: boolean,
  key: unknown,
  source: unknown,
  target: unknown,
  attributes?: EdgeAttributes
): void;

export function mergeEdge<EdgeAttributes extends Attributes = Attributes>(
  graph: Graph,
  undirected: boolean,
  key: unknown,
  source: unknown,
  target: unknown,
  attributes?: EdgeAttributes
): void;

export function updateEdge<EdgeAttributes extends Attributes = Attributes>(
  graph: Graph,
  undirected: boolean,
  key: unknown,
  source: unknown,
  target: unknown,
  attributes?: EdgeAttributes
): void;
