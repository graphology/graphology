import Graph, {NodeMapper} from 'graphology-types';

export default function isBipartiteBy(
  graph: Graph,
  getNodePartition: string | NodeMapper<string>
): boolean;
