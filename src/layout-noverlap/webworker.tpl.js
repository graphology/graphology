/**
 * Graphology Noverlap Layout Webworker
 * =====================================
 *
 * Web worker able to run the layout in a separate thread.
 */
 var { create_computer_ctx, iterate: wasm_iterate, get_node_matrix, get_converged } = require('./layout-noverlap-iterate-wasm/pkg/layout_noverlap_iterate_wasm.js')

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

    var result

    if (data.settings.wasm) {
      var ctxPtr = create_computer_ctx(matrix)
      converged = wasm_iterate(settings.margin, settings.ratio, settings.expansion, settings.gridSize, settings.speed, ctxPtr);
      NODES = get_node_matrix(ctxPtr)
      result = {converged: converged}
    } else {
      // Running the iteration
      result = iterate(data.settings, NODES);
    }

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
