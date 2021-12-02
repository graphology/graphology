export default class DFSStack {
  size: number;
  constructor(order: number);
  has(node: string): boolean;
  push(node: string): boolean;
  pop(): string | undefined;
}
