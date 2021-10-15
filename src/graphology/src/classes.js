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
    const finalOptions = assign({type: 'directed'}, options);

    if ('multi' in finalOptions && finalOptions.multi !== false)
      throw new InvalidArgumentsGraphError(
        'DirectedGraph.from: inconsistent indication that the graph should be multi in given options!'
      );

    if (finalOptions.type !== 'directed')
      throw new InvalidArgumentsGraphError(
        'DirectedGraph.from: inconsistent "' +
          finalOptions.type +
          '" type in given options!'
      );

    super(finalOptions);
  }
}
class UndirectedGraph extends Graph {
  constructor(options) {
    const finalOptions = assign({type: 'undirected'}, options);

    if ('multi' in finalOptions && finalOptions.multi !== false)
      throw new InvalidArgumentsGraphError(
        'UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!'
      );

    if (finalOptions.type !== 'undirected')
      throw new InvalidArgumentsGraphError(
        'UndirectedGraph.from: inconsistent "' +
          finalOptions.type +
          '" type in given options!'
      );

    super(finalOptions);
  }
}
class MultiGraph extends Graph {
  constructor(options) {
    const finalOptions = assign({multi: true}, options);

    if ('multi' in finalOptions && finalOptions.multi !== true)
      throw new InvalidArgumentsGraphError(
        'MultiGraph.from: inconsistent indication that the graph should be simple in given options!'
      );

    super(finalOptions);
  }
}
class MultiDirectedGraph extends Graph {
  constructor(options) {
    const finalOptions = assign({type: 'directed', multi: true}, options);

    if ('multi' in finalOptions && finalOptions.multi !== true)
      throw new InvalidArgumentsGraphError(
        'MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!'
      );

    if (finalOptions.type !== 'directed')
      throw new InvalidArgumentsGraphError(
        'MultiDirectedGraph.from: inconsistent "' +
          finalOptions.type +
          '" type in given options!'
      );

    super(finalOptions);
  }
}
class MultiUndirectedGraph extends Graph {
  constructor(options) {
    const finalOptions = assign({type: 'undirected', multi: true}, options);

    if ('multi' in finalOptions && finalOptions.multi !== true)
      throw new InvalidArgumentsGraphError(
        'MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!'
      );

    if (finalOptions.type !== 'undirected')
      throw new InvalidArgumentsGraphError(
        'MultiUndirectedGraph.from: inconsistent "' +
          finalOptions.type +
          '" type in given options!'
      );

    super(finalOptions);
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
  Class.from = function (data, options) {
    // Merging given options with serialized ones
    const finalOptions = assign({}, data.options, options);

    const instance = new Class(finalOptions);
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
