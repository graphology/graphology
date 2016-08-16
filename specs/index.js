/**
 * Graphology Specs
 * =================
 *
 * Unit tests factory taking the Graph object implementation.
 */
import assert from 'assert';
import properties from './properties';

/**
 * Returning the unit tests to run.
 *
 * @param  {string} path - Path to the implementation (should be absolute).
 * @return {object}      - The tests to run with Mocha.
 */
export default function specs(path) {

  // Requiring the implementation
  const implementation = require(path),
        Graph = implementation.default;

  return {
    'Properties': properties(Graph)
  };
}
