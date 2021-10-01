import Graph, {Attributes, GraphConstructor} from 'graphology-types';

export type ErdosRenyiGeneratorOptions = {
  order: number,
  probability?: number,
  approximateSize?: number,
  rng?: () => number
};

declare const erdosRenyi: {
  <NodeAttributes extends Attributes = Attributes, EdgeAttributes extends Attributes = Attributes, GraphAttributes extends Attributes = Attributes>(
    Graph: GraphConstructor<NodeAttributes, EdgeAttributes, GraphAttributes>,
    options: ErdosRenyiGeneratorOptions
  ): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;

  sparse<NodeAttributes extends Attributes = Attributes, EdgeAttributes extends Attributes = Attributes, GraphAttributes extends Attributes = Attributes>(
    Graph: GraphConstructor<NodeAttributes, EdgeAttributes, GraphAttributes>,
    options: ErdosRenyiGeneratorOptions
  ): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;
};

export default erdosRenyi;
