(function () {
  'use strict';

  function handleCancel() {
    const store = window.__PB_STORE__;
    if (store && typeof store.setSelectedRecord === 'function') {
      store.setSelectedRecord(null);
    }
    window.location.href = 'record-operations-pulsebadge-mini.html';
  }

  function wire() {
    document.querySelectorAll('[data-action-id="ACT_CANCEL_EDIT"]').forEach(function (el) {
      el.addEventListener('click', handleCancel);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
