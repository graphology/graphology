/**
 * Graphology Utilities
 * =====================
 *
 * Collection of helpful functions used by the implementation.
 */

/**
 * Creates a "private" property for the given member name by concealing it
 * using the `enumerable` option.
 *
 * @param {object}   target - Target object.
 * @param {string}   name   - Member name.
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

// TODO: this is just a temporary auto-increment
let incrementalId = 0;
export function uuid() {
  return incrementalId++;
}
