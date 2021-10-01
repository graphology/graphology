/**
 * Graphology ForceAtlas2 Layout Webworker
 * ========================================
 *
 * Web worker able to run the layout in a separate thread.
 */
module.exports = function worker() {
  var NODES,
      EDGES;

  var moduleShim = {};

  (function() {
    // <%= iterate %>
  })();

  var iterate = moduleShim.exports;

  self.addEventListener('message', function(event) {
    var data = event.data;

    NODES = new Float32Array(data.nodes);

    if (data.edges)
      EDGES = new Float32Array(data.edges);

    // Running the iteration
    iterate(
      data.settings,
      NODES,
      EDGES
    );

    // Sending result to supervisor
    self.postMessage({
      nodes: NODES.buffer
    }, [NODES.buffer]);
  });
};
