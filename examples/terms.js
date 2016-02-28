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
import connectedComponents from 'graph/connected-components';
import louvain from 'graph/modularity/louvain';
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

    // Iterating over the row's terms
    row.terms.forEach((term, position, terms) => {

      // 1 term = 1 node
      if (!graph.hasNode(term)) {

        // We add the term as node an keep two attributes:
        //   1) occurrences of this particular term
        //   2) top position of this term in expressions where it is found
        graph.addNode(term, {
          occurrences: 0,
          position
        });
      }

      // Updating position (we only keep the one nearest from start)
      graph.setNodeAttribute('position', currentPosition => Math.min(currentPosition, position));

      // Updating occurrences of the term
      graph.setNodeAttribute('occurrences', nb => nb + 1);

      // If we are the first term of the expression, we break here
      if (!position)
        return;

      // Retrieving the node of the last term
      const lastNode = terms[position - 1];

      // If there is no edge between `node` and `lastNode`, we create one
      if (!graph.hasEdgeBetween(node, lastNode)) {

        // We only need to track the weight here
        graph.addEdge(edgeId++, node, lastNode, {weight: 0});
      }

      // Increasing edge's weight
      // NOTE: graph.getEdgeBetween doesn't exist right now
      const edge = graph.getEdgeBetween(node, lastNode);
      graph.setEdgeAttribute(edge, weight, nb => nb + 1);
    });
  });

  // Finding connected components
  const components = connectedComponents(graph);

  // Keeping only larger components' nodes
  const nodesToDrop = _(components)
    .filter(component => component.order < 4)

    // NOTE: need a way to get the nodes
    .map(component => component.nodes())
    .flatten()
    .value();

  nodesToDrop.forEach(graph.dropNode);

  // Detecting communities
  louvain.assign(graph);

  // Now our nodes a community attribute we can use
  return graph;
}
