import Graph, {NodeKey, EdgeKey} from 'graphology-types';

export default function renameGraphKeys(
  graph: Graph,
  nodeKeyMapping: Record<NodeKey, NodeKey> = {},
  edgeKeyMapping: Record<EdgeKey, EdgeKey> = {}
): Graph;
