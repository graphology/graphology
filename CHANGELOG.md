# Changelog

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
