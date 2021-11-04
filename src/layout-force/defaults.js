/**
 * Graphology Force Layout Defaults
 * =================================
 *
 * Default options & settings used by the library.
 */
const returnFalse = () => false;

module.exports = {
  attributes: {
    x: 'x',
    y: 'y',
    fixed: 'fixed'
  },
  shouldSkipNode: returnFalse,
  shouldSkipEdge: returnFalse,
  settings: {
    attraction: 0.0005,
    repulsion: 0.1,
    gravity: 0.0001,
    inertia: 0.6,
    maxMove: 200
  }
};
