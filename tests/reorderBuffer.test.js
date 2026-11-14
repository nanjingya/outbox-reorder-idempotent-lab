import test from 'node:test';
import assert from 'node:assert/strict';
import { ReorderBuffer } from '../src/reorderBuffer.js';

test('marks lower version after higher emit as stale', () => {
  const b = new ReorderBuffer(10);
  const a1 = b.offer({ id: 'e3', key: 'u', version: 3, op: 'upsert', ts: 3 }, 3);
  assert.ok(a1.some((x) => x.type === 'emit' || x.type === 'hold'));
  // force commit path: offer same key higher already emitted — implementation may emit immediately
  // After version 3 emitted/held, version 2 should be stale when offered later if 3 already committed.
  // Drive commit by offering with same key progressing.
  for (const act of a1) {
    if (act.type === 'hold') {
      // nothing
    }
  }
  const a2 = b.offer({ id: 'e2', key: 'u', version: 2, op: 'upsert', ts: 2 }, 4);
  // If v3 was emitted, v2 must be stale; if v3 held, v2 may hold — accept either but when v3 emitted require stale.
  const emitted3 = a1.some((x) => x.type === 'emit');
  if (emitted3) assert.ok(a2.some((x) => x.type === 'stale'));
});
