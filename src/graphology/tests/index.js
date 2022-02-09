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
import serialization from './serialization';
import events from './events';
import utils from './utils';
import knownMethods from './known';
import misc from './misc';

const createErrorChecker = name => () => {
  return function (error) {
    return error && error.name === name;
  };
};

/**
 * Returning the unit tests to run.
 *
 * @param  {string} path - Path to the implementation (should be absolute).
 * @return {object}      - The tests to run with Mocha.
 */
export default function specs(Graph, implementation) {
  const errors = [
    ['invalid', 'InvalidArgumentsGraphError'],
    ['notFound', 'NotFoundGraphError'],
    ['usage', 'UsageGraphError']
  ];

  // Building error checkers
  const errorCheckers = {};
  errors.forEach(
    ([fn, name]) => (errorCheckers[fn] = createErrorChecker(name))
  );

  const tests = {
    Basic: {
      Instantiation: instantiation(Graph, implementation, errorCheckers),
      Properties: properties(Graph, errorCheckers),
      Mutation: mutation(Graph, errorCheckers),
      Read: read(Graph, errorCheckers),
      Attributes: attributes(Graph, errorCheckers),
      Iteration: iteration(Graph, errorCheckers),
      Serialization: serialization(Graph, errorCheckers),
      Events: events(Graph),
      Utils: utils(Graph, errorCheckers),
      'Known Methods': knownMethods(Graph, errorCheckers),
      Miscellaneous: misc(Graph)
    }
  };

  return tests;
}
