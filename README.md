[![Build Status](https://github.com/graphology/graphology/workflows/Tests/badge.svg)](https://github.com/graphology/graphology/actions)

# Graphology

`graphology` is a robust & multipurpose `Graph` object for JavaScript and TypeScript.

It aims at supporting various kinds of graphs with the same unified interface.

A `graphology` graph can therefore be directed, undirected or mixed, allow self-loops or not, and can be simple or support parallel edges.

Along with those specifications, one will also find a comprehensive [standard library](standard-library) full of graph theory algorithms and common utilities such as graph generators, layouts, traversals etc.

Finally, `graphology` graphs are able to emit a wide variety of [events](events), which makes them ideal to build interactive renderers for the browser. It is for instance used by [sigma.js](https://www.sigmajs.org/) as its data backend.

## Installation

To install `graphology` using npm, run the following command:

```
npm install graphology
```

The source repository can be found on [this](https://github.com/graphology/graphology) github repository, where you will be able to find standalone builds in the [releases](https://github.com/graphology/graphology/releases) for older JavaScript configurations.

Note that `graphology` also exports type declaration that are installed along using peer dependencies so it can be used with [TypeScript](https://www.typescriptlang.org/) out of the box.

If your version of npm is a bit old, you may need to install `graphology-types` yourself if the peer dependency resolution is not made for you already:

```
npm install graphology-types
```

## Changelog

A complete changelog can be found [here](https://github.com/graphology/graphology/blob/master/CHANGELOG.md).
