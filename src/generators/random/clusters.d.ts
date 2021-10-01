import Graph, {Attributes, GraphConstructor} from 'graphology-types';

export type ClustersGeneratorOptions = {
  clusterDensity?: number,
  order: number,
  size: number,
  clusters: number,
  rng?: () => number
};

export default function clusters<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  Graph: GraphConstructor<NodeAttributes, EdgeAttributes, GraphAttributes>,
  options: ClustersGeneratorOptions
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;
