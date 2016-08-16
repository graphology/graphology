/**
 * Graphology Reference Implementation
 * ====================================
 *
 * Reference implementation of the graphology specs.
 */
import {privateProperty, readOnlyProperty} from './utils';

/**
 * Enums.
 */
const TYPES = new Set(['directed', 'undirected', 'mixed']);

/**
 * Default options.
 */
const DEFAULTS = {
  map: false,
  multi: false,
  type: 'mixed'
};

/**
 * Graph class
 *
 * @constructor
 * @param {Graph|Array<Array>} [data]    - Hydratation data.
 * @param {object}             [options] - Options:
 * @param {string}               [type]  - Type of the graph.
 * @param {boolean}              [map]   - Allow references as keys?
 * @param {boolean}              [multi] - Allow parallel edges?
 */
export default function Graph(data, options) {
  options = options || {};

  //-- Solving options
  const map = options.map || DEFAULTS.map,
        multi = options.multi || DEFAULTS.multi,
        type = options.type || DEFAULTS.type;

  // Enforcing options validity
  if (typeof map !== 'boolean')
    throw Error(`Graph.constructor: invalid 'map' option. Expecting a boolean and found "${map}".`);

  if (typeof multi !== 'boolean')
    throw Error(`Graph.constructor: invalid 'multi' option. Expecting a boolean and found "${multi}".`);

  if (!TYPES.has(type))
    throw Error(`Graph.constructor: invalid 'type' option. Should be one of "mixed", "directed" or "undirected" and found "${type}".`);

  //-- Private properties

  // Counters
  privateProperty(this, '_order', 0);
  privateProperty(this, '_size', 0);

  // Indexes
  privateProperty(this, '_nodes', map ? new Map() : {});
  privateProperty(this, '_edges', map ? new Map() : {});

  //-- Properties readers
  readOnlyProperty(this, 'order', () => this._order);
  readOnlyProperty(this, 'size', () => this._size);
  readOnlyProperty(this, 'map', () => map);
  readOnlyProperty(this, 'multi', () => multi);
  readOnlyProperty(this, 'type', () => type);
}
