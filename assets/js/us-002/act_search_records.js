(function () {
  'use strict';

  function filterRecords(query) {
    const list = document.querySelector('.record-list');
    if (!list) return;
    const cards = list.querySelectorAll('.record-card');
    const lower = String(query || '').toLowerCase();
    cards.forEach(function (card) {
      const nameEl = card.querySelector('.record-name');
      const hostEl = card.querySelector('.record-host');
      const name = nameEl ? nameEl.textContent.toLowerCase() : '';
      const host = hostEl ? hostEl.textContent.toLowerCase() : '';
      card.style.display = (name.indexOf(lower) !== -1 || host.indexOf(lower) !== -1) ? '' : 'none';
    });
  }

  function handleInput(event) {
    filterRecords(event.target.value);
  }

  function handleFilterClick() {
    const input = document.querySelector('[data-action-id="ACT_SEARCH_RECORDS"]');
    if (input) {
      filterRecords(input.value);
    }
  }

  function wire() {
    document.querySelectorAll('[data-action-id="ACT_SEARCH_RECORDS"]').forEach(function (el) {
      if (el.tagName.toLowerCase() === 'input') {
        el.addEventListener('input', handleInput);
      } else {
        el.addEventListener('click', handleFilterClick);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
