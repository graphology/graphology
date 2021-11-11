/**
 * Graphology Node Attributes methods
 * ===================================
 */
import {assign, isPlainObject} from '../utils';

import {InvalidArgumentsGraphError, NotFoundGraphError} from '../errors';

const NODE = 0;
const SOURCE = 1;
const TARGET = 2;
const OPPOSITE = 3;

function findRelevantNodeData(
  graph,
  method,
  mode,
  nodeOrEdge,
  nameOrEdge,
  add1,
  add2
) {
  let nodeData, edgeData, arg1, arg2;

  nodeOrEdge = '' + nodeOrEdge;

  if (mode === NODE) {
    nodeData = graph._nodes.get(nodeOrEdge);

    if (!nodeData)
      throw new NotFoundGraphError(
        `Graph.${method}: could not find the "${nodeOrEdge}" node in the graph.`
      );

    arg1 = nameOrEdge;
    arg2 = add1;
  } else if (mode === OPPOSITE) {
    nameOrEdge = '' + nameOrEdge;

    edgeData = graph._edges.get(nameOrEdge);

    if (!edgeData)
      throw new NotFoundGraphError(
        `Graph.${method}: could not find the "${nameOrEdge}" edge in the graph.`
      );

    const source = edgeData.source.key;
    const target = edgeData.target.key;

    if (nodeOrEdge === source) {
      nodeData = edgeData.target;
    } else if (nodeOrEdge === target) {
      nodeData = edgeData.source;
    } else {
      throw new NotFoundGraphError(
        `Graph.${method}: the "${nodeOrEdge}" node is not attached to the "${nameOrEdge}" edge (${source}, ${target}).`
      );
    }

    arg1 = add1;
    arg2 = add2;
  } else {
    edgeData = graph._edges.get(nodeOrEdge);

    if (!edgeData)
      throw new NotFoundGraphError(
        `Graph.${method}: could not find the "${nodeOrEdge}" edge in the graph.`
      );

    if (mode === SOURCE) {
      nodeData = edgeData.source;
    } else {
      nodeData = edgeData.target;
    }

    arg1 = nameOrEdge;
    arg2 = add1;
  }

  return [nodeData, arg1, arg2];
}

function attachNodeAttributeGetter(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge, add1) {
    const [data, name] = findRelevantNodeData(
      this,
      method,
      mode,
      nodeOrEdge,
      nameOrEdge,
      add1
    );

    return data.attributes[name];
  };
}

function attachNodeAttributesGetter(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge) {
    const [data] = findRelevantNodeData(
      this,
      method,
      mode,
      nodeOrEdge,
      nameOrEdge
    );

    return data.attributes;
  };
}

function attachNodeAttributeChecker(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge, add1) {
    const [data, name] = findRelevantNodeData(
      this,
      method,
      mode,
      nodeOrEdge,
      nameOrEdge,
      add1
    );

    return data.attributes.hasOwnProperty(name);
  };
}

function attachNodeAttributeSetter(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge, add1, add2) {
    const [data, name, value] = findRelevantNodeData(
      this,
      method,
      mode,
      nodeOrEdge,
      nameOrEdge,
      add1,
      add2
    );

    data.attributes[name] = value;

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: data.key,
      type: 'set',
      attributes: data.attributes,
      name
    });

    return this;
  };
}

function attachNodeAttributeUpdater(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge, add1, add2) {
    const [data, name, updater] = findRelevantNodeData(
      this,
      method,
      mode,
      nodeOrEdge,
      nameOrEdge,
      add1,
      add2
    );

    if (typeof updater !== 'function')
      throw new InvalidArgumentsGraphError(
        `Graph.${method}: updater should be a function.`
      );

    const attributes = data.attributes;
    const value = updater(attributes[name]);

    attributes[name] = value;

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: data.key,
      type: 'set',
      attributes: data.attributes,
      name
    });

    return this;
  };
}

function attachNodeAttributeRemover(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge, add1) {
    const [data, name] = findRelevantNodeData(
      this,
      method,
      mode,
      nodeOrEdge,
      nameOrEdge,
      add1
    );

    delete data.attributes[name];

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: data.key,
      type: 'remove',
      attributes: data.attributes,
      name
    });

    return this;
  };
}

function attachNodeAttributesReplacer(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge, add1) {
    const [data, attributes] = findRelevantNodeData(
      this,
      method,
      mode,
      nodeOrEdge,
      nameOrEdge,
      add1
    );

    if (!isPlainObject(attributes))
      throw new InvalidArgumentsGraphError(
        `Graph.${method}: provided attributes are not a plain object.`
      );

    data.attributes = attributes;

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: data.key,
      type: 'replace',
      attributes: data.attributes
    });

    return this;
  };
}

function attachNodeAttributesMerger(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge, add1) {
    const [data, attributes] = findRelevantNodeData(
      this,
      method,
      mode,
      nodeOrEdge,
      nameOrEdge,
      add1
    );

    if (!isPlainObject(attributes))
      throw new InvalidArgumentsGraphError(
        `Graph.${method}: provided attributes are not a plain object.`
      );

    assign(data.attributes, attributes);

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: data.key,
      type: 'merge',
      attributes: data.attributes,
      data: attributes
    });

    return this;
  };
}

function attachNodeAttributesUpdater(Class, method, mode) {
  Class.prototype[method] = function (nodeOrEdge, nameOrEdge, add1) {
    const [data, updater] = findRelevantNodeData(
      this,
      method,
      mode,
      nodeOrEdge,
      nameOrEdge,
      add1
    );

    if (typeof updater !== 'function')
      throw new InvalidArgumentsGraphError(
        `Graph.${method}: provided updater is not a function.`
      );

    data.attributes = updater(data.attributes);

    // Emitting
    this.emit('nodeAttributesUpdated', {
      key: data.key,
      type: 'update',
      attributes: data.attributes
    });

    return this;
  };
}

/**
 * List of methods to attach.
 */
const NODE_ATTRIBUTES_METHODS = [
  {
    name: element => `get${element}Attribute`,
    attacher: attachNodeAttributeGetter
  },
  {
    name: element => `get${element}Attributes`,
    attacher: attachNodeAttributesGetter
  },
  {
    name: element => `has${element}Attribute`,
    attacher: attachNodeAttributeChecker
  },
  {
    name: element => `set${element}Attribute`,
    attacher: attachNodeAttributeSetter
  },
  {
    name: element => `update${element}Attribute`,
    attacher: attachNodeAttributeUpdater
  },
  {
    name: element => `remove${element}Attribute`,
    attacher: attachNodeAttributeRemover
  },
  {
    name: element => `replace${element}Attributes`,
    attacher: attachNodeAttributesReplacer
  },
  {
    name: element => `merge${element}Attributes`,
    attacher: attachNodeAttributesMerger
  },
  {
    name: element => `update${element}Attributes`,
    attacher: attachNodeAttributesUpdater
  }
];

/**
 * Attach every attributes-related methods to a Graph class.
 *
 * @param {function} Graph - Target class.
 */
export default function attachNodeAttributesMethods(Graph) {
  NODE_ATTRIBUTES_METHODS.forEach(function ({name, attacher}) {
    // For nodes
    attacher(Graph, name('Node'), NODE);

    // For sources
    attacher(Graph, name('Source'), SOURCE);

    // For targets
    attacher(Graph, name('Target'), TARGET);

    // For opposites
    attacher(Graph, name('Opposite'), OPPOSITE);
  });
}
