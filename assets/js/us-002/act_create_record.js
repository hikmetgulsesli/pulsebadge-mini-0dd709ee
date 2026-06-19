(function () {
  'use strict';

  function handleCreate() {
    const store = window.__PB_STORE__;
    if (!store || typeof store.addRecord !== 'function') {
      console.warn('[act_create_record] Store not available.');
      return;
    }
    const nextId = 'srv-new-' + Date.now();
    store.addRecord({
      id: nextId,
      name: 'New Service',
      host: 'host.pulsebadge.local',
      status: 'healthy',
      latencyMs: 0,
      lastChecked: new Date().toISOString()
    });
    window.location.reload();
  }

  function wire() {
    document.querySelectorAll('[data-action-id="ACT_CREATE_RECORD"]').forEach(function (el) {
      el.addEventListener('click', handleCreate);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
