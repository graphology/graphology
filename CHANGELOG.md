# Changelog

## 0.25.0

- Optimizing JSON serialization.
- Shipping source maps with package.

## 0.24.1

- Improving performance and memory usage of multigraphs.

## 0.24.0

- Adding `#.inboundDegree`, `#.outboundDegree`, `#.inboundDegreeWithoutSelfLoops`, `#.outboundDegreeWithoutSelfLoops`.
- Adding missing `#.dropDirectedEdge` & `#.dropUndirectedEdge`.
- Adding possibility to pass upgrading options to `#.copy`.
- Refactoring internal edge & neighbor iteration schemes.
- Dropping undocumented `#.upgradeToMixed` & `#.upgradeToMulti`.
- Refactoring internal indices.
- Fixing edge iteration wrt. self loops.
- Dropping some irrelevant arities for edge attribute updates.
- Improving performance of edge iteration.
- Improving perfromance of neighbor iteration.
- Improving performance of node deletion.
- Improving performance of edge attribute edition.
- Improving performance of internal edge key generator.
- Improving memory usage.
- Improving performance of default degree methods.
- Improving serialization performance.

## 0.23.2

- Fixing a `#.mergeUndirectedEdgeWithKey` & `#.updateUndirectedEdgeWithKey` bug when source & target are given in the reverse order.

## 0.23.1

- Fixing `#.copy` not copying the graph's attributes.
- Improving performance of `#.copy`.

## 0.23.0

- Adding `#.updateAttributes`.
- Adding `#.updateNodeAttributes`.
- Adding `#.updateEdgeAttributes`.
- Adding `#.getSourceAttribute`, `#.getTargetAttribute`, `#.getOppositeAttribute` and friends.
- Aligning `#.updateEachEdgeAttributes` callback arguments to `#.forEachEdge`.
- Improving `#.merge*` and `#.update*` function by returning useful information.
- Improving `#.opposite` performance.

_Migration guide_

This release should only affect you in the following cases:

1. You were relying on the keys returned by `#.mergeEdge`, `#.updateEdge` etc. In which case those methods now return a useful tuple containing said key as its first element as well as additional information about whether target elements already existed in the graph or not.
2. Some hidden adjacency iteration methods were mangled and are still hidden. This could only affect you if you were using `#.forEach`, `#.find` or `#.adjacency` (not to be confused with their node, edge & neighbor counterparts).

## 0.22.2

- Fixing `#.mergeEdge` & `#.updateEdge` error messages.
- Improving performance of `#.addEdge` etc. (less deopt).
- Improving `#.inspect` output wrt undirected multi edges.

## 0.22.1

- Fixing `prepublishOnly` script and shipped package.

## 0.22.0

- Rolling back to robust generated ids for edges.
- Adding `#.mapNodes`, `#.filterNodes`, `#.reduceNodes`, `#.findNode` `#.someNode`, `#.everyNode`.
- Adding `#.mapEdges`, `#.filterEdges`, `#.reduceEdges`, `#.findEdge` `#.someEdge`, `#.everyEdge`.
- Adding `#.mapNeighbors`, `#.filterNeighbors`, `#.reduceNeighbors`, `#.findNeighbor` `#.someNeighbor`, `#.everyNeighbor`.
- Adding `#.degreeWithoutSelfLoops`.
- Changing `#.forEach*Until` methods to `#.find*` methods.
- Dropping `#.hasGeneratedKey`.
- Dropping the `generated` last argument to edge & adjacency iterations.
- Dropping the `edgeKeyGenerator` instanciation option.
- Dropping second argument of `#.degree`.
- Changing `#.neighbors(source, target)` to `#.areNeighbors`.
- Changing iterator entries to objects rather than arrays.
- `#.exportEdge` will now always return a key.
- Fixing mutability bug with `#.copy`.
- Fixing adjacency iterator items missing `undirected`.
- Fixing edge iterator items missing `undirected`.
- Fixing bug related to instance counters and `#.clear`, `#.clearEdges`.
- Improving `#.copy` peformance.
- Improving `#.areNeighbors` performance.
- Improving `#.forEachNode` performance.
- Upgrading `obliterator` and improving iterator-based methods.

_Migration guide_

This release should only affect you in the following use-cases:

1. You were using `#.forEach*Until` methods, in which case you should replace them by the relevant `#.find*` or `#.some*` method.
2. You were using the boolean second argument to the `#.degree` methods. Replace those calls by `#.degreeWithoutSelfLoops`.
3. You were using the (well-hidden) two-arguments polymorphism of `#.neighbors`. Replace those calls by `#.areNeighbors`.
4. You were using iterators in which case the yielded entries are now objects rather than arrays and should be easier to destructure to access the parts you need.
5. You were doing despicable things with automatically generated keys.

## 0.21.1

- Fixing `#.removeNodeAttribute` error message.
- Upgrading types to `0.20.0`.

## 0.21.0

- `*Until` methods now return whether they broke.
- Fixing a bug with `#.forEachNodeUntil`.

## 0.20.0

- Changing default edge key generator to simple incremental id.

## 0.19.3

- Fixing issues related to `rollup` bundling.

## 0.19.2

- Fixing `#.dropNode` bug.

## 0.19.1

- Optimizing `#.dropNode`.

## 0.19.0

- Adding `#.forEachUntil`.
- Adding `#.forEachNodeUntil`.
- Adding `#.forEachEdgeUntil`.
- Adding `#.forEachNeighborUntil`.
- Adding `#.updateNode`.
- Adding `#.updateEdge`.
- Adding `attributes` to `attributesUpdated` events.
- Adding `attributes` to `nodeAttributesUpdated` events.
- Adding `attributes` to `edgeAttributesUpdated` events.
- Adding `#.updateEachNodeAttributes`.
- Adding `#.updateEachEdgeAttributes`.
- Passing `undirected` & `generatedKey` to `#.forEachEdge` callbacks.
- Changing `#.forEach` & `#.adjacency` semantics to something actually useful.
- Optimizing `*AttributesUpdated` events payload.
- Optimizing `#.edges(A, B)`.
- Optimizing `#.forEachEdge`.
- Optimizing `#.mergeEdge`.
- Optimizing `#.edges` and `#.nodes`.
- Optimizing `#.import`.
- Fixing `#.edges(A, B)` with directed self loops.
- Fixing `#.mergeEdgeWithKey` edge cases.
- Fixing `#.mergeAttributes` event payload.
- Fixing `#.edgeEntries` stack overflow with undirected edges.
- Dropping `before` and `after` from `replace` events metadata.
- Dropping `value` from `set` events metadata.
- Dropping overkill `toString` method.
- Correctly emitting `nodeAttributesUpdated` event when node is merged.
- Correctly emitting `edgeAttributesUpdated` event when edge is merged.
- `graphology-types` is now a peer dependency.

## 0.18.0

- Adding `#.implementation`.
- Adding `#.hasExtremity`.
- Adding `#.selfLoopCount`, `#.directedSelfLoopCount` & `#.undirectedSelfLoopCount`.
- Adding `#.hasGeneratedKey`.
- Renaming `#.directed` & `#.undirected` to `#.isDirected` & `#.isUndirected`.
- Renanming `#.selfLoop` to `#.isSelfLoop`.
- Serializing options & accepting them with `#.from` static methods.
- Improving performance of `#.opposite`.
- Improving serialization performance.
- Updating type declarations & adding generics.
- Optimizing various degree methods.
- Optimizing graph attributes methods.
- Fixing edges & neighbors iteration regarding self loops in the directed case.

## 0.17.1

- Optimizing `#.forEachEdge` methods.

## 0.17.0

- Changing packaging system.
- Fixing browser bundle.

## 0.16.1

- Bundle fixes (@zakjan).

## 0.16.0

- Proper `#.nullCopy` & `#.emptyCopy` methods.

## 0.15.2

- More flexible dependency to `graphology-types`.

## 0.15.1

- Adding missing `MultiGraph` export.
- Adding missing error typings.

## 0.15.0

- TypeScript support.
- Adding possibility to merge options using `#.emptyCopy`.

## 0.14.1

- Fixing `#.mergeEdge` for the self loop case.

## 0.14.0

- Adding `Symbol.iterator` to the prototype.
- Fixing custom inspection for node >= 10.

## 0.13.1

- Fixing edge attributes methods with typed graphs.

## 0.13.0

- Adding `#.nodeEntries`.
- Adding `#.edgeEntries`.
- Adding `#.neighborEntries`.
- Adding `#.forEach`.
- Adding `#.adjacency`.

## 0.12.0

- Adding `#.clearEdges`.
- Adding `#.forEachEdge` & alii.
- Adding `#.forEachNode` & alii.
- Adding `#.forEachNeighbor` & alii.
- Adding `#.inboundNeighbors` & `#.outboundNeighbors`.
- Adding `#.inboundEdges` & `#.outboundEdges`.
- Dropping `#.addNodesFrom`.
- Dropping `#.dropNodes` & `#.dropEdges`.
- Dropping plural serialization methods.
- Dropping `defaultNodeAttributes` & `defaultEdgeAttributes`.
- Fixing semantics of `#.inEdges` & `#.outEdges` for arity 2.
- Improving performance of edges-related methods.
- Improving performance of internal indices.
- Improving performance of `#.mergeNode`.
- Fixing edge-case deopt for `#.dropEdges`.
- Fixing bug related to multigraphs' neighbors.
- Attribute copy is now done on serialization.
- Completely reworking internal indices.

## 0.11.4

- Improving performance of neighbors-related methods.
- Improving performance of edges-related methods.

## 0.11.3

- Fixing issues related to the `obliterator` dependencies.

## 0.11.2

- Fixing an issue with `#.mergeNode` & string coercion.

## 0.11.1

- Fixing the `#.edges` for undirected graphs.

## 0.11.0

- Adding `#.directedSize` & `#.undirectedSize`.

## 0.10.2

- Performance enhancements.

## 0.10.1

- Performance enhancements.
- Fixing a bug with `#.mergeEdge` & undirected edges.

## 0.10.0

- Adding basic edges iterators.
- Fixing `#.inspect`.

## 0.9.1

- Fixing a bug concerning `#.hasEdge` & typed graphs.

## 0.9.0

- Major write performance improvements.
- Shifting the default edge key generation system.
- Dropping index' laziness.

## 0.8.0

- Adding the `#.nodesIterator` method.
- Performance improvements.

## 0.7.1

- Fixing a bug related to typed graphs' attributes.
- Fixing a bug with the dropping methods.

## 0.7.0

- Adding the `#.edge` & variants methods.
- Adding the `#.upgradeToMixed` method.
- Adding the `#.upgradeToMulti` method.
- Refactoring indices methods.

## 0.6.0

- Dropping `inbound` & `outbound` iteration methods.
- Dropping useless counting iteration methods.
- Dropping bunch consuming polymorphisms from iteration methods.
- Refactoring internal indices for undirected graphs.
- Improving performance.

## 0.5.4

- Fixing degree methods for typed graphs.

## 0.5.3

- Improving performance.

## 0.5.2

- Node.js 0.12.x compatibility.
- Fixing bug related to the graph's string coercion.
- Improving performance.
- Better error message when adding a self-loop when it's not authorized.

## 0.5.1

- Better unit tests.
- Internal refactoring.

## 0.5.0

- Implementing the static `#.from` method & switching constructor paradigm.
- Fixing bug related to the `attributesUpdated` event.
- Adding more errors related to attributes' setters.
- Adding typed edges attributes' getters/setters.
- Rewrote internal indices.
- Dropping `#.getEdge` & friends.
- Dropping `#.selfLoops`.

## 0.4.2

- Adding missing built files to the npm package.

## 0.4.1

- Adding missing `attributes` in export.

## 0.4.0

- Adding `#.removeNodeAttribute` & `#.removeEdgeAttribute` that was actually missing from earlier versions.
- Adding graph attributes.
- `nodeUpdated` & `edgeUpdated` changing to `nodeAttributesUpdated` & `edgeAttributesUpdated` respectively.

## 0.3.0

- Adding merge flags to import methods.

## 0.2.0

- Adding `#.hasNodeAttribute` & `#.hasEdgeAttribute`.
- Adding `#.removeNodeAttribute` & `#.removeEdgeAttribute`.
- Adding `#.mergeNode`.
- Adding `#.mergeEdge`, `#.mergeEdgeWithKey` and friends.
- Renaming `#.relatedNode` to `#.opposite`.
- Dropping the `onDuplicateNode` & `onDuplicateEdge` options.

## 0.1.1

- Fixing the argument passed to the `edgeKeyGenerator` function.
- Fixing a bug where source & target of an edge were not internally coerced to strings.

## 0.1.0

Initial version compliant to the specs.
