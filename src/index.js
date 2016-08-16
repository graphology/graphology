/**
 * Graphology Reference Implementation
 * ====================================
 *
 * Reference implementation of the graphology specs.
 */
import {privateProperty, readOnlyProperty} from './utils';

/**
 * Graph class
 *
 * @constructor
 */
export default function Graph() {

  // Internal properties
  const order = 0;

  // Properties readers
  readOnlyProperty(this, 'order', () => order);

  // Private properties
  privateProperty(this, '_nodes', {});
  privateProperty(this, '_edges', {});
}
