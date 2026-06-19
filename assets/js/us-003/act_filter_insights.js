(function () {
  'use strict';

  function getStatusCounts(records) {
    const counts = { healthy: 0, warning: 0, critical: 0 };
    if (!Array.isArray(records)) return counts;
    records.forEach(function (record) {
      if (record && record.status && counts.hasOwnProperty(record.status)) {
        counts[record.status] += 1;
      }
    });
    return counts;
  }

  function applyFilter(filterKey) {
    const grid = document.querySelector('[data-testid="insights-grid"]');
    if (!grid) return;
    const cards = grid.querySelectorAll('.insight-card');
    cards.forEach(function (card) {
      const metric = card.getAttribute('data-metric');
      if (!filterKey || filterKey === 'all' || metric === filterKey || metric === 'total') {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function handleFilterClick() {
    const store = window.__PB_STORE__;
    const state = store && typeof store.getState === 'function' ? store.getState() : {};
    const counts = getStatusCounts(state.records);
    const ordered = [
      { key: 'healthy', label: 'Healthy', count: counts.healthy },
      { key: 'warning', label: 'Warning', count: counts.warning },
      { key: 'critical', label: 'Critical', count: counts.critical }
    ];
    const priority = ordered.find(function (item) { return item.count > 0; });
    const filterKey = priority ? priority.key : 'all';
    applyFilter(filterKey);
    console.log('[act_filter_insights] Applied filter:', filterKey);
  }

  function wire() {
    document.querySelectorAll('[data-action-id="ACT_FILTER_INSIGHTS"]').forEach(function (el) {
      el.addEventListener('click', handleFilterClick);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
