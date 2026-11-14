import test from 'node:test';
import assert from 'node:assert/strict';
import { OutboxQueue } from '../src/outbox.js';

test('append and listAfter preserve order', () => {
  const q = new OutboxQueue();
  q.append({ id: 'a', key: 'k', version: 1, op: 'upsert', ts: 1, payload: 1 });
  q.append({ id: 'b', key: 'k', version: 2, op: 'upsert', ts: 2, payload: 2 });
  assert.equal(q.listAfter(-1).length, 2);
  assert.equal(q.listAfter(0)[0].id, 'b');
});
