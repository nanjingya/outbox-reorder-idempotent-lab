export class OutboxQueue {
  constructor() { this._rows = []; }
  append(event) {
    this._rows.push({ ...event });
    return this._rows.length - 1;
  }
  listAfter(cursor = -1) {
    return this._rows.slice(cursor + 1).map((e) => ({ ...e }));
  }
}
