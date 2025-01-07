/**
 * Graphology Utilities
 * =====================
 *
 * Collection of helpful functions used by the implementation.
 */

/**
 * Object.assign-like polyfill.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
function assignPolyfill() {
  const target = arguments[0];

  for (let i = 1, l = arguments.length; i < l; i++) {
    if (!arguments[i]) continue;

    for (const k in arguments[i]) target[k] = arguments[i][k];
  }

  return target;
}

let assign = assignPolyfill;

if (typeof Object.assign === 'function') assign = Object.assign;

export {assign};

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

  if (!sourceData) return edge;

  if (type === 'mixed') {
    edge =
      (sourceData.out && sourceData.out[target]) ||
      (sourceData.undirected && sourceData.undirected[target]);
  } else if (type === 'directed') {
    edge = sourceData.out && sourceData.out[target];
  } else {
    edge = sourceData.undirected && sourceData.undirected[target];
  }

  return edge;
}

/**
 * Checks whether the given value is a plain object.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */
export function isPlainObject(value) {
  // NOTE: as per https://github.com/graphology/graphology/issues/149
  // this function has been loosened not to reject object instances
  // coming from other JavaScript contexts. It has also been chosen
  // not to improve it to avoid obvious false positives and avoid
  // taking a performance hit. People should really use TypeScript
  // if they want to avoid feeding subtly irrelvant attribute objects.
  return typeof value === 'object' && value !== null;
}

/**
 * Checks whether the given object is empty.
 *
 * @param  {object}  o - Target Object.
 * @return {boolean}
 */
export function isEmpty(o) {
  let k;

  for (k in o) return false;

  return true;
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
  } else {
    descriptor.value = value;
    descriptor.writable = false;
  }

  Object.defineProperty(target, name, descriptor);
}

/**
 * Returns whether the given object constitute valid hints.
 *
 * @param {object} hints - Target object.
 */
export function validateHints(hints) {
  if (!isPlainObject(hints)) return false;

  if (hints.attributes && !Array.isArray(hints.attributes)) return false;

  return true;
}

/**
 * Creates a function generating incremental ids for edges.
 *
 * @return {function}
 */
export function incrementalIdStartingFromRandomByte() {
  let i = Math.floor(Math.random() * 256) & 0xff;

  return () => {
    return i++;
  };
}

/**
 * Takes the first `n` items from the given iterable.
 * @param {Iterable} iterable
 * @param {number} n
 * @returns {Array}
 */
export function take(iterable, n) {
  let i = 0;

  const iterator = iterable[Symbol.iterator]();

  const array = new Array(n);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (i === n) return array;

    const step = iterator.next();

    if (step.done) {
      if (i !== n) array.length = i;

      return array;
    }

    array[i++] = step.value;
  }
}

/**
 * Chains multiple iterators into a single iterator.
 *
 * @param {...Iterator} iterables
 * @returns {Iterator}
 */
export function chain() {
  const iterables = arguments;
  let current = null;
  let i = -1;

  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      let step = null;

      do {
        if (current === null) {
          i++;
          if (i >= iterables.length) return {done: true};
          current = iterables[i][Symbol.iterator]();
        }
        step = current.next();
        if (step.done) {
          current = null;
          continue;
        }
        break;
        // eslint-disable-next-line no-constant-condition
      } while (true);

      return step;
    }
  };
}

/**
 * Maps the given iterable using the provided function.
 *
 * @param {Iterable} iterable
 * @param {Function} fn
 * @returns {Iterator}
 */
export function map(iterable, fn) {
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      const step = iterable.next();
      if (step.done) return step;
      return {value: fn(step.value), done: false};
    }
  };
}

export function emptyIterator() {
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      return {done: true};
    }
  };
}
