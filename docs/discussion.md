# Discussion

Issues can be found [here](https://github.com/medialab/graphlib/issues).

| Status | Precisions | Description |
| :---: | :---: | --- |
| [?] | [link](#curry) | Discuss awkward currying of some attribute-related methods? |
| [?] | [link](#adj) | Discuss the adjacency iteration. |
| [X] | [link](#directed) | Make the graph Directed by default? |
| [X] | [link](#404) | Decide whether providing not found nodes to the edge-adding method should throw or create the nodes. (Option?) |

<h2 id="curry">Currying on attribute-releated method</h2>

Let's take the case of the `#.getNodeAttribute` method: it takes two arguments, the key of the node & the name of the attribute we want to retrieve. There is no arguing that this argument order is the better and looks quite consistent with JavaScript objects & feels natural to any JavaScript developer.

However, this order makes functional patterns like currying or partial application quite hard to use:

```js
// Let's say I want to collect the label of all my nodes, I can do this:
const labels = graph.mapNodes(node => graph.getAttribute(node, 'label'));

// But I cannot do what fancy functional programmers would do with partial
// application if the arguments were reversed, or the function curried:
const lables = graph.mapNodes(graph.getNodeAttribute('label'));

// Note that we could also use partialRight application but this is hardly
// elegant or considered a good pattern
```

The question is therefore: do we introduce some kind of akward currying by creating another signature of arity one to those function, taking the name of the attribute as lone argument and returning a function taking the node afterwards; or do we let external libraries & utilities tackle the problem?

<h2 id="adj">Adjacency iteration</h2>

What of it? What arguments will it take & on what exactly will we iterate?

<h2 id="directed">Should the graph be directed by default?</h2>

Letting the graph mixed would let people not worry too much about this.

<h2 id="404">On the topic of not found nodes when adding edges</h2>

On most graph libraries, edge-adding method won't throw when one of the referenced nodes is not found in the graph. Instead, they will add it to the graph. We could apply this behavior but we noticed that the only benefit from this approach is when you handle very simple graphs whose nodes don't require attributes.

```js
// For now, this will throw if one of the nodes is unknown:
graph.addEdge('source', 'target', {weight: 1});

// We could add the missing nodes but we won't be able to give attributes to them
// We could add a very cumbersome arity to tackle the issue:
// (array-polymorphism can't work since we can have arrays as nodes, remember?)
graph.addEdge('source', sourceAttr, 'target', targetAttr, {weight: 1});
```
