/**
 * Graphology Unit Test
 * =====================
 *
 * Running the unit tests for the reference implementation.
 */
import specs from './tests';
import util from 'util';
import Graph from './src/endpoint.esm.js';

// NOTE: this was breaking for node before v6
if (util.inspect.defaultOptions) util.inspect.defaultOptions.depth = null;

module.exports = specs(Graph, Graph);
