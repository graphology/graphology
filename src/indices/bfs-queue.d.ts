export default class BFSQueue<T = string> {
  size: number;
  seen: Set<string>;
  constructor(order: number);
  has(node: string): boolean;
  push(node: string): boolean;
  pushWith(node: string, item: T): boolean;
  shift(): T | undefined;
}
