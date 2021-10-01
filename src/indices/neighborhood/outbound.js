/**
 * Graphology Outbound Neighborhood Indices
 * =========================================
 */
var typed = require('mnemonist/utils/typed-arrays');

function OutboundNeighborhoodIndex(graph) {
  var upperBound = graph.directedSize + graph.undirectedSize * 2;

  var NeighborhoodPointerArray = typed.getPointerArray(upperBound);
  var NodesPointerArrray = typed.getPointerArray(graph.order);

  // NOTE: directedSize + undirectedSize * 2 is an upper bound for
  // neighborhood size
  this.graph = graph;
  this.neighborhood = new NodesPointerArrray(upperBound);

  this.starts = new NeighborhoodPointerArray(graph.order + 1);

  this.nodes = graph.nodes();

  var ids = {};

  var i, l, j, m, node, neighbors;

  var n = 0;

  for (i = 0, l = graph.order; i < l; i++)
    ids[this.nodes[i]] = i;

  for (i = 0, l = graph.order; i < l; i++) {
    node = this.nodes[i];
    neighbors = graph.outboundNeighbors(node);

    this.starts[i] = n;

    for (j = 0, m = neighbors.length; j < m; j++)
      this.neighborhood[n++] = ids[neighbors[j]];
  }

  // NOTE: we keep one more index as upper bound to simplify iteration
  this.starts[i] = upperBound;
}

OutboundNeighborhoodIndex.prototype.bounds = function(i) {
  return [this.starts[i], this.starts[i + 1]];
};

OutboundNeighborhoodIndex.prototype.project = function() {
  var self = this;

  var projection = {};

  self.nodes.forEach(function(node, i) {
    projection[node] = Array.from(
      self.neighborhood.slice(self.starts[i], self.starts[i + 1])
    ).map(function(j) {
      return self.nodes[j];
    });
  });

  return projection;
};

OutboundNeighborhoodIndex.prototype.collect = function(results) {
  var i, l;

  var o = {};

  for (i = 0, l = results.length; i < l; i++)
    o[this.nodes[i]] = results[i];

  return o;
};

OutboundNeighborhoodIndex.prototype.assign = function(prop, results) {
  var i, l;

  for (i = 0, l = results.length; i < l; i++)
    this.graph.setNodeAttribute(this.nodes[i], prop, results[i]);
};

exports.OutboundNeighborhoodIndex = OutboundNeighborhoodIndex;

function WeightedOutboundNeighborhoodIndex(graph, weightAttribute) {
  var upperBound = graph.directedSize + graph.undirectedSize * 2;

  var NeighborhoodPointerArray = typed.getPointerArray(upperBound);
  var NodesPointerArrray = typed.getPointerArray(graph.order);

  weightAttribute = weightAttribute || 'weight';

  // NOTE: directedSize + undirectedSize * 2 is an upper bound for
  // neighborhood size
  this.graph = graph;
  this.neighborhood = new NodesPointerArrray(upperBound);
  this.weights = new Float64Array(upperBound);

  this.starts = new NeighborhoodPointerArray(graph.order + 1);

  this.nodes = graph.nodes();

  var ids = {};

  var i, l, j, m, node, neighbor, edges, edge, weight;

  var n = 0;

  for (i = 0, l = graph.order; i < l; i++)
    ids[this.nodes[i]] = i;

  for (i = 0, l = graph.order; i < l; i++) {
    node = this.nodes[i];
    edges = graph.outboundEdges(node);

    this.starts[i] = n;

    for (j = 0, m = edges.length; j < m; j++) {
      edge = edges[j];
      neighbor = graph.opposite(node, edge);
      weight = graph.getEdgeAttribute(edge, weightAttribute);

      if (typeof weight !== 'number')
        weight = 1;

      // NOTE: for weighted mixed beware of merging weights if twice the same neighbor
      this.neighborhood[n] = ids[neighbor];
      this.weights[n++] = weight;
    }
  }

  // NOTE: we keep one more index as upper bound to simplify iteration
  this.starts[i] = upperBound;
}

WeightedOutboundNeighborhoodIndex.prototype.bounds = OutboundNeighborhoodIndex.prototype.bounds;
WeightedOutboundNeighborhoodIndex.prototype.project = OutboundNeighborhoodIndex.prototype.project;
WeightedOutboundNeighborhoodIndex.prototype.collect = OutboundNeighborhoodIndex.prototype.collect;
WeightedOutboundNeighborhoodIndex.prototype.assign = OutboundNeighborhoodIndex.prototype.assign;

exports.WeightedOutboundNeighborhoodIndex = WeightedOutboundNeighborhoodIndex;
