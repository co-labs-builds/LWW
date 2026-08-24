/*!
 * ac-choose-dates.js
 * Advanced Course "Choose Your Dates" page — confirm modal + date selection.
 *
 * Page: AC : Selection : Choose Your Dates (WIP)
 *       https://landmark-portal.com/advance-course-choose-dates
 *
 * WHAT THIS REPLACES
 *  The page lists available Advanced Courses through an Ontraport object record
 *  block that iterates oEvents. Each card carries its own hidden panel with its
 *  own Ontraport submit button. The old version proxied a click to that button,
 *  and THAT CLICK CREATED THE REGISTRATION.
 *
 *  Two things were wrong with it:
 *   1. An Ontraport form submit is attributed to the SESSION contact, not to
 *      whoever bought. Registration 1342 was created against contact 877 while
 *      the actual buyer was 1375 — the form never knew who the buyer was, only
 *      who the browser was.
 *   2. PUR : Purchase Router now creates a dateless registration at purchase.
 *      A second creator here means every buyer who picks dates gets two records
 *      — money on one, dates on the other.
 *
 *  So the click is gone. We POST to n8n instead, which UPDATES the registration
 *  the purchase already made. Identity travels in the URL, not in a cookie.
 *
 * REQUIRES, in the block template:
 *      <span class="lm-event-id" style="display:none">[Block//ID]</span>
 *  The event id is rendered nowhere else. mr_opsblck is empty until Ontraport's
 *  own click handler fills it, which never happens now that we don't click.
 *
 * REQUIRES, on the page URL — one of:
 *      ?r=<registration unique id>   from the reminder email
 *      ?c=<contact unique id>        from the checkout redirect
 *  With neither, we refuse rather than guess. Guessing is what produced 877.
 *
 * WHY THIS IS AN EXTERNAL FILE
 *  Ontraport's custom-HTML sanitiser rejects fetch() in a footer script
 *  ("Some of the custom html seems suspicious and cannot be saved"). Files
 *  loaded via <script src> are not sanitised. Same reason sms-formatting.js
 *  lives here.
 *
 * Load from the page footer:
 *      <script src="https://cdn.jsdelivr.net/gh/co-labs-builds/LWW@main/ac-choose-dates.js"></script>
 *  Pin a SHA for production — @main is mutable and jsDelivr caches it.
 *
 * Optional, set BEFORE the script tag:
 *      <script>window.LM_AC_CONFIRM_URL = '/your-confirmation-page';</script>
 *
 * Safe to load more than once.
 */
(function () {
  'use strict';

  if (window.__lmAcChooseDates) return;
  window.__lmAcChooseDates = true;

  var WEBHOOK = 'https://landmarkworldwide.awesomate.io/webhook/ac-choose-dates';
  var CONFIRM_URL = window.LM_AC_CONFIRM_URL || '';

  var PANEL_MARK = '.lm-close,[data-lm-close]';
  var PANEL_COL = '.col__style';
  var EVENT_ID_SEL = '.lm-event-id';

  var bodyModal = null;
  var backdrop = null;
  var currentSource = null;

  /* ------------------------------------------------------------------ modal */

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
    if (bodyModal) bodyModal.style.display = 'none';
    if (backdrop) backdrop.classList.remove('lm-open');
  }

  function setup() {
    backdrop = document.getElementById('lm-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'lm-backdrop';
      document.body.appendChild(backdrop);
    }
    bodyModal = document.createElement('div');
    bodyModal.id = 'lm-body-modal';
    bodyModal.style.cssText = [
      'display:none', 'position:fixed', 'overflow-y:auto', 'background:#fff',
      'box-shadow:0 10px 50px rgba(0,0,0,0.3)',
      'z-index:99999', 'padding:28px 24px', 'box-sizing:border-box'
    ].join(';');
    document.body.appendChild(bodyModal);

    window.addEventListener('resize', function () {
      if (bodyModal.style.display === 'block') positionModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  function openModal(panel) {
    currentSource = panel;
    bodyModal.innerHTML = panel.innerHTML;
    reflowDateRows(bodyModal);
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
  }

  /* ------------------------------------------------- source panel management */

  function hideSourcePanels() {
    var marks = document.querySelectorAll(PANEL_MARK);
    var count = 0;
    for (var i = 0; i < marks.length; i++) {
      if (marks[i].closest('#lm-body-modal')) continue;
      var p = marks[i].closest(PANEL_COL);
      if (p && p.style.display !== 'none') { p.style.display = 'none'; count++; }
    }
    if (count > 0) console.log('[LM] hid ' + count + ' source panel(s)');
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
    if (n > 0) console.log('[LM] stripped ' + n + ' daily-schedule trigger(s)');
    return n;
  }

  function sweep() { hideSourcePanels(); stripTriggers(); }

  function watchAndHide() {
    sweep();
    [150, 400, 800, 1500, 2500, 4000].forEach(function (ms) { setTimeout(sweep, ms); });
    if (window.MutationObserver) {
      var obs = new MutationObserver(function () { sweep(); });
      obs.observe(document.body, { childList: true, subtree: true });
      setTimeout(function () { obs.disconnect(); }, 8000);
    }
  }

  /* Climb limit is 24, not 12. The Select Date button reaches its panel within
     12 levels, but the Daily Schedule link is nested several levels deeper
     (span > u > b > a, inside the text wrapper), so 12 returned null. Still
     returns the FIRST ancestor containing a panel marker, which is always the
     current record's own panel, so raising the cap is safe. */
  function getPanelForButton(btn) {
    var a = btn.closest('a[opt-type="button-v3"],a[data-url_type]') || btn;
    var node = a;
    for (var i = 0; i < 24; i++) {
      if (!node.parentElement) break;
      node = node.parentElement;
      var mark = node.querySelector(PANEL_MARK);
      if (mark && !mark.closest('#lm-body-modal')) {
        console.log('[LM] panel matched at climb level ' + (i + 1));
        return mark.closest(PANEL_COL) || mark.parentElement;
      }
    }
    console.warn('[LM] no panel found for "' + (a.textContent || '').trim() + '"');
    return null;
  }

  /* ------------------------------------------------------------- date layout */

  function reflowDateRows(root) {
    var TIME_RE = /\d{1,2}:\d{2}\s*(?:AM|PM)\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM)/i;
    var rows = root.querySelectorAll('p,div,span');
    rows.forEach(function (row) {
      if (row.getAttribute('data-lm-split')) return;
      if (row.querySelector('p,div')) return;
      if (!TIME_RE.test(row.textContent || '')) return;
      var walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT, null);
      var tn, target = null;
      while ((tn = walker.nextNode())) {
        if (TIME_RE.test(tn.nodeValue)) { target = tn; break; }
      }
      if (!target) return;
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
      while (row.firstChild) left.appendChild(row.firstChild);
      var right = document.createElement('span');
      right.textContent = tm[0];
      right.style.whiteSpace = 'nowrap';
      row.appendChild(left);
      row.appendChild(right);
    });
  }

  /* ----------------------------------------------------------- the submission */

  function participantRef() {
    var q = new URLSearchParams(window.location.search);
    var ref = {};
    if (q.get('r')) ref.r = q.get('r').trim();
    if (q.get('c')) ref.c = q.get('c').trim();
    return ref;
  }

  function modalButtonLabel() {
    return bodyModal ? bodyModal.querySelector('.opt-button__text-target') : null;
  }

  /* Was: currentSource.querySelector('.opt-button--submit').click()
     That click was the Ontraport form submit that created the registration.
     It is deliberately gone. */
  function triggerSourceConfirm() {
    if (!currentSource) return;

    var idEl = currentSource.querySelector(EVENT_ID_SEL);
    var eventId = idEl ? (idEl.textContent || '').replace(/[^0-9]/g, '') : '';
    if (!eventId) {
      console.error('[LM] no event id on this panel. Is <span class="lm-event-id">[Block//ID]</span> in the block template and rendering a number?');
      return;
    }

    var ref = participantRef();
    if (!ref.r && !ref.c) {
      console.error('[LM] no ?r= or ?c= on the URL, so there is no way to tell who this is. Refusing rather than guessing.');
      return;
    }

    var payload = { eventId: eventId };
    if (ref.r) payload.r = ref.r;
    if (ref.c) payload.c = ref.c;

    var label = modalButtonLabel();
    var original = label ? label.textContent : '';
    if (label) label.textContent = 'Reserving…';

    fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json(); })
      .then(function (out) {
        console.log('[LM] ac-choose-dates ->', out);
        if (out && out.ok) {
          if (CONFIRM_URL) { window.location.href = CONFIRM_URL; return; }
          if (label) label.textContent = 'Reserved ✓';
          console.warn('[LM] no CONFIRM_URL set, staying on the page. Set window.LM_AC_CONFIRM_URL before the script tag.');
          return;
        }
        if (label) label.textContent = original;
        console.error('[LM] refused: ' + ((out && out.reason) || 'no reason given'));
      })
      .catch(function (err) {
        if (label) label.textContent = original;
        console.error('[LM] webhook call failed', err);
      });
  }

  /* -------------------------------------------------------------- delegation */

  function init() {
    setup();
    watchAndHide();

    document.addEventListener('click', function (e) {
      if (e.target.id === 'lm-backdrop') { e.preventDefault(); closeModal(); return; }

      if (bodyModal && bodyModal.style.display === 'block' && bodyModal.contains(e.target)) {
        if (e.target.closest(PANEL_MARK)) {
          e.preventDefault(); e.stopPropagation(); closeModal(); return;
        }
        var inBtn = e.target.closest('a,button,.opt-button,.opt-button__text-target');
        if (inBtn) {
          var t = (inBtn.textContent || '').trim().toLowerCase();
          if (t.indexOf('go back') !== -1) {
            e.preventDefault(); e.stopPropagation(); closeModal(); return;
          }
          if (t.indexOf('confirm') !== -1 && t.indexOf('reserve') !== -1) {
            e.preventDefault(); e.stopPropagation(); triggerSourceConfirm(); return;
          }
        }
        return;
      }

      var el = e.target.closest('a[opt-type="button-v3"],a[data-url_type],.opt-button,button');
      if (!el) return;
      var textEl = el.querySelector('.opt-button__text-target') || el;
      var lbl = (textEl.textContent || '').trim().toLowerCase();
      if (lbl === 'select date' || lbl === 'daily schedule') {
        /* Belt and braces: if this row appeared after the MutationObserver
           disconnected, its trigger may still be present. Remove it before we
           open, so the image lightbox cannot also fire. */
        if (el.hasAttribute('data-opf-trigger')) el.removeAttribute('data-opf-trigger');
        e.preventDefault();
        e.stopPropagation();
        var panel = getPanelForButton(el);
        if (panel) openModal(panel);
      }
    }, true);

    console.log('[LM] ac-choose-dates ready');
  }

  /* --------------------------------------------------- RECOMMENDED / ALT pill */

  function badgeStyles() {
    if (document.getElementById('lm-rec-pill-style')) return;
    var s = document.createElement('style');
    s.id = 'lm-rec-pill-style';
    s.textContent =
      '.lm-rec-pill{display:inline-block;font-weight:700;font-size:12px;line-height:1;' +
      'letter-spacing:.12em;text-transform:uppercase;padding:9px 18px;border-radius:999px;' +
      'margin:0 0 10px 0;font-family:inherit;vertical-align:middle;background:#E8703C;color:#ffffff !important;}' +
      '.lm-rec-pill.lm-alt{background:transparent;color:#6B6B6B !important;border:1px solid #C9C6C0;' +
      'font-weight:600;letter-spacing:.10em;}';
    document.head.appendChild(s);
  }

  function badges() {
    var SEL = '.el-id-8 .opt-text-wrapper > div';

    function handle(d) {
      if (d.getAttribute('data-lm-badge')) return;
      var b = d.firstElementChild;
      var c = (b && b.tagName === 'B') ? b : d;
      var first = c.firstElementChild;
      if (!first || first.tagName !== 'SPAN') return;
      var br = first.nextElementSibling;
      if (!br || br.tagName !== 'BR') return;
      var val = first.textContent.replace(/[​]/g, '').replace(/\s+/g, ' ').trim();
      /* An unrendered block placeholder still reads "[Block..." — leave it. */
      if (val.indexOf('[Block') === 0) return;
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

    badgeStyles();
    run();
    document.addEventListener('DOMContentLoaded', run);
    try { new MutationObserver(run).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
  }

  /* ------------------------------------------------------------------- boot */

  function boot() { init(); badges(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
