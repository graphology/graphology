import AbstractGraph from 'graphology-types';

export default class Graph extends AbstractGraph {}
export class DirectedGraph extends Graph {}
export class UndirectedGraph extends Graph {}
export class MultiGraph extends Graph {}
export class MultiDirectedGraph extends Graph {}
export class MultiUndirectedGraph extends Graph {}

export class InvalidArgumentsGraphError extends Error {}
export class NotFoundGraphError extends Error {}
export class UsageGraphError extends Error {}
