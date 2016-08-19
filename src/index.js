/**
 * Graphology Reference Implementation Endoint
 * ============================================
 *
 * Importing the Graph object & deriving alternative constructors.
 */
import {assign} from './utils';
import Graph from './graph';
import * as errors from './errors';

export default Graph;
export {errors};

/**
 * Alternative constructors.
 */
class DirectedGraph extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({type: 'directed'}, options)
    );
  }
}
class UndirectedGraph extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({type: 'undirected'}, options)
    );
  }
}
class MultiDirectedGraph extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({multi: true, type: 'directed'}, options)
    );
  }
}
class MultiUndirectedGraph extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({multi: true, type: 'undirected'}, options)
    );
  }
}
class DirectedGraphMap extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({map: true, type: 'directed'}, options)
    );
  }
}
class UndirectedGraphMap extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({map: true, type: 'undirected'}, options)
    );
  }
}
class MultiDirectedGraphMap extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({map: true, multi: true, type: 'directed'}, options)
    );
  }
}
class MultiUndirectedGraphMap extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({map: true, multi: true, type: 'undirected'}, options)
    );
  }
}

export {
  DirectedGraph,
  UndirectedGraph,
  MultiDirectedGraph,
  MultiUndirectedGraph,
  DirectedGraphMap,
  UndirectedGraphMap,
  MultiDirectedGraphMap,
  MultiUndirectedGraphMap
};
