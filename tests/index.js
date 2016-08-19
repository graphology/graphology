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

const createErrorChecker = name => () => {
  return function(error) {
    return error && error.name === name;
  };
};

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

  const errors = [
    ['invalid', 'InvalidArgumentsGraphError'],
    ['notFound', 'NotFoundGraphError'],
    ['usage', 'UsageGraphError']
  ];

  // Building error checkers
  const errorCheckers = {};

  errors.forEach(([fn, name]) => (errorCheckers[fn] = createErrorChecker(name)));

  return {
    'Instantiation': instantiation(Graph, implementation, errorCheckers),
    'Properties': properties(Graph, errors),
    'Mutation': mutation(Graph, errors),
    'Read': read(Graph, errors),
    'Attributes': attributes(Graph, errors),
    'Iteration': iteration(Graph, errors),
    'Known Methods': knownMethods(Graph, errors)
  };
}
