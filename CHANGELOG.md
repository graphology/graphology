# Changelog

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
