/*!
 * lm-phone-format.js
 * Live NANP phone formatting for Ontraport landing page inputs.
 *
 * Formats as the user types:  4156726240  ->  (415) 672-6240
 *
 * Design notes:
 *  - Matches by ID/name SUFFIX, not a hardcoded ID. Ontraport regenerates the
 *    block prefix (o2fa98823b73d-) per page, so a literal ID would work on one
 *    page and silently do nothing on the next.
 *  - Uses capture-phase delegation on document, so it survives blocks that are
 *    injected or re-rendered after load.
 *  - Preserves caret position by digit index, so mid-string edits don't jump.
 *  - Leaves anything starting with "+" alone (international entries).
 *
 * Drop in via Ontraport page Settings -> Tracking/Custom Code -> Footer,
 * or include from your repo. Safe to load more than once.
 */
(function () {
  'use strict';

  if (window.__lmPhoneFormat) return;
  window.__lmPhoneFormat = true;

  /* ------------------------------------------------------------------ *
   * Which inputs to format.
   * Add a suffix here for each phone field across the pilot / non-pilot
   * flows. Matching is on the END of the id or name attribute.
   * ------------------------------------------------------------------ */
  var FIELD_SUFFIXES = [
    'sms_number',   // Step 01 checkout - SMS Number
    'f2575'         // Step 02 FiF - Emergency Contact Phone  (VERIFY, see README note)
  ];

  var SELECTOR = FIELD_SUFFIXES.map(function (s) {
    return 'input[id$="-' + s + '"], input[id="' + s + '"], input[name$="' + s + '"]';
  }).join(', ');

  var lastDigits = new WeakMap();

  function digitsOf(s) {
    return String(s || '').replace(/\D/g, '');
  }

  function isInternational(s) {
    return /^\s*\+/.test(String(s || ''));
  }

  /* (415) 672-6240 — partial-safe, so it formats mid-typing too. */
  function format(d) {
    if (!d) return '';
    if (d.length <= 3) return '(' + d;
    if (d.length <= 6) return '(' + d.slice(0, 3) + ') ' + d.slice(3);
    return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
  }

  /* How many digits sit to the left of the caret. */
  function digitsBefore(value, pos) {
    return digitsOf(String(value).slice(0, pos)).length;
  }

  /* Where to put the caret so that N digits sit to its left. */
  function caretAfterDigit(formatted, n) {
    if (n <= 0) return formatted.charAt(0) === '(' ? 1 : 0;
    var seen = 0;
    for (var i = 0; i < formatted.length; i++) {
      if (formatted.charCodeAt(i) >= 48 && formatted.charCodeAt(i) <= 57) {
        if (++seen === n) return i + 1;
      }
    }
    return formatted.length;
  }

  function apply(el, inputType) {
    var raw = el.value;

    // Hands off international numbers.
    if (isInternational(raw)) {
      lastDigits.set(el, digitsOf(raw));
      return;
    }

    var focused = (el === document.activeElement);
    var pos = focused && typeof el.selectionStart === 'number'
      ? el.selectionStart
      : raw.length;

    var d = digitsOf(raw);
    var before = digitsBefore(raw, pos);

    // Strip a leading country 1 (11 digits: 14156726240).
    if (d.length === 11 && d.charAt(0) === '1') {
      d = d.slice(1);
      if (before > 0) before--;
    }

    if (d.length > 10) {
      d = d.slice(0, 10);
    }

    /* Backspace over a separator — ")" or "-" or a space — removes no digit,
       so the reformat would instantly restore it and the key would feel dead.
       Detect that case and delete the digit in front of it instead. */
    if (inputType === 'deleteContentBackward' &&
        d === lastDigits.get(el) &&
        before > 0) {
      d = d.slice(0, before - 1) + d.slice(before);
      before--;
    }

    if (before > d.length) before = d.length;

    var out = format(d);

    if (out !== raw) {
      el.value = out;
      if (focused) {
        var c = caretAfterDigit(out, before);
        try { el.setSelectionRange(c, c); } catch (e) { /* non-text input */ }
      }
    }

    lastDigits.set(el, d);
  }

  /* Mobile keyboards + autofill hints. Harmless if already set. */
  function prime(el) {
    if (el.__lmPrimed) return;
    el.__lmPrimed = true;
    if (!el.getAttribute('inputmode')) el.setAttribute('inputmode', 'tel');
    if (!el.getAttribute('autocomplete')) el.setAttribute('autocomplete', 'tel');
    el.setAttribute('maxlength', '14'); // (000) 000-0000
    if (el.value) apply(el);            // format Ontraport prefill
  }

  function primeAll(root) {
    var nodes = (root || document).querySelectorAll(SELECTOR);
    for (var i = 0; i < nodes.length; i++) prime(nodes[i]);
  }

  function matches(el) {
    return el && el.nodeType === 1 && el.matches && el.matches(SELECTOR);
  }

  document.addEventListener('input', function (e) {
    if (matches(e.target)) apply(e.target, e.inputType);
  }, true);

  document.addEventListener('focusin', function (e) {
    if (matches(e.target)) prime(e.target);
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { primeAll(); });
  } else {
    primeAll();
  }

  /* Ontraport injects blocks after load; catch late arrivals. */
  if (window.MutationObserver) {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var n = added[j];
          if (n.nodeType !== 1) continue;
          if (matches(n)) prime(n);
          else if (n.querySelectorAll) primeAll(n);
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
