/**
 * Graphology Browser GRAPHML Unit Tests Parser Definitions
 * =========================================================
 *
 * Definitions of the GRAPHML files stored in `./resources` so we can test
 * that the parser works as expected.
 */
module.exports = [
  {
    title: 'Basic Graph',
    graphml: 'basic',
    basics: {
      type: 'undirected',
      multi: false,
      meta: {
        id: 'G'
      },
      order: 11,
      node: {
        key: 'n5',
        attributes: {}
      },
      size: 12,
      edge: {
        source: 'n5',
        target: 'n7',
        attributes: {}
      }
    }
  },
  {
    title: 'Attributes Graph',
    graphml: 'attributes',
    basics: {
      type: 'undirected',
      multi: false,
      meta: {
        id: 'G',
        mode: 'static'
      },
      order: 6,
      node: {
        key: 'n4',
        attributes: {
          color: 'yellow'
        }
      },
      size: 7,
      edge: {
        source: 'n1',
        target: 'n3',
        attributes: {
          weight: 2
        }
      }
    }
  },
  {
    title: 'Les Misérables',
    graphml: 'miserables',
    basics: {
      type: 'undirected',
      multi: false,
      meta: {},
      order: 77,
      node: {
        key: '11',
        attributes: {
          label: 'Valjean',
          'Modularity Class': 1,
          size: 100,
          x: -87.93029,
          y: 6.8120565,
          color: '#f55b5b'
        }
      },
      size: 254,
      edge: {
        key: '169',
        source: '63',
        target: '62',
        undirected: true,
        attributes: {
          weight: 6
        }
      }
    }
  },
  {
    title: 'Les Misérables Broken',
    graphml: 'miserables_broken',
    basics: {
      type: 'undirected',
      multi: false,
      meta: {},
      order: 77,
      node: {
        key: '11',
        attributes: {
          label: 'Valjean',
          modularity_class: '1',
          size: 100,
          x: -87.93029,
          y: 6.8120565,
          color: '#f55b5b'
        }
      },
      size: 254,
      edge: {
        source: '66',
        target: '64',
        attributes: {
          weight: 3
        }
      }
    }
  },
  {
    title: 'MultiGraph',
    graphml: 'multigraph',
    basics: {
      type: 'undirected',
      multi: true,
      meta: {
        id: 'G'
      },
      order: 6,
      node: {
        key: 'n4',
        attributes: {
          color: 'yellow'
        }
      },
      size: 9,
      edge: {
        key: 'e8',
        source: 'n5',
        target: 'n4',
        attributes: {
          weight: 7.5
        },
        undirected: true
      }
    }
  },
  {
    title: 'Mixed MultiGraph',
    graphml: 'mixed_multigraph',
    basics: {
      type: 'mixed',
      multi: true,
      meta: {
        id: 'G'
      },
      order: 6,
      node: {
        key: 'n5',
        attributes: {
          color: 'turquoise'
        }
      },
      size: 8,
      edge: {
        key: 'e6',
        undirected: false,
        source: 'n5',
        target: 'n4',
        attributes: {
          weight: 1.1
        }
      }
    }
  },
  {
    title: 'Missing Nodes',
    graphml: 'missing_nodes',
    options: {
      addMissingNodes: true
    },
    basics: {
      type: 'directed',
      multi: false,
      meta: {
        id: '1000'
      },
      order: 51,
      node: {
        key: '9306289',
        attributes: {}
      },
      size: 37,
      edge: {
        source: '9504277',
        target: '9306289',
        attributes: {
          modification: 'add',
          timestamp: '1995-04-11'
        }
      }
    }
  }
];
