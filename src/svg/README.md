# Graphology SVG

SVG rendering routines for [`graphology`](https://graphology.github.io).

## Installation

```
npm install graphology-svg
```

## Usage

```js
var render = require('graphology-svg');

render(graph, './graph.svg', () => console.log('Done!'));
render(graph, './graph.svg', settings, () => console.log('Done!'));
```
