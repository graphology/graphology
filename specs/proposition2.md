# API Specs Proposition n°2

## Rationale

This proposition will assume the following:

* A node is the combination of an `key` which can be anything, and an optional `value` which is a key-value store whose integrity should be managed by the graph itself.
* An edge is also the combination of an `key` which can be anything, and an optinal `value` which is a key-value store whose integrity should be managed by the graph itself. Oviously, an edge has to go from a source node (by id) to a target node (by id).

**Node**: `(key) => value`

**Edge**: `(key) + (source, target) => value`

## Note

* This proposition assumes a very strict position about the value of the nodes as a protected properties store for the following reasons:
  * Possibility of localized events (needed by rendering engines to perform some kind of incremental updates).
  * Underlying implementation freedom (you want to use a FloatArray as storage, well you can).
  * Possibility to implement attributes' indexes very easily.
  * Possibility to enforce some "good practices" about specific node attributes such as checking that an edge's weight, or a node's x or y positions are correctly given as numerical values.
* It could be possible to make edges' key optional but this create issues concerning parallel edges.
* The keys of nodes & edges can be absolutely anything (scalar or not) and can be mutated *ad lib* without altering the structure of the graph.
* Serialization should somewhat be fairly easy to do.
* Once again, this implementation's rationale is very inspired by [networkx](https://networkx.github.io/).
* The reason why we have to split the concepts using both `key` and `value` is mostly because it's the only way to have both a data structure oblivious of what you give as "nodes" at the same time as keeping the possibility to query the graph by `id` in a performant way (namely `O(1)`).

## Graph types

The default graph should be mixed (both directed & undirected edges), support self-loops & parallel edges.

There should probably be subtypes of graph enabling the implementation to perform optimizations if the user can declare beforehand the type of their graph.

## Loose questions

* Should an edge be added with non-existent source or target: should we throw or add the missing nodes?
* Should we use `property` or `attribute` to design the key-value pairs of the nodes' & edges' values?
