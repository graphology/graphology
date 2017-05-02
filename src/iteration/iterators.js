/**
 * Graphology Iterator Classes
 * ============================
 *
 * Various classes representing the library's iterators.
 */

/**
 * Generic iterator class.
 *
 * @constructor
 * @param {function} next - Next function.
 */
class Iterator {
  constructor(next) {
    this.next = next;
  }
}

/**
 * Node iterator class.
 *
 * @constructor
 * @param {function} next - Next function.
 */
export class NodesIterator extends Iterator {}
