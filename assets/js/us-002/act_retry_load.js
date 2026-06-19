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

  function attachRetry() {
    const btn = document.querySelector('[data-action-id="ACT_RETRY_LOAD"]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const store = ensureStore();
      store.resetToFixtures();
    });
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachRetry);
    } else {
      attachRetry();
    }
  }

  init();
})();
