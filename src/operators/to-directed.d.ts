import Graph, {Attributes} from 'graphology-types';

type MergeEdgeFunction = (currentEdgeAttributes: Attributes, conflictingEdgeAttributes: Attributes) => Attributes;

type ToDirectedOptions = {
  mergeEdge: MergeEdgeFunction
};

export default function toDirected(graph: Graph, mergeEdge?: MergeEdgeFunction): Graph;
export default function toDirected(graph: Graph, options?: ToDirectedOptions): Graph;
