/**
 * LWW Build — Disable paste into Confirm Email
 * Displays an inline error message when paste is attempted.
 */
(function () {
  'use strict';

  var selector = 'input[id$="-confirm_email"]';
  var messageText =
    'Pasting disabled for this input. Please type your email address again.';

  function showPasteMessage(field) {
    var messageId = field.id + '-paste-error';
    var message = document.getElementById(messageId);

    if (!message) {
      message = document.createElement('div');
      message.id = messageId;
      message.setAttribute('role', 'alert');
      message.setAttribute('aria-live', 'assertive');

      message.style.marginTop = '6px';
      message.style.color = '#b42318';
      message.style.fontSize = '14px';
      message.style.lineHeight = '1.4';

      field.insertAdjacentElement('afterend', message);
      field.setAttribute('aria-describedby', messageId);
    }

    message.textContent = messageText;
    message.style.display = 'block';

    field.setAttribute('aria-invalid', 'true');

    clearTimeout(field._pasteMessageTimer);

    field._pasteMessageTimer = setTimeout(function () {
      message.style.display = 'none';
      field.removeAttribute('aria-invalid');
    }, 5000);
  }

  function blockPaste(event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    showPasteMessage(event.currentTarget);

    return false;
  }

  function protectField(field) {
    if (!field || field.getAttribute('data-paste-blocked') === 'true') {
      return;
    }

    field.setAttribute('data-paste-blocked', 'true');

    field.addEventListener('paste', blockPaste, true);
    field.onpaste = blockPaste;

    field.addEventListener('input', function () {
      var message = document.getElementById(field.id + '-paste-error');

      if (message) {
        message.style.display = 'none';
      }

      field.removeAttribute('aria-invalid');
    });
  }

  function attachProtection() {
    document.querySelectorAll(selector).forEach(protectField);
  }

  attachProtection();

  document.addEventListener('DOMContentLoaded', attachProtection);
  window.addEventListener('load', attachProtection);

  new MutationObserver(attachProtection).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
