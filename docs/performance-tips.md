---
layout: default
title: Performance tips
nav_order: 2.5
---

# Performance tips
{: .no_toc }

1. TOC
{:toc}

## Iterate using callback methods

This might seem counter-intuitive but iteration methods accepting old-fashioned callbacks (such as `#.forEachNode`, `#.forEachEdge`, for instance), are the fastest way to iterate through a graph.

Here are some reasons why:

1. `#.nodes` and `#.edges` must create an array and allocate memory by doing so and you will actually double your loop if you need to iterate over them once more afterwards.
2. Callback iteration methods gives you access to almost everything you could need without additional lookup of the graph, such as attributes, edge source & target etc.
3. Iterators are nice but are still quite badly optimized by JavaScript engines (including v8).

Long story short: if performance is critical, prefer callback methods.

```javascript
// Slowest...
graph.nodes().forEach(node => {
  const attr = graph.getNodeAttributes(node);
  console.log(node, attr);
});

// Still quite slow...
const nodes = graph.nodes();

for (let i = 0; i < nodes.length; i++) {
  const node = nodes[i];
  const attr = graph.getNodeAttributes(node);
  console.log(node, attr);
}

// Ok, I guess...
for (const [node, attr] of graph.nodeEntries()) {
  console.log(node, attr);
}

// Fast 🚀
graph.forEachNode((node, attr) => {
  console.log(node, attr);
});
```

Be sure, also, to avoid callback nesting if you want to keep as fast as possible.

```javascript
// BAD
graph.forEachNode(node => {

  // You are creating a function at each step of the node loop here!
  graph.forEachNeighbor(node, neighbor => {
    console.log(node, neighbor);
  });
});

// EVEN BETTER BUT CURSED
let currentNode;

function neighborCallback(neighbor) {
  console.log(currentNode, neighbor);
}

graph.forEachNode(node => {
  currentNode = node;
  graph.forEachNeighbor(node, neighborCallback);
});
```

Finally, always know that this should only be a concern if you are implementing a library or writing low-level code. If not, please use what fits your style and personal preference as it will probably not matter.

## Handle edge keys by yourself

If you know what you are doing, it can be a good idea to shunt the graph's automatic edge key creation by avoiding `#.addEdge` and relying on `#.addEdgeWithKey` instead.

Indeed, the automatic edge key generator was designed to avoid many common pitfalls such as collision detection across instances and runtimes.

So, if you know for sure how to avoid those pitfalls, you can probably generate keys yourself using a more performant method, such as basic incremental integers from `0` to `n`.

```javascript
function incrementalId() {
  let i = 0;

  return () => i++;
}

const edgeKeyGenerator = incrementalId();

const graph = new Graph();
graph.addNode('one');
graph.addNode('two');
graph.addEdgeWithKey(edgeKeyGenerator(), 'one', 'two');
```

## Avoid iterating twice on edges in mixed graphs

It is often desirable to handle directed & undirected egdes differently when operating on mixed graphs.

However the following scheme might underperform:

```js
graph.forEachDirectedEdge((edge) => {
  // Do something with directed edges...
});

graph.forEachUndirectedEdge((edge) => {
  // Do something with undirected edges...
});
```

This is because you will actually iterate twice on the internal edge map.

You should probably prefer using the `undirected` argument of edge iteration likewise:

```js
graph.forEachEdge((edge, attr, source, target, sa, ta, undirected) => {
  if (undirected) {
    // Do something with undirected edges...
  }
  else {
    // Do something with directed edges...
  }
});
```
