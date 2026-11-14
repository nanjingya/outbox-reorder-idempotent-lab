export class OutboxQueue {
  constructor() { this._rows = []; }
  append(event) { throw new Error('TODO append'); }
  listAfter(cursor = -1) { throw new Error('TODO listAfter'); }
}
