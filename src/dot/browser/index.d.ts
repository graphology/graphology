import Graph, {Attributes, GraphConstructor} from 'graphology-types';
import {DotParserOptions, DotWriterOptions} from '../common/types';

export function parse<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  Graph: GraphConstructor<NodeAttributes, EdgeAttributes, GraphAttributes>,
  source: string,
  options?: DotParserOptions
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;

export function write<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  FormattedNodeAttributes extends Attributes = Attributes,
  FormattedEdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  options?: DotWriterOptions<
    NodeAttributes,
    EdgeAttributes,
    FormattedNodeAttributes,
    FormattedEdgeAttributes
  >
): string;
