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
import iteration from './iteration';
import knownMethods from './known';
import staticMethods from './static';

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
    'Iteration': iteration(Graph),
    'Known Methods': knownMethods(Graph),
    'Static': staticMethods(Graph)
  };
}
