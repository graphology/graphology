/**
 * Graphology Attributes methods
 * ==============================
 *
 * Attributes-related methods being exactly the same for nodes & edges,
 * we abstract them here for factorization reasons.
 */
import {NotFoundGraphError} from './errors';

export function attachAttributeGetter(Class, method, key, elementName, checker) {
  Class.prototype[method] = function(element, name) {
    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" ${elementName} in the graph.`);

    let data;

    if (this.map)
      data = this[key].get(element);
    else
      data = this[key][element];

    const value = data.attributes[name];

    return value;
  };
}

export function attachAttributesGetter(Class, method, key, elementName, checker) {
  Class.prototype[method] = function(element) {
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
