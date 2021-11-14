/**
 * Graphology Weight Getter
 * =========================
 *
 * Function creating weight getters.
 */
function coerceWeight(value) {
  // Ensuring target value is a correct number
  if (typeof value !== 'number' || isNaN(value)) return 1;

  return value;
}

exports.createNodeValueGetter = function (nameOrFunction, defaultValue) {
  var getter = {};

  var coerceToDefault = function (v) {
    if (typeof v === 'undefined') return defaultValue;

    return v;
  };

  if (typeof defaultValue === 'function') coerceToDefault = defaultValue;

  var get = function (attributes) {
    return coerceToDefault(attributes[nameOrFunction]);
  };

  var returnDefault = function () {
    return coerceToDefault(undefined);
  };

  if (typeof nameOrFunction === 'string') {
    getter.fromAttributes = get;
    getter.fromGraph = function (graph, node) {
      return get(graph.getNodeAttributes(node));
    };
    getter.fromEntry = function (node, attributes) {
      return get(attributes);
    };
  } else if (typeof nameOrFunction === 'function') {
    getter.fromAttributes = function () {
      throw new Error(
        'graphology-utils/getters/createNodeValueGetter: irrelevant usage.'
      );
    };
    getter.fromGraph = function (graph, node) {
      return coerceToDefault(
        nameOrFunction(node, graph.getNodeAttributes(node))
      );
    };
    getter.fromEntry = function (node, attributes) {
      return coerceToDefault(nameOrFunction(node, attributes));
    };
  } else {
    getter.fromAttributes = returnDefault;
    getter.fromGraph = returnDefault;
    getter.fromEntry = returnDefault;
  }

  return getter;
};

exports.createEdgeValueGetter = function (nameOrFunction, defaultValue) {
  var getter = {};

  var coerceToDefault = function (v) {
    if (typeof v === 'undefined') return defaultValue;

    return v;
  };

  if (typeof defaultValue === 'function') coerceToDefault = defaultValue;

  var get = function (attributes) {
    return coerceToDefault(attributes[nameOrFunction]);
  };

  var returnDefault = function () {
    return coerceToDefault(undefined);
  };

  if (typeof nameOrFunction === 'string') {
    getter.fromAttributes = get;
    getter.fromGraph = function (graph, node) {
      return get(graph.getEdgeAttributes(node));
    };
    getter.fromEntry = function (node, attributes) {
      return get(attributes);
    };
  } else if (typeof nameOrFunction === 'function') {
    getter.fromAttributes = function () {
      throw new Error(
        'graphology-utils/getters/createEdgeValueGetter: irrelevant usage.'
      );
    };
    getter.fromGraph = function (graph, node) {
      return coerceToDefault(
        nameOrFunction(node, graph.getEdgeAttributes(node))
      );
    };
    getter.fromEntry = function (node, attributes) {
      return coerceToDefault(nameOrFunction(node, attributes));
    };
  } else {
    getter.fromAttributes = returnDefault;
    getter.fromGraph = returnDefault;
    getter.fromEntry = returnDefault;
  }

  return getter;
};

exports.createWeightGetter = function (name) {
  var weightGetter = function (attr) {
    // If no name was provided, it means we don't want a weighted computation
    if (!name) return 1;

    return coerceWeight(attr[name]);
  };

  return weightGetter;
};
