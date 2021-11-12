import Graph, {Attributes, GraphConstructor} from 'graphology-types';
import {GexfParserOptions, GexfWriterOptions} from '../common/types';

export function parse<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  GraphAttributes extends Attributes = Attributes
>(
  Graph: GraphConstructor<NodeAttributes, EdgeAttributes, GraphAttributes>,
  source: string | Document,
  options?: GexfParserOptions
): Graph<NodeAttributes, EdgeAttributes, GraphAttributes>;

export function write<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  FormattedNodeAttributes extends Attributes = Attributes,
  FormattedEdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  options?: GexfWriterOptions<
    NodeAttributes,
    EdgeAttributes,
    FormattedNodeAttributes,
    FormattedEdgeAttributes
  >
): string;
