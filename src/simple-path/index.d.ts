import Graph, {NodeKey, EdgeKey} from 'graphology-types';

export function allSimplePaths(graph: Graph, source: NodeKey, target: NodeKey): Array<Array<NodeKey>>;
export function allSimpleEdgePaths(graph: Graph, source: NodeKey, target: NodeKey): Array<Array<EdgeKey>>;
export function allSimpleEdgeGroupPaths(graph: Graph, source: NodeKey, target: NodeKey): Array<Array<Array<EdgeKey>>>;
