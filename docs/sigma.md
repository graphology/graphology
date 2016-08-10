# Concerning sigma

Sigma could largely beneficiate from `graphology` but should evolve this way:

## Graph data handling

Sigma shouldn't handle graph data anymore. Instead, a graph is bound to a sigma renderer & this renderer will refresh automatically on every relevant frame anytime the graph's data is updated by listening to its events.

This comes with many advantages like a good separation of concerns that enable anyone to use the `graphology` standard libs & extension to handle graph data (layout, communities, etc.) instead of having to rely on sigma.

Basically, sigma should become only a rendering engine (this includes other targets than the DOM, .dot for instance, cf. React).

```js
const graph = new Graph();
const renderer = new sigma();

// Or whatever, naming is bollocks
sigma.bind(graph);

graph.addNode('Hello');
// Will automatically refresh the view next frame
```

## Rendering & camera internal indexes

Sigma should not attach rendering & camera data to the nodes anymore.

Instead, those belong to an internal index of both the renderers & the cameras (no more `renderer1:x` properties and such attached to the node's data, the renderer will rely on its own index).

## Rendering state

Even if it might be desirable to let a layout edit the graph's data, it becomes very cumbersome when what you need is actually to edit rendering state.

Let's take a simple example: highlighting a node & its neighbors:

Typically, what you have to do is the following: if someone clicks a node, then you're gonna display this node in red, find its neighbors & do the same while also changing the color of every other node to a muted color.

Usually, and this is how sigma currently works, you would edit the nodes' data to change the color. But the issue is that you also have to keep the original color to display it back etc. This leads you to store parasite data by keeping an `originalColor` attribute or a `displayedColor` one & this is a bit awkward to attach this to the graph's own data since it is only relevant to the renderer's fleeting state. What if, for instance (this is an issue on manylines), you have to export the graph back for storing? You'll have to treat the data again to drop things you don't want to store because they are related to an ephemeral state of display.

So, here's two propositions:

* Let the renderer store state:

```js
graph.addNode('John', {age: 45});

// Once again, naming is bollocks
renderer.mergeNodeState('John', {highlighted: true});
renderer.mergeState({action: 'highlight'});
```

* Let the user specify reducers returning display information:

```js
// Function whose goal is to take graph data & renderer state
// and return display information
function nodeReducer(node, nodeState, rendererState) {
  if (rendererState.action === 'highlight') {
    return {
      color: nodeState.highlighted ? 'red' : 'gray'
    };
  }

  return {
    color: graph.getNodeAttribute(node, 'color')
  };
}
```

Another use case that pinpoint a potential use of this is manylines' category minimaps. They render the same data but have to tweak the internal macro-renderer just to be sure to avoid the map's state to change their display.

With this, rendering state is tied to a renderer & not to the graph's data.
