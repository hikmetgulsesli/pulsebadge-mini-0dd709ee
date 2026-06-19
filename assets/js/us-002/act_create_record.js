(function () {
  'use strict';

  function ensureStore() {
    if (window.__PULSEBADGE_STORE__) return window.__PULSEBADGE_STORE__;
    const storage = PulseBadgeStorage.createStorageAdapter();
    const fixtures = window.__PULSEBADGE_FIXTURES__ || {};
    window.__PULSEBADGE_STORE__ = PulseBadgeState.createStateStore({ storage: storage, fixtures: fixtures });
    window.__PULSEBADGE_STORE__.bootstrap();
    return window.__PULSEBADGE_STORE__;
  }

  function attachCreate() {
    const btn = document.querySelector('[data-action-id="ACT_CREATE_RECORD"]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const store = ensureStore();
      const nextId = 'srv-new-' + Date.now();
      store.addRecord({
        id: nextId,
        name: 'New Service',
        host: 'host.pulsebadge.local',
        status: 'healthy',
        latencyMs: 0,
        lastChecked: new Date().toISOString()
      });
    });
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachCreate);
    } else {
      attachCreate();
    }
  }

  init();
})();
