/**
 * Graphology Degree
 * ==================
 *
 * Functions used to compute the degree of each node of a given graph.
 */
var isGraph = require('graphology-utils/is-graph');
var DEFAULT_ATTRIBUTES = {
  degree: 'degree',
  inDegree: 'inDegree',
  outDegree: 'outDegree',
  undirectedDegree: 'undirectedDegree',
  directedDegree: 'directedDegree'
};

function abstractDegree(graph, callee, assign, type, options) {
  if (!isGraph(graph))
    throw new Error('graphology-metrics/' + callee + ': given graph is not a valid graphology instance.');
  if (graph.type === type) {
    throw new Error('graphology-metrics/' + callee + ': can not be calculated for ' + type + '  graphs.');
  }
  var nodes = graph.nodes();
  var i = 0;
  if (assign) {
    var attributes = Object.assign({}, DEFAULT_ATTRIBUTES, options && options.attributes);
    for (i = 0; i < nodes.length; i++) {
      graph.setNodeAttribute(
        nodes[i],
        attributes[callee],
        graph[callee](nodes[i])
      );
    }
    return;
  }
  var hashmap = {};
  for (i = 0; i < nodes.length; i++) {
    hashmap[nodes[i]] = graph[callee](nodes[i]);
  }
  return hashmap;
}

function allDegree(graph, options, assign) {
  if (!isGraph(graph))
    throw new Error('graphology-metrics/degree: given graph is not a valid graphology instance.');
  var attributes = Object.assign({}, DEFAULT_ATTRIBUTES, options && options.attributes);
  var nodes = graph.nodes();
  var types;
  var defaultTypes;
  if (graph.type === 'undirected') {
    defaultTypes = ['undirectedDegree'];
  }
  if (graph.type === 'mixed') {
    defaultTypes = ['inDegree', 'outDegree', 'undirectedDegree'];
  }
  if (graph.type === 'directed') {
    defaultTypes = ['inDegree', 'outDegree'];
  }

  if (options && options.types && options.types.length) {
    types = defaultTypes.filter(function(type) {
      return options.types.indexOf(type) > -1;
    });
  }
  else {
    types = defaultTypes;
  }
  var i = 0;
  var j = 0;
  if (assign) {
    for (i = 0; i < nodes.length; i++) {
      for (j = 0; j < types.length; j++) {
        graph.setNodeAttribute(
          nodes[i],
          attributes[types[j]],
          graph[types[j]](nodes[i])
        );
      }
    }
  }
  else {
    var hashmap = {};
    for (i = 0; i < nodes.length; i++) {
      var response = {};
      for (j = 0; j < types.length; j++) {
        response[attributes[types[j]]] = graph[types[j]](nodes[i]);
      }
      hashmap[nodes[i]] = response;
    }
    return hashmap;
  }
}
allDegree.assign = function assignAllDegree(graph, options) {
  allDegree(graph, options, true);
};

function degree(graph) {
  return abstractDegree(graph, 'degree');
}
degree.assign = function assignDegree(graph, options) {
  abstractDegree(graph, 'degree', true, 'none', options);
};

function inDegree(graph) {
  return abstractDegree(graph, 'inDegree', false, 'undirected');
}
inDegree.assign = function assignInDegree(graph, options) {
  abstractDegree(graph, 'inDegree', true, 'undirected', options);
};

function outDegree(graph) {
  return abstractDegree(graph, 'outDegree', false, 'undirected');
}
outDegree.assign = function assignOutDegree(graph, option) {
  abstractDegree(graph, 'outDegree', true, 'undirected', option);
};

function undirectedDegree(graph) {
  return abstractDegree(graph, 'undirectedDegree', false, 'directed');
}
undirectedDegree.assign = function assignUndirectedDegree(graph, option) {
  abstractDegree(graph, 'undirectedDegree', true, 'directed', option);
};

function directedDegree(graph) {
  return abstractDegree(graph, 'directedDegree', false, 'undirected');
}
directedDegree.assign = function assignUndirectedDegree(graph, option) {
  abstractDegree(graph, 'directedDegree', true, 'undirected', option);
};

degree.inDegree = inDegree;
degree.outDegree = outDegree;
degree.undirectedDegree = undirectedDegree;
degree.directedDegree = directedDegree;
degree.allDegree = allDegree;
degree.abstractDegree = abstractDegree;

module.exports = degree;
