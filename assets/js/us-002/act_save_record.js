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

  function populateForm() {
    const store = ensureStore();
    const state = store.getState();
    const record = (state.records || []).find(function (r) { return r && r.id === state.selectedRecordId; });
    const nameInput = document.getElementById('record-name');
    const hostInput = document.getElementById('record-host');
    const statusSelect = document.getElementById('record-status');
    if (record) {
      if (nameInput) nameInput.value = record.name || '';
      if (hostInput) hostInput.value = record.host || '';
      if (statusSelect) statusSelect.value = record.status || 'healthy';
    } else {
      if (nameInput) nameInput.value = '';
      if (hostInput) hostInput.value = '';
      if (statusSelect) statusSelect.value = 'healthy';
    }
  }

  function attachSave() {
    const form = document.querySelector('[data-testid="record-form"]');
    const saveBtn = document.querySelector('[data-action-id="ACT_SAVE_RECORD"]');
    if (!form || !saveBtn) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const store = ensureStore();
      const state = store.getState();
      if (!state.selectedRecordId) {
        window.location.href = 'record-operations-pulsebadge-mini.html';
        return;
      }
      const name = document.getElementById('record-name');
      const host = document.getElementById('record-host');
      const status = document.getElementById('record-status');
      if (!name.value.trim() || !host.value.trim()) {
        return;
      }
      store.updateRecord(state.selectedRecordId, {
        name: name.value.trim(),
        host: host.value.trim(),
        status: status.value,
        lastChecked: new Date().toISOString()
      });
      store.setSelectedRecord(null);
      window.location.href = 'record-operations-pulsebadge-mini.html';
    });
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        populateForm();
        attachSave();
      });
    } else {
      populateForm();
      attachSave();
    }
  }

  init();
})();
