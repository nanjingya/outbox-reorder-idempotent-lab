export function bindControls({ statusEl, statsEl, outEl, onLoad, onRun, onExport }) {
  document.querySelector('#btn-load')?.addEventListener('click', () => onLoad?.());
  document.querySelector('#btn-run')?.addEventListener('click', () => onRun?.());
  document.querySelector('#btn-export')?.addEventListener('click', () => onExport?.());
  if (statusEl) statusEl.textContent = 'ready';
  return {
    setStats(s) { if (statsEl) statsEl.textContent = JSON.stringify(s); },
    setOut(o) { if (outEl) outEl.textContent = typeof o === 'string' ? o : JSON.stringify(o, null, 2); },
  };
}
