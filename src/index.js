/**
 * Graphology Reference Implementation Endoint
 * ============================================
 *
 * Importing the Graph object & deriving alternative constructors.
 */
import {assign} from './utils';
import Graph from './graph';

import {
  InvalidArgumentsGraphError,
  NotFoundGraphError,
  UsageGraphError
} from './errors';

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
class GraphMap extends Graph {
  constructor(data, options) {
    super(
      data,
      assign({map: true}, options)
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

/**
 * Exporting as CommonJS for convenience.
 */
Graph.DirectedGraph = DirectedGraph;
Graph.UndirectedGraph = UndirectedGraph;
Graph.MultiDirectedGraph = MultiDirectedGraph;
Graph.MultiUndirectedGraph = MultiUndirectedGraph;
Graph.GraphMap = GraphMap;
Graph.DirectedGraphMap = DirectedGraphMap;
Graph.UndirectedGraphMap = UndirectedGraphMap;
Graph.MultiDirectedGraphMap = MultiDirectedGraphMap;
Graph.MultiUndirectedGraphMap = MultiUndirectedGraphMap;

Graph.InvalidArgumentsGraphError = InvalidArgumentsGraphError;
Graph.NotFoundGraphError = NotFoundGraphError;
Graph.UsageGraphError = UsageGraphError;

module.exports = Graph;
