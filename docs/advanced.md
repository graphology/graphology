# Advanced

## Indices

To be efficient, it is likely that most implementations will rely on internal indices.

But, since this part is likely to be implementation-related rather than enforced by the present specifications, we cannot describe more than some generic methods and a way to provide configuration if needed.

## Reference implementation

The reference `Graph` implementation computes a single index called `structure`.

By default, to avoid useless memory consumption, those indices are not computed before they are needed (when iterating on a node's neighbors, for instance).

But one remains free to customize the indices behavior to better fit their needs.

To customize an index' behavior, one must provide some configuration to the graph thusly:

```js
{
  lazy: false
}
```

* **lazy** <span class="code">[boolean]</span> <span class="default">false</span>: Should the index be computed ahead of time or should it be computed only when it becomes necessary?

### Example

Let's customize our graph indices' generation:

```js
const configuration = {
  structure: {
    lazy: true
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
