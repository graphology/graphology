/**
 * Graphology Unit Test
 * =====================
 *
 * Running the unit tests for the reference implementation.
 */
import specs from './specs';
import path from 'path';

module.exports = specs(path.join(__dirname, 'src'));
