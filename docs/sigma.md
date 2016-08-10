# Concerning sigma

Sigma could largely beneficiate from `graphology` but should evolve this way:

## Graph data handling

Sigma shouldn't handle graph data anymore. Instead, a graph is bound to a sigma renderer & this renderer will refresh automatically on every relevant frame anytime the graph's data is updated by listening to its events.

This comes with many advantages like a good separation of concerns that enable anyone to use the `graphology` standard libs & extension to handle graph data (layout, communities, etc.) instead of having to rely on sigma.

Basically, sigma should become only a rendering engine (this includes, why not, other targets than the DOM, cf. React).

```js
const graph = new Graph();
const renderer = new sigma();

// Or whatever, naming is bollocks
sigma.bind(graph);

graph.addNode('Hello');
// Will automatically refresh the view next frame
```

## Rendering & camera data

Sigma should not attach rendering & camera data to the nodes anymore. Instead, those belong to an internal index of both the renderer & the camera.

We could try to extend the concept by enabling the user to tag some state on specific nodes without having to rely on modifying the graph's data (changing rendering node's color comes to mind).
