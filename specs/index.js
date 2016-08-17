/**
 * Graphology Specs
 * =================
 *
 * Unit tests factory taking the Graph object implementation.
 */
import instantiation from './instantiation';
import properties from './properties';
import read from './read';
import mutation from './mutation';
import attributes from './attributes';
import knownMethods from './known-methods';

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
    'Instantiation': instantiation(Graph, implementation),
    'Properties': properties(Graph),
    'Mutation': mutation(Graph),
    'Read': read(Graph),
    'Attributes': attributes(Graph),
    'Known Methods': knownMethods(Graph)
  };
}
