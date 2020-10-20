/**
 * Graphology Attributes methods
 * ==============================
 *
 * Attributes-related methods being exactly the same for nodes & edges,
 * we abstract them here for factorization reasons.
 */
import {
  assign,
  isPlainObject,
  getMatchingEdge
} from './utils';

import {
  InvalidArgumentsGraphError,
  NotFoundGraphError,
  UsageGraphError
} from './errors';

import {
  DirectedEdgeData,
  UndirectedEdgeData
} from './data';

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
  Class.prototype[method] = function(element, name) {
    let data;

    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type)
      throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);

    if (arguments.length > 2) {

      if (this.multi)
        throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);

      const source = '' + element,
            target = '' + name;

      name = arguments[2];

      data = getMatchingEdge(this, source, target, type);

      if (!data)
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
    }
    else {
      element = '' + element;
      data = this._edges.get(element);

      if (!data)
        throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
    }

    if (type !== 'mixed' && !(data instanceof EdgeDataClass))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${type} edge in the graph.`);

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
  Class.prototype[method] = function(element) {
    let data;

    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type)
      throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);

    if (arguments.length > 1) {

      if (this.multi)
        throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);

      const source = '' + element,
            target = '' + arguments[1];

      data = getMatchingEdge(this, source, target, type);

      if (!data)
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
    }
    else {
      element = '' + element;
      data = this._edges.get(element);

      if (!data)
        throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
    }

    if (type !== 'mixed' && !(data instanceof EdgeDataClass))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${type} edge in the graph.`);

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
  Class.prototype[method] = function(element, name) {
    let data;

    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type)
      throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);

    if (arguments.length > 2) {

      if (this.multi)
        throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);

      const source = '' + element,
            target = '' + name;

      name = arguments[2];

      data = getMatchingEdge(this, source, target, type);

      if (!data)
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
    }
    else {
      element = '' + element;
      data = this._edges.get(element);

      if (!data)
        throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
    }

    if (type !== 'mixed' && !(data instanceof EdgeDataClass))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${type} edge in the graph.`);

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
  Class.prototype[method] = function(element, name, value) {
    let data;

    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type)
      throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);

    if (arguments.length > 3) {

      if (this.multi)
        throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);

      const source = '' + element,
            target = '' + name;

      name = arguments[2];
      value = arguments[3];

      data = getMatchingEdge(this, source, target, type);

      if (!data)
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
    }
    else {
      element = '' + element;
      data = this._edges.get(element);

      if (!data)
        throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
    }

    if (type !== 'mixed' && !(data instanceof EdgeDataClass))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${type} edge in the graph.`);

    data.attributes[name] = value;

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: data.key,
      type: 'set',
      meta: {
        name,
        value
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
  Class.prototype[method] = function(element, name, updater) {
    let data;

    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type)
      throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);

    if (arguments.length > 3) {

      if (this.multi)
        throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);

      const source = '' + element,
            target = '' + name;

      name = arguments[2];
      updater = arguments[3];

      data = getMatchingEdge(this, source, target, type);

      if (!data)
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
    }
    else {
      element = '' + element;
      data = this._edges.get(element);

      if (!data)
        throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
    }

    if (typeof updater !== 'function')
      throw new InvalidArgumentsGraphError(`Graph.${method}: updater should be a function.`);

    if (type !== 'mixed' && !(data instanceof EdgeDataClass))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${type} edge in the graph.`);

    data.attributes[name] = updater(data.attributes[name]);

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: data.key,
      type: 'set',
      meta: {
        name,
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
  Class.prototype[method] = function(element, name) {
    let data;

    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type)
      throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);

    if (arguments.length > 2) {

      if (this.multi)
        throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);

      const source = '' + element,
            target = '' + name;

      name = arguments[2];

      data = getMatchingEdge(this, source, target, type);

      if (!data)
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
    }
    else {
      element = '' + element;
      data = this._edges.get(element);

      if (!data)
        throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
    }

    if (type !== 'mixed' && !(data instanceof EdgeDataClass))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${type} edge in the graph.`);

    delete data.attributes[name];

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: data.key,
      type: 'remove',
      meta: {
        name
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
  Class.prototype[method] = function(element, attributes) {
    let data;

    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type)
      throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);

    if (arguments.length > 2) {

      if (this.multi)
        throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);

      const source = '' + element,
            target = '' + attributes;

      attributes = arguments[2];

      data = getMatchingEdge(this, source, target, type);

      if (!data)
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
    }
    else {
      element = '' + element;
      data = this._edges.get(element);

      if (!data)
        throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
    }

    if (!isPlainObject(attributes))
      throw new InvalidArgumentsGraphError(`Graph.${method}: provided attributes are not a plain object.`);

    if (type !== 'mixed' && !(data instanceof EdgeDataClass))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${type} edge in the graph.`);

    data.attributes = attributes;

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: data.key,
      type: 'replace',
      meta: {}
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
  Class.prototype[method] = function(element, attributes) {
    let data;

    if (this.type !== 'mixed' && type !== 'mixed' && type !== this.type)
      throw new UsageGraphError(`Graph.${method}: cannot find this type of edges in your ${this.type} graph.`);

    if (arguments.length > 2) {

      if (this.multi)
        throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);

      const source = '' + element,
            target = '' + attributes;

      attributes = arguments[2];

      data = getMatchingEdge(this, source, target, type);

      if (!data)
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);
    }
    else {
      element = '' + element;
      data = this._edges.get(element);

      if (!data)
        throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);
    }

    if (!isPlainObject(attributes))
      throw new InvalidArgumentsGraphError(`Graph.${method}: provided attributes are not a plain object.`);

    if (type !== 'mixed' && !(data instanceof EdgeDataClass))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${type} edge in the graph.`);

    assign(data.attributes, attributes);

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
const ATTRIBUTES_METHODS = [
  {
    name: element => `get${element}Attribute`,
    attacher: attachAttributeGetter
  },
  {
    name: element => `get${element}Attributes`,
    attacher: attachAttributesGetter
  },
  {
    name: element => `has${element}Attribute`,
    attacher: attachAttributeChecker
  },
  {
    name: element => `set${element}Attribute`,
    attacher: attachAttributeSetter
  },
  {
    name: element => `update${element}Attribute`,
    attacher: attachAttributeUpdater
  },
  {
    name: element => `remove${element}Attribute`,
    attacher: attachAttributeRemover
  },
  {
    name: element => `replace${element}Attributes`,
    attacher: attachAttributesReplacer
  },
  {
    name: element => `merge${element}Attributes`,
    attacher: attachAttributesMerger
  }
];

/**
 * Attach every attributes-related methods to a Graph class.
 *
 * @param {function} Graph - Target class.
 */
export function attachAttributesMethods(Graph) {
  ATTRIBUTES_METHODS.forEach(function({name, attacher}) {

    // For edges
    attacher(
      Graph,
      name('Edge'),
      'mixed',
      DirectedEdgeData
    );

    // For directed edges
    attacher(
      Graph,
      name('DirectedEdge'),
      'directed',
      DirectedEdgeData
    );

    // For undirected edges
    attacher(
      Graph,
      name('UndirectedEdge'),
      'undirected',
      UndirectedEdgeData
    );
  });
}
