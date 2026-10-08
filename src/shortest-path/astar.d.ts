import Graph, {Attributes} from 'graphology-types';
import {MinimalEdgeMapper} from 'graphology-utils/getters';

type BidirectionalAstarResult = string[];

export function bidirectional<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  source: string | number,
  target: string | number,
  getEdgeWeight?:
    | keyof EdgeAttributes
    | MinimalEdgeMapper<number, EdgeAttributes>,
  heuristic?: (node: string, target: string) => number,
  options?: {
    cutoff?: number;
  }
): BidirectionalAstarResult;
