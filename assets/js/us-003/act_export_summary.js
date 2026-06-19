(function () {
  'use strict';

  function buildSummary(state) {
    const safeState = state || {};
    const records = Array.isArray(safeState.records) ? safeState.records : [];
    const counts = safeState.counts || { total: 0, healthy: 0, warning: 0, critical: 0 };
    return {
      exportedAt: new Date().toISOString(),
      summary: {
        total: counts.total,
        healthy: counts.healthy,
        warning: counts.warning,
        critical: counts.critical
      },
      records: records.map(function (record) {
        return {
          id: record.id,
          name: record.name,
          host: record.host,
          status: record.status,
          latencyMs: record.latencyMs,
          lastChecked: record.lastChecked
        };
      })
    };
  }

  function handleExportClick() {
    const store = window.__PB_STORE__;
    if (!store || typeof store.getState !== 'function' || typeof store.setActivePanel !== 'function') {
      console.warn('[act_export_summary] Store not available.');
      return;
    }
    const state = store.getState();
    const summary = buildSummary(state);
    console.log('[act_export_summary] Snapshot:', summary);
    store.setActivePanel('snapshot');
  }

  function wire() {
    document.querySelectorAll('[data-action-id="ACT_EXPORT_SUMMARY"]').forEach(function (el) {
      el.addEventListener('click', handleExportClick);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
