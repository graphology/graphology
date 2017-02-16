# Changelog

## 0.5.2 (provisional)

* Node.js 0.12.x compatibility.
* Fixing bug related to the graph's string coercion.

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
