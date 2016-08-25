/**
 * Graphology Unit Test
 * =====================
 *
 * Running the unit tests for the reference implementation.
 */
import specs from './tests';
import util from 'util';
import Graph from './src';

if (util.inspect.defaultOptions)
  util.inspect.defaultOptions.depth = null;

module.exports = specs(Graph, Graph);
