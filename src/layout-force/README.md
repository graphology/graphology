# Graphology Force layout

JavaScript implementation of a basic [force directed layout algorithm](https://en.wikipedia.org/wiki/Force-directed_graph_drawing) for [graphology](https://graphology.github.io).

In some few cases, for very small graphs, [ForceAtlas2](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0098679) can be "too efficient". This simpler force algorithm cannot spatialize larger networks, but will offer a more organic movement.

## Installation

```
npm install graphology-layout-force
```

## Usage

- [Pre-requisite](#pre-requisite)
- [Settings](#settings)
- [Synchronous layout](#synchronous-layout)
- [Webworker](#webworker)

### Pre-requisites

Each node's starting position must be set before running the force layout algorithm. Two attributes called `x` and `y` must therefore be defined for all the graph nodes.

### Settings

- **xKey** _?string_ [`"x"`]: name of the attribute representing the `x` position of each node.
- **yKey** _?string_ [`"y"`]: name of the attribute representing the `y` position of each node.
- **attraction** _?number_ [`0.0005`]: importance of the attraction force, that attracts each pair of connected nodes like elastics.
- **repulsion** _?number_ [`0.1`]: importance of the repulsion force, that attracts each pair of nodes like magnets.
- **gravity** _?number_ [`0.0001`]: importance of the gravity force, that attracts all nodes to the center.
- **inertia** _?number_ [`0.6`]: percentage of a node vector displacement that is preserved at each step. `0` means no inertia, `1` means no friction.
- **maxMove** _?number_ [`200`]: Maximum length a node can travel at each step, in pixel.
- **shouldSkipEdge** _?function_: If given, the algorithm will completely ignore edges when `shouldSkipEdge` returns a truthy value.
- **shouldSkipNode** _?function_: If given, the algorithm will completely ignore nodes when `shouldSkipNode` returns a truthy value.
- **isNodeFixed** _?function_: If given, the algorithm will not move nodes when `isNodeFixed` returns a truthy value. These nodes will still apply forces on other nodes.

### Continuous run

The only way to run this algorithm now is to start it is to start it, and it will continuously compute new positions for the graph nodes.

_Example_

```js
import ForceLayout from 'graphology-layout-force';

const layout = new ForceLayout(graph);

// To start the layout. Here, highlighted nodes will be frozen:
layout.start({ settings: { isNodeFixed: node => graph.getNodeAttribute(node, "highlighted") } });

// To stop the layout
layout.stop();

// To kill the layout and release attached memory
layout.kill();
```
