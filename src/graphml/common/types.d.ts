import {Attributes} from 'graphology-types';

export type GraphmlParserOptions = {
  addMissingNodes?: boolean;
};

export type NodeFormatter<
  NodeAttributes extends Attributes = Attributes,
  FormattedAttributes extends Attributes = Attributes
> = (key: string, attributes: NodeAttributes) => FormattedAttributes;

export type EdgeFormatter<
  EdgeAttributes extends Attributes = Attributes,
  FormattedAttributes extends Attributes = Attributes
> = (key: string, attributes: EdgeAttributes) => FormattedAttributes;

export type GraphmlWriterOptions<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes,
  FormattedNodeAttributes extends Attributes = Attributes,
  FormattedEdgeAttributes extends Attributes = Attributes
> = {
  encoding?: string;
  pretty?: boolean;
  formatNode?: NodeFormatter<NodeAttributes, FormattedNodeAttributes>;
  formatEdge?: EdgeFormatter<EdgeAttributes, FormattedEdgeAttributes>;
};
