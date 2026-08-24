/*!
 * ac-choose-dates.js
 * Advanced Course "Choose Your Dates" page — confirm modal + date selection.
 *
 * Page: AC : Selection : Choose Your Dates (WIP)
 *       https://landmark-portal.com/advance-course-choose-dates
 *
 * WHAT THIS REPLACES
 *  The page lists available Advanced Courses through an Ontraport object record
 *  block that iterates oEvents. Each card carries a hidden panel with its own
 *  Ontraport submit button, and "Confirm & Reserve" proxied a click to it:
 *
 *      function triggerSourceConfirm() {
 *        var btn = currentSource.querySelector('.opt-button--submit');
 *        if (btn) { btn.click(); }        // <- THIS created the registration
 *      }
 *
 *  Two things were wrong with that. An Ontraport form submit is attributed to
 *  the SESSION contact, not to whoever bought — registration 1342 was created
 *  against contact 877 while the buyer was 1375. And PUR : Purchase Router now
 *  creates a dateless registration at purchase, so a second creator here gives
 *  every buyer two records: money on one, dates on the other.
 *
 *  The click is gone. We POST to n8n, which UPDATES the registration the
 *  purchase already made. Identity travels in the URL, not in a cookie.
 *
 * REQUIRES, in the block template (on el-id-15, beside the close ×):
 *      <span class="lm-event-id" style="display:none">[Block//ID]</span>
 *  [Block//ID] is the oEvent id — verified against block_obj_id=270 in an
 *  Ontraport form redirect. [Block//Event ID] is NOT a valid tag; Ontraport
 *  echoes it back with ##jsonescape appended. mr_opsblck stays empty now that
 *  Ontraport's own click handler never runs.
 *
 * REQUIRES, on the page URL — one of:
 *      ?r=<registration unique id>   from the reminder email
 *      ?c=<contact unique id>        from the checkout redirect
 *  With neither, we refuse rather than guess. Guessing is what produced 877.
 *
 * WHY THIS IS AN EXTERNAL FILE
 *  Ontraport's custom-HTML sanitiser rejects fetch() ("Some of the custom html
 *  seems suspicious and cannot be saved"). Files loaded via <script src> are
 *  not sanitised. Same reason sms-formatting.js lives here.
 *
 * Load from the page footer:
 *      <script>window.LM_AC_CONFIRM_URL = '/your-confirmation-page';</script>
 *      <script src="https://cdn.jsdelivr.net/gh/co-labs-builds/LWW@main/ac-choose-dates.js"></script>
 *  Pin a SHA for production — @main is mutable and jsDelivr caches it.
 *
 *  Set window.LM_AC_DEBUG = false to quieten the [LM] logs.
 *
 * DELETE the in-block Custom HTML element that holds the old confirm script.
 * Its CSS and every robustness fix in it are folded in below, so nothing is
 * lost — but the two copies fight over the modal if both are present.
 *
 * Safe to load more than once.
 */
(function () {
  'use strict';

  if (window.__lmAcChooseDates) { return; }
  window.__lmAcChooseDates = true;

  var WEBHOOK      = 'https://landmarkworldwide.awesomate.io/webhook/ac-choose-dates';
  var CONFIRM_URL  = window.LM_AC_CONFIRM_URL || '';
  var DEBUG        = (window.LM_AC_DEBUG !== false);

  var PANEL_MARK   = '.lm-close,[data-lm-close]';
  var PANEL_COL    = '.col__style';
  var CONFIRM_RE   = /confirm/i;
  var EVENT_ID_SEL = '.lm-event-id';

  var bodyModal = null;
  var backdrop = null;
  var currentSource = null;

  function log()  { if (DEBUG) { console.log.apply(console, arguments); } }
  function warn() { console.warn.apply(console, arguments); }

  /* --------------------------------------------------------------- styles */

  function injectStyles() {
    if (document.getElementById('lm-ac-styles')) { return; }
    var s = document.createElement('style');
    s.id = 'lm-ac-styles';
    s.textContent = [
      '#lm-backdrop{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:99998;}',
      '#lm-backdrop.lm-open{display:block;}',
      '.lm-close{position:absolute;top:10px;right:14px;width:34px;height:34px;font-size:30px;',
      'line-height:34px;text-align:center;cursor:pointer;color:#555;z-index:10;}',
      '.lm-close:hover{color:#000;}',
      '.lm-rec-pill{display:inline-block;font-weight:700;font-size:12px;line-height:1;',
      'letter-spacing:.12em;text-transform:uppercase;padding:9px 18px;border-radius:999px;',
      'margin:0 0 10px 0;font-family:inherit;vertical-align:middle;background:#E8703C;color:#ffffff !important;}',
      '.lm-rec-pill.lm-alt{background:transparent;color:#6B6B6B !important;border:1px solid #C9C6C0;',
      'font-weight:600;letter-spacing:.10em;}'
    ].join('');
    document.head.appendChild(s);
  }

  /* ---------------------------------------------------------------- modal */

  /* Any #lm-body-modal that is not ours belongs to another copy of this script
     still running on the page. Detach it — a detached node can never paint, so
     the other copy goes on driving an invisible element and stops stacking a
     second dialog on top of ours. */
  function dropForeignModals() {
    var mods = document.querySelectorAll('#lm-body-modal');
    var n = 0;
    for (var i = 0; i < mods.length; i++) {
      if (mods[i] !== bodyModal && mods[i].parentNode) {
        mods[i].parentNode.removeChild(mods[i]); n++;
      }
    }
    if (n > 0) { warn('[LM] removed ' + n + ' modal(s) from another copy of this script'); }
    return n;
  }

  function positionModal() {
    var vw = window.innerWidth || document.documentElement.clientWidth;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var w = Math.min(Math.round(vw * 0.92), 640);
    bodyModal.style.width = w + 'px';
    bodyModal.style.left = Math.round((vw - w) / 2) + 'px';
    bodyModal.style.maxHeight = Math.round(vh * 0.88) + 'px';
    var h = bodyModal.offsetHeight;
    bodyModal.style.top = Math.max(20, Math.round((vh - h) / 2)) + 'px';
  }

  function closeModal() {
    var mods = document.querySelectorAll('#lm-body-modal');
    for (var i = 0; i < mods.length; i++) { mods[i].style.display = 'none'; }
    if (bodyModal) { bodyModal.style.display = 'none'; }
    var bds = document.querySelectorAll('#lm-backdrop');
    for (var j = 0; j < bds.length; j++) { bds[j].classList.remove('lm-open'); }
  }

  function setup() {
    var bds = document.querySelectorAll('#lm-backdrop');
    for (var b = 1; b < bds.length; b++) {
      if (bds[b].parentNode) { bds[b].parentNode.removeChild(bds[b]); }
    }
    backdrop = bds[0] || null;
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'lm-backdrop';
      document.body.appendChild(backdrop);
    }

    bodyModal = document.createElement('div');
    bodyModal.id = 'lm-body-modal';
    bodyModal.setAttribute('data-lm-owner', '1');
    bodyModal.style.cssText = [
      'display:none', 'position:fixed', 'overflow-y:auto', 'background:#fff',
      'box-shadow:0 10px 50px rgba(0,0,0,0.3)',
      'z-index:99999', 'padding:28px 24px', 'box-sizing:border-box'
    ].join(';');
    document.body.appendChild(bodyModal);
    dropForeignModals();

    window.addEventListener('resize', function () {
      if (bodyModal.style.display === 'block') { positionModal(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeModal(); }
    });
  }

  /* ------------------------------------------- source panels and triggers */

  function hideSourcePanels() {
    var marks = document.querySelectorAll(PANEL_MARK);
    var count = 0;
    for (var i = 0; i < marks.length; i++) {
      if (marks[i].closest('#lm-body-modal')) { continue; }
      var p = marks[i].closest(PANEL_COL);
      if (p && p.style.display !== 'none') { p.style.display = 'none'; count++; }
    }
    if (count > 0) { log('[LM] hid ' + count + ' source panel(s)'); }
    return count;
  }

  /* "Daily Schedule" links carry Ontraport's own lightbox trigger
     (data-opf-trigger), which is what opens the image popup. Strip it so only
     our confirm modal opens. Runs on the same schedule as hideSourcePanels()
     so it also catches rows rendered later by the dynamic block. */
  function stripTriggers() {
    var links = document.querySelectorAll('a[data-opf-trigger]');
    var n = 0;
    for (var i = 0; i < links.length; i++) {
      var t = (links[i].textContent || '').trim().toLowerCase();
      if (t === 'daily schedule') { links[i].removeAttribute('data-opf-trigger'); n++; }
    }
    if (n > 0) { log('[LM] stripped ' + n + ' daily-schedule trigger(s)'); }
    return n;
  }

  function sweep() { hideSourcePanels(); stripTriggers(); dropForeignModals(); }

  function watchAndHide() {
    sweep();
    [150, 400, 800, 1500, 2500, 4000].forEach(function (ms) { setTimeout(sweep, ms); });
    if (window.MutationObserver) {
      var obs = new MutationObserver(function () { sweep(); });
      obs.observe(document.body, { childList: true, subtree: true });
      setTimeout(function () { obs.disconnect(); }, 8000);
    }
  }

  /* ------------------------------------------------------- panel matching */

  /* A .col__style is only a real panel if it carries a close marker AND reads
     like the confirm dialog. Without the text test we match layout columns
     that happen to sit near a marker. */
  function panelFromMark(mark) {
    if (!mark || mark.closest('#lm-body-modal')) { return null; }
    var col = mark.closest(PANEL_COL);
    if (!col) { return null; }
    if (!CONFIRM_RE.test(col.textContent || '')) { return null; }
    return col;
  }

  /* Climb limit is 24, not 12. The Select Date button reaches its panel within
     12 levels, but the Daily Schedule link is nested several levels deeper
     (span > u > b > a, inside the text wrapper), so 12 returned null. */
  function getPanelForButton(btn) {
    var a = btn.closest('a[opt-type="button-v3"],a[data-url_type]') || btn;
    var node = a;
    for (var i = 0; i < 24; i++) {
      if (!node.parentElement) { break; }
      node = node.parentElement;
      var marks = node.querySelectorAll(PANEL_MARK);
      var found = [];
      for (var k = 0; k < marks.length; k++) {
        var col = panelFromMark(marks[k]);
        if (col && found.indexOf(col) === -1) { found.push(col); }
      }
      if (found.length === 0) { continue; }
      if (found.length > 1) {
        warn('[LM] ' + found.length + ' panels at climb level ' + (i + 1) +
             ' - climbed past the row, using the first');
      }
      log('[LM] panel matched at climb level ' + (i + 1));
      return found[0];
    }
    warn('[LM] no panel found for "' + (a.textContent || '').trim() + '"');
    return null;
  }

  /* ---------------------------------------------------------- date layout */

  function reflowDateRows(root) {
    var TIME_RE = /\d{1,2}:\d{2}\s*(?:AM|PM)\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM)/i;
    var rows = root.querySelectorAll('p,div,span');
    rows.forEach(function (row) {
      if (row.getAttribute('data-lm-split')) { return; }
      if (row.querySelector('p,div')) { return; }
      if (!TIME_RE.test(row.textContent || '')) { return; }
      var walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT, null);
      var tn, target = null;
      while ((tn = walker.nextNode())) {
        if (TIME_RE.test(tn.nodeValue)) { target = tn; break; }
      }
      if (!target) { return; }
      var tm = target.nodeValue.match(TIME_RE);
      var idx = target.nodeValue.indexOf(tm[0]);
      target.nodeValue = target.nodeValue.slice(0, idx).replace(/[\s\-]+$/, '');
      row.setAttribute('data-lm-split', '1');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.alignItems = 'baseline';
      row.style.flexWrap = 'wrap';
      row.style.gap = '16px';
      var left = document.createElement('span');
      while (row.firstChild) { left.appendChild(row.firstChild); }
      var right = document.createElement('span');
      right.textContent = tm[0];
      right.style.whiteSpace = 'nowrap';
      row.appendChild(left);
      row.appendChild(right);
    });
  }

  function openModal(panel) {
    var html = panel.innerHTML || '';
    if (html.replace(/<[^>]*>/g, '').trim().length < 20) {
      warn('[LM] panel matched but is empty - not opening', panel);
      return;
    }
    currentSource = panel;
    dropForeignModals();
    bodyModal.innerHTML = html;
    try { reflowDateRows(bodyModal); } catch (err) { warn('[LM] reflow failed', err); }

    var x = bodyModal.querySelector(PANEL_MARK);
    if (!x) {
      x = document.createElement('span');
      x.className = 'lm-close';
      x.setAttribute('data-lm-close', '');
      x.textContent = '×';
    }
    bodyModal.appendChild(x);
    bodyModal.style.display = 'block';
    positionModal();
    backdrop.classList.add('lm-open');
    setTimeout(dropForeignModals, 0);
    setTimeout(dropForeignModals, 60);
    log('[LM] modal open ' + bodyModal.offsetWidth + 'x' + bodyModal.offsetHeight);
  }

  /* ------------------------------------------------------ the submission */

  /* Ontraport's own post-checkout redirect already carries the buyer:
       uid=7FPM000   contact unique id
       cid=1379      contact id
     so no extra query string needs adding to the redirect. ?r= and ?c= are
     still honoured for links we author ourselves, like the reminder email.

     Deliberately NOT read: _vcid. It decodes to the SESSION contact, which is
     not always the buyer - one live checkout redirect carried cid=1379 next to
     _vcid=1373. cid is the form's contact and is the one to trust. */
  function participantRef() {
    var q = new URLSearchParams(window.location.search);
    var ref = {};

    var r = q.get('r') || q.get('registrationId');
    var u = q.get('c') || q.get('uid');
    var n = q.get('cid') || q.get('contactId');

    if (r) { ref.r = r.trim(); }
    if (u) { ref.c = u.trim(); }
    if (n && /^[0-9]+$/.test(n.trim())) { ref.contactId = n.trim(); }

    return ref;
  }

  function haveRef(ref) {
    return !!(ref.r || ref.c || ref.contactId);
  }

  function eventIdFrom(panel) {
    var el = panel.querySelector(EVENT_ID_SEL);
    return el ? (el.textContent || '').replace(/[^0-9]/g, '') : '';
  }

  /* Was: currentSource.querySelector('.opt-button--submit').click()
     That click was the Ontraport form submit that created the registration.
     It is deliberately gone — see the header. */
  function triggerSourceConfirm() {
    if (!currentSource) { return; }

    var eventId = eventIdFrom(currentSource) || eventIdFrom(bodyModal);
    if (!eventId) {
      warn('[LM] no event id on this panel. Is <span class="lm-event-id">[Block//ID]</span> ' +
           'on el-id-15 in the block template, and rendering a number?');
      return;
    }

    var ref = participantRef();
    if (!haveRef(ref)) {
      warn('[LM] no identifier on the URL - expected one of r, c, uid or cid. ' +
           'There is no way to tell who this is, so refusing rather than guessing.');
      return;
    }

    var payload = { eventId: eventId };
    if (ref.r) { payload.r = ref.r; }
    if (ref.c) { payload.c = ref.c; }
    if (ref.contactId) { payload.contactId = ref.contactId; }

    var label = bodyModal ? bodyModal.querySelector('.opt-button__text-target') : null;
    var original = label ? label.textContent : '';
    if (label) { label.textContent = 'Reserving…'; }

    log('[LM] posting', payload);

    fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (out) {
        log('[LM] ac-choose-dates ->', out);
        if (out && out.ok) {
          // Prefer the URL the webhook hands back - it is THIS registration's own
          // information-form page, read off the record. The information form lives
          // on a dynamic template, so its URL only resolves with the record slug in
          // the PATH (/confirmation/7J1K7PT). A hardcoded /confirmation/ with no
          // slug lands on Ontraport's "your page isn't turned on yet" screen, which
          // is exactly what a fixed LM_AC_CONFIRM_URL did on 24 Aug.
          var next = (out.confirmationUrl || '').trim() || CONFIRM_URL;
          if (next) { window.location.href = next; return; }
          if (label) { label.textContent = 'Reserved ✓'; }
          warn('[LM] reserved, but no confirmationUrl came back and no ' +
               'window.LM_AC_CONFIRM_URL is set, so there is nowhere to send you.');
          return;
        }
        if (label) { label.textContent = original; }
        warn('[LM] refused: ' + ((out && out.reason) || 'no reason given'));
      })
      .catch(function (err) {
        if (label) { label.textContent = original; }
        warn('[LM] webhook call failed', err);
      });
  }

  /* ------------------------------------------------------------ delegation */

  function init() {
    injectStyles();
    setup();
    watchAndHide();

    document.addEventListener('click', function (e) {
      if (e.target.id === 'lm-backdrop') { e.preventDefault(); closeModal(); return; }

      /* Keyed on the modal ID, NOT on our own reference. If the × belongs to
         another copy's dialog we still close everything on the first click. */
      var closeHit = e.target.closest(PANEL_MARK);
      if (closeHit && closeHit.closest('#lm-body-modal')) {
        e.preventDefault(); e.stopImmediatePropagation(); closeModal(); return;
      }

      var host = e.target.closest('#lm-body-modal');
      if (host && host.style.display === 'block') {
        var inBtn = e.target.closest('a,button,.opt-button,.opt-button__text-target');
        if (inBtn) {
          var t = (inBtn.textContent || '').trim().toLowerCase();
          if (t.indexOf('go back') !== -1) {
            e.preventDefault(); e.stopImmediatePropagation(); closeModal(); return;
          }
          if (t.indexOf('confirm') !== -1 && t.indexOf('reserve') !== -1) {
            e.preventDefault(); e.stopImmediatePropagation(); triggerSourceConfirm(); return;
          }
        }
        return;
      }

      var el = e.target.closest('a[opt-type="button-v3"],a[data-url_type],.opt-button,button');
      if (!el) { return; }
      var textEl = el.querySelector('.opt-button__text-target') || el;
      var label = (textEl.textContent || '').trim().toLowerCase();

      if (label === 'select date' || label === 'daily schedule') {
        /* Belt and braces: if this row appeared after the MutationObserver
           disconnected, its trigger may still be present. */
        if (el.hasAttribute('data-opf-trigger')) { el.removeAttribute('data-opf-trigger'); }
        e.preventDefault();
        e.stopPropagation();
        log('[LM] click: ' + label);
        var panel = getPanelForButton(el);
        if (panel) {
          try { openModal(panel); } catch (err) { warn('[LM] openModal threw', err); }
        }
      }
    }, true);

    log('[LM] ac-choose-dates ready');
  }

  /* --------------------------------------------- RECOMMENDED / ALT pills */

  function badges() {
    var SEL = '.el-id-8 .opt-text-wrapper > div';

    function handle(d) {
      if (d.getAttribute('data-lm-badge')) { return; }
      var b = d.firstElementChild;
      var c = (b && b.tagName === 'B') ? b : d;
      var first = c.firstElementChild;
      if (!first || first.tagName !== 'SPAN') { return; }
      var br = first.nextElementSibling;
      if (!br || br.tagName !== 'BR') { return; }
      var val = first.textContent.replace(/[​]/g, '').replace(/\s+/g, ' ').trim();
      /* An unrendered block template still reads "[Block..." — leave it alone. */
      if (val.indexOf('[Block') === 0) { return; }
      d.setAttribute('data-lm-badge', '1');
      c.removeChild(first); c.removeChild(br);
      if (val) {
        var s = document.createElement('span');
        s.className = 'lm-rec-pill' + (/^recommended$/i.test(val) ? '' : ' lm-alt');
        s.textContent = val;
        d.insertBefore(document.createElement('br'), d.firstChild);
        d.insertBefore(s, d.firstChild);
      }
    }

    function run() { Array.prototype.forEach.call(document.querySelectorAll(SEL), handle); }

    run();
    document.addEventListener('DOMContentLoaded', run);
    try {
      new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true });
    } catch (e) {}
  }

  /* ------------------------------------------------------------------ boot */

  function boot() { init(); badges(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
