/**
 * Graphology Density
 * ===================
 *
 * Functions used to compute the density of the given graph.
 */
var isGraph = require('graphology-utils/is-graph');

/**
 * Returns the undirected density.
 *
 * @param  {number} order - Number of nodes in the graph.
 * @param  {number} size  - Number of edges in the graph.
 * @return {number}
 */
function undirectedDensity(order, size) {
  return 2 * size / (order * (order - 1));
}

/**
 * Returns the directed density.
 *
 * @param  {number} order - Number of nodes in the graph.
 * @param  {number} size  - Number of edges in the graph.
 * @return {number}
 */
function directedDensity(order, size) {
  return size / (order * (order - 1));
}

/**
 * Returns the mixed density.
 *
 * @param  {number} order - Number of nodes in the graph.
 * @param  {number} size  - Number of edges in the graph.
 * @return {number}
 */
function mixedDensity(order, size) {
  var d = (order * (order - 1));

  return (
    size /
    (d + d / 2)
  );
}

/**
 * Returns the size a multi graph would have if it were a simple one.
 *
 * @param  {Graph}  graph - Target graph.
 * @return {number}
 */
function simpleSizeForMultiGraphs(graph) {
  var nodes = graph.nodes(),
      size = 0,
      i,
      l;

  for (i = 0, l = nodes.length; i < l; i++) {
    size += graph.outNeighbors(nodes[i]).length;
    size += graph.undirectedNeighbors(nodes[i]).length / 2;
  }

  return size;
}

/**
 * Returns the density for the given parameters.
 *
 * Arity 3:
 * @param  {boolean} type  - Type of density.
 * @param  {boolean} multi - Compute multi density?
 * @param  {Graph}   graph - Target graph.
 *
 * Arity 4:
 * @param  {boolean} type  - Type of density.
 * @param  {boolean} multi - Compute multi density?
 * @param  {number}  order - Number of nodes in the graph.
 * @param  {number}  size  - Number of edges in the graph.
 *
 * @return {number}
 */
function abstractDensity(type, multi, graph) {
  var order,
      size;

  // Retrieving order & size
  if (arguments.length > 3) {
    order = graph;
    size = arguments[3];

    if (typeof order !== 'number')
      throw new Error('graphology-metrics/density: given order is not a number.');

    if (typeof size !== 'number')
      throw new Error('graphology-metrics/density: given size is not a number.');
  }
  else {

    if (!isGraph(graph))
      throw new Error('graphology-metrics/density: given graph is not a valid graphology instance.');

    order = graph.order;
    size = graph.size;

    if (graph.multi && multi === false)
      size = simpleSizeForMultiGraphs(graph);
  }

  // When the graph has only one node, its density is 0
  if (order < 2)
    return 0;

  // Guessing type & multi
  if (type === null)
    type = graph.type;
  if (multi === null)
    multi = graph.multi;

  // Getting the correct function
  var fn;

  if (type === 'undirected')
    fn = undirectedDensity;
  else if (type === 'directed')
    fn = directedDensity;
  else
    fn = mixedDensity;

  // Applying the function
  return fn(order, size);
}

/**
 * Creating the exported functions.
 */
var density = abstractDensity.bind(null, null, null);
density.directedDensity = abstractDensity.bind(null, 'directed', false);
density.undirectedDensity = abstractDensity.bind(null, 'undirected', false);
density.mixedDensity = abstractDensity.bind(null, 'mixed', false);
density.multiDirectedDensity = abstractDensity.bind(null, 'directed', true);
density.multiUndirectedDensity = abstractDensity.bind(null, 'undirected', true);
density.multiMixedDensity = abstractDensity.bind(null, 'mixed', true);

/**
 * Exporting.
 */
module.exports = density;
