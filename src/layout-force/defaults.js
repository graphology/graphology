/**
 * Graphology Force Layout Defaults
 * =================================
 *
 * Default options & settings used by the library.
 */
module.exports = {
  nodeXAttribute: 'x',
  nodeYAttribute: 'y',
  isNodeFixed: 'fixed',
  shouldSkipNode: null,
  shouldSkipEdge: null,
  settings: {
    attraction: 0.0005,
    repulsion: 0.1,
    gravity: 0.0001,
    inertia: 0.6,
    maxMove: 200
  }
};
