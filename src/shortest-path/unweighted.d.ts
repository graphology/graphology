import Graph from 'graphology-types';

type ShortestPath = Array<string>;
type ShortestPathMapping = {[key: string]: ShortestPath};
type ShortestPathLengthMapping = {[key: string]: number};

type BrandesResult = [
  Array<string>,
  {[key: string]: Array<string>},
  {[key: string]: number}
];

interface IUnweightedShortestPath {
  (graph: Graph, source: unknown): ShortestPathMapping;
  (graph: Graph, source: unknown, target: unknown): ShortestPath | null;

  bidirectional(
    graph: Graph,
    source: unknown,
    target: unknown
  ): ShortestPath | null;
  singleSource(graph: Graph, source: unknown): ShortestPathMapping;
  singleSourceLength(graph: Graph, source: unknown): ShortestPathLengthMapping;
  brandes(graph: Graph, source: unknown): BrandesResult;
}

declare const shortestPath: IUnweightedShortestPath;

export default shortestPath;
