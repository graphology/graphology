/**
 * Graphology Noverlap Layout Supervisor
 * ======================================
 *
 * Supervisor class able to spawn a web worker to run the Noverlap layout in a
 * separate thread not to block UI with heavy synchronous computations.
 */
var workerFunction = require('./webworker.js'),
  isGraph = require('graphology-utils/is-graph'),
  helpers = require('./helpers.js');

var DEFAULT_SETTINGS = require('./defaults.js');

/**
 * Class representing a Noverlap layout run by a webworker.
 *
 * @constructor
 * @param  {Graph}         graph        - Target graph.
 * @param  {object|number} params       - Parameters:
 * @param  {object}          [settings] - Settings.
 */
function NoverlapLayoutSupervisor(graph, params) {
  params = params || {};

  // Validation
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout-noverlap/worker: the given graph is not a valid graphology instance.'
    );

  // Validating settings
  var settings = Object.assign({}, DEFAULT_SETTINGS, params.settings),
    validationError = helpers.validateSettings(settings);

  if (validationError)
    throw new Error(
      'graphology-layout-noverlap/worker: ' + validationError.message
    );

  // Properties
  this.worker = null;
  this.graph = graph;
  this.settings = settings;
  this.matrices = null;
  this.running = false;
  this.killed = false;

  this.inputReducer = params.inputReducer;
  this.outputReducer = params.outputReducer;

  this.callbacks = {
    onConverged:
      typeof params.onConverged === 'function' ? params.onConverged : null
  };

  // Binding listeners
  this.handleMessage = this.handleMessage.bind(this);

  var alreadyRespawning = false;
  var self = this;

  this.handleAddition = function () {
    if (alreadyRespawning) return;

    alreadyRespawning = true;

    self.spawnWorker();
    setTimeout(function () {
      alreadyRespawning = false;
    }, 0);
  };

  graph.on('nodeAdded', this.handleAddition);
  graph.on('edgeAdded', this.handleAddition);

  // Spawning worker
  this.spawnWorker();
}

NoverlapLayoutSupervisor.prototype.isRunning = function () {
  return this.running;
};

/**
 * Internal method used to spawn the web worker.
 */
NoverlapLayoutSupervisor.prototype.spawnWorker = function () {
  if (this.worker) this.worker.terminate();

  this.worker = helpers.createWorker(workerFunction);
  this.worker.addEventListener('message', this.handleMessage);

  if (this.running) {
    this.running = false;
    this.start();
  }
};

/**
 * Internal method used to handle the worker's messages.
 *
 * @param {object} event - Event to handle.
 */
NoverlapLayoutSupervisor.prototype.handleMessage = function (event) {
  if (!this.running) return;

  var matrix = new Float32Array(event.data.nodes);

  helpers.assignLayoutChanges(this.graph, matrix, this.outputReducer);
  this.matrices.nodes = matrix;

  if (event.data.result.converged) {
    if (this.callbacks.onConverged) this.callbacks.onConverged();

    this.stop();
    return;
  }

  // Looping
  this.askForIterations();
};

/**
 * Internal method used to ask for iterations from the worker.
 *
 * @return {NoverlapLayoutSupervisor}
 */
NoverlapLayoutSupervisor.prototype.askForIterations = function () {
  var matrices = this.matrices;

  var payload = {
    settings: this.settings,
    nodes: matrices.nodes.buffer
  };

  var buffers = [matrices.nodes.buffer];

  this.worker.postMessage(payload, buffers);

  return this;
};

/**
 * Method used to start the layout.
 *
 * @return {NoverlapLayoutSupervisor}
 */
NoverlapLayoutSupervisor.prototype.start = function () {
  if (this.killed)
    throw new Error(
      'graphology-layout-noverlap/worker.start: layout was killed.'
    );

  if (this.running) return this;

  // Building matrices
  this.matrices = {
    nodes: helpers.graphToByteArray(this.graph, this.inputReducer)
  };

  this.running = true;
  this.askForIterations();

  return this;
};

/**
 * Method used to stop the layout.
 *
 * @return {NoverlapLayoutSupervisor}
 */
NoverlapLayoutSupervisor.prototype.stop = function () {
  this.running = false;

  return this;
};

/**
 * Method used to kill the layout.
 *
 * @return {NoverlapLayoutSupervisor}
 */
NoverlapLayoutSupervisor.prototype.kill = function () {
  if (this.killed) return this;

  this.running = false;
  this.killed = true;

  // Clearing memory
  this.matrices = null;

  // Terminating worker
  this.worker.terminate();

  // Unbinding listeners
  this.graph.removeListener('nodeAdded', this.handleAddition);
  this.graph.removeListener('edgeAdded', this.handleAddition);
};

/**
 * Exporting.
 */
module.exports = NoverlapLayoutSupervisor;
