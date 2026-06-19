(function (global) {
  'use strict';

  const APP_NAME = 'PulseBadge Mini';
  const SCREENS = {
    operations: { id: 'operations', label: 'Operations' },
    editor: { id: 'editor', label: 'Editor' },
    insights: { id: 'insights', label: 'Insights' }
  };

  let store = null;
  let storage = null;
  let unsubscribe = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function createElement(tag, attrs, text) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const key of Object.keys(attrs)) {
        if (key === 'className') {
          el.className = attrs[key];
        } else if (key === 'dataset') {
          for (const dkey of Object.keys(attrs[key])) {
            el.dataset[dkey] = attrs[key][dkey];
          }
        } else {
          el.setAttribute(key, attrs[key]);
        }
      }
    }
    if (text !== undefined && text !== null) {
      el.textContent = String(text);
    }
    return el;
  }

  function formatStatus(status) {
    return typeof status === 'string' ? status : 'unknown';
  }

  function renderNav(state, container) {
    container.innerHTML = '';
    const nav = createElement('nav', { className: 'app-nav', 'aria-label': 'Primary' });

    const brand = createElement('div', { className: 'app-brand' });
    brand.appendChild(createElement('span', { className: 'app-brand-mark' }, '●'));
    brand.appendChild(createElement('span', { className: 'app-brand-name' }, APP_NAME));
    nav.appendChild(brand);

    const links = createElement('div', { className: 'app-nav-links' });
    for (const key of Object.keys(SCREENS)) {
      const screen = SCREENS[key];
      const isActive = state.activeScreen === screen.id;
      const link = createElement(
        'button',
        {
          className: 'app-nav-link' + (isActive ? ' is-active' : ''),
          type: 'button',
          'data-action-id': 'ACT_NAV_' + screen.id.toUpperCase(),
          'data-screen': screen.id
        },
        screen.label
      );
      link.addEventListener('click', function () {
        store.setActiveScreen(screen.id);
      });
      links.appendChild(link);
    }
    nav.appendChild(links);

    const meta = createElement('div', { className: 'app-nav-meta' });
    const statusBadge = createElement(
      'span',
      {
        className: 'storage-status storage-status--' + formatStatus(state.storageStatus),
        'data-testid': 'storage-status'
      },
      state.storageStatus
    );
    meta.appendChild(statusBadge);
    nav.appendChild(meta);

    container.appendChild(nav);
  }

  function renderOperations(state, container) {
    container.innerHTML = '';
    const header = createElement('header', { className: 'screen-header' });
    header.appendChild(createElement('h2', {}, 'Record Operations'));
    header.appendChild(createElement('p', { className: 'screen-summary' }, 'Monitor and manage service records.'));
    container.appendChild(header);

    const controls = createElement('div', { className: 'screen-controls' });
    const search = createElement('input', {
      className: 'app-input',
      type: 'text',
      placeholder: 'Search records...',
      'data-testid': 'search-records'
    });
    controls.appendChild(search);
    const createBtn = createElement('button', { className: 'app-button app-button--primary', type: 'button', 'data-action-id': 'ACT_RECORD_CREATE' }, 'Create Record');
    createBtn.addEventListener('click', function () {
      const nextId = 'srv-new-' + Date.now();
      store.addRecord({ id: nextId, name: 'New Service', host: 'host.pulsebadge.local', status: 'healthy', latencyMs: 0, lastChecked: new Date().toISOString() });
    });
    controls.appendChild(createBtn);
    container.appendChild(controls);

    const list = createElement('div', { className: 'record-list' });
    search.addEventListener('input', function (e) {
      const query = String(e.target.value || '').toLowerCase();
      const cards = list.querySelectorAll('.record-card');
      for (const card of cards) {
        const nameEl = card.querySelector('.record-name');
        const hostEl = card.querySelector('.record-host');
        const name = nameEl ? String(nameEl.textContent).toLowerCase() : '';
        const host = hostEl ? String(hostEl.textContent).toLowerCase() : '';
        card.style.display = name.indexOf(query) >= 0 || host.indexOf(query) >= 0 ? '' : 'none';
      }
    });
    if (state.records.length === 0) {
      list.appendChild(createElement('p', { className: 'empty-state' }, 'No records found.'));
    } else {
      for (const record of state.records) {
        const card = createElement('article', { className: 'record-card record-card--' + formatStatus(record.status) });
        card.appendChild(createElement('h3', { className: 'record-name' }, record.name));
        card.appendChild(createElement('p', { className: 'record-host' }, record.host));
        card.appendChild(createElement('span', { className: 'record-status record-status--' + formatStatus(record.status) }, record.status));
        const inspectBtn = createElement('button', { className: 'app-button app-button--secondary', type: 'button', 'data-action-id': 'ACT_RECORD_INSPECT' }, 'Inspect');
        inspectBtn.addEventListener('click', function () {
          store.setSelectedRecord(record.id);
          store.setActiveScreen('editor');
        });
        card.appendChild(inspectBtn);
        list.appendChild(card);
      }
    }
    container.appendChild(list);
  }

  function renderEditor(state, container) {
    container.innerHTML = '';
    const header = createElement('header', { className: 'screen-header' });
    header.appendChild(createElement('h2', {}, 'Record Editor'));
    container.appendChild(header);

    const record = state.records.find(function (r) { return r && r.id === state.selectedRecordId; }) || null;

    if (!record) {
      container.appendChild(createElement('p', { className: 'empty-state' }, 'Select a record from Operations to edit it.'));
      const openOps = createElement('button', { className: 'app-button', type: 'button', 'data-action-id': 'ACT_NAV_OPERATIONS' }, 'Open Operations');
      openOps.addEventListener('click', function () { store.setActiveScreen('operations'); });
      container.appendChild(openOps);
      return;
    }

    const form = createElement('form', { className: 'record-form' });
    form.addEventListener('submit', function (event) { event.preventDefault(); });

    const nameGroup = createElement('div', { className: 'form-group' });
    nameGroup.appendChild(createElement('label', { for: 'record-name' }, 'Service name'));
    const nameInput = createElement('input', { className: 'app-input', id: 'record-name', type: 'text', value: record.name });
    nameGroup.appendChild(nameInput);
    form.appendChild(nameGroup);

    const hostGroup = createElement('div', { className: 'form-group' });
    hostGroup.appendChild(createElement('label', { for: 'record-host' }, 'Host'));
    const hostInput = createElement('input', { className: 'app-input', id: 'record-host', type: 'text', value: record.host });
    hostGroup.appendChild(hostInput);
    form.appendChild(hostGroup);

    const statusGroup = createElement('div', { className: 'form-group' });
    statusGroup.appendChild(createElement('label', { for: 'record-status' }, 'Status'));
    const statusSelect = createElement('select', { className: 'app-input app-select', id: 'record-status' });
    for (const status of ['healthy', 'warning', 'critical']) {
      const option = createElement('option', { value: status, selected: record.status === status ? 'selected' : undefined }, status);
      statusSelect.appendChild(option);
    }
    statusGroup.appendChild(statusSelect);
    form.appendChild(statusGroup);

    const actions = createElement('div', { className: 'form-actions' });
    const saveBtn = createElement('button', { className: 'app-button app-button--primary', type: 'submit', 'data-action-id': 'ACT_RECORD_SAVE' }, 'Save Record');
    saveBtn.addEventListener('click', function () {
      const success = store.updateRecord(record.id, {
        name: nameInput.value,
        host: hostInput.value,
        status: statusSelect.value,
        lastChecked: new Date().toISOString()
      });
      if (success) {
        store.setSelectedRecord(null);
        store.setActiveScreen('operations');
      }
    });
    actions.appendChild(saveBtn);

    const cancelBtn = createElement('button', { className: 'app-button', type: 'button', 'data-action-id': 'ACT_RECORD_CANCEL' }, 'Cancel');
    cancelBtn.addEventListener('click', function () { store.setSelectedRecord(null); store.setActiveScreen('operations'); });
    actions.appendChild(cancelBtn);
    form.appendChild(actions);

    container.appendChild(form);
  }

  function renderInsights(state, container) {
    container.innerHTML = '';
    const header = createElement('header', { className: 'screen-header' });
    header.appendChild(createElement('h2', {}, 'Insights'));
    header.appendChild(createElement('p', { className: 'screen-summary' }, 'High-level health overview.'));
    container.appendChild(header);

    const counts = state.counts || { total: 0, healthy: 0, warning: 0, critical: 0 };
    const grid = createElement('div', { className: 'insights-grid' });
    const metrics = [
      { key: 'total', label: 'Total', value: counts.total },
      { key: 'healthy', label: 'Healthy', value: counts.healthy },
      { key: 'warning', label: 'Warning', value: counts.warning },
      { key: 'critical', label: 'Critical', value: counts.critical }
    ];
    for (const metric of metrics) {
      const card = createElement('div', { className: 'insight-card insight-card--' + metric.key });
      card.appendChild(createElement('span', { className: 'insight-value' }, metric.value));
      card.appendChild(createElement('span', { className: 'insight-label' }, metric.label));
      grid.appendChild(card);
    }
    container.appendChild(grid);

    const actions = createElement('div', { className: 'screen-controls' });
    const snapshotBtn = createElement('button', { className: 'app-button app-button--secondary', type: 'button', 'data-action-id': 'ACT_INSIGHTS_SNAPSHOT' }, 'JSON Snapshot');
    snapshotBtn.addEventListener('click', function () { store.setActivePanel('snapshot'); });
    actions.appendChild(snapshotBtn);
    container.appendChild(actions);

    if (state.activePanel === 'snapshot') {
      const panel = createElement('pre', { className: 'snapshot-panel' });
      panel.textContent = JSON.stringify({ records: state.records, counts: state.counts }, null, 2);
      container.appendChild(panel);
    }
  }

  function renderError(state, container) {
    if (!state.lastError) {
      container.innerHTML = '';
      container.classList.add('is-hidden');
      return;
    }
    container.classList.remove('is-hidden');
    container.innerHTML = '';
    const message = createElement('p', {}, state.lastError);
    const dismiss = createElement('button', { className: 'app-button app-button--small', type: 'button', 'data-action-id': 'ACT_DISMISS_ERROR' }, 'Dismiss');
    dismiss.addEventListener('click', function () { store.clearError(); });
    container.appendChild(message);
    container.appendChild(dismiss);
  }

  function render(state) {
    const root = byId('app-root');
    if (!root) return;

    root.innerHTML = '';

    renderNav(state, root);

    const errorBanner = createElement('div', { className: 'error-banner is-hidden', 'data-testid': 'error-banner' });
    root.appendChild(errorBanner);
    renderError(state, errorBanner);

    const main = createElement('main', { className: 'app-main', 'data-testid': 'app-main' });
    main.dataset.screen = state.activeScreen;

    if (state.activeScreen === 'operations') {
      renderOperations(state, main);
    } else if (state.activeScreen === 'editor') {
      renderEditor(state, main);
    } else if (state.activeScreen === 'insights') {
      renderInsights(state, main);
    } else {
      main.appendChild(createElement('p', { className: 'empty-state' }, 'Unknown screen.'));
    }

    root.appendChild(main);
  }

  function bootstrap() {
    if (typeof PulseBadgeStorage === 'undefined') {
      throw new Error('PulseBadgeStorage module is not loaded.');
    }
    if (typeof PulseBadgeState === 'undefined') {
      throw new Error('PulseBadgeState module is not loaded.');
    }

    storage = PulseBadgeStorage.createStorageAdapter();

    let fixtures = {};
    if (window.__PULSEBADGE_FIXTURES__) {
      fixtures = window.__PULSEBADGE_FIXTURES__;
    }

    store = PulseBadgeState.createStateStore({ storage: storage, fixtures: fixtures });

    unsubscribe = store.subscribe(function (state) {
      render(state);
    });

    store.bootstrap();

    return {
      getState: store.getState,
      subscribe: store.subscribe,
      setActiveScreen: store.setActiveScreen,
      setSelectedRecord: store.setSelectedRecord,
      setActivePanel: store.setActivePanel,
      updateRecord: store.updateRecord,
      addRecord: store.addRecord,
      removeRecord: store.removeRecord,
      resetToFixtures: store.resetToFixtures,
      clearError: store.clearError,
      getStorageStatus: function () { return storage ? storage.getStatus() : 'unknown'; },
      getStorageAdapter: function () { return storage; }
    };
  }

  global.PulseBadgeApp = { bootstrap, SCREENS };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      global.app = PulseBadgeApp.bootstrap();
      global.setfarmStaticReady = true;
    });
  } else {
    global.app = PulseBadgeApp.bootstrap();
    global.setfarmStaticReady = true;
  }
})(window);
