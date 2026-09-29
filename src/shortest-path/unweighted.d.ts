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
  source: string,
  target: string
): ShortestPath | null;

export function singleSource(
  graph: Graph,
  source: string
): ShortestPathMapping;

export function singleSourceLength(
  graph: Graph,
  source: string
): ShortestPathLengthMapping;

export function undirectedSingleSourceLength(
  graph: Graph,
  node: string
): ShortestPathLengthMapping;

export function brandes(graph: Graph, source: string): BrandesResult;
