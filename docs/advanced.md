# Advanced

## Indices

To be efficient, it is likely that most implementations will rely on internal indices.

But, since this part is likely to be reference-related rather than enforced by the present specifications, we cannot enforce more than some generic methods and a way to provide some configuration if needed.

## Reference implementation

The reference `Graph` implementation computes a single index called `structure`.

By default, to avoid useless memory consumption, those indices are not computed before they are needed (when iterating on a node's neighbors, for instance).

But one remains free to customize the indices behavior to better fit their needs.

By default then, indices are lazily computed, full and synchronized.

To customize an index' behavior, one must provide some configuration to the graph thusly:

```js
{
  precomputed: false,
  synchronized: false
}
```

* **precomputed** <span class="code">[boolean]</span> <span class="default">false</span>: Should the index be computed ahead of time or should it be computed when it becomes necessary?
* **synchronized** <span class="code">boolean</span> <span class="default">false</span>: Should the index be automatically synchronized when needed after being computed the first time, or should it be lazily synchronized?

### Example

Let's customize our graph indices' generation:

```js
const configuration = {
  structure: {
    precomputed: true,
    synchronized: true
  }
};

const graph = new Graph(null, {indices: configuration});
```

### Indices-related methods

#### #.computeIndex

Forces the computation of the desired index.

*Example*

```js
graph.computeIndex('structure');
```

*Arguments*

* **name** <span class="code">string</span>: name of the index to compute.

#### #.clearIndex

Release the desired index from memory.

*Example*

```js
graph.clearIndex('structure');
```

*Arguments*

* **name** <span class="code">string</span>: name of the index to clear.
