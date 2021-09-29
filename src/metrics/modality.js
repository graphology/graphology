/**
 * Graphology Modalities
 * ===================
 *
 * Functions used to compute the modalities of each category of a given graph.
 */
var isGraph = require('graphology-utils/is-graph');
var density = require('./density');

function isEmpty(obj) {

  // null and undefined are "empty"
  if (!obj)
    return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0)
    return false;
  if (obj.length === 0)
    return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== 'object')
    return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

function createEmptyModalities() {
  return {
    nodes: 0,
    internalEdges: 0,
    density: 0,
    externalEdges: 0,
    inboundEdges: 0,
    outboundEdges: 0,
  };
}

function modalities(graph, attributes) {
  if (!isGraph(graph))
    throw new Error('graphology-metrics/modality: given graph is not a valid graphology instance.');
  if (!attributes || (attributes && attributes.length === 0)) {
    throw new Error('graphology-metrics/modality: no attributes where given.');
  }
  if (!Array.isArray(attributes)) {
    if (typeof(attributes) !== 'string') {
      throw new Error('graphology-metrics/modality: Attributes must be a string or an array of strings. typeof attributes = ' + typeof(attributes));
    }
    attributes = [attributes];
  }
  var hashmap = {};
  var i = 0;

  // Build hashmap's accepted attributes
  for (i = 0; i < attributes.length; i++) {
    hashmap[attributes[i]] = {};
  }

  function modalitiesCreator(type) {
    return function(key, edgeAttributes, source, target, sourceAttributes, targetAttributes) {
      for (i = 0; i < attributes.length; i++) {
        var attribute = attributes[i];
        var mapForAttribute = hashmap[attribute];
        var sourceValue = sourceAttributes[attribute];
        var targetValue = targetAttributes[attribute];
        var mapForSourceValue = mapForAttribute[sourceValue];
        // If attribute is not in source or target attributes we can exit the iteration.
        if (!(attribute in sourceAttributes) || !(attribute in targetAttributes)) {
          return;
        }
        if (!mapForSourceValue) {
          mapForSourceValue = createEmptyModalities();
          mapForAttribute[sourceValue] = mapForSourceValue;
        }
        var mapForTargetValue = mapForAttribute[targetValue];
        if (!mapForTargetValue) {
          mapForTargetValue = createEmptyModalities();
          mapForAttribute[targetValue] = mapForTargetValue;
        }
        if (sourceValue === targetValue) {
          mapForSourceValue.internalEdges++;
        }
        else {
          if (type === 'directed') {
            // Directed graphs only have in/out edges
            mapForSourceValue.outboundEdges++;
            mapForTargetValue.inboundEdges++;

            // externalEdges are all the edges going in OR out of a category.
            // So any link where source !== target.
            mapForSourceValue.externalEdges++;
            mapForTargetValue.externalEdges++;
          }
          else {
            // externalEdges are all the edges going in OR out of a category.
            // So any link where source !== target.
            mapForSourceValue.externalEdges++;
            mapForTargetValue.externalEdges++;
            if (type === 'mixed') {
              mapForSourceValue.outboundEdges++;
              mapForSourceValue.inboundEdges++;
              mapForTargetValue.outboundEdges++;
              mapForTargetValue.inboundEdges++;
            }
          }
        }
      }
    };
  }

  var densityFn;
  if (graph.type === 'directed') {
    graph.forEachEdge(
      modalitiesCreator(graph.type)
    );
    densityFn = density.directedDensity;
  }
  else if (graph.type === 'undirected') {
    graph.forEachEdge(
      modalitiesCreator(graph.type)
    );
    densityFn = density.undirectedDensity;
  }
  else {
    graph.forEachDirectedEdge(
      modalitiesCreator('directed')
    );
    graph.forEachUndirectedEdge(
      modalitiesCreator(graph.type)
    );
    densityFn = density.mixedDensity;
  }

  graph.forEachNode(function(node, nodeAttributes) {
    for (i = 0; i < attributes.length; i++) {
      hashmap[attributes[i]][nodeAttributes[attributes[i]]].nodes++;
    }
  });

  // Checks if all provided attributes has been computed.
  for (var attribute in hashmap) {
    if (isEmpty(hashmap[attribute])) {
      throw new Error('graphology-metrics/modality: Attribute ' + attribute + ' provided not found in any node attributes.');
    }
    var valuesForAttribute = hashmap[attribute];
    for (var value in valuesForAttribute) {
      var valueModalities = valuesForAttribute[value];
      valueModalities.density = densityFn(
        valueModalities.nodes,
        valueModalities.internalEdges
      );
    }
  }
  return hashmap;
}

module.exports = modalities;
