export class ReorderBuffer {
  constructor(maxHoldMs = 1000) { this.maxHoldMs = maxHoldMs; }
  offer(event, now) { throw new Error('TODO offer'); }
}
