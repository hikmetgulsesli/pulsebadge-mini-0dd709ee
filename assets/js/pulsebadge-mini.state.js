(function (global) {
  'use strict';

  const DEFAULT_SCREEN = 'operations';
  const DEFAULT_PANEL = null;

  function computeCounts(records) {
    const total = Array.isArray(records) ? records.length : 0;
    let healthy = 0;
    let warning = 0;
    let critical = 0;

    if (Array.isArray(records)) {
      for (const record of records) {
        if (record && record.status === 'healthy') healthy += 1;
        else if (record && record.status === 'warning') warning += 1;
        else if (record && record.status === 'critical') critical += 1;
      }
    }

    return { total, healthy, warning, critical };
  }

  function createStateStore(options) {
    options = options || {};
    const storage = options.storage;
    const fixtures = options.fixtures || {};
    const persisted = storage ? storage.load({}).data : {};

    const fixtureRecords = Array.isArray(fixtures.records) ? fixtures.records : [];
    const persistedRecords = Array.isArray(persisted.records) ? persisted.records : null;

    let state = {
      activeScreen: persisted.activeScreen || fixtures.preferences && fixtures.preferences.defaultScreen || DEFAULT_SCREEN,
      selectedRecordId: persisted.selectedRecordId || null,
      activePanel: persisted.activePanel || DEFAULT_PANEL,
      records: persistedRecords !== null ? persistedRecords : fixtureRecords,
      preferences: Object.assign({}, fixtures.preferences || {}, persisted.preferences || {}),
      counts: computeCounts(persistedRecords !== null ? persistedRecords : fixtureRecords),
      storageStatus: storage ? storage.getStatus() : 'ready',
      lastError: storage ? storage.getLastError() : null
    };

    const listeners = [];

    function getState() {
      return {
        activeScreen: state.activeScreen,
        selectedRecordId: state.selectedRecordId,
        activePanel: state.activePanel,
        records: state.records.slice(),
        preferences: Object.assign({}, state.preferences),
        counts: Object.assign({}, state.counts),
        storageStatus: state.storageStatus,
        lastError: state.lastError
      };
    }

    function notify() {
      const snapshot = getState();
      for (const listener of listeners) {
        try {
          listener(snapshot);
        } catch (e) {
          // listener errors are non-fatal
        }
      }
    }

    function subscribe(listener) {
      if (typeof listener !== 'function') return function () {};
      listeners.push(listener);
      return function unsubscribe() {
        const idx = listeners.indexOf(listener);
        if (idx >= 0) listeners.splice(idx, 1);
      };
    }

    function persist() {
      if (!storage) return;
      const persistable = {
        activeScreen: state.activeScreen,
        selectedRecordId: state.selectedRecordId,
        activePanel: state.activePanel,
        records: state.records,
        preferences: state.preferences
      };
      storage.save(persistable);
      state.storageStatus = storage.getStatus();
      state.lastError = storage.getLastError();
    }

    function setActiveScreen(screenId) {
      if (!screenId || typeof screenId !== 'string') return;
      state.activeScreen = screenId;
      persist();
      notify();
    }

    function setSelectedRecord(recordId) {
      state.selectedRecordId = recordId === null ? null : String(recordId);
      persist();
      notify();
    }

    function setActivePanel(panelId) {
      state.activePanel = panelId === null ? null : String(panelId);
      persist();
      notify();
    }

    function updateRecord(recordId, patch) {
      const idx = state.records.findIndex(function (r) { return r && r.id === recordId; });
      if (idx < 0) {
        state.lastError = 'Record not found: ' + recordId;
        notify();
        return false;
      }
      state.records[idx] = Object.assign({}, state.records[idx], patch, { id: recordId });
      state.counts = computeCounts(state.records);
      persist();
      notify();
      return true;
    }

    function addRecord(record) {
      if (!record || !record.id) {
        state.lastError = 'Cannot add record without an id.';
        notify();
        return false;
      }
      if (state.records.some(function (r) { return r && r.id === record.id; })) {
        state.lastError = 'Record already exists: ' + record.id;
        notify();
        return false;
      }
      state.records.push(record);
      state.counts = computeCounts(state.records);
      persist();
      notify();
      return true;
    }

    function removeRecord(recordId) {
      const before = state.records.length;
      state.records = state.records.filter(function (r) { return r && r.id !== recordId; });
      const removed = before - state.records.length;
      if (removed === 0) {
        state.lastError = 'Record not found: ' + recordId;
        notify();
        return false;
      }
      if (state.selectedRecordId === recordId) {
        state.selectedRecordId = null;
      }
      state.counts = computeCounts(state.records);
      persist();
      notify();
      return true;
    }

    function resetToFixtures() {
      state.records = fixtureRecords.slice();
      state.selectedRecordId = null;
      state.activePanel = DEFAULT_PANEL;
      state.counts = computeCounts(state.records);
      persist();
      notify();
    }

    function clearError() {
      state.lastError = null;
      if (storage) storage.clearError();
      notify();
    }

    function bootstrap() {
      state.storageStatus = storage ? storage.getStatus() : 'ready';
      state.lastError = storage ? storage.getLastError() : null;
      notify();
      return getState();
    }

    return {
      getState,
      subscribe,
      setActiveScreen,
      setSelectedRecord,
      setActivePanel,
      updateRecord,
      addRecord,
      removeRecord,
      resetToFixtures,
      clearError,
      bootstrap
    };
  }

  global.PulseBadgeState = { createStateStore, computeCounts };
})(window);
