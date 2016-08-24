/**
 * Graphology Unit Test
 * =====================
 *
 * Running the unit tests for the reference implementation.
 */
import specs from './tests';
import util from 'util';
import Graph from './src';

util.inspect.defaultOptions.depth = null;

module.exports = specs(Graph, Graph);
