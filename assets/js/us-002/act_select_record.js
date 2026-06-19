(function () {
  'use strict';

  function handleSelect(event) {
    const store = window.__PB_STORE__;
    const target = event.target.closest('[data-action-id="ACT_SELECT_RECORD"]');
    if (!target) return;
    const card = target.closest('.record-card');
    const recordId = card ? card.getAttribute('data-record-id') : null;
    if (!recordId) return;
    if (store && typeof store.setSelectedRecord === 'function') {
      store.setSelectedRecord(recordId);
    }
    window.location.href = 'record-editor-pulsebadge-mini.html';
  }

  function wire() {
    document.addEventListener('click', handleSelect);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
