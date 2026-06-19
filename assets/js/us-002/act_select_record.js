(function () {
  'use strict';

  function handleSelect(event) {
    const store = window.__PB_STORE__;
    const card = event.currentTarget.closest('.record-card');
    const recordId = card ? card.getAttribute('data-record-id') : null;
    if (!recordId) return;
    if (store && typeof store.setSelectedRecord === 'function') {
      store.setSelectedRecord(recordId);
    }
    window.location.href = 'record-editor-pulsebadge-mini.html';
  }

  function wire() {
    document.querySelectorAll('[data-action-id="ACT_SELECT_RECORD"]').forEach(function (el) {
      el.addEventListener('click', handleSelect);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
