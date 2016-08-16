/**
 * Graphology Utilities
 * =====================
 *
 * Collection of helpful functions used by the implementation.
 */

/**
 * Creates a read-only property for the given member name & the given getter.
 *
 * @param {object}   target - Target object.
 * @param {string}   name   - Member name.
 * @param {function} getter - The attached getter function.
 */
export function readOnly(target, name, getter) {
  Object.defineProperty(target, name, {
    configurable: false,
    get: getter
  });
}
