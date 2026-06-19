(function () {
  'use strict';

  function handleRetry() {
    const store = window.__PB_STORE__;
    if (store && typeof store.resetToFixtures === 'function') {
      store.resetToFixtures();
    }
    window.location.reload();
  }

  function wire() {
    document.querySelectorAll('[data-action-id="ACT_RETRY_LOAD"]').forEach(function (el) {
      el.addEventListener('click', handleRetry);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
