import Graph from 'graphology-types';

export default function renameGraphKeys(
  graph: Graph,
  nodeKeyMapping: Record<string, string>,
  edgeKeyMapping: Record<string, string>
): Graph;
