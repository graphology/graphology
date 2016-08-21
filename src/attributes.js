/**
 * Graphology Attributes methods
 * ==============================
 *
 * Attributes-related methods being exactly the same for nodes & edges,
 * we abstract them here for factorization reasons.
 */
import {
  InvalidArgumentsError,
  NotFoundGraphError
} from './errors';

function attachAttributeGetter(Class, method, key, elementName, checker, finder) {
  Class.prototype[method] = function(element, name) {
    if (arguments.length > 2) {
      if (!finder)
        throw new InvalidArgumentsError(`Graph.${method}: too many arguments provided.`);

      const source = element,
            target = name;

      name = arguments[2];

      if (!this[checker](source, target))
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);

      element = this[finder](source, target);
    }

    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${elementName} in the graph.`);

    let data;

    if (this.map)
      data = this[key].get(element);
    else
      data = this[key][element];

    return data.attributes[name];
  };
}

function attachAttributesGetter(Class, method, key, elementName, checker, finder) {
  Class.prototype[method] = function(element) {
    if (arguments.length > 1) {
      if (!finder)
        throw new InvalidArgumentsError(`Graph.${method}: too many arguments provided.`);

      const source = element,
            target = arguments[1];

      if (!this[checker](source, target))
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);

      element = this[finder](source, target);
    }

    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${elementName} in the graph.`);

    let data;

    if (this.map)
      data = this[key].get(element);
    else
      data = this[key][element];

    return data.attributes;
  };
}

function attachAttributeSetter(Class, method, key, elementName, checker, finder) {
  Class.prototype[method] = function(element, name, value) {
    if (arguments.length > 3) {
      if (!finder)
        throw new InvalidArgumentsError(`Graph.${method}: too many arguments provided.`);

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

    let data;

    if (this.map)
      data = this[key].get(element);
    else
      data = this[key][element];

    data.attributes[name] = value;

    return this;
  };
}

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
  }
];

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
