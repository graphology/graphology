/**
 * Graphology Force Layout Worker
 * ===============================
 *
 * A worker made for running a force layout live.
 *
 * Note that it does not run in a webworker yet but respect animation frames.
 */
const isGraph = require('graphology-utils/is-graph');
const resolveDefaults = require('graphology-utils/defaults');

const iterate = require('./iterate.js');
const helpers = require('./helpers.js');
const DEFAULTS = require('./defaults.js');

function ForceSupervisor(graph, params) {
  // Validation
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout-force/worker: the given graph is not a valid graphology instance.'
    );

  this.callbacks = {};

  if (params.onConverged) this.callbacks.onConverged = params.onConverged;

  params = resolveDefaults(params, DEFAULTS);

  this.graph = graph;
  this.params = params;
  this.nodeStates = helpers.initializeNodeStates(graph, params.attributes);
  this.frameID = null;
  this.running = false;
  this.killed = false;

  // TODO: hook listeners on graph to listen to dropNode, dropEdge, clear, clearEdges
}

ForceSupervisor.prototype.isRunning = function () {
  return this.running;
};

ForceSupervisor.prototype.runFrame = function () {
  iterate(this.graph, this.nodeStates, this.params);

  helpers.assignLayoutChanges(
    this.graph,
    this.nodeStates,
    this.params.attributes
  );

  // TODO: convergence is not easy
  // if (result.converged) {
  //   if (this.callbacks.onConverged) this.callbacks.onConverged();
  //   this.stop();
  // } else {
  //   this.frameID = window.requestAnimationFrame(() => this.runFrame());
  // }

  this.frameID = window.requestAnimationFrame(() => this.runFrame());
};

ForceSupervisor.prototype.stop = function () {
  this.running = false;

  if (this.frameID !== null) {
    window.cancelAnimationFrame(this.frameID);
    this.frameID = null;
  }

  return this;
};

ForceSupervisor.prototype.start = function () {
  if (this.killed)
    throw new Error('graphology-layout-force/worker.start: layout was killed.');

  if (this.running) return;

  this.running = true;
  this.runFrame();
};

ForceSupervisor.prototype.kill = function () {
  this.stop();
  delete this.nodeStates;
  this.killed = true;

  // TODO: cleanup events
};

module.exports = ForceSupervisor;
