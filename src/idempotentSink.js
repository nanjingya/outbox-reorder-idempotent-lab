export class IdempotentSink {
  constructor() {}
  apply(event) { throw new Error('TODO apply'); }
  get(key) { throw new Error('TODO get'); }
}
