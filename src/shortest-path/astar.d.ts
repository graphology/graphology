import Graph, {Attributes} from 'graphology-types';
import {MinimalEdgeMapper} from 'graphology-utils/getters';

export function bidirectional<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  source: unknown,
  target: unknown,
  getEdgeWeight?:
    | keyof EdgeAttributes
    | MinimalEdgeMapper<number, EdgeAttributes>,
  heuristic?: (node: unknown, target) => number,
  options?: {
    cutoff?: number
  }
): BidirectionalDijstraResult;
