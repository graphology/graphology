(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["graphology"] = factory();
	else
		root["graphology"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Graphology Custom Errors
 * =========================
 *
 * Defining custom errors for ease of use & easy unit tests across
 * implementations (normalized typology rather than relying on error
 * messages to check whether the correct error was found).
 */
var GraphError = exports.GraphError = function (_Error) {
  _inherits(GraphError, _Error);

  function GraphError(message, data) {
    _classCallCheck(this, GraphError);

    var _this = _possibleConstructorReturn(this, _Error.call(this));

    _this.name = 'GraphError';
    _this.message = message || '';
    _this.data = data || {};
    return _this;
  }

  return GraphError;
}(Error);

var InvalidArgumentsGraphError = exports.InvalidArgumentsGraphError = function (_GraphError) {
  _inherits(InvalidArgumentsGraphError, _GraphError);

  function InvalidArgumentsGraphError(message, data) {
    _classCallCheck(this, InvalidArgumentsGraphError);

    var _this2 = _possibleConstructorReturn(this, _GraphError.call(this, message, data));

    _this2.name = 'InvalidArgumentsGraphError';

    // This is V8 specific to enhance stack readability
    if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(_this2, InvalidArgumentsGraphError.prototype.constructor);
    return _this2;
  }

  return InvalidArgumentsGraphError;
}(GraphError);

var NotFoundGraphError = exports.NotFoundGraphError = function (_GraphError2) {
  _inherits(NotFoundGraphError, _GraphError2);

  function NotFoundGraphError(message, data) {
    _classCallCheck(this, NotFoundGraphError);

    var _this3 = _possibleConstructorReturn(this, _GraphError2.call(this, message, data));

    _this3.name = 'NotFoundGraphError';

    // This is V8 specific to enhance stack readability
    if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(_this3, NotFoundGraphError.prototype.constructor);
    return _this3;
  }

  return NotFoundGraphError;
}(GraphError);

var UsageGraphError = exports.UsageGraphError = function (_GraphError3) {
  _inherits(UsageGraphError, _GraphError3);

  function UsageGraphError(message, data) {
    _classCallCheck(this, UsageGraphError);

    var _this4 = _possibleConstructorReturn(this, _GraphError3.call(this, message, data));

    _this4.name = 'UsageGraphError';

    // This is V8 specific to enhance stack readability
    if (typeof Error.captureStackTrace === 'function') Error.captureStackTrace(_this4, UsageGraphError.prototype.constructor);
    return _this4;
  }

  return UsageGraphError;
}(GraphError);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.assign = assign;
exports.getMatchingEdge = getMatchingEdge;
exports.isGraph = isGraph;
exports.isPlainObject = isPlainObject;
exports.prettyPrint = prettyPrint;
exports.privateProperty = privateProperty;
exports.readOnlyProperty = readOnlyProperty;
exports.incrementalId = incrementalId;
/**
 * Graphology Utilities
 * =====================
 *
 * Collection of helpful functions used by the implementation.
 */

/**
 * Very simple Object.assign-like function.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
function assign() {
  var target = arguments[0] || {};

  for (var i = 1, l = arguments.length; i < l; i++) {
    if (!arguments[i]) continue;

    for (var k in arguments[i]) {
      target[k] = arguments[i][k];
    }
  }

  return target;
}

/**
 * Function returning the first matching edge for given path.
 * Note: this function does not check the existence of source & target. This
 * must be performed by the caller.
 *
 * @param  {Graph}  graph  - Target graph.
 * @param  {any}    source - Source node.
 * @param  {any}    target - Target node.
 * @param  {string} type   - Type of the edge (mixed, directed or undirected).
 * @return {string|null}
 */
function getMatchingEdge(graph, source, target, type) {
  var sourceData = graph._nodes.get(source);

  var edge = null;

  if (!sourceData) return edge;

  if (type === 'mixed') {
    edge = sourceData.out && sourceData.out[target] || sourceData.undirected && sourceData.undirected[target];
  } else if (type === 'directed') {
    edge = sourceData.out && sourceData.out[target];
  } else {
    edge = sourceData.undirected && sourceData.undirected[target];
  }

  return edge;
}

/**
 * Checks whether the given value is a Graph implementation instance.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */
function isGraph(value) {
  return value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && typeof value.addUndirectedEdgeWithKey === 'function' && typeof value.dropNode === 'function';
}

/**
 * Checks whether the given value is a plain object.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */
function isPlainObject(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null && value.constructor === Object;
}

/**
 * Pretty prints the given integer.
 *
 * @param  {number}  integer - Target integer.
 * @return {string}          - The pretty string.
 */
function prettyPrint(integer) {
  var string = '' + integer;

  var prettyString = '';

  for (var i = 0, l = string.length; i < l; i++) {
    var j = l - i - 1;

    prettyString = string[j] + prettyString;

    if (!((i - 2) % 3) && i !== l - 1) prettyString = ',' + prettyString;
  }

  return prettyString;
}

/**
 * Creates a "private" property for the given member name by concealing it
 * using the `enumerable` option.
 *
 * @param {object} target - Target object.
 * @param {string} name   - Member name.
 */
function privateProperty(target, name, value) {
  Object.defineProperty(target, name, {
    enumerable: false,
    configurable: false,
    writable: true,
    value: value
  });
}

/**
 * Creates a read-only property for the given member name & the given getter.
 *
 * @param {object}   target - Target object.
 * @param {string}   name   - Member name.
 * @param {mixed}    value  - The attached getter or fixed value.
 */
function readOnlyProperty(target, name, value) {
  var descriptor = {
    enumerable: true,
    configurable: true
  };

  if (typeof value === 'function') {
    descriptor.get = value;
  } else {
    descriptor.value = value;
    descriptor.writable = false;
  }

  Object.defineProperty(target, name, descriptor);
}

/**
 * Creates a function generating incremental ids for edges.
 *
 * @return {function}
 */
function incrementalId() {
  var i = 0;

  return function () {
    return '_geid' + i++ + '_';
  };
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * Obliterator Iterator Class
 * ===========================
 *
 * Simple class representing the library's iterators.
 */

/**
 * Iterator class.
 *
 * @constructor
 * @param {function} next - Next function.
 */
function Iterator(next) {

  // Hiding the given function
  Object.defineProperty(this, '_next', {
    writable: false,
    enumerable: false,
    value: next
  });

  // Is the iterator complete?
  this.done = false;
}

/**
 * Next function.
 *
 * @return {object}
 */
// NOTE: maybe this should dropped for performance?
Iterator.prototype.next = function() {
  if (this.done)
    return {done: true};

  var step = this._next();

  if (step.done)
    this.done = true;

  return step;
};

/**
 * If symbols are supported, we add `next` to `Symbol.iterator`.
 */
if (typeof Symbol !== 'undefined')
  Iterator.prototype[Symbol.iterator] = function() {
    return this;
  };

/**
 * Returning an iterator of the given values.
 *
 * @param  {any...} values - Values.
 * @return {Iterator}
 */
Iterator.of = function() {
  var args = arguments,
      l = args.length,
      i = 0;

  return new Iterator(function() {
    if (i >= l)
      return {done: true};

    return {done: false, value: args[i++]};
  });
};

/**
 * Returning an empty iterator.
 *
 * @return {Iterator}
 */
Iterator.empty = function() {
  var iterator = new Iterator(null);
  iterator.done = true;

  return iterator;
};

/**
 * Returning whether the given value is an iterator.
 *
 * @param  {any} value - Value.
 * @return {boolean}
 */
Iterator.is = function(value) {
  if (value instanceof Iterator)
    return true;

  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.next === 'function'
  );
};

/**
 * Exporting.
 */
module.exports = Iterator;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MixedNodeData = MixedNodeData;
exports.DirectedNodeData = DirectedNodeData;
exports.UndirectedNodeData = UndirectedNodeData;
exports.DirectedEdgeData = DirectedEdgeData;
exports.UndirectedEdgeData = UndirectedEdgeData;
/**
 * Graphology Internal Data Classes
 * =================================
 *
 * Internal classes hopefully reduced to structs by engines & storing
 * necessary information for nodes & edges.
 *
 * Note that those classes don't rely on the `class` keyword to avoid some
 * cruft introduced by most of ES2015 transpilers.
 */

/**
 * MixedNodeData class.
 *
 * @constructor
 * @param {string} string     - The node's key.
 * @param {object} attributes - Node's attributes.
 */
function MixedNodeData(key, attributes) {

  // Attributes
  this.key = key;
  this.attributes = attributes;

  // Degrees
  this.inDegree = 0;
  this.outDegree = 0;
  this.undirectedDegree = 0;
  this.directedSelfLoops = 0;
  this.undirectedSelfLoops = 0;

  // Indices
  this.in = {};
  this.out = {};
  this.undirected = {};
}

/**
 * DirectedNodeData class.
 *
 * @constructor
 * @param {string} string     - The node's key.
 * @param {object} attributes - Node's attributes.
 */
function DirectedNodeData(key, attributes) {

  // Attributes
  this.key = key;
  this.attributes = attributes || {};

  // Degrees
  this.inDegree = 0;
  this.outDegree = 0;
  this.directedSelfLoops = 0;

  // Indices
  this.in = {};
  this.out = {};
}

DirectedNodeData.prototype.upgradeToMixed = function () {

  // Degrees
  this.undirectedDegree = 0;
  this.undirectedSelfLoops = 0;

  // Indices
  this.undirected = {};
};

/**
 * UndirectedNodeData class.
 *
 * @constructor
 * @param {string} string     - The node's key.
 * @param {object} attributes - Node's attributes.
 */
function UndirectedNodeData(key, attributes) {

  // Attributes
  this.key = key;
  this.attributes = attributes || {};

  // Degrees
  this.undirectedDegree = 0;
  this.undirectedSelfLoops = 0;

  // Indices
  this.undirected = {};
}

UndirectedNodeData.prototype.upgradeToMixed = function () {

  // Degrees
  this.inDegree = 0;
  this.outDegree = 0;
  this.directedSelfLoops = 0;

  // Indices
  this.in = {};
  this.out = {};
};

/**
 * DirectedEdgeData class.
 *
 * @constructor
 * @param {string}  string       - The edge's key.
 * @param {boolean} generatedKey - Was its key generated?
 * @param {string}  source       - Source of the edge.
 * @param {string}  target       - Target of the edge.
 * @param {object}  attributes   - Edge's attributes.
 */
function DirectedEdgeData(key, generatedKey, source, target, attributes) {

  // Attributes
  this.key = key;
  this.attributes = attributes;

  // Extremities
  this.source = source;
  this.target = target;

  // Was its key generated?
  this.generatedKey = generatedKey;
}

/**
 * UndirectedEdgeData class.
 *
 * @constructor
 * @param {string}  string       - The edge's key.
 * @param {boolean} generatedKey - Was its key generated?
 * @param {string}  source       - Source of the edge.
 * @param {string}  target       - Target of the edge.
 * @param {object}  attributes   - Edge's attributes.
 */
function UndirectedEdgeData(key, generatedKey, source, target, attributes) {

  // Attributes
  this.key = key;
  this.attributes = attributes;

  // Extremities
  this.source = source;
  this.target = target;

  // Was its key generated?
  this.generatedKey = generatedKey;
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

/* eslint no-constant-condition: 0 */
/**
 * Obliterator Take Function
 * ==========================
 *
 * Function taking n or every value of the given iterator and returns them
 * into an array.
 */

/**
 * Take.
 *
 * @param  {Iterator} iterator - Target iterator.
 * @param  {number}   [n]      - Optional number of items to take.
 * @return {array}
 */
module.exports = function take(iterator, n) {
  var l = arguments.length > 1 ? n : Infinity,
      array = l !== Infinity ? new Array(l) : [],
      step,
      i = 0;

  while (true) {

    if (i === l)
      return array;

    step = iterator.next();

    if (step.done) {

      if (i !== n)
        return array.slice(0, i);

      return array;
    }

    array[i++] = step.value;
  }
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Obliterator Chain Function
 * ===========================
 *
 * Variadic function combining the given iterators.
 */
var Iterator = __webpack_require__(2);

/**
 * Chain.
 *
 * @param  {...Iterator} iterators - Target iterators.
 * @return {Iterator}
 */
module.exports = function chain() {
  var iterators = arguments,
      current,
      i = -1;

  return new Iterator(function iterate() {
    if (!current) {
      i++;

      if (i >= iterators.length)
        return {done: true};

      current = iterators[i];
    }

    var step = current.next();

    if (step.done) {
      current = null;
      return iterate();
    }

    return step;
  });
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utils = __webpack_require__(1);

var _graph = __webpack_require__(7);

var _graph2 = _interopRequireDefault(_graph);

var _errors = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Graphology Reference Implementation Endoint
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * ============================================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Importing the Graph object & creating typed constructors.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


/**
 * Alternative constructors.
 */
var DirectedGraph = function (_Graph) {
  _inherits(DirectedGraph, _Graph);

  function DirectedGraph(options) {
    _classCallCheck(this, DirectedGraph);

    return _possibleConstructorReturn(this, _Graph.call(this, (0, _utils.assign)({ type: 'directed' }, options)));
  }

  return DirectedGraph;
}(_graph2.default);

var UndirectedGraph = function (_Graph2) {
  _inherits(UndirectedGraph, _Graph2);

  function UndirectedGraph(options) {
    _classCallCheck(this, UndirectedGraph);

    return _possibleConstructorReturn(this, _Graph2.call(this, (0, _utils.assign)({ type: 'undirected' }, options)));
  }

  return UndirectedGraph;
}(_graph2.default);

var MultiDirectedGraph = function (_Graph3) {
  _inherits(MultiDirectedGraph, _Graph3);

  function MultiDirectedGraph(options) {
    _classCallCheck(this, MultiDirectedGraph);

    return _possibleConstructorReturn(this, _Graph3.call(this, (0, _utils.assign)({ multi: true, type: 'directed' }, options)));
  }

  return MultiDirectedGraph;
}(_graph2.default);

var MultiUndirectedGraph = function (_Graph4) {
  _inherits(MultiUndirectedGraph, _Graph4);

  function MultiUndirectedGraph(options) {
    _classCallCheck(this, MultiUndirectedGraph);

    return _possibleConstructorReturn(this, _Graph4.call(this, (0, _utils.assign)({ multi: true, type: 'undirected' }, options)));
  }

  return MultiUndirectedGraph;
}(_graph2.default);

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
    var instance = new Class(options);
    instance.import(data);

    return instance;
  };
}

attachStaticFromMethod(_graph2.default);
attachStaticFromMethod(DirectedGraph);
attachStaticFromMethod(UndirectedGraph);
attachStaticFromMethod(MultiDirectedGraph);
attachStaticFromMethod(MultiUndirectedGraph);

/**
 * Attaching the various constructors to the Graph class itself so we can
 * keep CommonJS semantics so everyone can consume the library easily.
 */
_graph2.default.Graph = _graph2.default;
_graph2.default.DirectedGraph = DirectedGraph;
_graph2.default.UndirectedGraph = UndirectedGraph;
_graph2.default.MultiDirectedGraph = MultiDirectedGraph;
_graph2.default.MultiUndirectedGraph = MultiUndirectedGraph;

_graph2.default.InvalidArgumentsGraphError = _errors.InvalidArgumentsGraphError;
_graph2.default.NotFoundGraphError = _errors.NotFoundGraphError;
_graph2.default.UsageGraphError = _errors.UsageGraphError;

module.exports = _graph2.default;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = __webpack_require__(8);

var _iterator = __webpack_require__(2);

var _iterator2 = _interopRequireDefault(_iterator);

var _take = __webpack_require__(4);

var _take2 = _interopRequireDefault(_take);

var _errors = __webpack_require__(0);

var _data = __webpack_require__(3);

var _indices = __webpack_require__(9);

var _attributes = __webpack_require__(10);

var _edges = __webpack_require__(11);

var _neighbors = __webpack_require__(12);

var _serialization = __webpack_require__(13);

var _utils = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint no-nested-ternary: 0 */
/**
 * Graphology Reference Implementation
 * ====================================
 *
 * Reference implementation of the graphology specs.
 */


/**
 * Enums.
 */
var TYPES = new Set(['directed', 'undirected', 'mixed']);

var EMITTER_PROPS = new Set(['domain', '_events', '_eventsCount', '_maxListeners']);

var EDGE_ADD_METHODS = [{
  name: function name(verb) {
    return verb + 'Edge';
  },
  generateKey: true
}, {
  name: function name(verb) {
    return verb + 'DirectedEdge';
  },
  generateKey: true,
  type: 'directed'
}, {
  name: function name(verb) {
    return verb + 'UndirectedEdge';
  },
  generateKey: true,
  type: 'undirected'
}, {
  name: function name(verb) {
    return verb + 'EdgeWithKey';
  }
}, {
  name: function name(verb) {
    return verb + 'DirectedEdgeWithKey';
  },
  type: 'directed'
}, {
  name: function name(verb) {
    return verb + 'UndirectedEdgeWithKey';
  },
  type: 'undirected'
}];

/**
 * Default options.
 */
var DEFAULTS = {
  allowSelfLoops: true,
  edgeKeyGenerator: null,
  multi: false,
  type: 'mixed'
};

/**
 * Abstract functions used by the Graph class for various methods.
 */

/**
 * Internal method used to add an arbitrary edge to the given graph.
 *
 * @param  {Graph}   graph           - Target graph.
 * @param  {string}  name            - Name of the child method for errors.
 * @param  {boolean} mustGenerateKey - Should the graph generate an id?
 * @param  {boolean} undirected      - Whether the edge is undirected.
 * @param  {any}     edge            - The edge's key.
 * @param  {any}     source          - The source node.
 * @param  {any}     target          - The target node.
 * @param  {object}  [attributes]    - Optional attributes.
 * @return {any}                     - The edge.
 *
 * @throws {Error} - Will throw if the graph is of the wrong type.
 * @throws {Error} - Will throw if the given attributes are not an object.
 * @throws {Error} - Will throw if source or target doesn't exist.
 * @throws {Error} - Will throw if the edge already exist.
 */
function addEdge(graph, name, mustGenerateKey, undirected, edge, source, target, attributes) {

  // Checking validity of operation
  if (!undirected && graph.type === 'undirected') throw new _errors.UsageGraphError('Graph.' + name + ': you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.');

  if (undirected && graph.type === 'directed') throw new _errors.UsageGraphError('Graph.' + name + ': you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.');

  if (attributes && !(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.' + name + ': invalid attributes. Expecting an object but got "' + attributes + '"');

  // Coercion of source & target:
  source = '' + source;
  target = '' + target;
  attributes = attributes || {};

  if (!graph.allowSelfLoops && source === target) throw new _errors.UsageGraphError('Graph.' + name + ': source & target are the same ("' + source + '"), thus creating a loop explicitly forbidden by this graph \'allowSelfLoops\' option set to false.');

  var sourceData = graph._nodes.get(source),
      targetData = graph._nodes.get(target);

  if (!sourceData) throw new _errors.NotFoundGraphError('Graph.' + name + ': source node "' + source + '" not found.');

  if (!targetData) throw new _errors.NotFoundGraphError('Graph.' + name + ': target node "' + target + '" not found.');

  // Must the graph generate an id for this edge?
  var eventData = {
    key: null,
    undirected: undirected,
    source: source,
    target: target,
    attributes: attributes
  };

  if (mustGenerateKey) edge = graph._edgeKeyGenerator(eventData);

  // Coercion of edge key
  edge = '' + edge;

  // Here, we have a key collision
  if (graph._edges.has(edge)) throw new _errors.UsageGraphError('Graph.' + name + ': the "' + edge + '" edge already exists in the graph.');

  // Here, we might have a source / target collision
  if (!graph.multi && (undirected ? typeof sourceData.undirected[target] !== 'undefined' : typeof sourceData.out[target] !== 'undefined')) {
    throw new _errors.UsageGraphError('Graph.' + name + ': an edge linking "' + source + '" to "' + target + '" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the \'multi\' option.');
  }

  // Storing some data
  var DataClass = undirected ? _data.UndirectedEdgeData : _data.DirectedEdgeData;

  var edgeData = new DataClass(edge, mustGenerateKey, sourceData, targetData, attributes);

  // Adding the edge to the internal register
  graph._edges.set(edge, edgeData);

  // Incrementing node degree counters
  if (source === target) {
    if (undirected) sourceData.undirectedSelfLoops++;else sourceData.directedSelfLoops++;
  } else {
    if (undirected) {
      sourceData.undirectedDegree++;
      targetData.undirectedDegree++;
    } else {
      sourceData.outDegree++;
      targetData.inDegree++;
    }
  }

  // Updating relevant index
  (0, _indices.updateStructureIndex)(graph, undirected, edgeData, source, target, sourceData, targetData);

  if (undirected) graph._undirectedSize++;else graph._directedSize++;

  // Emitting
  eventData.key = edge;

  graph.emit('edgeAdded', eventData);

  return edge;
}

/**
 * Internal method used to add an arbitrary edge to the given graph.
 *
 * @param  {Graph}   graph           - Target graph.
 * @param  {string}  name            - Name of the child method for errors.
 * @param  {boolean} mustGenerateKey - Should the graph generate an id?
 * @param  {boolean} undirected      - Whether the edge is undirected.
 * @param  {any}     edge            - The edge's key.
 * @param  {any}     source          - The source node.
 * @param  {any}     target          - The target node.
 * @param  {object}  [attributes]    - Optional attributes.
 * @return {any}                     - The edge.
 *
 * @throws {Error} - Will throw if the graph is of the wrong type.
 * @throws {Error} - Will throw if the given attributes are not an object.
 * @throws {Error} - Will throw if source or target doesn't exist.
 * @throws {Error} - Will throw if the edge already exist.
 */
function mergeEdge(graph, name, mustGenerateKey, undirected, edge, source, target, attributes) {

  // Checking validity of operation
  if (!undirected && graph.type === 'undirected') throw new _errors.UsageGraphError('Graph.' + name + ': you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead.');

  if (undirected && graph.type === 'directed') throw new _errors.UsageGraphError('Graph.' + name + ': you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead.');

  if (attributes && !(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.' + name + ': invalid attributes. Expecting an object but got "' + attributes + '"');

  // Coercion of source & target:
  source = '' + source;
  target = '' + target;
  attributes = attributes || {};

  if (!graph.allowSelfLoops && source === target) throw new _errors.UsageGraphError('Graph.' + name + ': source & target are the same ("' + source + '"), thus creating a loop explicitly forbidden by this graph \'allowSelfLoops\' option set to false.');

  var sourceData = graph._nodes.get(source),
      targetData = graph._nodes.get(target),
      edgeData = void 0;

  // Do we need to handle duplicate?
  var alreadyExistingEdge = null;

  if (!mustGenerateKey) {
    edgeData = graph._edges.get(edge);

    if (edgeData) {

      // Here, we need to ensure, if the user gave a key, that source & target
      // are coherent
      if (edgeData.source !== source || edgeData.target !== target || undirected && (edgeData.source !== target || edgeData.target !== source)) {
        throw new _errors.UsageGraphError('Graph.' + name + ': inconsistency detected when attempting to merge the "' + edge + '" edge with "' + source + '" source & "' + target + '" target vs. (' + edgeData.source + ', ' + edgeData.target + ').');
      }

      alreadyExistingEdge = edge;
    }
  }

  var alreadyExistingEdgeData = void 0;

  // Here, we might have a source / target collision
  if (!alreadyExistingEdge && !graph.multi && sourceData && (undirected ? typeof sourceData.undirected[target] !== 'undefined' : typeof sourceData.out[target] !== 'undefined')) {
    alreadyExistingEdgeData = (0, _utils.getMatchingEdge)(graph, source, target, undirected ? 'undirected' : 'directed');
  }

  // Handling duplicates
  if (alreadyExistingEdgeData) {

    // We can skip the attribute merging part if the user did not provide them
    if (!attributes) return alreadyExistingEdge;

    // Merging the attributes
    (0, _utils.assign)(alreadyExistingEdgeData.attributes, attributes);
    return alreadyExistingEdge;
  }

  // Must the graph generate an id for this edge?
  var eventData = {
    key: null,
    undirected: undirected,
    source: source,
    target: target,
    attributes: attributes
  };

  if (mustGenerateKey) edge = graph._edgeKeyGenerator(eventData);

  // Coercion of edge key
  edge = '' + edge;

  // Here, we have a key collision
  if (graph._edges.has(edge)) throw new _errors.UsageGraphError('Graph.' + name + ': the "' + edge + '" edge already exists in the graph.');

  if (!sourceData) {
    graph.addNode(source);
    sourceData = graph._nodes.get(source);

    if (source === target) targetData = sourceData;
  }
  if (!targetData) {
    graph.addNode(target);
    targetData = graph._nodes.get(target);
  }

  // Storing some data
  var DataClass = undirected ? _data.UndirectedEdgeData : _data.DirectedEdgeData;

  edgeData = new DataClass(edge, mustGenerateKey, sourceData, targetData, attributes);

  // Adding the edge to the internal register
  graph._edges.set(edge, edgeData);

  // Incrementing node degree counters
  if (source === target) {
    if (undirected) sourceData.undirectedSelfLoops++;else sourceData.directedSelfLoops++;
  } else {
    if (undirected) {
      sourceData.undirectedDegree++;
      targetData.undirectedDegree++;
    } else {
      sourceData.outDegree++;
      targetData.inDegree++;
    }
  }

  // Updating relevant index
  (0, _indices.updateStructureIndex)(graph, undirected, edgeData, source, target, sourceData, targetData);

  if (undirected) graph._undirectedSize++;else graph._directedSize++;

  // Emitting
  eventData.key = edge;

  graph.emit('edgeAdded', eventData);

  return edge;
}

/**
 * Graph class
 *
 * @constructor
 * @param  {object}  [options] - Options:
 * @param  {boolean}   [allowSelfLoops] - Allow self loops?
 * @param  {string}    [type]           - Type of the graph.
 * @param  {boolean}   [map]            - Allow references as keys?
 * @param  {boolean}   [multi]          - Allow parallel edges?
 *
 * @throws {Error} - Will throw if the arguments are not valid.
 */

var Graph = function (_EventEmitter) {
  _inherits(Graph, _EventEmitter);

  function Graph(options) {
    _classCallCheck(this, Graph);

    //-- Solving options
    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

    options = (0, _utils.assign)({}, DEFAULTS, options);

    // Enforcing options validity
    if (options.edgeKeyGenerator && typeof options.edgeKeyGenerator !== 'function') throw new _errors.InvalidArgumentsGraphError('Graph.constructor: invalid \'edgeKeyGenerator\' option. Expecting a function but got "' + options.edgeKeyGenerator + '".');

    if (typeof options.multi !== 'boolean') throw new _errors.InvalidArgumentsGraphError('Graph.constructor: invalid \'multi\' option. Expecting a boolean but got "' + options.multi + '".');

    if (!TYPES.has(options.type)) throw new _errors.InvalidArgumentsGraphError('Graph.constructor: invalid \'type\' option. Should be one of "mixed", "directed" or "undirected" but got "' + options.type + '".');

    if (typeof options.allowSelfLoops !== 'boolean') throw new _errors.InvalidArgumentsGraphError('Graph.constructor: invalid \'allowSelfLoops\' option. Expecting a boolean but got "' + options.allowSelfLoops + '".');

    //-- Private properties

    // Utilities
    var NodeDataClass = options.type === 'mixed' ? _data.MixedNodeData : options.type === 'directed' ? _data.DirectedNodeData : _data.UndirectedNodeData;

    (0, _utils.privateProperty)(_this, 'NodeDataClass', NodeDataClass);

    // Indexes
    (0, _utils.privateProperty)(_this, '_attributes', {});
    (0, _utils.privateProperty)(_this, '_nodes', new Map());
    (0, _utils.privateProperty)(_this, '_edges', new Map());
    (0, _utils.privateProperty)(_this, '_directedSize', 0);
    (0, _utils.privateProperty)(_this, '_undirectedSize', 0);
    (0, _utils.privateProperty)(_this, '_edgeKeyGenerator', options.edgeKeyGenerator || (0, _utils.incrementalId)());

    // Options
    (0, _utils.privateProperty)(_this, '_options', options);

    // Emitter properties
    EMITTER_PROPS.forEach(function (prop) {
      return (0, _utils.privateProperty)(_this, prop, _this[prop]);
    });

    //-- Properties readers
    (0, _utils.readOnlyProperty)(_this, 'order', function () {
      return _this._nodes.size;
    });
    (0, _utils.readOnlyProperty)(_this, 'size', function () {
      return _this._edges.size;
    });
    (0, _utils.readOnlyProperty)(_this, 'directedSize', function () {
      return _this._directedSize;
    });
    (0, _utils.readOnlyProperty)(_this, 'undirectedSize', function () {
      return _this._undirectedSize;
    });
    (0, _utils.readOnlyProperty)(_this, 'multi', _this._options.multi);
    (0, _utils.readOnlyProperty)(_this, 'type', _this._options.type);
    (0, _utils.readOnlyProperty)(_this, 'allowSelfLoops', _this._options.allowSelfLoops);
    return _this;
  }

  /**---------------------------------------------------------------------------
   * Read
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning whether the given node is found in the graph.
   *
   * @param  {any}     node - The node.
   * @return {boolean}
   */


  Graph.prototype.hasNode = function hasNode(node) {
    return this._nodes.has('' + node);
  };

  /**
   * Method returning whether the given directed edge is found in the graph.
   *
   * Arity 1:
   * @param  {any}     edge - The edge's key.
   *
   * Arity 2:
   * @param  {any}     source - The edge's source.
   * @param  {any}     target - The edge's target.
   *
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the arguments are invalid.
   */


  Graph.prototype.hasDirectedEdge = function hasDirectedEdge(source, target) {

    // Early termination
    if (this.type === 'undirected') return false;

    if (arguments.length === 1) {
      var edge = '' + source;

      var edgeData = this._edges.get(edge);

      return !!edgeData && edgeData instanceof _data.DirectedEdgeData;
    } else if (arguments.length === 2) {

      source = '' + source;
      target = '' + target;

      // If the node source or the target is not in the graph we break
      var nodeData = this._nodes.get(source);

      if (!nodeData) return false;

      // Is there a directed edge pointing toward target?
      var edges = nodeData.out[target];

      if (!edges) return false;

      return this.multi ? !!edges.size : true;
    }

    throw new _errors.InvalidArgumentsGraphError('Graph.hasDirectedEdge: invalid arity (' + arguments.length + ', instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.');
  };

  /**
   * Method returning whether the given undirected edge is found in the graph.
   *
   * Arity 1:
   * @param  {any}     edge - The edge's key.
   *
   * Arity 2:
   * @param  {any}     source - The edge's source.
   * @param  {any}     target - The edge's target.
   *
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the arguments are invalid.
   */


  Graph.prototype.hasUndirectedEdge = function hasUndirectedEdge(source, target) {

    // Early termination
    if (this.type === 'directed') return false;

    if (arguments.length === 1) {
      var edge = '' + source;

      var edgeData = this._edges.get(edge);

      return !!edgeData && edgeData instanceof _data.UndirectedEdgeData;
    } else if (arguments.length === 2) {

      source = '' + source;
      target = '' + target;

      // If the node source or the target is not in the graph we break
      var nodeData = this._nodes.get(source);

      if (!nodeData) return false;

      // Is there a directed edge pointing toward target?
      var edges = nodeData.undirected[target];

      if (!edges) return false;

      return this.multi ? !!edges.size : true;
    }

    throw new _errors.InvalidArgumentsGraphError('Graph.hasDirectedEdge: invalid arity (' + arguments.length + ', instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.');
  };

  /**
   * Method returning whether the given edge is found in the graph.
   *
   * Arity 1:
   * @param  {any}     edge - The edge's key.
   *
   * Arity 2:
   * @param  {any}     source - The edge's source.
   * @param  {any}     target - The edge's target.
   *
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the arguments are invalid.
   */


  Graph.prototype.hasEdge = function hasEdge(source, target) {

    if (arguments.length === 1) {
      var edge = '' + source;

      return this._edges.has(edge);
    } else if (arguments.length === 2) {

      source = '' + source;
      target = '' + target;

      // If the node source or the target is not in the graph we break
      var nodeData = this._nodes.get(source);

      if (!nodeData) return false;

      // Is there a directed edge pointing toward target?
      var edges = typeof nodeData.out !== 'undefined' && nodeData.out[target];

      if (!edges) edges = typeof nodeData.undirected !== 'undefined' && nodeData.undirected[target];

      if (!edges) return false;

      return this.multi ? !!edges.size : true;
    }

    throw new _errors.InvalidArgumentsGraphError('Graph.hasEdge: invalid arity (' + arguments.length + ', instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target.');
  };

  /**
   * Method returning the edge matching source & target in a directed fashion.
   *
   * @param  {any} source - The edge's source.
   * @param  {any} target - The edge's target.
   *
   * @return {any|undefined}
   *
   * @throws {Error} - Will throw if the graph is multi.
   * @throws {Error} - Will throw if source or target doesn't exist.
   */


  Graph.prototype.directedEdge = function directedEdge(source, target) {

    if (this.type === 'undirected') return;

    source = '' + source;
    target = '' + target;

    if (this.multi) throw new _errors.UsageGraphError('Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.');

    var sourceData = this._nodes.get(source);

    if (!sourceData) throw new _errors.NotFoundGraphError('Graph.directedEdge: could not find the "' + source + '" source node in the graph.');

    if (!this._nodes.has(target)) throw new _errors.NotFoundGraphError('Graph.directedEdge: could not find the "' + target + '" target node in the graph.');

    var edgeData = sourceData.out && sourceData.out[target] || undefined;

    if (edgeData) return edgeData.key;
  };

  /**
   * Method returning the edge matching source & target in a undirected fashion.
   *
   * @param  {any} source - The edge's source.
   * @param  {any} target - The edge's target.
   *
   * @return {any|undefined}
   *
   * @throws {Error} - Will throw if the graph is multi.
   * @throws {Error} - Will throw if source or target doesn't exist.
   */


  Graph.prototype.undirectedEdge = function undirectedEdge(source, target) {

    if (this.type === 'directed') return;

    source = '' + source;
    target = '' + target;

    if (this.multi) throw new _errors.UsageGraphError('Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.');

    var sourceData = this._nodes.get(source);

    if (!sourceData) throw new _errors.NotFoundGraphError('Graph.undirectedEdge: could not find the "' + source + '" source node in the graph.');

    if (!this._nodes.has(target)) throw new _errors.NotFoundGraphError('Graph.undirectedEdge: could not find the "' + target + '" target node in the graph.');

    var edgeData = sourceData.undirected && sourceData.undirected[target] || undefined;

    if (edgeData) return edgeData.key;
  };

  /**
   * Method returning the edge matching source & target in a mixed fashion.
   *
   * @param  {any} source - The edge's source.
   * @param  {any} target - The edge's target.
   *
   * @return {any|undefined}
   *
   * @throws {Error} - Will throw if the graph is multi.
   * @throws {Error} - Will throw if source or target doesn't exist.
   */


  Graph.prototype.edge = function edge(source, target) {
    if (this.multi) throw new _errors.UsageGraphError('Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.');

    source = '' + source;
    target = '' + target;

    var sourceData = this._nodes.get(source);

    if (!sourceData) throw new _errors.NotFoundGraphError('Graph.edge: could not find the "' + source + '" source node in the graph.');

    if (!this._nodes.has(target)) throw new _errors.NotFoundGraphError('Graph.edge: could not find the "' + target + '" target node in the graph.');

    var edgeData = sourceData.out && sourceData.out[target] || sourceData.undirected && sourceData.undirected[target] || undefined;

    if (edgeData) return edgeData.key;
  };

  /**
   * Method returning the given node's in degree.
   *
   * @param  {any}     node      - The node's key.
   * @param  {boolean} allowSelfLoops - Count self-loops?
   * @return {number}            - The node's in degree.
   *
   * @throws {Error} - Will throw if the selfLoops arg is not boolean.
   * @throws {Error} - Will throw if the node isn't in the graph.
   */


  Graph.prototype.inDegree = function inDegree(node) {
    var selfLoops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (typeof selfLoops !== 'boolean') throw new _errors.InvalidArgumentsGraphError('Graph.inDegree: Expecting a boolean but got "' + selfLoops + '" for the second parameter (allowing self-loops to be counted).');

    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new _errors.NotFoundGraphError('Graph.inDegree: could not find the "' + node + '" node in the graph.');

    if (this.type === 'undirected') return 0;

    var loops = selfLoops ? nodeData.directedSelfLoops : 0;

    return nodeData.inDegree + loops;
  };

  /**
   * Method returning the given node's out degree.
   *
   * @param  {any}     node      - The node's key.
   * @param  {boolean} selfLoops - Count self-loops?
   * @return {number}            - The node's out degree.
   *
   * @throws {Error} - Will throw if the selfLoops arg is not boolean.
   * @throws {Error} - Will throw if the node isn't in the graph.
   */


  Graph.prototype.outDegree = function outDegree(node) {
    var selfLoops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (typeof selfLoops !== 'boolean') throw new _errors.InvalidArgumentsGraphError('Graph.outDegree: Expecting a boolean but got "' + selfLoops + '" for the second parameter (allowing self-loops to be counted).');

    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (!nodeData) throw new _errors.NotFoundGraphError('Graph.outDegree: could not find the "' + node + '" node in the graph.');

    if (this.type === 'undirected') return 0;

    var loops = selfLoops ? nodeData.directedSelfLoops : 0;

    return nodeData.outDegree + loops;
  };

  /**
   * Method returning the given node's directed degree.
   *
   * @param  {any}     node      - The node's key.
   * @param  {boolean} selfLoops - Count self-loops?
   * @return {number}            - The node's directed degree.
   *
   * @throws {Error} - Will throw if the selfLoops arg is not boolean.
   * @throws {Error} - Will throw if the node isn't in the graph.
   */


  Graph.prototype.directedDegree = function directedDegree(node) {
    var selfLoops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (typeof selfLoops !== 'boolean') throw new _errors.InvalidArgumentsGraphError('Graph.directedDegree: Expecting a boolean but got "' + selfLoops + '" for the second parameter (allowing self-loops to be counted).');

    node = '' + node;

    if (!this.hasNode(node)) throw new _errors.NotFoundGraphError('Graph.directedDegree: could not find the "' + node + '" node in the graph.');

    if (this.type === 'undirected') return 0;

    return this.inDegree(node, selfLoops) + this.outDegree(node, selfLoops);
  };

  /**
   * Method returning the given node's undirected degree.
   *
   * @param  {any}     node      - The node's key.
   * @param  {boolean} selfLoops - Count self-loops?
   * @return {number}            - The node's undirected degree.
   *
   * @throws {Error} - Will throw if the selfLoops arg is not boolean.
   * @throws {Error} - Will throw if the node isn't in the graph.
   */


  Graph.prototype.undirectedDegree = function undirectedDegree(node) {
    var selfLoops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (typeof selfLoops !== 'boolean') throw new _errors.InvalidArgumentsGraphError('Graph.undirectedDegree: Expecting a boolean but got "' + selfLoops + '" for the second parameter (allowing self-loops to be counted).');

    node = '' + node;

    if (!this.hasNode(node)) throw new _errors.NotFoundGraphError('Graph.undirectedDegree: could not find the "' + node + '" node in the graph.');

    if (this.type === 'directed') return 0;

    var data = this._nodes.get(node),
        loops = selfLoops ? data.undirectedSelfLoops * 2 : 0;

    return data.undirectedDegree + loops;
  };

  /**
   * Method returning the given node's degree.
   *
   * @param  {any}     node      - The node's key.
   * @param  {boolean} selfLoops - Count self-loops?
   * @return {number}            - The node's degree.
   *
   * @throws {Error} - Will throw if the selfLoops arg is not boolean.
   * @throws {Error} - Will throw if the node isn't in the graph.
   */


  Graph.prototype.degree = function degree(node) {
    var selfLoops = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (typeof selfLoops !== 'boolean') throw new _errors.InvalidArgumentsGraphError('Graph.degree: Expecting a boolean but got "' + selfLoops + '" for the second parameter (allowing self-loops to be counted).');

    node = '' + node;

    if (!this.hasNode(node)) throw new _errors.NotFoundGraphError('Graph.degree: could not find the "' + node + '" node in the graph.');

    var degree = 0;

    if (this.type !== 'undirected') degree += this.directedDegree(node, selfLoops);

    if (this.type !== 'directed') degree += this.undirectedDegree(node, selfLoops);

    return degree;
  };

  /**
   * Method returning the given edge's source.
   *
   * @param  {any} edge - The edge's key.
   * @return {any}      - The edge's source.
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */


  Graph.prototype.source = function source(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new _errors.NotFoundGraphError('Graph.source: could not find the "' + edge + '" edge in the graph.');

    return data.source.key;
  };

  /**
   * Method returning the given edge's target.
   *
   * @param  {any} edge - The edge's key.
   * @return {any}      - The edge's target.
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */


  Graph.prototype.target = function target(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new _errors.NotFoundGraphError('Graph.target: could not find the "' + edge + '" edge in the graph.');

    return data.target.key;
  };

  /**
   * Method returning the given edge's extremities.
   *
   * @param  {any}   edge - The edge's key.
   * @return {array}      - The edge's extremities.
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */


  Graph.prototype.extremities = function extremities(edge) {
    edge = '' + edge;

    var edgeData = this._edges.get(edge);

    if (!edgeData) throw new _errors.NotFoundGraphError('Graph.extremities: could not find the "' + edge + '" edge in the graph.');

    return [edgeData.source.key, edgeData.target.key];
  };

  /**
   * Given a node & an edge, returns the other extremity of the edge.
   *
   * @param  {any}   node - The node's key.
   * @param  {any}   edge - The edge's key.
   * @return {any}        - The related node.
   *
   * @throws {Error} - Will throw if either the node or the edge isn't in the graph.
   */


  Graph.prototype.opposite = function opposite(node, edge) {
    node = '' + node;
    edge = '' + edge;

    if (!this._nodes.has(node)) throw new _errors.NotFoundGraphError('Graph.opposite: could not find the "' + node + '" node in the graph.');

    var data = this._edges.get(edge);

    if (!data) throw new _errors.NotFoundGraphError('Graph.opposite: could not find the "' + edge + '" edge in the graph.');

    var sourceData = data.source,
        targetData = data.target;


    var source = sourceData.key,
        target = targetData.key;

    if (node !== source && node !== target) throw new _errors.NotFoundGraphError('Graph.opposite: the "' + node + '" node is not attached to the "' + edge + '" edge (' + source + ', ' + target + ').');

    return node === source ? target : source;
  };

  /**
   * Method returning whether the given edge is undirected.
   *
   * @param  {any}     edge - The edge's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */


  Graph.prototype.undirected = function undirected(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new _errors.NotFoundGraphError('Graph.undirected: could not find the "' + edge + '" edge in the graph.');

    return data instanceof _data.UndirectedEdgeData;
  };

  /**
   * Method returning whether the given edge is directed.
   *
   * @param  {any}     edge - The edge's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */


  Graph.prototype.directed = function directed(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new _errors.NotFoundGraphError('Graph.directed: could not find the "' + edge + '" edge in the graph.');

    return data instanceof _data.DirectedEdgeData;
  };

  /**
   * Method returning whether the given edge is a self loop.
   *
   * @param  {any}     edge - The edge's key.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the edge isn't in the graph.
   */


  Graph.prototype.selfLoop = function selfLoop(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new _errors.NotFoundGraphError('Graph.selfLoop: could not find the "' + edge + '" edge in the graph.');

    return data.source === data.target;
  };

  /**---------------------------------------------------------------------------
   * Mutation
   **---------------------------------------------------------------------------
   */

  /**
   * Method used to add a node to the graph.
   *
   * @param  {any}    node         - The node.
   * @param  {object} [attributes] - Optional attributes.
   * @return {any}                 - The node.
   *
   * @throws {Error} - Will throw if the given node already exist.
   * @throws {Error} - Will throw if the given attributes are not an object.
   */


  Graph.prototype.addNode = function addNode(node, attributes) {
    if (attributes && !(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.addNode: invalid attributes. Expecting an object but got "' + attributes + '"');

    // String coercion
    node = '' + node;
    attributes = attributes || {};

    if (this._nodes.has(node)) throw new _errors.UsageGraphError('Graph.addNode: the "' + node + '" node already exist in the graph.');

    var data = new this.NodeDataClass(node, attributes);

    // Adding the node to internal register
    this._nodes.set(node, data);

    // Emitting
    this.emit('nodeAdded', {
      key: node,
      attributes: attributes
    });

    return node;
  };

  /**
   * Method used to merge a node into the graph.
   *
   * @param  {any}    node         - The node.
   * @param  {object} [attributes] - Optional attributes.
   * @return {any}                 - The node.
   */


  Graph.prototype.mergeNode = function mergeNode(node, attributes) {
    if (attributes && !(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.mergeNode: invalid attributes. Expecting an object but got "' + attributes + '"');

    // String coercion
    node = '' + node;
    attributes = attributes || {};

    // If the node already exists, we merge the attributes
    var data = this._nodes.get(node);

    if (data) {
      if (attributes) (0, _utils.assign)(data.attributes, attributes);
      return node;
    }

    data = new this.NodeDataClass(node, attributes);

    // Adding the node to internal register
    this._nodes.set(node, data);

    // Emitting
    this.emit('nodeAdded', {
      key: node,
      attributes: attributes
    });

    return node;
  };

  /**
   * Method used to drop a single node & all its attached edges from the graph.
   *
   * @param  {any}    node - The node.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the node doesn't exist.
   */


  Graph.prototype.dropNode = function dropNode(node) {
    node = '' + node;

    if (!this.hasNode(node)) throw new _errors.NotFoundGraphError('Graph.dropNode: could not find the "' + node + '" node in the graph.');

    // Removing attached edges
    var edges = this.edges(node);

    // NOTE: we could go faster here
    for (var i = 0, l = edges.length; i < l; i++) {
      this.dropEdge(edges[i]);
    }var data = this._nodes.get(node);

    // Dropping the node from the register
    this._nodes.delete(node);

    // Emitting
    this.emit('nodeDropped', {
      key: node,
      attributes: data.attributes
    });
  };

  /**
   * Method used to drop a single edge from the graph.
   *
   * Arity 1:
   * @param  {any}    edge - The edge.
   *
   * Arity 2:
   * @param  {any}    source - Source node.
   * @param  {any}    target - Target node.
   *
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the edge doesn't exist.
   */


  Graph.prototype.dropEdge = function dropEdge(edge) {
    var edgeData = void 0;

    if (arguments.length > 1) {
      var source = '' + arguments[0],
          target = '' + arguments[1];

      edgeData = (0, _utils.getMatchingEdge)(this, source, target, this.type);

      if (!edgeData) throw new _errors.NotFoundGraphError('Graph.dropEdge: could not find the "' + source + '" -> "' + target + '" edge in the graph.');
    } else {
      edge = '' + edge;

      edgeData = this._edges.get(edge);

      if (!edgeData) throw new _errors.NotFoundGraphError('Graph.dropEdge: could not find the "' + edge + '" edge in the graph.');
    }

    // Dropping the edge from the register
    this._edges.delete(edgeData.key);

    // Updating related degrees
    var _edgeData = edgeData,
        sourceData = _edgeData.source,
        targetData = _edgeData.target,
        attributes = _edgeData.attributes;


    var undirected = edgeData instanceof _data.UndirectedEdgeData;

    if (sourceData === targetData) {
      sourceData.selfLoops--;
    } else {
      if (undirected) {
        sourceData.undirectedDegree--;
        targetData.undirectedDegree--;
      } else {
        sourceData.outDegree--;
        targetData.inDegree--;
      }
    }

    // Clearing index
    (0, _indices.clearEdgeFromStructureIndex)(this, undirected, edgeData);

    if (undirected) this._undirectedSize--;else this._directedSize--;

    // Emitting
    this.emit('edgeDropped', {
      key: edge,
      attributes: attributes,
      source: sourceData.key,
      target: targetData.key,
      undirected: undirected
    });

    return this;
  };

  /**
   * Method used to remove every edge & every node from the graph.
   *
   * @return {Graph}
   */


  Graph.prototype.clear = function clear() {

    // Clearing edges
    this._edges.clear();

    // Clearing nodes
    this._nodes.clear();

    // Emitting
    this.emit('cleared');
  };

  /**
   * Method used to remove every edge from the graph.
   *
   * @return {Graph}
   */


  Graph.prototype.clearEdges = function clearEdges() {

    // Clearing edges
    this._edges.clear();

    // Clearing indices
    this.clearIndex();

    // Emitting
    this.emit('edgesCleared');
  };

  /**---------------------------------------------------------------------------
   * Attributes-related methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning the desired graph's attribute.
   *
   * @param  {string} name - Name of the attribute.
   * @return {any}
   */


  Graph.prototype.getAttribute = function getAttribute(name) {
    return this._attributes[name];
  };

  /**
   * Method returning the graph's attributes.
   *
   * @return {object}
   */


  Graph.prototype.getAttributes = function getAttributes() {
    return this._attributes;
  };

  /**
   * Method returning whether the graph has the desired attribute.
   *
   * @param  {string}  name - Name of the attribute.
   * @return {boolean}
   */


  Graph.prototype.hasAttribute = function hasAttribute(name) {
    return this._attributes.hasOwnProperty(name);
  };

  /**
   * Method setting a value for the desired graph's attribute.
   *
   * @param  {string}  name  - Name of the attribute.
   * @param  {any}     value - Value for the attribute.
   * @return {Graph}
   */


  Graph.prototype.setAttribute = function setAttribute(name, value) {
    this._attributes[name] = value;

    // Emitting
    this.emit('attributesUpdated', {
      type: 'set',
      meta: {
        name: name,
        value: value
      }
    });

    return this;
  };

  /**
   * Method using a function to update the desired graph's attribute's value.
   *
   * @param  {string}   name    - Name of the attribute.
   * @param  {function} updater - Function use to update the attribute's value.
   * @return {Graph}
   */


  Graph.prototype.updateAttribute = function updateAttribute(name, updater) {
    if (typeof updater !== 'function') throw new _errors.InvalidArgumentsGraphError('Graph.updateAttribute: updater should be a function.');

    this._attributes[name] = updater(this._attributes[name]);

    // Emitting
    this.emit('attributesUpdated', {
      type: 'set',
      meta: {
        name: name,
        value: this._attributes[name]
      }
    });

    return this;
  };

  /**
   * Method removing the desired graph's attribute.
   *
   * @param  {string} name  - Name of the attribute.
   * @return {Graph}
   */


  Graph.prototype.removeAttribute = function removeAttribute(name) {
    delete this._attributes[name];

    // Emitting
    this.emit('attributesUpdated', {
      type: 'remove',
      meta: {
        name: name
      }
    });

    return this;
  };

  /**
   * Method replacing the graph's attributes.
   *
   * @param  {object} attributes - New attributes.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if given attributes are not a plain object.
   */


  Graph.prototype.replaceAttributes = function replaceAttributes(attributes) {
    if (!(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.replaceAttributes: provided attributes are not a plain object.');

    var before = this._attributes;

    this._attributes = attributes;

    // Emitting
    this.emit('attributesUpdated', {
      type: 'replace',
      meta: {
        before: before,
        after: attributes
      }
    });

    return this;
  };

  /**
   * Method merging the graph's attributes.
   *
   * @param  {object} attributes - Attributes to merge.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if given attributes are not a plain object.
   */


  Graph.prototype.mergeAttributes = function mergeAttributes(attributes) {
    if (!(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.mergeAttributes: provided attributes are not a plain object.');

    this._attributes = (0, _utils.assign)(this._attributes, attributes);

    // Emitting
    this.emit('attributesUpdated', {
      type: 'merge',
      meta: {
        data: this._attributes
      }
    });

    return this;
  };

  /**
   * Method returning the desired attribute for the given node.
   *
   * @param  {any}    node - Target node.
   * @param  {string} name - Name of the attribute to get.
   * @return {any}
   *
   * @throws {Error} - Will throw if the node is not found.
   */


  Graph.prototype.getNodeAttribute = function getNodeAttribute(node, name) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.getNodeAttribute: could not find the "' + node + '" node in the graph.');

    return data.attributes[name];
  };

  /**
   * Method returning the attributes for the given node.
   *
   * @param  {any}    node - Target node.
   * @return {object}
   *
   * @throws {Error} - Will throw if the node is not found.
   */


  Graph.prototype.getNodeAttributes = function getNodeAttributes(node) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.getNodeAttributes: could not find the "' + node + '" node in the graph.');

    return data.attributes;
  };

  /**
   * Method checking whether the given attribute exists for the given node.
   *
   * @param  {any}    node - Target node.
   * @param  {string} name - Name of the attribute to check.
   * @return {boolean}
   *
   * @throws {Error} - Will throw if the node is not found.
   */


  Graph.prototype.hasNodeAttribute = function hasNodeAttribute(node, name) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.hasNodeAttribute: could not find the "' + node + '" node in the graph.');

    return data.attributes.hasOwnProperty(name);
  };

  /**
   * Method checking setting the desired attribute for the given node.
   *
   * @param  {any}    node  - Target node.
   * @param  {string} name  - Name of the attribute to set.
   * @param  {any}    value - Value for the attribute.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if less than 3 arguments are passed.
   * @throws {Error} - Will throw if the node is not found.
   */


  Graph.prototype.setNodeAttribute = function setNodeAttribute(node, name, value) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.setNodeAttribute: could not find the "' + node + '" node in the graph.');

    if (arguments.length < 3) throw new _errors.InvalidArgumentsGraphError('Graph.setNodeAttribute: not enough arguments. Either you forgot to pass the attribute\'s name or value, or you meant to use #.replaceNodeAttributes / #.mergeNodeAttributes instead.');

    data.attributes[name] = value;

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'set',
      meta: {
        name: name,
        value: value
      }
    });

    return this;
  };

  /**
   * Method checking setting the desired attribute for the given node.
   *
   * @param  {any}      node    - Target node.
   * @param  {string}   name    - Name of the attribute to set.
   * @param  {function} updater - Function that will update the attribute.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if less than 3 arguments are passed.
   * @throws {Error} - Will throw if updater is not a function.
   * @throws {Error} - Will throw if the node is not found.
   */


  Graph.prototype.updateNodeAttribute = function updateNodeAttribute(node, name, updater) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.updateNodeAttribute: could not find the "' + node + '" node in the graph.');

    if (arguments.length < 3) throw new _errors.InvalidArgumentsGraphError('Graph.updateNodeAttribute: not enough arguments. Either you forgot to pass the attribute\'s name or updater, or you meant to use #.replaceNodeAttributes / #.mergeNodeAttributes instead.');

    if (typeof updater !== 'function') throw new _errors.InvalidArgumentsGraphError('Graph.updateAttribute: updater should be a function.');

    var attributes = data.attributes;

    attributes[name] = updater(attributes[name]);

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'set',
      meta: {
        name: name,
        value: attributes[name]
      }
    });

    return this;
  };

  /**
   * Method removing the desired attribute for the given node.
   *
   * @param  {any}    node  - Target node.
   * @param  {string} name  - Name of the attribute to remove.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the node is not found.
   */


  Graph.prototype.removeNodeAttribute = function removeNodeAttribute(node, name) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.hasNodeAttribute: could not find the "' + node + '" node in the graph.');

    delete data.attributes[name];

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'remove',
      meta: {
        name: name
      }
    });

    return this;
  };

  /**
   * Method completely replacing the attributes of the given node.
   *
   * @param  {any}    node       - Target node.
   * @param  {object} attributes - New attributes.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the node is not found.
   * @throws {Error} - Will throw if the given attributes is not a plain object.
   */


  Graph.prototype.replaceNodeAttributes = function replaceNodeAttributes(node, attributes) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.replaceNodeAttributes: could not find the "' + node + '" node in the graph.');

    if (!(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.replaceNodeAttributes: provided attributes are not a plain object.');

    var oldAttributes = data.attributes;

    data.attributes = attributes;

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'replace',
      meta: {
        before: oldAttributes,
        after: attributes
      }
    });

    return this;
  };

  /**
   * Method merging the attributes of the given node with the provided ones.
   *
   * @param  {any}    node       - Target node.
   * @param  {object} attributes - Attributes to merge.
   * @return {Graph}
   *
   * @throws {Error} - Will throw if the node is not found.
   * @throws {Error} - Will throw if the given attributes is not a plain object.
   */


  Graph.prototype.mergeNodeAttributes = function mergeNodeAttributes(node, attributes) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.mergeNodeAttributes: could not find the "' + node + '" node in the graph.');

    if (!(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.mergeNodeAttributes: provided attributes are not a plain object.');

    (0, _utils.assign)(data.attributes, attributes);

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: node,
      type: 'merge',
      meta: {
        data: attributes
      }
    });

    return this;
  };

  /**---------------------------------------------------------------------------
   * Iteration-related methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method iterating over the graph's adjacency using the given callback.
   *
   * @param  {function}  callback - Callback to use.
   */


  Graph.prototype.forEach = function forEach(callback) {
    if (typeof callback !== 'function') throw new _errors.InvalidArgumentsGraphError('Graph.forEach: expecting a callback.');

    this._edges.forEach(function (edgeData, key) {
      var sourceData = edgeData.source,
          targetData = edgeData.target;

      callback(sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, key, edgeData.attributes);
    });
  };

  /**
   * Method returning an iterator over the graph's adjacency.
   *
   * @return {Iterator}
   */


  Graph.prototype.adjacency = function adjacency() {
    var iterator = this._edges.values();

    return new _iterator2.default(function () {
      var step = iterator.next();

      if (step.done) return step;

      var edgeData = step.value;

      var sourceData = edgeData.source,
          targetData = edgeData.target;

      return {
        done: false,
        value: [sourceData.key, targetData.key, sourceData.attributes, targetData.attributes, edgeData.key, edgeData.attributes]
      };
    });
  };

  /**
   * Method returning the list of the graph's nodes.
   *
   * @return {array} - The nodes.
   */


  Graph.prototype.nodes = function nodes() {
    return (0, _take2.default)(this._nodes.keys(), this._nodes.size);
  };

  /**
   * Method iterating over the graph's nodes using the given callback.
   *
   * @param  {function}  callback - Callback (key, attributes, index).
   */


  Graph.prototype.forEachNode = function forEachNode(callback) {
    if (typeof callback !== 'function') throw new _errors.InvalidArgumentsGraphError('Graph.forEachNode: expecting a callback.');

    this._nodes.forEach(function (data, key) {
      callback(key, data.attributes);
    });
  };

  /**
   * Method returning an iterator over the graph's node entries.
   *
   * @return {Iterator}
   */


  Graph.prototype.nodeEntries = function nodeEntries() {
    var iterator = this._nodes.values();

    return new _iterator2.default(function () {
      var step = iterator.next();

      if (step.done) return step;

      var data = step.value;

      return { value: [data.key, data.attributes], done: false };
    });
  };

  /**---------------------------------------------------------------------------
   * Serialization
   **---------------------------------------------------------------------------
   */

  /**
   * Method exporting the target node.
   *
   * @param  {any}   node - Target node.
   * @return {array}      - The serialized node.
   *
   * @throws {Error} - Will throw if the node is not found.
   */


  Graph.prototype.exportNode = function exportNode(node) {
    node = '' + node;

    var data = this._nodes.get(node);

    if (!data) throw new _errors.NotFoundGraphError('Graph.exportNode: could not find the "' + node + '" node in the graph.');

    return (0, _serialization.serializeNode)(node, data);
  };

  /**
   * Method exporting the target edge.
   *
   * @param  {any}   edge - Target edge.
   * @return {array}      - The serialized edge.
   *
   * @throws {Error} - Will throw if the edge is not found.
   */


  Graph.prototype.exportEdge = function exportEdge(edge) {
    edge = '' + edge;

    var data = this._edges.get(edge);

    if (!data) throw new _errors.NotFoundGraphError('Graph.exportEdge: could not find the "' + edge + '" edge in the graph.');

    return (0, _serialization.serializeEdge)(edge, data);
  };

  /**
   * Method used to export the whole graph.
   *
   * @return {object} - The serialized graph.
   */


  Graph.prototype.export = function _export() {

    var nodes = new Array(this._nodes.size);

    var i = 0;

    this._nodes.forEach(function (data, key) {
      nodes[i++] = (0, _serialization.serializeNode)(key, data);
    });

    var edges = new Array(this._edges.size);

    i = 0;

    this._edges.forEach(function (data, key) {
      edges[i++] = (0, _serialization.serializeEdge)(key, data);
    });

    return {
      attributes: this.getAttributes(),
      nodes: nodes,
      edges: edges
    };
  };

  /**
   * Method used to import a serialized node.
   *
   * @param  {object} data   - The serialized node.
   * @param  {boolean} merge - Whether to merge the given node.
   * @return {Graph}         - Returns itself for chaining.
   */


  Graph.prototype.importNode = function importNode(data) {
    var merge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


    // Validating
    var error = (0, _serialization.validateSerializedNode)(data);

    if (error) {

      if (error === 'not-object') throw new _errors.InvalidArgumentsGraphError('Graph.importNode: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');
      if (error === 'no-key') throw new _errors.InvalidArgumentsGraphError('Graph.importNode: no key provided.');
      if (error === 'invalid-attributes') throw new _errors.InvalidArgumentsGraphError('Graph.importNode: invalid attributes. Attributes should be a plain object, null or omitted.');
    }

    // Adding the node
    var key = data.key,
        _data$attributes = data.attributes,
        attributes = _data$attributes === undefined ? {} : _data$attributes;


    if (merge) this.mergeNode(key, attributes);else this.addNode(key, attributes);

    return this;
  };

  /**
   * Method used to import a serialized edge.
   *
   * @param  {object}  data  - The serialized edge.
   * @param  {boolean} merge - Whether to merge the given edge.
   * @return {Graph}         - Returns itself for chaining.
   */


  Graph.prototype.importEdge = function importEdge(data) {
    var merge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


    // Validating
    var error = (0, _serialization.validateSerializedEdge)(data);

    if (error) {

      if (error === 'not-object') throw new _errors.InvalidArgumentsGraphError('Graph.importEdge: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');
      if (error === 'no-source') throw new _errors.InvalidArgumentsGraphError('Graph.importEdge: missing souce.');
      if (error === 'no-target') throw new _errors.InvalidArgumentsGraphError('Graph.importEdge: missing target.');
      if (error === 'invalid-attributes') throw new _errors.InvalidArgumentsGraphError('Graph.importEdge: invalid attributes. Attributes should be a plain object, null or omitted.');
      if (error === 'invalid-undirected') throw new _errors.InvalidArgumentsGraphError('Graph.importEdge: invalid undirected. Undirected should be boolean or omitted.');
    }

    // Adding the edge
    var source = data.source,
        target = data.target,
        _data$attributes2 = data.attributes,
        attributes = _data$attributes2 === undefined ? {} : _data$attributes2,
        _data$undirected = data.undirected,
        undirected = _data$undirected === undefined ? false : _data$undirected;


    var method = void 0;

    if ('key' in data) {
      method = merge ? undirected ? this.mergeUndirectedEdgeWithKey : this.mergeDirectedEdgeWithKey : undirected ? this.addUndirectedEdgeWithKey : this.addDirectedEdgeWithKey;

      method.call(this, data.key, source, target, attributes);
    } else {
      method = merge ? undirected ? this.mergeUndirectedEdge : this.mergeDirectedEdge : undirected ? this.addUndirectedEdge : this.addDirectedEdge;

      method.call(this, source, target, attributes);
    }

    return this;
  };

  /**
   * Method used to import a serialized graph.
   *
   * @param  {object|Graph} data  - The serialized graph.
   * @param  {boolean}      merge - Whether to merge data.
   * @return {Graph}              - Returns itself for chaining.
   */


  Graph.prototype.import = function _import(data) {
    var _this2 = this;

    var merge = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


    // Importing a Graph instance
    if ((0, _utils.isGraph)(data)) {

      this.import(data.export(), merge);
      return this;
    }

    // Importing a serialized graph
    if (!(0, _utils.isPlainObject)(data)) throw new _errors.InvalidArgumentsGraphError('Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.');

    if (data.attributes) {
      if (!(0, _utils.isPlainObject)(data.attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.import: invalid attributes. Expecting a plain object.');

      if (merge) this.mergeAttributes(data.attributes);else this.replaceAttributes(data.attributes);
    }

    // TODO: optimize
    if (data.nodes) data.nodes.forEach(function (node) {
      return _this2.importNode(node, merge);
    });

    if (data.edges) data.edges.forEach(function (edge) {
      return _this2.importEdge(edge, merge);
    });

    return this;
  };

  /**---------------------------------------------------------------------------
   * Utils
   **---------------------------------------------------------------------------
   */

  /**
   * Method returning an empty copy of the graph, i.e. a graph without nodes
   * & edges but with the exact same options.
   *
   * @return {Graph} - The empty copy.
   */


  Graph.prototype.emptyCopy = function emptyCopy() {
    return new Graph(this._options);
  };

  /**
   * Method returning an exact copy of the graph.
   *
   * @return {Graph} - The copy.
   */


  Graph.prototype.copy = function copy() {
    var graph = new Graph(this._options);
    graph.import(this);

    return graph;
  };

  /**
   * Method upgrading the graph to a mixed one.
   *
   * @return {Graph} - The copy.
   */


  Graph.prototype.upgradeToMixed = function upgradeToMixed() {
    if (this.type === 'mixed') return this;

    // Upgrading node data:
    // NOTE: maybe this could lead to some de-optimization by usual
    // JavaScript engines but I cannot be sure of it. Another solution
    // would be to reinstantiate the classes but this surely has a performance
    // and memory impact.
    this._nodes.forEach(function (data) {
      return data.upgradeToMixed();
    });

    // Mutating the options & the instance
    this._options.type = 'mixed';
    (0, _utils.readOnlyProperty)(this, 'type', this._options.type);
    (0, _utils.privateProperty)(this, 'NodeDataClass', _data.MixedNodeData);

    return this;
  };

  /**
   * Method upgrading the graph to a multi one.
   *
   * @return {Graph} - The copy.
   */


  Graph.prototype.upgradeToMulti = function upgradeToMulti() {
    if (this.multi) return this;

    // Mutating the options & the instance
    this._options.multi = true;
    (0, _utils.readOnlyProperty)(this, 'multi', true);

    // Upgrading indices
    (0, _indices.upgradeStructureIndexToMulti)(this);

    return this;
  };

  /**---------------------------------------------------------------------------
   * Indexes-related methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method used to clear the desired index to clear memory.
   *
   * @return {Graph}       - Returns itself for chaining.
   */


  Graph.prototype.clearIndex = function clearIndex() {
    (0, _indices.clearStructureIndex)(this);
    return this;
  };

  /**---------------------------------------------------------------------------
   * Known methods
   **---------------------------------------------------------------------------
   */

  /**
   * Method used by JavaScript to perform JSON serialization.
   *
   * @return {object} - The serialized graph.
   */


  Graph.prototype.toJSON = function toJSON() {
    return this.export();
  };

  /**
   * Method used to perform string coercion and returning useful information
   * about the Graph instance.
   *
   * @return {string} - String representation of the graph.
   */


  Graph.prototype.toString = function toString() {
    var pluralOrder = this.order > 1 || this.order === 0,
        pluralSize = this.size > 1 || this.size === 0;

    return 'Graph<' + (0, _utils.prettyPrint)(this.order) + ' node' + (pluralOrder ? 's' : '') + ', ' + (0, _utils.prettyPrint)(this.size) + ' edge' + (pluralSize ? 's' : '') + '>';
  };

  /**
   * Method used internally by node's console to display a custom object.
   *
   * @return {object} - Formatted object representation of the graph.
   */


  Graph.prototype.inspect = function inspect() {
    var _this3 = this;

    var nodes = {};
    this._nodes.forEach(function (data, key) {
      nodes[key] = data.attributes;
    });

    var edges = {},
        multiIndex = {};

    this._edges.forEach(function (data, key) {
      var direction = data instanceof _data.UndirectedEdgeData ? '--' : '->';

      var label = '';

      var desc = '(' + data.source.key + ')' + direction + '(' + data.target.key + ')';

      if (!data.generatedKey) {
        label += '[' + key + ']: ';
      } else if (_this3.multi) {
        if (typeof multiIndex[desc] === 'undefined') {
          multiIndex[desc] = 0;
        } else {
          multiIndex[desc]++;
        }

        label += multiIndex[desc] + '. ';
      }

      label += desc;

      edges[label] = data.attributes;
    });

    var dummy = {};

    for (var k in this) {
      if (this.hasOwnProperty(k) && !EMITTER_PROPS.has(k) && typeof this[k] !== 'function') dummy[k] = this[k];
    }

    dummy.attributes = this._attributes;
    dummy.nodes = nodes;
    dummy.edges = edges;

    (0, _utils.privateProperty)(dummy, 'constructor', this.constructor);

    return dummy;
  };

  return Graph;
}(_events.EventEmitter);

/**
 * Attaching custom inspect method for node >= 10.
 */


exports.default = Graph;
if (typeof Symbol !== 'undefined') Graph.prototype[Symbol.for('nodejs.util.inspect.custom')] = Graph.prototype.inspect;

/**
 * Attaching methods to the prototype.
 *
 * Here, we are attaching a wide variety of methods to the Graph class'
 * prototype when those are very numerous and when their creation is
 * abstracted.
 */

/**
 * Related to edge addition.
 */
EDGE_ADD_METHODS.forEach(function (method) {
  ['add', 'merge'].forEach(function (verb) {
    var name = method.name(verb),
        fn = verb === 'add' ? addEdge : mergeEdge;

    if (method.generateKey) {
      Graph.prototype[name] = function (source, target, attributes) {
        return fn(this, name, true, (method.type || this.type) === 'undirected', null, source, target, attributes);
      };
    } else {
      Graph.prototype[name] = function (edge, source, target, attributes) {
        return fn(this, name, false, (method.type || this.type) === 'undirected', edge, source, target, attributes);
      };
    }
  });
});

/**
 * Self iterator.
 */
if (typeof Symbol !== 'undefined') Graph.prototype[Symbol.iterator] = Graph.prototype.adjacency;

/**
 * Attributes-related.
 */
(0, _attributes.attachAttributesMethods)(Graph);

/**
 * Edge iteration-related.
 */
(0, _edges.attachEdgeIterationMethods)(Graph);

/**
 * Neighbor iteration-related.
 */
(0, _neighbors.attachNeighborIterationMethods)(Graph);

/***/ }),
/* 8 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStructureIndex = updateStructureIndex;
exports.clearEdgeFromStructureIndex = clearEdgeFromStructureIndex;
exports.clearStructureIndex = clearStructureIndex;
exports.upgradeStructureIndexToMulti = upgradeStructureIndexToMulti;
/**
 * Graphology Indexes Functions
 * =============================
 *
 * Bunch of functions used to compute or clear indexes.
 */

/**
 * Function updating the 'structure' index with the given edge's data.
 * Note that in the case of the multi graph, related edges are stored in a
 * set that is the same for A -> B & B <- A.
 *
 * @param {Graph}    graph      - Target Graph instance.
 * @param {EdgeData} edgeData   - Added edge's data.
 * @param {NodeData} sourceData - Source node's data.
 * @param {NodeData} targetData - Target node's data.
 */
function updateStructureIndex(graph, undirected, edgeData, source, target, sourceData, targetData) {
  var multi = graph.multi;

  var outKey = undirected ? 'undirected' : 'out',
      inKey = undirected ? 'undirected' : 'in';

  // Handling source
  var edgeOrSet = sourceData[outKey][target];

  if (typeof edgeOrSet === 'undefined') {
    edgeOrSet = multi ? new Set() : edgeData;
    sourceData[outKey][target] = edgeOrSet;
  }

  if (multi) edgeOrSet.add(edgeData);

  // If selfLoop, we break here
  if (source === target) return;

  // Handling target (we won't add the edge because it was already taken
  // care of with source above)
  if (typeof targetData[inKey][source] === 'undefined') targetData[inKey][source] = edgeOrSet;
}

/**
 * Function clearing the 'structure' index data related to the given edge.
 *
 * @param {Graph}    graph    - Target Graph instance.
 * @param {EdgeData} edgeData - Dropped edge's data.
 */
function clearEdgeFromStructureIndex(graph, undirected, edgeData) {
  var multi = graph.multi;

  var sourceData = edgeData.source,
      targetData = edgeData.target;


  var source = sourceData.key,
      target = targetData.key;

  // NOTE: since the edge set is the same for source & target, we can only
  // affect source
  var outKey = undirected ? 'undirected' : 'out',
      sourceIndex = sourceData[outKey];

  var inKey = undirected ? 'undirected' : 'in';

  if (target in sourceIndex) {

    if (multi) {
      var set = sourceIndex[target];

      if (set.size === 1) {
        delete sourceIndex[target];
        delete targetData[inKey][source];
      } else {
        set.delete(edgeData);
      }
    } else delete sourceIndex[target];
  }

  if (multi) return;

  var targetIndex = targetData[inKey];

  delete targetIndex[source];
}

/**
 * Function clearing the whole 'structure' index.
 *
 * @param {Graph} graph - Target Graph instance.
 */
function clearStructureIndex(graph) {
  graph._nodes.forEach(function (data) {

    // Clearing now useless properties
    if (typeof data.in !== 'undefined') {
      data.in = {};
      data.out = {};
    }

    if (typeof data.undirected !== 'undefined') {
      data.undirected = {};
    }
  });
}

/**
 * Function used to upgrade a simple `structure` index to a multi on.
 *
 * @param {Graph}  graph - Target Graph instance.
 */
function upgradeStructureIndexToMulti(graph) {
  graph._nodes.forEach(function (data, node) {

    // Directed
    if (data.out) {

      for (var neighbor in data.out) {
        var edges = new Set();
        edges.add(data.out[neighbor]);
        data.out[neighbor] = edges;
        graph._nodes.get(neighbor).in[node] = edges;
      }
    }

    // Undirected
    if (data.undirected) {
      for (var _neighbor in data.undirected) {
        if (_neighbor > node) continue;

        var _edges = new Set();
        _edges.add(data.undirected[_neighbor]);
        data.undirected[_neighbor] = _edges;
        graph._nodes.get(_neighbor).undirected[node] = _edges;
      }
    }
  });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachAttributesMethods = attachAttributesMethods;

var _utils = __webpack_require__(1);

var _errors = __webpack_require__(0);

var _data = __webpack_require__(3);

/**
 * Attach an attribute getter method onto the provided class.
 *
 * @param {function} Class         - Target class.
 * @param {string}   method        - Method name.
 * @param {string}   type          - Type of the edge to find.
 * @param {Class}    EdgeDataClass - Class of the edges to filter.
 */
function attachAttributeGetter(Class, method, type, EdgeDataClass) {

  /**
   * Get the desired attribute for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   * @param  {string} name    - Attribute's name.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   * @param  {string}  name   - Attribute's name.
   *
   * @return {mixed}          - The attribute's value.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, name) {
    var data = void 0;

    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new _errors.UsageGraphError('Graph.' + method + ': cannot find this type of edges in your ' + this.type + ' graph.');

    if (arguments.length > 2) {

      if (this.multi) throw new _errors.UsageGraphError('Graph.' + method + ': cannot use a {source,target} combo when asking about an edge\'s attributes in a MultiGraph since we cannot infer the one you want information about.');

      var source = '' + element,
          target = '' + name;

      name = arguments[2];

      data = (0, _utils.getMatchingEdge)(this, source, target, type);

      if (!data) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find an edge for the given path ("' + source + '" - "' + target + '").');
    } else {
      element = '' + element;
      data = this._edges.get(element);

      if (!data) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" edge in the graph.');
    }

    if (type !== 'mixed' && !(data instanceof EdgeDataClass)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" ' + type + ' edge in the graph.');

    return data.attributes[name];
  };
}

/**
 * Attach an attributes getter method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   type        - Type of the edge to find.
 * @param {Class}    EdgeDataClass - Class of the edges to filter.
 */
/**
 * Graphology Attributes methods
 * ==============================
 *
 * Attributes-related methods being exactly the same for nodes & edges,
 * we abstract them here for factorization reasons.
 */
function attachAttributesGetter(Class, method, type, EdgeDataClass) {

  /**
   * Retrieves all the target element's attributes.
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   *
   * @return {object}          - The element's attributes.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element) {
    var data = void 0;

    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new _errors.UsageGraphError('Graph.' + method + ': cannot find this type of edges in your ' + this.type + ' graph.');

    if (arguments.length > 1) {

      if (this.multi) throw new _errors.UsageGraphError('Graph.' + method + ': cannot use a {source,target} combo when asking about an edge\'s attributes in a MultiGraph since we cannot infer the one you want information about.');

      var source = '' + element,
          target = '' + arguments[1];

      data = (0, _utils.getMatchingEdge)(this, source, target, type);

      if (!data) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find an edge for the given path ("' + source + '" - "' + target + '").');
    } else {
      element = '' + element;
      data = this._edges.get(element);

      if (!data) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" edge in the graph.');
    }

    if (type !== 'mixed' && !(data instanceof EdgeDataClass)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" ' + type + ' edge in the graph.');

    return data.attributes;
  };
}

/**
 * Attach an attribute checker method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   type        - Type of the edge to find.
 * @param {Class}    EdgeDataClass - Class of the edges to filter.
 */
function attachAttributeChecker(Class, method, type, EdgeDataClass) {

  /**
   * Checks whether the desired attribute is set for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   * @param  {string} name    - Attribute's name.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   * @param  {string}  name   - Attribute's name.
   *
   * @return {boolean}
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, name) {
    var data = void 0;

    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new _errors.UsageGraphError('Graph.' + method + ': cannot find this type of edges in your ' + this.type + ' graph.');

    if (arguments.length > 2) {

      if (this.multi) throw new _errors.UsageGraphError('Graph.' + method + ': cannot use a {source,target} combo when asking about an edge\'s attributes in a MultiGraph since we cannot infer the one you want information about.');

      var source = '' + element,
          target = '' + name;

      name = arguments[2];

      data = (0, _utils.getMatchingEdge)(this, source, target, type);

      if (!data) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find an edge for the given path ("' + source + '" - "' + target + '").');
    } else {
      element = '' + element;
      data = this._edges.get(element);

      if (!data) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" edge in the graph.');
    }

    if (type !== 'mixed' && !(data instanceof EdgeDataClass)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" ' + type + ' edge in the graph.');

    return data.attributes.hasOwnProperty(name);
  };
}

/**
 * Attach an attribute setter method onto the provided class.
 *
 * @param {function} Class         - Target class.
 * @param {string}   method        - Method name.
 * @param {string}   type          - Type of the edge to find.
 * @param {Class}    EdgeDataClass - Class of the edges to filter.
 */
function attachAttributeSetter(Class, method, type, EdgeDataClass) {

  /**
   * Set the desired attribute for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   * @param  {string} name    - Attribute's name.
   * @param  {mixed}  value   - New attribute value.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   * @param  {string}  name   - Attribute's name.
   * @param  {mixed}  value   - New attribute value.
   *
   * @return {Graph}          - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, name, value) {
    var data = void 0;

    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new _errors.UsageGraphError('Graph.' + method + ': cannot find this type of edges in your ' + this.type + ' graph.');

    if (arguments.length > 3) {

      if (this.multi) throw new _errors.UsageGraphError('Graph.' + method + ': cannot use a {source,target} combo when asking about an edge\'s attributes in a MultiGraph since we cannot infer the one you want information about.');

      var source = '' + element,
          target = '' + name;

      name = arguments[2];
      value = arguments[3];

      data = (0, _utils.getMatchingEdge)(this, source, target, type);

      if (!data) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find an edge for the given path ("' + source + '" - "' + target + '").');
    } else {
      element = '' + element;
      data = this._edges.get(element);

      if (!data) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" edge in the graph.');
    }

    if (type !== 'mixed' && !(data instanceof EdgeDataClass)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" ' + type + ' edge in the graph.');

    data.attributes[name] = value;

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: data.key,
      type: 'set',
      meta: {
        name: name,
        value: value
      }
    });

    return this;
  };
}

/**
 * Attach an attribute updater method onto the provided class.
 *
 * @param {function} Class         - Target class.
 * @param {string}   method        - Method name.
 * @param {string}   type          - Type of the edge to find.
 * @param {Class}    EdgeDataClass - Class of the edges to filter.
 */
function attachAttributeUpdater(Class, method, type, EdgeDataClass) {

  /**
   * Update the desired attribute for the given element (node or edge) using
   * the provided function.
   *
   * Arity 2:
   * @param  {any}      element - Target element.
   * @param  {string}   name    - Attribute's name.
   * @param  {function} updater - Updater function.
   *
   * Arity 3 (only for edges):
   * @param  {any}      source  - Source element.
   * @param  {any}      target  - Target element.
   * @param  {string}   name    - Attribute's name.
   * @param  {function} updater - Updater function.
   *
   * @return {Graph}            - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, name, updater) {
    var data = void 0;

    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new _errors.UsageGraphError('Graph.' + method + ': cannot find this type of edges in your ' + this.type + ' graph.');

    if (arguments.length > 3) {

      if (this.multi) throw new _errors.UsageGraphError('Graph.' + method + ': cannot use a {source,target} combo when asking about an edge\'s attributes in a MultiGraph since we cannot infer the one you want information about.');

      var source = '' + element,
          target = '' + name;

      name = arguments[2];
      updater = arguments[3];

      data = (0, _utils.getMatchingEdge)(this, source, target, type);

      if (!data) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find an edge for the given path ("' + source + '" - "' + target + '").');
    } else {
      element = '' + element;
      data = this._edges.get(element);

      if (!data) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" edge in the graph.');
    }

    if (typeof updater !== 'function') throw new _errors.InvalidArgumentsGraphError('Graph.' + method + ': updater should be a function.');

    if (type !== 'mixed' && !(data instanceof EdgeDataClass)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" ' + type + ' edge in the graph.');

    data.attributes[name] = updater(data.attributes[name]);

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: data.key,
      type: 'set',
      meta: {
        name: name,
        value: data.attributes[name]
      }
    });

    return this;
  };
}

/**
 * Attach an attribute remover method onto the provided class.
 *
 * @param {function} Class         - Target class.
 * @param {string}   method        - Method name.
 * @param {string}   type          - Type of the edge to find.
 * @param {Class}    EdgeDataClass - Class of the edges to filter.
 */
function attachAttributeRemover(Class, method, type, EdgeDataClass) {

  /**
   * Remove the desired attribute for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   * @param  {string} name    - Attribute's name.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   * @param  {string}  name   - Attribute's name.
   *
   * @return {Graph}          - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, name) {
    var data = void 0;

    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new _errors.UsageGraphError('Graph.' + method + ': cannot find this type of edges in your ' + this.type + ' graph.');

    if (arguments.length > 2) {

      if (this.multi) throw new _errors.UsageGraphError('Graph.' + method + ': cannot use a {source,target} combo when asking about an edge\'s attributes in a MultiGraph since we cannot infer the one you want information about.');

      var source = '' + element,
          target = '' + name;

      name = arguments[2];

      data = (0, _utils.getMatchingEdge)(this, source, target, type);

      if (!data) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find an edge for the given path ("' + source + '" - "' + target + '").');
    } else {
      element = '' + element;
      data = this._edges.get(element);

      if (!data) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" edge in the graph.');
    }

    if (type !== 'mixed' && !(data instanceof EdgeDataClass)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" ' + type + ' edge in the graph.');

    delete data.attributes[name];

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: data.key,
      type: 'remove',
      meta: {
        name: name
      }
    });

    return this;
  };
}

/**
 * Attach an attribute replacer method onto the provided class.
 *
 * @param {function} Class         - Target class.
 * @param {string}   method        - Method name.
 * @param {string}   type          - Type of the edge to find.
 * @param {Class}    EdgeDataClass - Class of the edges to filter.
 */
function attachAttributesReplacer(Class, method, type, EdgeDataClass) {

  /**
   * Replace the attributes for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element    - Target element.
   * @param  {object} attributes - New attributes.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source     - Source element.
   * @param  {any}     target     - Target element.
   * @param  {object}  attributes - New attributes.
   *
   * @return {Graph}              - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, attributes) {
    var data = void 0;

    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new _errors.UsageGraphError('Graph.' + method + ': cannot find this type of edges in your ' + this.type + ' graph.');

    if (arguments.length > 2) {

      if (this.multi) throw new _errors.UsageGraphError('Graph.' + method + ': cannot use a {source,target} combo when asking about an edge\'s attributes in a MultiGraph since we cannot infer the one you want information about.');

      var source = '' + element,
          target = '' + attributes;

      attributes = arguments[2];

      data = (0, _utils.getMatchingEdge)(this, source, target, type);

      if (!data) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find an edge for the given path ("' + source + '" - "' + target + '").');
    } else {
      element = '' + element;
      data = this._edges.get(element);

      if (!data) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" edge in the graph.');
    }

    if (!(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.' + method + ': provided attributes are not a plain object.');

    if (type !== 'mixed' && !(data instanceof EdgeDataClass)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" ' + type + ' edge in the graph.');

    var oldAttributes = data.attributes;

    data.attributes = attributes;

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: data.key,
      type: 'replace',
      meta: {
        before: oldAttributes,
        after: attributes
      }
    });

    return this;
  };
}

/**
 * Attach an attribute merger method onto the provided class.
 *
 * @param {function} Class         - Target class.
 * @param {string}   method        - Method name.
 * @param {string}   type          - Type of the edge to find.
 * @param {Class}    EdgeDataClass - Class of the edges to filter.
 */
function attachAttributesMerger(Class, method, type, EdgeDataClass) {

  /**
   * Replace the attributes for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element    - Target element.
   * @param  {object} attributes - Attributes to merge.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source     - Source element.
   * @param  {any}     target     - Target element.
   * @param  {object}  attributes - Attributes to merge.
   *
   * @return {Graph}              - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function (element, attributes) {
    var data = void 0;

    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type) throw new _errors.UsageGraphError('Graph.' + method + ': cannot find this type of edges in your ' + this.type + ' graph.');

    if (arguments.length > 2) {

      if (this.multi) throw new _errors.UsageGraphError('Graph.' + method + ': cannot use a {source,target} combo when asking about an edge\'s attributes in a MultiGraph since we cannot infer the one you want information about.');

      var source = '' + element,
          target = '' + attributes;

      attributes = arguments[2];

      data = (0, _utils.getMatchingEdge)(this, source, target, type);

      if (!data) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find an edge for the given path ("' + source + '" - "' + target + '").');
    } else {
      element = '' + element;
      data = this._edges.get(element);

      if (!data) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" edge in the graph.');
    }

    if (!(0, _utils.isPlainObject)(attributes)) throw new _errors.InvalidArgumentsGraphError('Graph.' + method + ': provided attributes are not a plain object.');

    if (type !== 'mixed' && !(data instanceof EdgeDataClass)) throw new _errors.NotFoundGraphError('Graph.' + method + ': could not find the "' + element + '" ' + type + ' edge in the graph.');

    (0, _utils.assign)(data.attributes, attributes);

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: data.key,
      type: 'merge',
      meta: {
        data: attributes
      }
    });

    return this;
  };
}

/**
 * List of methods to attach.
 */
var ATTRIBUTES_METHODS = [{
  name: function name(element) {
    return 'get' + element + 'Attribute';
  },
  attacher: attachAttributeGetter
}, {
  name: function name(element) {
    return 'get' + element + 'Attributes';
  },
  attacher: attachAttributesGetter
}, {
  name: function name(element) {
    return 'has' + element + 'Attribute';
  },
  attacher: attachAttributeChecker
}, {
  name: function name(element) {
    return 'set' + element + 'Attribute';
  },
  attacher: attachAttributeSetter
}, {
  name: function name(element) {
    return 'update' + element + 'Attribute';
  },
  attacher: attachAttributeUpdater
}, {
  name: function name(element) {
    return 'remove' + element + 'Attribute';
  },
  attacher: attachAttributeRemover
}, {
  name: function name(element) {
    return 'replace' + element + 'Attributes';
  },
  attacher: attachAttributesReplacer
}, {
  name: function name(element) {
    return 'merge' + element + 'Attributes';
  },
  attacher: attachAttributesMerger
}];

/**
 * Attach every attributes-related methods to a Graph class.
 *
 * @param {function} Graph - Target class.
 */
function attachAttributesMethods(Graph) {
  ATTRIBUTES_METHODS.forEach(function (_ref) {
    var name = _ref.name,
        attacher = _ref.attacher;


    // For edges
    attacher(Graph, name('Edge'), 'mixed', _data.DirectedEdgeData);

    // For directed edges
    attacher(Graph, name('DirectedEdge'), 'directed', _data.DirectedEdgeData);

    // For undirected edges
    attacher(Graph, name('UndirectedEdge'), 'undirected', _data.UndirectedEdgeData);
  });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachEdgeIteratorCreator = attachEdgeIteratorCreator;
exports.attachEdgeIterationMethods = attachEdgeIterationMethods;

var _iterator = __webpack_require__(2);

var _iterator2 = _interopRequireDefault(_iterator);

var _chain = __webpack_require__(5);

var _chain2 = _interopRequireDefault(_chain);

var _take = __webpack_require__(4);

var _take2 = _interopRequireDefault(_take);

var _errors = __webpack_require__(0);

var _data = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Definitions.
 */
var EDGES_ITERATION = [{
  name: 'edges',
  type: 'mixed'
}, {
  name: 'inEdges',
  type: 'directed',
  direction: 'in'
}, {
  name: 'outEdges',
  type: 'directed',
  direction: 'out'
}, {
  name: 'inboundEdges',
  type: 'mixed',
  direction: 'in'
}, {
  name: 'outboundEdges',
  type: 'mixed',
  direction: 'out'
}, {
  name: 'directedEdges',
  type: 'directed'
}, {
  name: 'undirectedEdges',
  type: 'undirected'
}];

/**
 * Function collecting edges from the given object.
 *
 * @param  {array}  edges  - Edges array to populate.
 * @param  {object} object - Target object.
 * @return {array}         - The found edges.
 */
/**
 * Graphology Edge Iteration
 * ==========================
 *
 * Attaching some methods to the Graph class to be able to iterate over a
 * graph's edges.
 */
function collect(edges, object) {
  for (var k in object) {
    if (object[k] instanceof Set) object[k].forEach(function (edgeData) {
      return edges.push(edgeData.key);
    });else edges.push(object[k].key);
  }
}

/**
 * Function iterating over edges from the given object using a callback.
 *
 * @param {object}   object   - Target object.
 * @param {function} callback - Function to call.
 */
function forEach(object, callback) {
  for (var k in object) {
    if (object[k] instanceof Set) object[k].forEach(function (edgeData) {
      return callback(edgeData.key, edgeData.attributes, edgeData.source.key, edgeData.target.key, edgeData.source.attributes, edgeData.target.attributes);
    });else {
      var edgeData = object[k];

      callback(edgeData.key, edgeData.attributes, edgeData.source.key, edgeData.target.key, edgeData.source.attributes, edgeData.target.attributes);
    }
  }
}

/**
 * Function returning an iterator over edges from the given object.
 *
 * @param  {object}   object - Target object.
 * @return {Iterator}
 */
function createIterator(object) {
  var keys = Object.keys(object),
      l = keys.length;

  var inner = null,
      i = 0;

  return new _iterator2.default(function next() {
    var edgeData = void 0;

    if (inner) {
      var step = inner.next();

      if (step.done) {
        inner = null;
        i++;
        return next();
      }

      edgeData = step.value;
    } else {
      if (i >= l) return { done: true };

      var k = keys[i];

      edgeData = object[k];

      if (edgeData instanceof Set) {
        inner = edgeData.values();
        return next();
      }

      i++;
    }

    return {
      done: false,
      value: [edgeData.key, edgeData.attributes, edgeData.source.key, edgeData.target.key, edgeData.source.attributes, edgeData.target.attributes]
    };
  });
}

/**
 * Function collecting edges from the given object at given key.
 *
 * @param  {array}  edges  - Edges array to populate.
 * @param  {object} object - Target object.
 * @param  {mixed}  k      - Neighbor key.
 * @return {array}         - The found edges.
 */
function collectForKey(edges, object, k) {

  if (!(k in object)) return;

  if (object[k] instanceof Set) object[k].forEach(function (edgeData) {
    return edges.push(edgeData.key);
  });else edges.push(object[k].key);

  return;
}

/**
 * Function iterating over the egdes from the object at given key using
 * a callback.
 *
 * @param {object}   object   - Target object.
 * @param {mixed}    k        - Neighbor key.
 * @param {function} callback - Callback to use.
 */
function forEachForKey(object, k, callback) {

  if (!(k in object)) return;

  if (object[k] instanceof Set) object[k].forEach(function (edgeData) {
    return callback(edgeData.key, edgeData.attributes, edgeData.source.key, edgeData.target.key, edgeData.source.attributes, edgeData.target.attributes);
  });else {
    var edgeData = object[k];

    callback(edgeData.key, edgeData.attributes, edgeData.source.key, edgeData.target.key, edgeData.source.attributes, edgeData.target.attributes);
  }

  return;
}

/**
 * Function returning an iterator over the egdes from the object at given key.
 *
 * @param  {object}   object   - Target object.
 * @param  {mixed}    k        - Neighbor key.
 * @return {Iterator}
 */
function createIteratorForKey(object, k) {
  var v = object[k];

  if (v instanceof Set) {
    var iterator = v.values();

    return new _iterator2.default(function () {
      var step = iterator.next();

      if (step.done) return step;

      var edgeData = step.value;

      return {
        done: false,
        value: [edgeData.key, edgeData.attributes, edgeData.source.key, edgeData.target.key, edgeData.source.attributes, edgeData.target.attributes]
      };
    });
  }

  return _iterator2.default.of([v.key, v.attributes, v.source.key, v.target.key, v.source.attributes, v.target.attributes]);
}

/**
 * Function creating an array of edges for the given type.
 *
 * @param  {Graph}   graph - Target Graph instance.
 * @param  {string}  type  - Type of edges to retrieve.
 * @return {array}         - Array of edges.
 */
function createEdgeArray(graph, type) {
  if (graph.size === 0) return [];

  if (type === 'mixed' || type === graph.type) return (0, _take2.default)(graph._edges.keys(), graph._edges.size);

  var size = type === 'undirected' ? graph.undirectedSize : graph.directedSize;

  var list = new Array(size),
      mask = type === 'undirected';

  var i = 0;

  graph._edges.forEach(function (data, edge) {

    if (data instanceof _data.UndirectedEdgeData === mask) list[i++] = edge;
  });

  return list;
}

/**
 * Function iterating over a graph's edges using a callback.
 *
 * @param  {Graph}    graph    - Target Graph instance.
 * @param  {string}   type     - Type of edges to retrieve.
 * @param  {function} callback - Function to call.
 */
function forEachEdge(graph, type, callback) {
  if (graph.size === 0) return;

  if (type === 'mixed' || type === graph.type) {
    graph._edges.forEach(function (data, key) {
      var attributes = data.attributes,
          source = data.source,
          target = data.target;


      callback(key, attributes, source.key, target.key, source.attributes, target.attributes);
    });
  } else {
    var mask = type === 'undirected';

    graph._edges.forEach(function (data, key) {
      if (data instanceof _data.UndirectedEdgeData === mask) {
        var attributes = data.attributes,
            source = data.source,
            target = data.target;


        callback(key, attributes, source.key, target.key, source.attributes, target.attributes);
      }
    });
  }
}

/**
 * Function creating an iterator of edges for the given type.
 *
 * @param  {Graph}    graph - Target Graph instance.
 * @param  {string}   type  - Type of edges to retrieve.
 * @return {Iterator}
 */
function createEdgeIterator(graph, type) {
  if (graph.size === 0) return _iterator2.default.empty();

  var iterator = void 0;

  if (type === 'mixed') {
    iterator = graph._edges.values();

    return new _iterator2.default(function next() {
      var step = iterator.next();

      if (step.done) return step;

      var data = step.value;

      var value = [data.key, data.attributes, data.source.key, data.target.key, data.source.attributes, data.target.attributes];

      return { value: value, done: false };
    });
  }

  iterator = graph._edges.values();

  return new _iterator2.default(function next() {
    var step = iterator.next();

    if (step.done) return step;

    var data = step.value;

    if (data instanceof _data.UndirectedEdgeData === (type === 'undirected')) {
      var value = [data.key, data.attributes, data.source.key, data.target.key, data.source.attributes, data.target.attributes];

      return { value: value, done: false };
    }

    return next();
  });
}

/**
 * Function creating an array of edges for the given type & the given node.
 *
 * @param  {string}  type      - Type of edges to retrieve.
 * @param  {string}  direction - In or out?
 * @param  {any}     nodeData  - Target node's data.
 * @return {array}             - Array of edges.
 */
function createEdgeArrayForNode(type, direction, nodeData) {
  var edges = [];

  if (type !== 'undirected') {
    if (direction !== 'out') collect(edges, nodeData.in);
    if (direction !== 'in') collect(edges, nodeData.out);
  }

  if (type !== 'directed') {
    collect(edges, nodeData.undirected);
  }

  return edges;
}

/**
 * Function iterating over a node's edges using a callback.
 *
 * @param  {string}   type      - Type of edges to retrieve.
 * @param  {string}   direction - In or out?
 * @param  {any}      nodeData  - Target node's data.
 * @param  {function} callback  - Function to call.
 */
function forEachEdgeForNode(type, direction, nodeData, callback) {

  if (type !== 'undirected') {
    if (direction !== 'out') forEach(nodeData.in, callback);
    if (direction !== 'in') forEach(nodeData.out, callback);
  }

  if (type !== 'directed') {
    forEach(nodeData.undirected, callback);
  }
}

/**
 * Function iterating over a node's edges using a callback.
 *
 * @param  {string}   type      - Type of edges to retrieve.
 * @param  {string}   direction - In or out?
 * @param  {any}      nodeData  - Target node's data.
 * @return {Iterator}
 */
function createEdgeIteratorForNode(type, direction, nodeData) {
  var iterator = _iterator2.default.empty();

  if (type !== 'undirected') {
    if (direction !== 'out' && typeof nodeData.in !== 'undefined') iterator = (0, _chain2.default)(iterator, createIterator(nodeData.in));
    if (direction !== 'in' && typeof nodeData.out !== 'undefined') iterator = (0, _chain2.default)(iterator, createIterator(nodeData.out));
  }

  if (type !== 'directed' && typeof nodeData.undirected !== 'undefined') {
    iterator = (0, _chain2.default)(iterator, createIterator(nodeData.undirected));
  }

  return iterator;
}

/**
 * Function creating an array of edges for the given path.
 *
 * @param  {string}   type       - Type of edges to retrieve.
 * @param  {string}   direction  - In or out?
 * @param  {NodeData} sourceData - Source node's data.
 * @param  {any}      target     - Target node.
 * @return {array}               - Array of edges.
 */
function createEdgeArrayForPath(type, direction, sourceData, target) {
  var edges = [];

  if (type !== 'undirected') {

    if (typeof sourceData.in !== 'undefined' && direction !== 'out') collectForKey(edges, sourceData.in, target);

    if (typeof sourceData.out !== 'undefined' && direction !== 'in') collectForKey(edges, sourceData.out, target);
  }

  if (type !== 'directed') {
    if (typeof sourceData.undirected !== 'undefined') collectForKey(edges, sourceData.undirected, target);
  }

  return edges;
}

/**
 * Function iterating over edges for the given path using a callback.
 *
 * @param  {string}   type       - Type of edges to retrieve.
 * @param  {string}   direction  - In or out?
 * @param  {NodeData} sourceData - Source node's data.
 * @param  {string}   target     - Target node.
 * @param  {function} callback   - Function to call.
 */
function forEachEdgeForPath(type, direction, sourceData, target, callback) {
  if (type !== 'undirected') {

    if (typeof sourceData.in !== 'undefined' && direction !== 'out') forEachForKey(sourceData.in, target, callback);

    if (typeof sourceData.out !== 'undefined' && direction !== 'in') forEachForKey(sourceData.out, target, callback);
  }

  if (type !== 'directed') {
    if (typeof sourceData.undirected !== 'undefined') forEachForKey(sourceData.undirected, target, callback);
  }
}

/**
 * Function returning an iterator over edges for the given path.
 *
 * @param  {string}   type       - Type of edges to retrieve.
 * @param  {string}   direction  - In or out?
 * @param  {NodeData} sourceData - Source node's data.
 * @param  {string}   target     - Target node.
 * @param  {function} callback   - Function to call.
 */
function createEdgeIteratorForPath(type, direction, sourceData, target) {
  var iterator = _iterator2.default.empty();

  if (type !== 'undirected') {

    if (typeof sourceData.in !== 'undefined' && direction !== 'out' && target in sourceData.in) iterator = (0, _chain2.default)(iterator, createIteratorForKey(sourceData.in, target));

    if (typeof sourceData.out !== 'undefined' && direction !== 'in' && target in sourceData.out) iterator = (0, _chain2.default)(iterator, createIteratorForKey(sourceData.out, target));
  }

  if (type !== 'directed') {
    if (typeof sourceData.undirected !== 'undefined' && target in sourceData.undirected) iterator = (0, _chain2.default)(iterator, createIteratorForKey(sourceData.undirected, target));
  }

  return iterator;
}

/**
 * Function attaching an edge array creator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachEdgeArrayCreator(Class, description) {
  var name = description.name,
      type = description.type,
      direction = description.direction;

  /**
   * Function returning an array of certain edges.
   *
   * Arity 0: Return all the relevant edges.
   *
   * Arity 1: Return all of a node's relevant edges.
   * @param  {any}   node   - Target node.
   *
   * Arity 2: Return the relevant edges across the given path.
   * @param  {any}   source - Source node.
   * @param  {any}   target - Target node.
   *
   * @return {array|number} - The edges or the number of edges.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */

  Class.prototype[name] = function (source, target) {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return [];

    if (!arguments.length) return createEdgeArray(this, type);

    if (arguments.length === 1) {
      source = '' + source;

      var nodeData = this._nodes.get(source);

      if (typeof nodeData === 'undefined') throw new _errors.NotFoundGraphError('Graph.' + name + ': could not find the "' + source + '" node in the graph.');

      // Iterating over a node's edges
      return createEdgeArrayForNode(type === 'mixed' ? this.type : type, direction, nodeData);
    }

    if (arguments.length === 2) {
      source = '' + source;
      target = '' + target;

      var sourceData = this._nodes.get(source);

      if (!sourceData) throw new _errors.NotFoundGraphError('Graph.' + name + ':  could not find the "' + source + '" source node in the graph.');

      if (!this._nodes.has(target)) throw new _errors.NotFoundGraphError('Graph.' + name + ':  could not find the "' + target + '" target node in the graph.');

      // Iterating over the edges between source & target
      return createEdgeArrayForPath(type, direction, sourceData, target);
    }

    throw new _errors.InvalidArgumentsGraphError('Graph.' + name + ': too many arguments (expecting 0, 1 or 2 and got ' + arguments.length + ').');
  };
}

/**
 * Function attaching a edge callback iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachForEachEdge(Class, description) {
  var name = description.name,
      type = description.type,
      direction = description.direction;


  var forEachName = 'forEach' + name[0].toUpperCase() + name.slice(1, -1);

  /**
   * Function iterating over the graph's relevant edges by applying the given
   * callback.
   *
   * Arity 1: Iterate over all the relevant edges.
   * @param  {function} callback - Callback to use.
   *
   * Arity 2: Iterate over all of a node's relevant edges.
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   *
   * Arity 3: Iterate over the relevant edges across the given path.
   * @param  {any}      source   - Source node.
   * @param  {any}      target   - Target node.
   * @param  {function} callback - Callback to use.
   *
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  Class.prototype[forEachName] = function (source, target, callback) {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return;

    if (arguments.length === 1) {
      callback = source;
      return forEachEdge(this, type, callback);
    }

    if (arguments.length === 2) {
      source = '' + source;
      callback = target;

      var nodeData = this._nodes.get(source);

      if (typeof nodeData === 'undefined') throw new _errors.NotFoundGraphError('Graph.' + forEachName + ': could not find the "' + source + '" node in the graph.');

      // Iterating over a node's edges
      return forEachEdgeForNode(type === 'mixed' ? this.type : type, direction, nodeData, callback);
    }

    if (arguments.length === 3) {
      source = '' + source;
      target = '' + target;

      var sourceData = this._nodes.get(source);

      if (!sourceData) throw new _errors.NotFoundGraphError('Graph.' + forEachName + ':  could not find the "' + source + '" source node in the graph.');

      if (!this._nodes.has(target)) throw new _errors.NotFoundGraphError('Graph.' + forEachName + ':  could not find the "' + target + '" target node in the graph.');

      // Iterating over the edges between source & target
      return forEachEdgeForPath(type, direction, sourceData, target, callback);
    }

    throw new _errors.InvalidArgumentsGraphError('Graph.' + forEachName + ': too many arguments (expecting 1, 2 or 3 and got ' + arguments.length + ').');
  };
}

/**
 * Function attaching an edge iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachEdgeIteratorCreator(Class, description) {
  var originalName = description.name,
      type = description.type,
      direction = description.direction;


  var name = originalName.slice(0, -1) + 'Entries';

  /**
   * Function returning an iterator over the graph's edges.
   *
   * Arity 0: Iterate over all the relevant edges.
   *
   * Arity 1: Iterate over all of a node's relevant edges.
   * @param  {any}   node   - Target node.
   *
   * Arity 2: Iterate over the relevant edges across the given path.
   * @param  {any}   source - Source node.
   * @param  {any}   target - Target node.
   *
   * @return {array|number} - The edges or the number of edges.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  Class.prototype[name] = function (source, target) {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return _iterator2.default.empty();

    if (!arguments.length) return createEdgeIterator(this, type);

    if (arguments.length === 1) {
      source = '' + source;

      var sourceData = this._nodes.get(source);

      if (!sourceData) throw new _errors.NotFoundGraphError('Graph.' + name + ': could not find the "' + source + '" node in the graph.');

      // Iterating over a node's edges
      return createEdgeIteratorForNode(type, direction, sourceData);
    }

    if (arguments.length === 2) {
      source = '' + source;
      target = '' + target;

      var _sourceData = this._nodes.get(source);

      if (!_sourceData) throw new _errors.NotFoundGraphError('Graph.' + name + ':  could not find the "' + source + '" source node in the graph.');

      if (!this._nodes.has(target)) throw new _errors.NotFoundGraphError('Graph.' + name + ':  could not find the "' + target + '" target node in the graph.');

      // Iterating over the edges between source & target
      return createEdgeIteratorForPath(type, direction, _sourceData, target);
    }

    throw new _errors.InvalidArgumentsGraphError('Graph.' + name + ': too many arguments (expecting 0, 1 or 2 and got ' + arguments.length + ').');
  };
}

/**
 * Function attaching every edge iteration method to the Graph class.
 *
 * @param {function} Graph - Graph class.
 */
function attachEdgeIterationMethods(Graph) {
  EDGES_ITERATION.forEach(function (description) {
    attachEdgeArrayCreator(Graph, description);
    attachForEachEdge(Graph, description);
    attachEdgeIteratorCreator(Graph, description);
  });
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachNeighborIterationMethods = attachNeighborIterationMethods;

var _iterator = __webpack_require__(2);

var _iterator2 = _interopRequireDefault(_iterator);

var _chain = __webpack_require__(5);

var _chain2 = _interopRequireDefault(_chain);

var _take = __webpack_require__(4);

var _take2 = _interopRequireDefault(_take);

var _errors = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Definitions.
 */
/**
 * Graphology Neighbor Iteration
 * ==============================
 *
 * Attaching some methods to the Graph class to be able to iterate over
 * neighbors.
 */
var NEIGHBORS_ITERATION = [{
  name: 'neighbors',
  type: 'mixed'
}, {
  name: 'inNeighbors',
  type: 'directed',
  direction: 'in'
}, {
  name: 'outNeighbors',
  type: 'directed',
  direction: 'out'
}, {
  name: 'inboundNeighbors',
  type: 'mixed',
  direction: 'in'
}, {
  name: 'outboundNeighbors',
  type: 'mixed',
  direction: 'out'
}, {
  name: 'directedNeighbors',
  type: 'directed'
}, {
  name: 'undirectedNeighbors',
  type: 'undirected'
}];

/**
 * Function merging neighbors into the given set iterating over the given object.
 *
 * @param {BasicSet} neighbors - Neighbors set.
 * @param {object}   object    - Target object.
 */
function merge(neighbors, object) {
  if (typeof object === 'undefined') return;

  for (var neighbor in object) {
    neighbors.add(neighbor);
  }
}

/**
 * Function creating an array of relevant neighbors for the given node.
 *
 * @param  {string}       type      - Type of neighbors.
 * @param  {string}       direction - Direction.
 * @param  {any}          nodeData  - Target node's data.
 * @return {Array}                  - The list of neighbors.
 */
function createNeighborArrayForNode(type, direction, nodeData) {

  // If we want only undirected or in or out, we can roll some optimizations
  if (type !== 'mixed') {
    if (type === 'undirected') return Object.keys(nodeData.undirected);

    if (typeof direction === 'string') return Object.keys(nodeData[direction]);
  }

  // Else we need to keep a set of neighbors not to return duplicates
  var neighbors = new Set();

  if (type !== 'undirected') {

    if (direction !== 'out') {
      merge(neighbors, nodeData.in);
    }
    if (direction !== 'in') {
      merge(neighbors, nodeData.out);
    }
  }

  if (type !== 'directed') {
    merge(neighbors, nodeData.undirected);
  }

  return (0, _take2.default)(neighbors.values(), neighbors.size);
}

/**
 * Function iterating over the given node's relevant neighbors using a
 * callback.
 *
 * @param  {string}   type      - Type of neighbors.
 * @param  {string}   direction - Direction.
 * @param  {any}      nodeData  - Target node's data.
 * @param  {function} callback  - Callback to use.
 */
function forEachInObject(nodeData, object, callback) {
  for (var k in object) {
    var edgeData = object[k];

    if (edgeData instanceof Set) edgeData = edgeData.values().next().value;

    var sourceData = edgeData.source,
        targetData = edgeData.target;

    var neighborData = sourceData === nodeData ? targetData : sourceData;

    callback(neighborData.key, neighborData.attributes);
  }
}

function forEachInObjectOnce(visited, nodeData, object, callback) {
  for (var k in object) {
    var edgeData = object[k];

    if (edgeData instanceof Set) edgeData = edgeData.values().next().value;

    var sourceData = edgeData.source,
        targetData = edgeData.target;

    var neighborData = sourceData === nodeData ? targetData : sourceData;

    if (visited.has(neighborData.key)) continue;

    visited.add(neighborData.key);

    callback(neighborData.key, neighborData.attributes);
  }
}

function forEachNeighborForNode(type, direction, nodeData, callback) {

  // If we want only undirected or in or out, we can roll some optimizations
  if (type !== 'mixed') {
    if (type === 'undirected') return forEachInObject(nodeData, nodeData.undirected, callback);

    if (typeof direction === 'string') return forEachInObject(nodeData, nodeData[direction], callback);
  }

  // Else we need to keep a set of neighbors not to return duplicates
  var visited = new Set();

  if (type !== 'undirected') {

    if (direction !== 'out') {
      forEachInObjectOnce(visited, nodeData, nodeData.in, callback);
    }
    if (direction !== 'in') {
      forEachInObjectOnce(visited, nodeData, nodeData.out, callback);
    }
  }

  if (type !== 'directed') {
    forEachInObjectOnce(visited, nodeData, nodeData.undirected, callback);
  }
}

/**
 * Function returning an iterator over the given node's relevant neighbors.
 *
 * @param  {string}   type      - Type of neighbors.
 * @param  {string}   direction - Direction.
 * @param  {any}      nodeData  - Target node's data.
 * @return {Iterator}
 */
function createObjectIterator(nodeData, object) {
  var keys = Object.keys(object),
      l = keys.length;

  var i = 0;

  return new _iterator2.default(function () {
    if (i >= l) return { done: true };

    var edgeData = object[keys[i++]];

    if (edgeData instanceof Set) edgeData = edgeData.values().next().value;

    var sourceData = edgeData.source,
        targetData = edgeData.target;

    var neighborData = sourceData === nodeData ? targetData : sourceData;

    return {
      done: false,
      value: [neighborData.key, neighborData.attributes]
    };
  });
}

function createDedupedObjectIterator(visited, nodeData, object) {
  var keys = Object.keys(object),
      l = keys.length;

  var i = 0;

  return new _iterator2.default(function next() {
    if (i >= l) return { done: true };

    var edgeData = object[keys[i++]];

    if (edgeData instanceof Set) edgeData = edgeData.values().next().value;

    var sourceData = edgeData.source,
        targetData = edgeData.target;

    var neighborData = sourceData === nodeData ? targetData : sourceData;

    if (visited.has(neighborData.key)) return next();

    visited.add(neighborData.key);

    return {
      done: false,
      value: [neighborData.key, neighborData.attributes]
    };
  });
}

function createNeighborIterator(type, direction, nodeData) {

  // If we want only undirected or in or out, we can roll some optimizations
  if (type !== 'mixed') {
    if (type === 'undirected') return createObjectIterator(nodeData, nodeData.undirected);

    if (typeof direction === 'string') return createObjectIterator(nodeData, nodeData[direction]);
  }

  var iterator = _iterator2.default.empty();

  // Else we need to keep a set of neighbors not to return duplicates
  var visited = new Set();

  if (type !== 'undirected') {

    if (direction !== 'out') {
      iterator = (0, _chain2.default)(iterator, createDedupedObjectIterator(visited, nodeData, nodeData.in));
    }
    if (direction !== 'in') {
      iterator = (0, _chain2.default)(iterator, createDedupedObjectIterator(visited, nodeData, nodeData.out));
    }
  }

  if (type !== 'directed') {
    iterator = (0, _chain2.default)(iterator, createDedupedObjectIterator(visited, nodeData, nodeData.undirected));
  }

  return iterator;
}

/**
 * Function returning whether the given node has target neighbor.
 *
 * @param  {Graph}        graph     - Target graph.
 * @param  {string}       type      - Type of neighbor.
 * @param  {string}       direction - Direction.
 * @param  {any}          node      - Target node.
 * @param  {any}          neighbor  - Target neighbor.
 * @return {boolean}
 */
function nodeHasNeighbor(graph, type, direction, node, neighbor) {

  var nodeData = graph._nodes.get(node);

  if (type !== 'undirected') {

    if (direction !== 'out' && typeof nodeData.in !== 'undefined') {
      for (var k in nodeData.in) {
        if (k === neighbor) return true;
      }
    }
    if (direction !== 'in' && typeof nodeData.out !== 'undefined') {
      for (var _k in nodeData.out) {
        if (_k === neighbor) return true;
      }
    }
  }

  if (type !== 'directed' && typeof nodeData.undirected !== 'undefined') {
    for (var _k2 in nodeData.undirected) {
      if (_k2 === neighbor) return true;
    }
  }

  return false;
}

/**
 * Function attaching a neighbors array creator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachNeighborArrayCreator(Class, description) {
  var name = description.name,
      type = description.type,
      direction = description.direction;

  /**
   * Function returning an array or the count of certain neighbors.
   *
   * Arity 1: Return all of a node's relevant neighbors.
   * @param  {any}   node   - Target node.
   *
   * Arity 2: Return whether the two nodes are indeed neighbors.
   * @param  {any}   source - Source node.
   * @param  {any}   target - Target node.
   *
   * @return {array|number} - The neighbors or the number of neighbors.
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */

  Class.prototype[name] = function (node) {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return [];

    if (arguments.length === 2) {
      var node1 = '' + arguments[0],
          node2 = '' + arguments[1];

      if (!this._nodes.has(node1)) throw new _errors.NotFoundGraphError('Graph.' + name + ': could not find the "' + node1 + '" node in the graph.');

      if (!this._nodes.has(node2)) throw new _errors.NotFoundGraphError('Graph.' + name + ': could not find the "' + node2 + '" node in the graph.');

      // Here, we want to assess whether the two given nodes are neighbors
      return nodeHasNeighbor(this, type, direction, node1, node2);
    } else if (arguments.length === 1) {
      node = '' + node;

      var nodeData = this._nodes.get(node);

      if (typeof nodeData === 'undefined') throw new _errors.NotFoundGraphError('Graph.' + name + ': could not find the "' + node + '" node in the graph.');

      // Here, we want to iterate over a node's relevant neighbors
      var neighbors = createNeighborArrayForNode(type === 'mixed' ? this.type : type, direction, nodeData);

      return neighbors;
    }

    throw new _errors.InvalidArgumentsGraphError('Graph.' + name + ': invalid number of arguments (expecting 1 or 2 and got ' + arguments.length + ').');
  };
}

/**
 * Function attaching a neighbors callback iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachForEachNeighbor(Class, description) {
  var name = description.name,
      type = description.type,
      direction = description.direction;


  var forEachName = 'forEach' + name[0].toUpperCase() + name.slice(1, -1);

  /**
   * Function iterating over all the relevant neighbors using a callback.
   *
   * @param  {any}      node     - Target node.
   * @param  {function} callback - Callback to use.
   * @return {undefined}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  Class.prototype[forEachName] = function (node, callback) {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return;

    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (typeof nodeData === 'undefined') throw new _errors.NotFoundGraphError('Graph.' + forEachName + ': could not find the "' + node + '" node in the graph.');

    // Here, we want to iterate over a node's relevant neighbors
    forEachNeighborForNode(type === 'mixed' ? this.type : type, direction, nodeData, callback);
  };
}

/**
 * Function attaching a neighbors callback iterator method to the Graph prototype.
 *
 * @param {function} Class       - Target class.
 * @param {object}   description - Method description.
 */
function attachNeighborIteratorCreator(Class, description) {
  var name = description.name,
      type = description.type,
      direction = description.direction;


  var iteratorName = name.slice(0, -1) + 'Entries';

  /**
   * Function returning an iterator over all the relevant neighbors.
   *
   * @param  {any}      node     - Target node.
   * @return {Iterator}
   *
   * @throws {Error} - Will throw if there are too many arguments.
   */
  Class.prototype[iteratorName] = function (node) {

    // Early termination
    if (type !== 'mixed' && this.type !== 'mixed' && type !== this.type) return _iterator2.default.empty();

    node = '' + node;

    var nodeData = this._nodes.get(node);

    if (typeof nodeData === 'undefined') throw new _errors.NotFoundGraphError('Graph.' + iteratorName + ': could not find the "' + node + '" node in the graph.');

    // Here, we want to iterate over a node's relevant neighbors
    return createNeighborIterator(type === 'mixed' ? this.type : type, direction, nodeData);
  };
}

/**
 * Function attaching every neighbor iteration method to the Graph class.
 *
 * @param {function} Graph - Graph class.
 */
function attachNeighborIterationMethods(Graph) {
  NEIGHBORS_ITERATION.forEach(function (description) {
    attachNeighborArrayCreator(Graph, description);
    attachForEachNeighbor(Graph, description);
    attachNeighborIteratorCreator(Graph, description);
  });
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeNode = serializeNode;
exports.serializeEdge = serializeEdge;
exports.validateSerializedNode = validateSerializedNode;
exports.validateSerializedEdge = validateSerializedEdge;

var _data = __webpack_require__(3);

var _utils = __webpack_require__(1);

/**
 * Formats internal node data into a serialized node.
 *
 * @param  {any}    key  - The node's key.
 * @param  {object} data - Internal node's data.
 * @return {array}       - The serialized node.
 */
/**
 * Graphology Serialization Utilities
 * ===================================
 *
 * Collection of functions used to validate import-export formats & to ouput
 * them from internal graph data.
 *
 * Serialized Node:
 * {key, ?attributes}
 *
 * Serialized Edge:
 * {key?, source, target, attributes?, undirected?}
 *
 * Serialized Graph:
 * {nodes[], edges?[]}
 */
function serializeNode(key, data) {
  var serialized = { key: key };

  if (Object.keys(data.attributes).length) serialized.attributes = (0, _utils.assign)({}, data.attributes);

  return serialized;
}

/**
 * Formats internal edge data into a serialized edge.
 *
 * @param  {any}    key  - The edge's key.
 * @param  {object} data - Internal edge's data.
 * @return {array}       - The serialized edge.
 */
function serializeEdge(key, data) {
  var serialized = {
    source: data.source.key,
    target: data.target.key
  };

  // We export the key unless if it was provided by the user
  if (!data.generatedKey) serialized.key = key;

  if (Object.keys(data.attributes).length) serialized.attributes = (0, _utils.assign)({}, data.attributes);

  if (data instanceof _data.UndirectedEdgeData) serialized.undirected = true;

  return serialized;
}

/**
 * Checks whether the given value is a serialized node.
 *
 * @param  {mixed} value - Target value.
 * @return {string|null}
 */
function validateSerializedNode(value) {
  if (!(0, _utils.isPlainObject)(value)) return 'not-object';

  if (!('key' in value)) return 'no-key';

  if ('attributes' in value && (!(0, _utils.isPlainObject)(value.attributes) || value.attributes === null)) return 'invalid-attributes';

  return null;
}

/**
 * Checks whether the given value is a serialized edge.
 *
 * @param  {mixed} value - Target value.
 * @return {string|null}
 */
function validateSerializedEdge(value) {
  if (!(0, _utils.isPlainObject)(value)) return 'not-object';

  if (!('source' in value)) return 'no-source';

  if (!('target' in value)) return 'no-target';

  if ('attributes' in value && (!(0, _utils.isPlainObject)(value.attributes) || value.attributes === null)) return 'invalid-attributes';

  if ('undirected' in value && typeof value.undirected !== 'boolean') return 'invalid-undirected';

  return null;
}

/***/ })
/******/ ]);
});