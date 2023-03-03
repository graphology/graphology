import Graph from 'graphology-types';

type ShortestPath = Array<string>;
type ShortestPathMapping = {[key: string]: ShortestPath};
type ShortestPathLengthMapping = {[key: string]: number};

type BrandesResult = [
  Array<string>,
  {[key: string]: Array<string>},
  {[key: string]: number}
];

export function bidirectional(
  graph: Graph,
  source: unknown,
  target: unknown
): ShortestPath | null;

export function singleSource(
  graph: Graph,
  source: unknown
): ShortestPathMapping;

export function singleSourceLength(
  graph: Graph,
  source: unknown
): ShortestPathLengthMapping;

export function undirectedSingleSourceLength(
  graph: Graph,
  node: unknown
): ShortestPathLengthMapping;

export function brandes(graph: Graph, source: unknown): BrandesResult;
