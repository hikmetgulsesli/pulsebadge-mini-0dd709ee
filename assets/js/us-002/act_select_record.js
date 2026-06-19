(function () {
  'use strict';

  function handleSelect(event) {
    const store = window.__PB_STORE__;
    const trigger = event.target.closest('[data-action-id="ACT_SELECT_RECORD"]');
    const card = trigger ? trigger.closest('.record-card') : null;
    const recordId = card ? card.getAttribute('data-record-id') : null;
    if (!recordId) return;
    if (store && typeof store.setSelectedRecord === 'function') {
      store.setSelectedRecord(recordId);
    }
    window.location.href = 'record-editor-pulsebadge-mini.html';
  }

  function wire() {
    document.addEventListener('click', function (event) {
      if (event.target.closest('[data-action-id="ACT_SELECT_RECORD"]')) {
        handleSelect(event);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
