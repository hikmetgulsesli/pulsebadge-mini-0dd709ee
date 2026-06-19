(function () {
  'use strict';

  function handleSave(event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
    const store = window.__PB_STORE__;
    if (!store || typeof store.getState !== 'function' || typeof store.updateRecord !== 'function') {
      console.warn('[act_save_record] Store not available.');
      return;
    }
    const state = store.getState();
    const recordId = state.selectedRecordId;
    if (!recordId) {
      console.warn('[act_save_record] No record selected.');
      return;
    }
    const nameInput = document.getElementById('record-name');
    const hostInput = document.getElementById('record-host');
    const statusSelect = document.getElementById('record-status');
    store.updateRecord(recordId, {
      name: nameInput ? nameInput.value : '',
      host: hostInput ? hostInput.value : '',
      status: statusSelect ? statusSelect.value : 'healthy',
      lastChecked: new Date().toISOString()
    });
    store.setSelectedRecord(null);
    window.location.href = 'record-operations-pulsebadge-mini.html';
  }

  function wire() {
    document.querySelectorAll('[data-action-id="ACT_SAVE_RECORD"]').forEach(function (el) {
      el.addEventListener('click', handleSave);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
