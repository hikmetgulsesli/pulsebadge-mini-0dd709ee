window.__SETFARM_TEST_BRIDGE__ = {
  stack: "static-html",
  ready: true,
  getAppState: function () {
    if (typeof window.app !== 'object' || window.app === null) {
      return null;
    }
    return window.app.getState();
  },
  dispatch: function (action, payload) {
    if (typeof window.app !== 'object' || window.app === null) {
      return { ok: false, error: 'window.app is not available' };
    }
    const handlers = {
      navigate: function (screenId) { window.app.setActiveScreen(screenId); return { ok: true }; },
      selectRecord: function (recordId) { window.app.setSelectedRecord(recordId); return { ok: true }; },
      setPanel: function (panelId) { window.app.setActivePanel(panelId); return { ok: true }; },
      saveRecord: function (patch) { return { ok: window.app.updateRecord(patch.id, patch) }; },
      addRecord: function (record) { return { ok: window.app.addRecord(record) }; },
      removeRecord: function (recordId) { return { ok: window.app.removeRecord(recordId) }; },
      resetFixtures: function () { window.app.resetToFixtures(); return { ok: true }; },
      clearError: function () { window.app.clearError(); return { ok: true }; }
    };
    const handler = handlers[action];
    if (!handler) {
      return { ok: false, error: 'Unknown action: ' + action };
    }
    try {
      return handler(payload);
    } catch (err) {
      return { ok: false, error: err && err.message ? err.message : String(err) };
    }
  }
};
