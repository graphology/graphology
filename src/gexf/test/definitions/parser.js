/**
 * Graphology Browser GEXF Unit Tests Parser Definitions
 * ======================================================
 *
 * Definitions of the GEXF files stored in `./resources` so we can test
 * that the parser works as expected.
 */
module.exports = [
  {
    title: 'Minimal Graph',
    gexf: 'minimal',
    basics: {
      type: 'directed',
      multi: false,
      version: '1.2',
      mode: 'static',
      defaultEdgeType: 'directed',
      meta: {
        creator: 'Gexf.net',
        description: 'A hello world! file',
        lastModifiedDate: '2009-03-20'
      },
      order: 2,
      node: {
        key: 0,
        attributes: {
          label: 'Hello'
        }
      },
      size: 1,
      edge: {
        key: 0,
        source: 0,
        target: 1
      }
    }
  },
  {
    title: 'Graph with Missing Nodes',
    gexf: 'missing_nodes',
    options: {
      addMissingNodes: true
    },
    basics: {
      type: 'directed',
      multi: false,
      version: '1.2',
      mode: 'static',
      defaultEdgeType: 'directed',
      meta: {
        creator: 'Gexf.net',
        description: 'A hello world! file',
        lastModifiedDate: '2009-03-20'
      },
      order: 6,
      node: {
        key: 0,
        attributes: {
          label: 'Hello'
        }
      },
      size: 4,
      edge: {
        key: 3,
        source: 5,
        target: 6
      }
    }
  },
  {
    title: 'Graph with Undeclared Attributes',
    gexf: 'undeclared_attribute',
    options: {
      allowUndeclaredAttributes: true
    },
    basics: {
      type: 'directed',
      multi: false,
      version: '1.2',
      mode: 'static',
      defaultEdgeType: 'directed',
      meta: {},
      order: 2,
      node: {
        key: 0,
        attributes: {
          label: 'Gephi',
          url: 'http://gephi.org'
        }
      },
      size: 1,
      edge: {
        source: 0,
        target: 1,
        attributes: {
          count: '43'
        }
      }
    }
  },
  {
    title: 'Mixed Graph',
    gexf: 'mixed',
    basics: {
      type: 'mixed',
      multi: false,
      version: '1.2',
      mode: 'static',
      defaultEdgeType: 'directed',
      meta: {
        creator: 'Yomguithereal',
        description: 'A mixed graph',
        lastModifiedDate: '2009-03-20'
      },
      order: 3,
      node: {
        key: 1,
        attributes: {
          label: 'one'
        }
      },
      size: 3,
      edge: {
        key: 2,
        source: 2,
        target: 3,
        attributes: {
          label: 'Nice edge',
          weight: 4.56
        }
      }
    }
  },
  {
    title: 'Yeast',
    gexf: 'yeast',
    basics: {
      type: 'undirected',
      multi: false,
      version: '1.1',
      mode: 'static',
      defaultEdgeType: 'undirected',
      meta: {},
      order: 2361,
      node: {
        key: 5025,
        attributes: {
          label: 'YNR007C'
        }
      },
      size: 7182,
      edge: {
        key: 20347,
        source: 7197,
        target: 7198,
        undirected: true
      }
    }
  },
  {
    title: 'Rio',
    gexf: 'rio',
    basics: {
      type: 'directed',
      multi: false,
      version: '1.2',
      mode: 'static',
      defaultEdgeType: 'directed',
      meta: {
        creator: 'Gephi 0.8.1',
        lastModifiedDate: '2015-03-30'
      },
      order: 366,
      node: {
        key: 'ncs4',
        attributes: {
          label: 'http://cupuladospovos.org.br',
          Label2: 'cupuladospovos.org.br',
          'Nature of institution:': 'Event',
          Category: 'Social Ecology',
          'Latest Six Posts Frequency': 'Dially',
          Language: 'Portuguese',
          'Information Resources': 'Multimedia',
          indegree: 12,
          outdegree: 31,
          degree: 43,
          size: 11.7894535,
          x: -168.71039,
          y: 5.129696,
          z: 0,
          color: 'rgb(144,107,198)'
        }
      },
      size: 1107,
      edge: {
        source: 'ncs526',
        target: 'ncs97',
        attributes: {
          hypertext: true
        }
      }
    }
  },
  {
    title: 'Data Graph',
    gexf: 'data',
    basics: {
      type: 'directed',
      multi: false,
      version: '1.2',
      mode: 'static',
      defaultEdgeType: 'directed',
      meta: {
        creator: 'Gephi.org',
        description: 'A Web network',
        lastModifiedDate: '2009-03-20'
      },
      order: 4,
      node: {
        key: 1,
        attributes: {
          frog: true,
          label: 'Webatlas',
          url: 'http://webatlas.fr',
          indegree: 2
        }
      },
      size: 5,
      edge: {
        key: 4,
        source: 0,
        target: 3
      }
    }
  },
  {
    title: 'Arctic',
    gexf: 'arctic',
    basics: {
      type: 'directed',
      multi: false,
      version: '1.0',
      mode: 'static',
      defaultEdgeType: 'undirected',
      meta: {},
      order: 1715,
      node: {
        key: 5,
        attributes: {
          label: 'San Francisco',
          color: 'rgb(255,51,51)',
          x: -120.99793,
          y: 63.12548,
          z: 0,
          nodedef: 'n5',
          occurrences: 14,
          size: 3.7195435
        }
      },
      size: 6676,
      edge: {
        key: 1251,
        source: 637,
        target: 300
      }
    }
  },
  {
    title: 'Celegans Graph',
    gexf: 'celegans',
    basics: {
      type: 'undirected',
      multi: true,
      version: '1.1',
      mode: 'static',
      defaultEdgeType: 'undirected',
      meta: {},
      order: 306,
      node: {
        key: 109,
        attributes: {
          label: '110'
        }
      },
      size: 2345,
      edge: {
        key: 2278,
        source: 267,
        target: 304,
        undirected: true,
        attributes: {
          weight: 2
        }
      }
    }
  },
  {
    title: 'Les Misérables Graph',
    gexf: 'les_miserables',
    basics: {
      type: 'directed',
      multi: false,
      version: '1.1',
      mode: 'static',
      defaultEdgeType: 'directed',
      meta: {
        creator: 'ofNodesAndEdges.com',
        title: 'Les Misérables, the characters coappearance weighted graph',
        lastModifiedDate: '2010-05-29+01:27'
      },
      order: 77,
      node: {
        key: '5.0',
        attributes: {
          label: 'Geborand',
          authority: 0.0034188034,
          hub: 0.0034188034,
          x: 318.6509,
          y: 85.41602,
          z: 0,
          color: 'rgb(179,0,0)',
          size: 15
        }
      },
      size: 254,
      edge: {
        key: 204,
        source: '67.0',
        target: '57.0',
        attributes: {
          weight: 3
        }
      }
    }
  },
  {
    title: 'Edge Viz Graph',
    gexf: 'edge_viz',
    basics: {
      type: 'directed',
      multi: false,
      version: '1.1',
      mode: 'static',
      defaultEdgeType: 'directed',
      meta: {
        creator: 'Yomguithereal',
        title: 'An edge viz test graph',
        lastModifiedDate: '2010-05-29+01:27'
      },
      order: 2,
      node: {
        key: '0.0',
        attributes: {
          authority: 0.01880342,
          hub: 0.01880342,
          label: 'Myriel',
          color: 'rgb(216,72,45)',
          x: 268.72385,
          y: 91.18155,
          z: 0,
          size: 22.714287
        }
      },
      size: 1,
      edge: {
        key: 0,
        source: '1.0',
        target: '0.0',
        attributes: {
          color: 'rgba(179,0,0,0.5)',
          thickness: 2,
          shape: 'dotted'
        }
      }
    }
  },
  {
    title: 'Edge Data Graph',
    gexf: 'edge_data',
    basics: {
      type: 'directed',
      multi: false,
      version: '1.2',
      mode: 'static',
      defaultEdgeType: 'directed',
      meta: {
        creator: 'Gephi.org',
        description: 'A Web network',
        lastModifiedDate: '2009-03-20'
      },
      order: 4,
      node: {
        key: 1,
        attributes: {
          label: 'Webatlas',
          url: 'http://webatlas.fr',
          indegree: 2,
          frog: true
        }
      },
      size: 5,
      edge: {
        key: 3,
        source: 2,
        target: 1,
        attributes: {
          predicate: 'likes',
          confidence: 0.88
        }
      }
    }
  },
  {
    title: 'Case & Attributes Graph',
    gexf: 'case',
    basics: {
      type: 'directed',
      multi: false,
      version: '1.2',
      mode: 'static',
      defaultEdgeType: 'directed',
      meta: {
        creator: 'polinode.com',
        description: 'Survey One',
        lastModifiedDate: '02-05-2014'
      },
      order: 10,
      node: {
        key: '5362389af1e6696e0395864e',
        attributes: {
          label: '2',
          Gender: 'Female',
          Position: 'Graduate',
          list: 'Respondent',
          name: 'Cleopatra Cordray',
          status: 'Submitted'
        }
      },
      size: 20,
      edge: {
        key: 4,
        source: '5362389af1e6696e0395864e',
        target: '5362389af1e6696e03958654',
        attributes: {
          Q1: 'true'
        }
      }
    }
  },
  {
    title: 'ListString Graph',
    gexf: 'liststring',
    basics: {
      type: 'directed',
      multi: false,
      version: '1.2',
      mode: 'static',
      defaultEdgeType: 'directed',
      meta: {
        creator: 'Gephi.org',
        description: 'A Web network',
        lastModifiedDate: '2009-03-20'
      },
      order: 4,
      node: {
        key: 0,
        attributes: {
          types: ['cooking', 'money'],
          indegree: 1,
          frog: true,
          label: 'Gephi'
        }
      },
      size: 5,
      edge: {
        key: 3,
        source: 2,
        target: 1
      }
    }
  },
  {
    title: 'Gexf 1.3 Graph',
    gexf: 'v1_3',
    basics: {
      type: 'undirected',
      multi: false,
      version: '1.3',
      mode: 'static',
      defaultEdgeType: 'undirected',
      meta: {},
      order: 2,
      node: {
        key: 'Suzy',
        attributes: {
          label: 'Suzy',
          color: '#ff00ff',
          pipe: ['a', 'b', 'c'],
          comma: ['a', 'b', 'c'],
          raw: ['a', 'b', 'c'],
          single: ['a', "'b'", 'c'],
          double: ['a', 'b', 'c'],
          mixed: ['a', 'b', 'c'],
          booleans: [true, false, false],
          numbers: [1, 1.5, 2]
        }
      },
      size: 1,
      edge: {
        source: 'John',
        target: 'Suzy',
        attributes: {
          kind: 'likes'
        }
      }
    }
  }
];
