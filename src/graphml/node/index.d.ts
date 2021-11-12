import Graph, {Attributes, GraphConstructor} from 'graphology-types';
import {GraphmlParserOptions} from '../common/types';

export function parse<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  Graph: GraphConstructor<NodeAttributes, EdgeAttributes, GraphAttributes>,
  source: string | Document,
  options?: GraphmlParserOptions
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;
