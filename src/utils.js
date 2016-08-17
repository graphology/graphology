/**
 * Graphology Utilities
 * =====================
 *
 * Collection of helpful functions used by the implementation.
 */

/**
 * Very simple Object.assign-like function.
 *
 * @param  {object} [...objects] - Target objects.
 * @return {object}
 */
export function assign(...objects) {
  const o = objects[0];

  for (let i = 1, l = objects.length; i < l; i++) {
    for (const k in objects[i])
      o[k] = objects[i][k];
  }

  return o;
}

/**
 * Class emulating a Set object & used internally to reduce memory footprint &
 * ensure ES5 compatibility.
 *
 * @constructor
 */
export class BasicSet {
  constructor(values) {
    for (let i = 0, l = values.length; i < l; i++)
      this[values[i]] = true;
  }

  add(value) {
    this[value] = true;
  }

  has(value) {
    return value in this;
  }
}

/**
 * Checks whether the given value is a plain object.
 *
 * @param  {mixed}  value - Target value.
 * @return {boolean}
 */

// NOTE: this function remains simplist. Might be a good idea to improve it.
export function isPlainObject(value) {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value)
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

    if (!((i - 2) % 3))
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
 * @param {function} getter - The attached getter function.
 */
export function readOnlyProperty(target, name, getter) {
  Object.defineProperty(target, name, {
    enumerable: true,
    configurable: false,
    get: getter
  });
}

/**
 * Simple uuid v4 function.
 *
 * @return {string} - The uuid.
 */
export function uuid() {
  let uuid = '',
      random,
      i;

  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;

    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8): random)).toString(16);
  }

  return uuid;
}
