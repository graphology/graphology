---
layout: default
title: Implementing graphology
nav_order: 15
---

# Implementing graphology

Although the `graphology` npm package proposes its reference implementation, `graphology`is actually only a specification for a JavaScript/TypeScript `Graph` that anyone remains free to implement however they like.

What's more, any custom implementation of `graphology` remains completely able to use all of the [standard library](./standard-library) and type declarations, without any additional complications.

Graphs are complex structures and, while we designed the reference implementation to handle most common cases with good performance, there is no silver bullet and one will always be able to implement the present specifications in a more performant fashion for very specific use cases.

If you wish to implement `graphology` on your own and want to be sure you are doing it correctly, know that it is possible to test your own implementation against the lib's unit tests.

## Running the unit tests

First, you need to install `graphology` and `mocha` from npm:

```
npm install --save-dev graphology mocha
```

Then you need to create a file that will be run by `mocha`:

```js
// test.js
import specs from 'graphology/specs';
import Graph from 'my-custom-graphology-implementation';

module.exports = specs(Graph, Graph);
```

*Arguments*

* **class** <span class="code">function</span>: the Graph class of your implementation.
* **implementation** <span class="code">object</span>: an object containing the rest of the implementation (alternative constructors, errors). Note that most of the time, or at least if you export your implementation through CommonJS, the `class` and `implementation` arguments will be the same.

Then, run the tests using `mocha`:

```
mocha -u exports test.js
```
