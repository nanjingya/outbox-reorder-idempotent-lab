export class IdempotentSink {
  constructor() {
    this._seen = new Set();
    this._state = new Map();
  }
  apply(event) {
    if (this._seen.has(event.id)) return { applied: false, reason: 'dup-id' };
    this._seen.add(event.id);
    const cur = this._state.get(event.key);
    if (event.op === 'delete') {
      if (cur && cur.version > event.version) return { applied: false, reason: 'stale-delete' };
      this._state.set(event.key, { tombstone: true, version: event.version, payload: null });
      return { applied: true };
    }
    if (cur?.tombstone && event.version < cur.version) {
      return { applied: false, reason: 'tombstone' };
    }
    if (cur && event.version < cur.version) return { applied: false, reason: 'stale-version' };
    this._state.set(event.key, { tombstone: false, version: event.version, payload: event.payload });
    return { applied: true };
  }
  get(key) { return this._state.get(key); }
}
