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
export function assign() {
  const target = arguments[0] || {};

  for (let i = 1, l = arguments.length; i < l; i++) {
    if (!arguments[i])
      continue;

    for (const k in arguments[i])
      target[k] = arguments[i][k];
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
export function getMatchingEdge(graph, source, target, type) {
  const sourceData = graph._nodes.get(source);

  let edge = null;

  if (type === 'mixed') {
    edge = (
      (sourceData.out && sourceData.out[target]) ||
      (sourceData.undirected && sourceData.undirected[target])
    );
  }
  else if (type === 'directed') {
    edge = sourceData.out && sourceData.out[target];
  }
  else {
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
export function isGraph(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.addUndirectedEdgeWithKey === 'function' &&
    typeof value.dropNode === 'function'
  );
}

/**
 * Checks whether the given value is a plain object.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */
export function isPlainObject(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    value.constructor === Object
  );
}

/**
 * Pretty prints the given integer.
 *
 * @param  {number}  integer - Target integer.
 * @return {string}          - The pretty string.
 */
export function prettyPrint(integer) {
  const string = '' + integer;

  let prettyString = '';

  for (let i = 0, l = string.length; i < l; i++) {
    const j = l - i - 1;

    prettyString = string[j] + prettyString;

    if (!((i - 2) % 3) && i !== l - 1)
      prettyString = ',' + prettyString;
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
export function privateProperty(target, name, value) {
  Object.defineProperty(target, name, {
    enumerable: false,
    configurable: false,
    writable: true,
    value
  });
}


/**
 * Creates a read-only property for the given member name & the given getter.
 *
 * @param {object}   target - Target object.
 * @param {string}   name   - Member name.
 * @param {mixed}    value  - The attached getter or fixed value.
 */
export function readOnlyProperty(target, name, value) {
  const descriptor = {
    enumerable: true,
    configurable: true
  };

  if (typeof value === 'function') {
    descriptor.get = value;
  }
  else {
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
export function incrementalId() {
  let i = 0;

  return () => {
    return `_geid${i++}_`;
  };
}
