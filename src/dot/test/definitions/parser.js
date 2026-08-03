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
  },
  {
    title: 'Escaped Attributes',
    dot: 'escaped_attrs',
    basics: {
      type: 'undirected',
      multi: false,
      meta: {
        id: 'G'
      },
      order: 2,
      node: {
        key: 'n0',
        attributes: {
          color: '#FF0000',
          label: 'say "hello"'
        }
      },
      size: 1,
      edge: {
        source: 'n0',
        target: 'n1',
        attributes: {
          note: 'File: "test.txt" #1'
        }
      }
    }
  },
  {
    title: 'Boolean Attributes',
    dot: 'boolean_attrs',
    basics: {
      type: 'undirected',
      multi: false,
      meta: {
        id: 'G'
      },
      order: 2,
      node: {
        key: 'n0',
        attributes: {
          active: true,
          visible: false,
          count: 0
        }
      },
      size: 1,
      edge: {
        source: 'n0',
        target: 'n1',
        attributes: {
          highlighted: true,
          weight: 2
        }
      }
    }
  },
  {
    title: 'Edge Chain',
    dot: 'edge_chain',
    basics: {
      type: 'directed',
      multi: false,
      meta: {
        id: 'D'
      },
      order: 4,
      node: {
        key: 'a',
        attributes: {}
      },
      size: 3,
      edge: {
        source: 'a',
        target: 'b',
        undirected: false,
        attributes: {}
      }
    }
  },
  {
    title: 'Subgraph',
    dot: 'subgraph',
    basics: {
      type: 'undirected',
      multi: false,
      meta: {},
      order: 3,
      node: {
        key: 'a',
        attributes: {
          color: 'red'
        }
      },
      size: 2,
      edge: {
        source: 'b',
        target: 'c',
        attributes: {}
      }
    }
  },
  {
    title: 'Default Attributes',
    dot: 'default_attrs',
    basics: {
      type: 'undirected',
      multi: false,
      meta: {},
      order: 3,
      node: {
        key: 'a',
        attributes: {
          color: 'red',
          shape: 'box'
        }
      },
      size: 2,
      edge: {
        source: 'b',
        target: 'c',
        attributes: {
          weight: 3
        }
      }
    }
  },
  {
    title: 'Mixed Graph',
    dot: 'mixed',
    basics: {
      type: 'mixed',
      multi: false,
      meta: {
        id: 'G'
      },
      order: 4,
      node: {
        key: 'a',
        attributes: {}
      },
      size: 2,
      edge: {
        source: 'a',
        target: 'b',
        undirected: false,
        attributes: {}
      }
    }
  },
  {
    title: 'Implicit Nodes',
    dot: 'implicit_nodes',
    basics: {
      type: 'undirected',
      multi: false,
      meta: {},
      order: 3,
      node: {
        key: 'a',
        attributes: {}
      },
      size: 2,
      edge: {
        source: 'a',
        target: 'b',
        attributes: {}
      }
    }
  },
  {
    title: 'Special Node IDs',
    dot: 'special_node_ids',
    basics: {
      type: 'directed',
      multi: false,
      meta: {
        id: 'G'
      },
      order: 3,
      node: {
        key: '++_2036923609960',
        attributes: {
          node_kind: '++',
          is_named: false,
          text: '++'
        }
      },
      size: 2,
      edge: {
        source: '++_2036923609960',
        target: ')_2036923547800',
        undirected: false,
        attributes: {}
      }
    }
  }
];
