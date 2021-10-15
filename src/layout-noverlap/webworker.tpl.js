/**
 * Graphology Noverlap Layout Webworker
 * =====================================
 *
 * Web worker able to run the layout in a separate thread.
 */
module.exports = function worker() {
  var NODES;

  var moduleShim = {};

  (function () {
    // <%= iterate %>
  })();

  var iterate = moduleShim.exports;

  self.addEventListener('message', function (event) {
    var data = event.data;

    NODES = new Float32Array(data.nodes);

    // Running the iteration
    var result = iterate(data.settings, NODES);

    // Sending result to supervisor
    self.postMessage(
      {
        result: result,
        nodes: NODES.buffer
      },
      [NODES.buffer]
    );
  });
};
