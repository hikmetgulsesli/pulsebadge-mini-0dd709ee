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

  function attachCancel() {
    const btn = document.querySelector('[data-action-id="ACT_CANCEL_EDIT"]');
    if (btn) {
      btn.addEventListener('click', function () {
        const store = ensureStore();
        store.setSelectedRecord(null);
        window.location.href = 'record-operations-pulsebadge-mini.html';
      });
    }

    const container = document.getElementById('app-root') || document.body;
    container.addEventListener('click', function (e) {
      const target = e.target.closest('[data-action-id]');
      if (!target) return;
      const actionId = target.dataset.actionId;
      if (actionId === 'ACT_CANCEL_EDIT') return;

      if (actionId === 'ACT_OPERATIONS') {
        window.location.href = 'record-operations-pulsebadge-mini.html';
        return;
      }

      if (actionId === 'ACT_INSIGHTS') {
        window.location.href = 'index.html';
        return;
      }

      if (actionId === 'ACT_NAV_EDITOR') {
        window.location.href = 'record-editor-pulsebadge-mini.html';
        return;
      }
    });
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachCancel);
    } else {
      attachCancel();
    }
  }

  init();
})();
