import { bindControls } from './ui/controls.js';
import { runPipeline } from './engine.js';

const statusEl = document.querySelector('#status');
const statsEl = document.querySelector('#stats');
const outEl = document.querySelector('#out');
let events = [];
let last = null;
const ui = bindControls({
  statusEl, statsEl, outEl,
  onLoad: async () => {
    const text = await (await fetch('./fixtures/events.jsonl')).text();
    events = text.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
    ui.setOut({ loaded: events.length });
  },
  onRun: () => {
    last = runPipeline(events);
    ui.setStats(last.stats);
    ui.setOut(last.applied);
  },
  onExport: () => ui.setOut(last || { error: 'no-result' }),
});
