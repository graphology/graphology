/**
 * Graphology Browser DOT Unit Tests Parser Definitions
 * =====================================================
 *
 * Definitions of the DOT files stored in `./resources` so we can test
 * that the parser works as expected.
 */
module.exports = [
  {
    title: 'Basic Graph',
    dot: 'basic',
    basics: {
      type: 'undirected',
      multi: false,
      meta: {
        id: 'G'
      },
      order: 6,
      node: {
        key: 'n0',
        attributes: {}
      },
      size: 7,
      edge: {
        source: 'n0',
        target: 'n2',
        attributes: {}
      }
    }
  },
  {
    title: 'Directed Graph',
    dot: 'directed',
    basics: {
      type: 'directed',
      multi: false,
      meta: {
        id: 'G'
      },
      order: 4,
      node: {
        key: 'n0',
        attributes: {}
      },
      size: 4,
      edge: {
        source: 'n0',
        target: 'n1',
        undirected: false,
        attributes: {}
      }
    }
  },
  {
    title: 'Attributes Graph',
    dot: 'attributes',
    basics: {
      type: 'undirected',
      multi: false,
      meta: {
        id: 'G',
        mode: 'static'
      },
      order: 6,
      node: {
        key: 'n0',
        attributes: {
          color: 'green'
        }
      },
      size: 7,
      edge: {
        source: 'n5',
        target: 'n4',
        attributes: {
          weight: 1.1
        }
      }
    }
  }
];
