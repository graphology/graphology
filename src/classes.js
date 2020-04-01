/**
 * Graphology Helper Classes
 * ==========================
 *
 * Building some higher-order classes instantiating the graph with
 * predefinite options.
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
  constructor(options) {
    super(
      assign({type: 'directed'}, options)
    );
  }
}
class UndirectedGraph extends Graph {
  constructor(options) {
    super(
      assign({type: 'undirected'}, options)
    );
  }
}
class MultiGraph extends Graph {
  constructor(options) {
    super(
      assign({multi: true}, options)
    );
  }
}
class MultiDirectedGraph extends Graph {
  constructor(options) {
    super(
      assign({multi: true, type: 'directed'}, options)
    );
  }
}
class MultiUndirectedGraph extends Graph {
  constructor(options) {
    super(
      assign({multi: true, type: 'undirected'}, options)
    );
  }
}

/**
 * Attaching static #.from method to each of the constructors.
 */
function attachStaticFromMethod(Class) {

  /**
   * Builds a graph from serialized data or another graph's data.
   *
   * @param  {Graph|SerializedGraph} data      - Hydratation data.
   * @param  {object}                [options] - Options.
   * @return {Class}
   */
  Class.from = function(data, options) {
    const instance = new Class(options);
    instance.import(data);

    return instance;
  };
}

attachStaticFromMethod(Graph);
attachStaticFromMethod(DirectedGraph);
attachStaticFromMethod(UndirectedGraph);
attachStaticFromMethod(MultiGraph);
attachStaticFromMethod(MultiDirectedGraph);
attachStaticFromMethod(MultiUndirectedGraph);

Graph.Graph = Graph;
Graph.DirectedGraph = DirectedGraph;
Graph.UndirectedGraph = UndirectedGraph;
Graph.MultiGraph = MultiGraph;
Graph.MultiDirectedGraph = MultiDirectedGraph;
Graph.MultiUndirectedGraph = MultiUndirectedGraph;

Graph.InvalidArgumentsGraphError = InvalidArgumentsGraphError;
Graph.NotFoundGraphError = NotFoundGraphError;
Graph.UsageGraphError = UsageGraphError;

export {
  Graph,
  DirectedGraph,
  UndirectedGraph,
  MultiGraph,
  MultiDirectedGraph,
  MultiUndirectedGraph
};
