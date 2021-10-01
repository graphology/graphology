import Graph, {NodeKey} from 'graphology-types';

export default class SortedComponentsIndex {
  orders: Uint32Array;
  offsets: Uint32Array;
  nodes: Array<NodeKey>;
  count: number;

  constructor(graph: Graph);
}
