/**
 * Disable paste into the Ontraport Confirm Email field.
 * Targets any input whose rendered ID ends with "-confirm_email".
 */
(function () {
  'use strict';

  var selector = 'input[id$="-confirm_email"]';

  function blockPaste(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return false;
  }

  function attachPasteBlock() {
    document.querySelectorAll(selector).forEach(function (field) {
      if (field.getAttribute('data-paste-blocked') === 'true') {
        return;
      }

      field.setAttribute('data-paste-blocked', 'true');
      field.addEventListener('paste', blockPaste, true);
      field.onpaste = blockPaste;
    });
  }

  attachPasteBlock();
  document.addEventListener('DOMContentLoaded', attachPasteBlock);
  window.addEventListener('load', attachPasteBlock);

  new MutationObserver(attachPasteBlock).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
