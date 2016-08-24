# Running the unit tests

If you implemented `graphology` on your own and want to be sure you are compliant with the present specifications, here is how to run the unit tests:

First, you need to install `graphology` and `mocha` from npm:

```
npm install --save-dev graphology mocha
```

Then you need to create a file to run with mocha:

```js
// test.js
import specs from 'graphology/specs';
import Graph from 'my-implem';

module.exports = specs(Graph, Graph, {map: true});
```

*Arguments*

* **class** <span class="code">function</span>: the Graph class of your implementation.
* **implementation** <span class="code">object</span>: an object containing the rest of the implementation (alternative constructors, errors). Note that most of the time, or at least if you export your implementation through CommonJS, the `class` and `implementation` arguments will be the same.
* **options** <span class="code">object</span>: options:
  * **map** <span class="code">boolean</span> <span class="default">true</span>: whether to test `GraphMap` also.

Then, run the tests using `mocha`:

```
mocha -u exports test.js
```
