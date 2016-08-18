/**
 * Graphology Unit Test
 * =====================
 *
 * Running the unit tests for the reference implementation.
 */
import specs from './tests';
import path from 'path';

module.exports = specs(path.join(__dirname, 'src'));
