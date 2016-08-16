/**
 * Graphology Reference Implementation
 * ====================================
 *
 * Reference implementation of the graphology specs.
 */
import {readOnly} from './utils';

/**
 * Graph class
 *
 * @constructor
 */
export default function Graph() {

  // Internal properties
  const order = 0;

  // Properties readers
  readOnly(this, 'order', () => order);
}
