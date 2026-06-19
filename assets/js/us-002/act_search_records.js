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

  function renderRecordList() {
    const store = ensureStore();
    const state = store.getState();
    const list = document.querySelector('[data-testid="record-list"]');
    if (!list) return;
    list.innerHTML = '';

    if (!Array.isArray(state.records) || state.records.length === 0) {
      list.appendChild(document.createElement('p')).className = 'empty-state';
      list.querySelector('.empty-state').textContent = 'No records found.';
      return;
    }

    state.records.forEach(function (record) {
      const card = document.createElement('article');
      card.className = 'record-card record-card--' + (record.status || 'unknown');
      card.dataset.recordId = record.id;

      const info = document.createElement('div');
      const name = document.createElement('h3');
      name.className = 'record-name';
      name.textContent = record.name;
      info.appendChild(name);
      const host = document.createElement('p');
      host.className = 'record-host';
      host.textContent = record.host;
      info.appendChild(host);
      card.appendChild(info);

      const status = document.createElement('span');
      status.className = 'record-status record-status--' + (record.status || 'unknown');
      status.textContent = record.status || 'unknown';
      card.appendChild(status);

      const inspectBtn = document.createElement('button');
      inspectBtn.className = 'app-button app-button--secondary';
      inspectBtn.type = 'button';
      inspectBtn.dataset.actionId = 'ACT_SELECT_RECORD';
      inspectBtn.dataset.recordId = record.id;
      inspectBtn.textContent = 'Inspect';
      card.appendChild(inspectBtn);

      list.appendChild(card);
    });

    document.dispatchEvent(new CustomEvent('pulsebadge:records-rendered'));
  }

  function attachSearch() {
    const input = document.querySelector('[data-action-id="ACT_SEARCH_RECORDS"]');
    if (input) {
      input.addEventListener('input', function (e) {
        const query = (e.target.value || '').toLowerCase();
        const cards = document.querySelectorAll('.record-card');
        cards.forEach(function (card) {
          const nameEl = card.querySelector('.record-name');
          const hostEl = card.querySelector('.record-host');
          const name = nameEl ? nameEl.textContent.toLowerCase() : '';
          const host = hostEl ? hostEl.textContent.toLowerCase() : '';
          card.style.display = (name.indexOf(query) !== -1 || host.indexOf(query) !== -1) ? '' : 'none';
        });
      });
    }

    const filterBtn = document.querySelector('[data-action-id="ACT_FILTER_RECORDS"]');
    if (filterBtn) {
      filterBtn.addEventListener('click', function () {
        const input = document.querySelector('[data-action-id="ACT_SEARCH_RECORDS"]');
        if (input) input.focus();
      });
    }
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        renderRecordList();
        attachSearch();
      });
    } else {
      renderRecordList();
      attachSearch();
    }
  }

  init();
})();
