import Graph, {Attributes, GraphConstructor} from 'graphology-types';
import {GraphmlParserOptions, GraphmlWriterOptions} from '../common/types';

export function parse<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  Graph: GraphConstructor<NodeAttributes, EdgeAttributes, GraphAttributes>,
  source: string | Document,
  options?: GraphmlParserOptions
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;

export function write<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  FormattedNodeAttributes extends Attributes = Attributes,
  FormattedEdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  options?: GraphmlWriterOptions<
    NodeAttributes,
    EdgeAttributes,
    FormattedNodeAttributes,
    FormattedEdgeAttributes
  >
): string;
