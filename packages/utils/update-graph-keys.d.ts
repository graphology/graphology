import Graph, {NodeKey, EdgeKey, Attributes} from 'graphology-types';

export default function updateGraphKeys<
  NodeAttributes extends Attributes = Attributes,
  EdgeAttributes extends Attributes = Attributes
>(
  graph: Graph<NodeAttributes, EdgeAttributes>,
  nodeKeyUpdater: (key: NodeKey, attributes: NodeAttributes) => NodeKey,
  edgeKeyUpdater: (
    key: EdgeKey,
    attributes: EdgeAttributes,
    source: NodeKey,
    target: NodeKey,
    sourceAttributes: NodeAttributes,
    targetAttributes: NodeAttributes,
    undirected: boolean,
    generatedKey: boolean
  ) => EdgeKey
): Graph;
