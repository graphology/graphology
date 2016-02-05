/**
 * Terms Network
 * ==============
 *
 * @Yomguithereal
 *
 * Building a network of terms based on a list of expressions. Once the
 * network is built, we need to drop some useless components and apply
 * community detection using the Louvain algorithm.
 *
 * Expressions are tokenized into terms ("a new thing" => ["a", "new" "thing"]),
 * with a black-list for common words such as "a" or not.
 *
 * The idea is to build a network of terms so we can visualize it hereafter.
 *
 * The original algorithm needs ~150 locs without comments. This example
 * is way more concise and understandable.
 */
import Graph from 'graph';
import connectedComponents from 'graph-connected-components';
import louvain from 'graph-louvain';
import _ from 'lodash';

export default function(rows) {

  // Creating our graph
  const graph = new Graph();

  let edgeId = 0;

  // Iterating over our rows
  rows.forEach(row => {

    // Note that in this example, the rows store expressions that have been
    // prealably tokenized.

    // We don't consider mono-term expressions
    if (row.terms.length <= 1)
      return;

    row.terms.forEach((term, position, terms) => {

      // 1 term = 1 node
      if (!graph.hasNode(term)) {

        // We just need an id, occurrences and the term position in the expression
        graph.addNode({
          id: term,
          occurrences: 0,
          position
        });
      }

      const node = graph.get(term);

      // Updating position (we only keep the one nearest from start)
      node.position = Math.min(node.position, position);

      // Updating occurrences of the term
      node.occurrences++;

      // If we are the first term of the expression, we break here
      if (!position)
        return;

      // Retrieving the node of the last term
      const lastNode = graph.get(terms[terms.length - 1]);

      // If there is no edge between `node` and `lastNode`, we create one
      if (!graph.hasEdge(node, lastNode)) {

        // NOTE: here we see that we should discuss the `addEdge` specs
        // NOTE: should the weight be handled by the user or the Graph?
        // NOTE: should add methods return the created object or the graph?
        graph.addEdge({
          id: edgeId,
          source: node.id,
          target: lastNode.id,
          weight: 0
        });
      }

      // Increasing edge's weight
      // NOTE: graph.get & graph.getEdge or graph.getNode & graph.getNode
      const edge = graph.getEdge(edgeId);
      edge.weight++;

      edgeId++;
    });
  });

  // Finding connected components
  const components = connectedComponents(graph);

  // Keeping only larger components' nodes
  const nodesToDrop = _(components)
    .filter(component => component.order < 4)
    .map(component => component.nodes)
    .flatten()
    .value();

  nodesToDrop.forEach(graph.dropNode);

  // Detecting communities
  louvain.assign(graph);

  // Now our nodes have a .community property we can use
  return graph;
}
