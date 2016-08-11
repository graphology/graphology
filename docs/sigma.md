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
function nodeReducer(graph, renderer, node) {
  const currentAction = renderer.getState().action,
        nodeState = renderer.getNodeState();

  if (currentAction === 'highlight') {
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

## Draft

```js
import Graph from 'graph';
import Sigma, {Camera} from 'sigma';

// Renderers (DOM is auto-detect 'canvas' or 'webgl')
import DOMRenderer from 'sigma/dom';
import CanvasRenderer from 'sigma/canvas';
import WebglRenderer from 'sigma/webgl';
import SVGRenderer from 'sigma/svg';

const graph = new Graph();

const sigma = new Sigma(graph, {

  // Optional camera, if none provided, the instance will create its own
  camera: new Camera(),

  // Providing the renderer class
  renderer: new DOMRenderer('#container'),

  // Reducers (they are all merged into one another)
  nodeReducers: [
    function(graph, node) {
      const state = this.getState(),
            nodeState = this.getNodeState(node);

      let color;

      if (state.highlighting)
        color = nodeState.highlighted ? 'red' : 'gray';
      else
        color = graph.getNodeAttribute('color');

      return {
        label: node,
        x: graph.getNodeAttribute(node, 'x'),
        y: graph.getNodeAttribute(node, 'y'),
        color
      };
    }
  ]

  // Usual settings
  settings: {
    maxNodeSize: 34
  }
});

// Alternatively
const sigma = new Sigma(graph, DOMRenderer);

// Retrieving various things:
const graph = sigma.getGraph();
const camera = sigma.getCamera();
const renderer = sigma.getRenderer();

// Setting state
sigma.setState('highlighting', true);
sigma.setNodeState(node, 'highlighted', false);

// Refreshing manually
sigma.refresh();

// Handling camera
camera.goTo();
camera.getState();

// Binding events (do this at renderer level?)
sigma.on('clickNode', function(node) {
  sigma.setNodeState(node, 'highlighted', true);
});

// Extending sigma to provide high-level methods:
class MySigma extends Sigma {
  highlightNode(node) {
    this.setEveryNodeState(node, 'highlighted', false);
    this.setNodeState(node, 'highlighted', true);
    this.setState('highlighting', true);
  }

  reset() {
    this.setEveryNodeState('highlighted', false);
    this.setState('highlighting', false);
  }
}

const mySigma = new MySigma();

mySigma.on('clickNode', mySigma.highlightNode);
mySigma.on('clickStage', mySigma.reset);

// Extending a renderer (you can also create one from scratch following a known interface)
// Or you can provide options to the basic canvas renderer instead
class CustomCanvasRenderer extends CanvasRenderer {

  // Those methods are specific to each renderer (webgl doesn't need same as canvas)
  drawNode(canvas, data, settings) {

    // Here, camera translations & middlewares are already processed

    // Do canvas magic...
    canvas.rect(...);
  }
}

// The rendering pipe should be described in the renderer itself (webgl process for instance
// should be handled in the renderer & not in the sigma instance).

// Process: (react on data or state update)
//   1. Reducers (data + state) => info
//   2. Middlewares => pre-rendering data
//   3. Camera view + Renderer display => rendering state

// Accessing actual rendered state
renderer.getRenderingState(node);
```
