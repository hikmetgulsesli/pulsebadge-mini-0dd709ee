(function (global) {
  'use strict';

  const STORAGE_KEY = 'pulsebadge.mini.state.v1';
  const SCHEMA_VERSION = 1;

  function createStorageAdapter() {
    let status = 'ready';
    let lastError = null;

    function isAvailable() {
      try {
        const test = '__pulsebadge_storage_test__';
        global.localStorage.setItem(test, test);
        global.localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    }

    function getStatus() {
      return status;
    }

    function getLastError() {
      return lastError;
    }

    function clearError() {
      lastError = null;
    }

    function load(defaults) {
      if (!isAvailable()) {
        status = 'error';
        lastError = 'localStorage is not available in this environment.';
        return { data: defaults || {}, recovered: false };
      }

      const raw = global.localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        status = 'ready';
        return { data: defaults || {}, recovered: false };
      }

      try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Persisted data is not an object.');
        }
        if (parsed.__schema !== SCHEMA_VERSION) {
          throw new Error('Persisted schema version is unsupported.');
        }
        status = 'ready';
        return { data: parsed.data, recovered: false };
      } catch (err) {
        status = 'corrupted';
        lastError = 'Persisted data was corrupted or unreadable; defaults applied. (' + (err && err.message ? err.message : 'unknown') + ')';
        return { data: defaults || {}, recovered: true };
      }
    }

    function save(data) {
      if (!isAvailable()) {
        status = 'error';
        lastError = 'localStorage is not available; changes will not persist.';
        return false;
      }

      try {
        const payload = {
          __schema: SCHEMA_VERSION,
          savedAt: new Date().toISOString(),
          data: data
        };
        global.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        status = 'ready';
        lastError = null;
        return true;
      } catch (err) {
        status = 'error';
        lastError = 'Failed to save state. (' + (err && err.message ? err.message : 'unknown') + ')';
        return false;
      }
    }

    function clear() {
      if (!isAvailable()) {
        status = 'error';
        lastError = 'localStorage is not available; cannot clear persisted state.';
        return false;
      }
      try {
        global.localStorage.removeItem(STORAGE_KEY);
        status = 'ready';
        lastError = null;
        return true;
      } catch (err) {
        status = 'error';
        lastError = 'Failed to clear persisted state. (' + (err && err.message ? err.message : 'unknown') + ')';
        return false;
      }
    }

    return {
      STORAGE_KEY,
      SCHEMA_VERSION,
      isAvailable,
      getStatus,
      getLastError,
      clearError,
      load,
      save,
      clear
    };
  }

  global.PulseBadgeStorage = { createStorageAdapter };
})(window);
