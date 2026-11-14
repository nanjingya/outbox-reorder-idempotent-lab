import { OutboxQueue } from './outbox.js';
import { ReorderBuffer } from './reorderBuffer.js';
import { IdempotentSink } from './idempotentSink.js';

export function runPipeline(events, { maxHoldMs = 1000 } = {}) {
  const outbox = new OutboxQueue();
  for (const e of events) outbox.append(e);
  const buffer = new ReorderBuffer(maxHoldMs);
  const sink = new IdempotentSink();
  const stats = { emitted: 0, stale: 0, late: 0, hold: 0, applied: 0, skipped: 0 };
  const applied = [];
  for (const e of outbox.listAfter(-1)) {
    const acts = buffer.offer(e, e.arriveTs ?? e.ts);
    for (const act of acts) {
      stats[act.type] = (stats[act.type] || 0) + 1;
      if (act.type === 'emit' || act.type === 'late') {
        stats.emitted += 1;
        const r = sink.apply(act.event);
        if (r.applied) { stats.applied += 1; applied.push(act.event); }
        else stats.skipped += 1;
      }
    }
  }
  return { stats, applied, sink };
}
