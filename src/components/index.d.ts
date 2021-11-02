import Graph, {Attributes} from 'graphology-types';

export function connectedComponents(graph: Graph): Array<Array<string>>;
export function largestConnectedComponent(graph: Graph): Array<string>;
export function stronglyConnectedComponents(graph: Graph): Array<Array<string>>;
export function largestConnectedComponentSubgraph<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes>
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;
