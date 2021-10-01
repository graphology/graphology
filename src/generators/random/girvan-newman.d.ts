import Graph, {Attributes, GraphConstructor} from 'graphology-types';

export type GirvanNewmanGeneratorOptions = {
  zOut: number,
  rng?: () => number
};

export default function girvanNewman<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  Graph: GraphConstructor<NodeAttributes, EdgeAttributes, GraphAttributes>,
  options: GirvanNewmanGeneratorOptions
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;
