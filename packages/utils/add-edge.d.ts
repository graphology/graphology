import Graph, {Attributes, NodeKey, EdgeKey} from 'graphology-types';

export function addEdge<EdgeAttributes extends Attributes = Attributes>(
  graph: Graph,
  undirected: boolean,
  key: EdgeKey | null | undefined,
  source: NodeKey,
  target: NodeKey,
  attributes?: EdgeAttributes
): void;

export function copyEdge<EdgeAttributes extends Attributes = Attributes>(
  graph: Graph,
  undirected: boolean,
  key: EdgeKey | null | undefined,
  source: NodeKey,
  target: NodeKey,
  attributes?: EdgeAttributes
): void;

export function mergeEdge<EdgeAttributes extends Attributes = Attributes>(
  graph: Graph,
  undirected: boolean,
  key: EdgeKey | null | undefined,
  source: NodeKey,
  target: NodeKey,
  attributes?: EdgeAttributes
): void;

export function updateEdge<EdgeAttributes extends Attributes = Attributes>(
  graph: Graph,
  undirected: boolean,
  key: EdgeKey | null | undefined,
  source: NodeKey,
  target: NodeKey,
  attributes?: EdgeAttributes
): void;
