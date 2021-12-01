import Graph, {Attributes, EdgePredicate} from 'graphology-types';

export function forEachConnectedComponent(
  graph: Graph,
  callback: (component: Array<string>) => void
): void;
export function forEachConnectedComponentOrder(
  graph: Graph,
  callback: (componentOrder: number) => void
): void;
export function forEachConnectedComponentOrder<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph,
  edgeFilter: EdgePredicate<NodeAttributes, EdgeAttributes>,
  callback: (componentOrder: number) => void
): void;
export function countConnectedComponents(graph: Graph): number;
export function connectedComponents(graph: Graph): Array<Array<string>>;
export function largestConnectedComponent(graph: Graph): Array<string>;
export function stronglyConnectedComponents(graph: Graph): Array<Array<string>>;
export function largestConnectedComponentSubgraph<G extends Graph>(graph: G): G;
export function cropToLargestConnectedComponent(graph: Graph): void;
