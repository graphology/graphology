import Graph, {NotFoundGraphError} from 'graphology';
import {Attributes} from 'graphology-types';

export default function bypassNode<NodeAttributes extends Attributes = Attributes>(
  graph: Graph<NodeAttributes>,
  node: string
): void;
