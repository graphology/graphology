# Changelog

## 0.17.1

* Optimizing `#.forEachEdge` methods.

## 0.17.0

* Changing packaging system.
* Fixing browser bundle.

## 0.16.1

* Bundle fixes (@zakjan).

## 0.16.0

* Proper `#.nullCopy` & `#.emptyCopy` methods.

## 0.15.2

* More flexible dependency to `graphology-types`.

## 0.15.1

* Adding missing `MultiGraph` export.
* Adding missing error typings.

## 0.15.0

* TypeScript support.
* Adding possibility to merge options using `#.emptyCopy`.

## 0.14.1

* Fixing `#.mergeEdge` for the self loop case.

## 0.14.0

* Adding `Symbol.iterator` to the prototype.
* Fixing custom inspection for node >= 10.

## 0.13.1

* Fixing edge attributes methods with typed graphs.

## 0.13.0

* Adding `#.nodeEntries`.
* Adding `#.edgeEntries`.
* Adding `#.neighborEntries`.
* Adding `#.forEach`.
* Adding `#.adjacency`.

## 0.12.0

* Adding `#.clearEdges`.
* Adding `#.forEachEdge` & alii.
* Adding `#.forEachNode` & alii.
* Adding `#.forEachNeighbor` & alii.
* Adding `#.inboundNeighbors` & `#.outboundNeighbors`.
* Adding `#.inboundEdges` & `#.outboundEdges`.
* Dropping `#.addNodesFrom`.
* Dropping `#.dropNodes` & `#.dropEdges`.
* Dropping plural serialization methods.
* Dropping `defaultNodeAttributes` & `defaultEdgeAttributes`.
* Fixing semantics of `#.inEdges` & `#.outEdges` for arity 2.
* Improving performance of edges-related methods.
* Improving performance of internal indices.
* Improving performance of `#.mergeNode`.
* Fixing edge-case deopt for `#.dropEdges`.
* Fixing bug related to multigraphs' neighbors.
* Attribute copy is now done on serialization.
* Completely reworking internal indices.

## 0.11.4

* Improving performance of neighbors-related methods.
* Improving performance of edges-related methods.

## 0.11.3

* Fixing issues related to the `obliterator` dependencies.

## 0.11.2

* Fixing an issue with `#.mergeNode` & string coercion.

## 0.11.1

* Fixing the `#.edges` for undirected graphs.

## 0.11.0

* Adding `#.directedSize` & `#.undirectedSize`.

## 0.10.2

* Performance enhancements.

## 0.10.1

* Performance enhancements.
* Fixing a bug with `#.mergeEdge` & undirected edges.

## 0.10.0

* Adding basic edges iterators.
* Fixing `#.inspect`.

## 0.9.1

* Fixing a bug concerning `#.hasEdge` & typed graphs.

## 0.9.0

* Major write performance improvements.
* Shifting the default edge key generation system.
* Dropping index' laziness.

## 0.8.0

* Adding the `#.nodesIterator` method.
* Performance improvements.

## 0.7.1

* Fixing a bug related to typed graphs' attributes.
* Fixing a bug with the dropping methods.

## 0.7.0

* Adding the `#.edge` & variants methods.
* Adding the `#.upgradeToMixed` method.
* Adding the `#.upgradeToMulti` method.
* Refactoring indices methods.

## 0.6.0

* Dropping `inbound` & `outbound` iteration methods.
* Dropping useless counting iteration methods.
* Dropping bunch consuming polymorphisms from iteration methods.
* Refactoring internal indices for undirected graphs.
* Improving performance.

## 0.5.4

* Fixing degree methods for typed graphs.

## 0.5.3

* Improving performance.

## 0.5.2

* Node.js 0.12.x compatibility.
* Fixing bug related to the graph's string coercion.
* Improving performance.
* Better error message when adding a self-loop when it's not authorized.

## 0.5.1

* Better unit tests.
* Internal refactoring.

## 0.5.0

* Implementing the static `#.from` method & switching constructor paradigm.
* Fixing bug related to the `attributesUpdated` event.
* Adding more errors related to attributes' setters.
* Adding typed edges attributes' getters/setters.
* Rewrote internal indices.
* Dropping `#.getEdge` & friends.
* Dropping `#.selfLoops`.

## 0.4.2

* Adding missing built files to the npm package.

## 0.4.1

* Adding missing `attributes` in export.

## 0.4.0

* Adding `#.removeNodeAttribute` & `#.removeEdgeAttribute` that was actually missing from earlier versions.
* Adding graph attributes.
* `nodeUpdated` & `edgeUpdated` changing to `nodeAttributesUpdated` & `edgeAttributesUpdated` respectively.

## 0.3.0

* Adding merge flags to import methods.

## 0.2.0

* Adding `#.hasNodeAttribute` & `#.hasEdgeAttribute`.
* Adding `#.removeNodeAttribute` & `#.removeEdgeAttribute`.
* Adding `#.mergeNode`.
* Adding `#.mergeEdge`, `#.mergeEdgeWithKey` and friends.
* Renaming `#.relatedNode` to `#.opposite`.
* Dropping the `onDuplicateNode` & `onDuplicateEdge` options.

## 0.1.1

* Fixing the argument passed to the `edgeKeyGenerator` function.
* Fixing a bug where source & target of an edge were not internally coerced to strings.

## 0.1.0

Initial version compliant to the specs.
