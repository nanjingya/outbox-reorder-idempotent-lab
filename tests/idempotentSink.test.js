import test from 'node:test';
import assert from 'node:assert/strict';
import { IdempotentSink } from '../src/idempotentSink.js';

test('same event id only once', () => {
  const s = new IdempotentSink();
  const e = { id: 'e1', key: 'u1', version: 1, op: 'upsert', payload: { n: 1 } };
  assert.equal(s.apply(e).applied, true);
  assert.equal(s.apply(e).applied, false);
});

test('tombstone blocks older upsert resurrection', () => {
  const s = new IdempotentSink();
  assert.equal(s.apply({ id: 'd', key: 'u1', version: 5, op: 'delete', payload: null }).applied, true);
  const r = s.apply({ id: 'old', key: 'u1', version: 4, op: 'upsert', payload: { n: 4 } });
  assert.equal(r.applied, false);
  assert.equal(s.get('u1')?.tombstone, true);
});

test('higher version wins', () => {
  const s = new IdempotentSink();
  s.apply({ id: 'a', key: 'u1', version: 1, op: 'upsert', payload: { n: 1 } });
  s.apply({ id: 'b', key: 'u1', version: 3, op: 'upsert', payload: { n: 3 } });
  assert.equal(s.get('u1').payload.n, 3);
  assert.equal(s.apply({ id: 'c', key: 'u1', version: 2, op: 'upsert', payload: { n: 2 } }).applied, false);
});
