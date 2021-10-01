import Graph, {NodeKey} from 'graphology-types';

type SingleSourceDijkstraResult = {[key: string]: string[];}
type BidirectionalDijstraResult = string[];
type BrandesResult = [
  Array<NodeKey>,
  {[key: string]: Array<NodeKey>},
  {[key: string]: number}
];


interface IDijkstra {
  bidirectional(graph: Graph, source: string, target: string, weightAttribute: string): BidirectionalDijstraResult;
  singleSource(graph: Graph, source: string, weightAttribute: string): SingleSourceDijkstraResult;
  brandes(graph: Graph, source: string, weightAttribute: string): BrandesResult;
}

declare const dijkstra: IDijkstra;
export default dijkstra;
