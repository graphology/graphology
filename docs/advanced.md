# Advanced

## Indexes

For convenience, the `Graph` instance computes two kinds of indexes:

* Index of neighbors.
* Index of related edges.

By default, to avoid useless memory consumption, those indexes are not computed before they are needed (when iterating on a node's neighbors, for instance).

But one remains free to customize the indexes behavior to better fit their needs.

By default then, indexes are lazily computed, full and synchronized.

To customize an index' behavior, one must provide some configuration to the graph thusly:

```js
{
  full: true,
  precomputed: false,
  synchronized: false
}
```

* **full** <span class="code">[boolean]</span> <span class="default">true</span>: Should the index be fully computed or just computed for the needed part (won't cut the computation time down, only memory usage).
* **precomputed** <span class="code">[boolean]</span> <span class="default">false</span>: Should the index be computed ahead of time or should it be computed when it becomes necessary?
* **synchronized** <span class="code">boolean</span> <span class="default">false</span>: Should the index be automatically synchronized when needed after being computed the first time, or should it be lazily synchronized?
