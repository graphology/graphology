/**
 * Graphology Attributes methods
 * ==============================
 *
 * Attributes-related methods being exactly the same for nodes & edges,
 * we abstract them here for factorization reasons.
 */
import {
  assign,
  isPlainObject
} from './utils';

import {
  InvalidArgumentsGraphError,
  NotFoundGraphError
} from './errors';

/**
 * Attach an attribute getter method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   key         - Key of the element's storage on instance.
 * @param {string}   elementName - Name of target element for messages.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   [finder]    - Name of the finder method to use.
 */
function attachAttributeGetter(Class, method, key, elementName, checker, finder) {

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
    if (arguments.length > 2) {
      if (!finder)
        throw new InvalidArgumentsGraphError(`Graph.${method}: too many arguments provided.`);

      const source = element,
            target = name;

      name = arguments[2];

      if (!this[checker](source, target))
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);

      element = this[finder](source, target);
    }

    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${elementName} in the graph.`);

    const data = this[key].get(element);

    return data.attributes[name];
  };
}

/**
 * Attach an attributes getter method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   key         - Key of the element's storage on instance.
 * @param {string}   elementName - Name of target element for messages.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   [finder]    - Name of the finder method to use.
 */
function attachAttributesGetter(Class, method, key, elementName, checker, finder) {

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
    if (arguments.length > 1) {
      if (!finder)
        throw new InvalidArgumentsGraphError(`Graph.${method}: too many arguments provided.`);

      const source = element,
            target = arguments[1];

      if (!this[checker](source, target))
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);

      element = this[finder](source, target);
    }

    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${elementName} in the graph.`);

    const data = this[key].get(element);

    return data.attributes;
  };
}

/**
 * Attach an attribute setter method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   key         - Key of the element's storage on instance.
 * @param {string}   elementName - Name of target element for messages.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   [finder]    - Name of the finder method to use.
 */
function attachAttributeSetter(Class, method, key, elementName, checker, finder) {
  const eventName = elementName === 'node' ? 'nodeUpdated' : 'edgeUpdated';

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
    if (arguments.length > 3) {
      if (!finder)
        throw new InvalidArgumentsGraphError(`Graph.${method}: too many arguments provided.`);

      const source = element,
            target = name;

      name = arguments[2];
      value = arguments[3];

      if (!this[checker](source, target))
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);

      element = this[finder](source, target);
    }

    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${elementName} in the graph.`);

    const data = this[key].get(element);

    data.attributes[name] = value;

    // Emitting
    this.emit(eventName, {
      key: element,
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
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   key         - Key of the element's storage on instance.
 * @param {string}   elementName - Name of target element for messages.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   [finder]    - Name of the finder method to use.
 */
function attachAttributeUpdater(Class, method, key, elementName, checker, finder) {
  const eventName = elementName === 'node' ? 'nodeUpdated' : 'edgeUpdated';

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
    if (arguments.length > 3) {
      if (!finder)
        throw new InvalidArgumentsGraphError(`Graph.${method}: too many arguments provided.`);

      const source = element,
            target = name;

      name = arguments[2];
      updater = arguments[3];

      if (!this[checker](source, target))
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);

      element = this[finder](source, target);
    }

    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${elementName} in the graph.`);

    const data = this[key].get(element);

    data.attributes[name] = updater(data.attributes[name]);

    // Emitting
    this.emit(eventName, {
      key: element,
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
 * Attach an attribute replacer method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   key         - Key of the element's storage on instance.
 * @param {string}   elementName - Name of target element for messages.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   [finder]    - Name of the finder method to use.
 */
function attachAttributesReplacer(Class, method, key, elementName, checker, finder) {
  const eventName = elementName === 'node' ? 'nodeUpdated' : 'edgeUpdated';

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
    if (arguments.length > 2) {
      if (!finder)
        throw new InvalidArgumentsGraphError(`Graph.${method}: too many arguments provided.`);

      const source = element,
            target = attributes;

      attributes = arguments[2];

      if (!this[checker](source, target))
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);

      element = this[finder](source, target);
    }

    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${elementName} in the graph.`);

    if (!isPlainObject(attributes))
      throw new InvalidArgumentsGraphError(`Graph.${method}: provided attributes are not a plain object.`);

    const data = this[key].get(element);

    const oldAttributes = data.attributes;

    data.attributes = attributes;

    // Emitting
    this.emit(eventName, {
      key: element,
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
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   key         - Key of the element's storage on instance.
 * @param {string}   elementName - Name of target element for messages.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   [finder]    - Name of the finder method to use.
 */
function attachAttributesMerger(Class, method, key, elementName, checker, finder) {
  const eventName = elementName === 'node' ? 'nodeUpdated' : 'edgeUpdated';

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
    if (arguments.length > 2) {
      if (!finder)
        throw new InvalidArgumentsGraphError(`Graph.${method}: too many arguments provided.`);

      const source = element,
            target = attributes;

      attributes = arguments[2];

      if (!this[checker](source, target))
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);

      element = this[finder](source, target);
    }

    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${elementName} in the graph.`);

    if (!isPlainObject(attributes))
      throw new InvalidArgumentsGraphError(`Graph.${method}: provided attributes are not a plain object.`);

    const data = this[key].get(element);

    assign(data.attributes, attributes);

    // Emitting
    this.emit(eventName, {
      key: element,
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
    name: element => `set${element}Attribute`,
    attacher: attachAttributeSetter
  },
  {
    name: element => `update${element}Attribute`,
    attacher: attachAttributeUpdater
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

    // For nodes
    attacher(
      Graph,
      name('Node'),
      '_nodes',
      'node',
      'hasNode'
    );

    // For edges
    attacher(
      Graph,
      name('Edge'),
      '_edges',
      'edge',
      'hasEdge',
      'getEdge'
    );
  });
}
