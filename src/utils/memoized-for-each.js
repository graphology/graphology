/**
 * Graphology memoizedForEach
 * ===========================
 *
 * Memoized version of the #.forEach function able to cache computations
 * related to source node in adjacency.
 */
var isGraph = require('./is-graph');

/**
 * Iterates over the given's graph adjacency all while caching some costly
 * computation for each traversed source node.
 *
 * @param {Graph}    graph    - Target graph.
 * @param {function} cacher   - Function used to cache values for each source.
 * @param {function} callback - Iteration callback.
 */
module.exports = function memoizedForEach(graph, cacher, callback) {
  if (!isGraph(graph))
    throw new Error('graphology-utils/memoized-for-each: expecting a valid graphology instance.');

  var currentSource, cache;

  graph.forEach(function(s, t, sa, ta, e, ea, u, g) {
    if (currentSource !== s) {
      currentSource = s;
      cache = cacher(s, sa);
    }

    callback(cache, s, t, sa, ta, e, ea, u, g);
  });
};
