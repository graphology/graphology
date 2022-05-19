[![Build Status](https://github.com/graphology/graphology/workflows/Tests/badge.svg)](https://github.com/graphology/graphology/actions) [![DOI](https://zenodo.org/badge/66482976.svg)](https://zenodo.org/badge/latestdoi/66482976)

# Graphology

`graphology` is a robust & multipurpose `Graph` object for JavaScript and TypeScript.

It aims at supporting various kinds of graphs with the same unified interface.

A `graphology` graph can therefore be directed, undirected or mixed, allow self-loops or not, and can be simple or support parallel edges.

Along with this `Graph` object, one will also find a comprehensive [standard library](https://graphology.github.io/standard-library/) full of graph theory algorithms and common utilities such as graph generators, layouts, traversals etc.

Finally, `graphology` graphs are able to emit a wide variety of [events](https://graphology.github.io/events), which makes them ideal to build interactive renderers for the browser. It is for instance used by [sigma.js](https://www.sigmajs.org/) as its data backend.

## Installation

To install `graphology` using npm, run the following command:

```
npm install graphology
```

*Legacy bundle*

Standalone builds of `graphology` and its full standard library can be found in the repository's [releases](https://github.com/graphology/graphology/releases) if you can only rely on your own `script` tags to load code.

```html
<!-- To use a Graph object -->
<script src="graphology.min.js"></script>
<!-- This exposes a global variable named "graphology" -->
<script>
  const graph = new graphology.Graph();

  const {UndirectedGraph, DirectedGraph} = graphology;
</script>

<!-- To use the standard library -->
<script src="graphology-library.min.js"></script>
<!-- This exposes a global variable named "graphologyLibrary" -->
<script>
  const density = graphologyLibrary.metrics.graph.density(graph);
</script>
```

Be warned that the standard library bundle often lags behind and is not always completely up to date.

*TypeScript usage*

Note that `graphology` also exports type declaration that are installed along using peer dependencies so it can be used with [TypeScript](https://www.typescriptlang.org/) out of the box.

If your version of npm is a bit old, you may need to install `graphology-types` yourself if the peer dependency resolution is not made for you already:

```
npm install graphology-types
```

It can also be useful to pin `graphology-types` version in your `package.json` to avoid resolution issues sometimes.

## How to cite

`graphology` is published on [Zenodo](https://zenodo.org/) as [![DOI](https://zenodo.org/badge/66482976.svg)](https://zenodo.org/badge/latestdoi/66482976)

You can cite it thusly:

> Guillaume Plique. (2021). Graphology, a robust and multipurpose Graph object for JavaScript. Zenodo. https://doi.org/10.5281/zenodo.5681257

## Changelog

A complete changelog can be found [here](https://github.com/graphology/graphology/blob/master/CHANGELOG.md).
