<script type='text/javascript'>
(function () {
  "use strict";

  function initializeNavigation(nav) {
    if (
      !nav ||
      nav.dataset.lmFjNavReady === "true"
    ) {
      return;
    }

    var menuButton = nav.querySelector(
      ".opt-navigation-menu__menu-button"
    );

    var menu = nav.querySelector(
      ".opt-navigation-menu__main-menu-links"
    );

    if (!menuButton || !menu) {
      return;
    }

    nav.dataset.lmFjNavReady = "true";

    if (!menu.id) {
      menu.id = "lm-fj-mobile-menu-" +
        Math.random()
          .toString(36)
          .slice(2, 9);
    }

    menuButton.setAttribute(
      "aria-controls",
      menu.id
    );

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );

    menuButton.setAttribute(
      "aria-label",
      "Open navigation menu"
    );

    function setOpen(open) {
      nav.classList.toggle(
        "is-open",
        open
      );

      menuButton.setAttribute(
        "aria-expanded",
        open ? "true" : "false"
      );

      menuButton.setAttribute(
        "aria-label",
        open
          ? "Close navigation menu"
          : "Open navigation menu"
      );
    }

    function closeMenu() {
      setOpen(false);
    }

    menuButton.addEventListener(
      "click",
      function (event) {
        event.preventDefault();
        event.stopPropagation();

        setOpen(
          !nav.classList.contains(
            "is-open"
          )
        );
      },
      true
    );

    menu.addEventListener(
      "click",
      function (event) {
        var link = event.target.closest(
          "a"
        );

        if (!link) {
          return;
        }

        closeMenu();
      }
    );

    document.addEventListener(
      "click",
      function (event) {
        if (
          nav.classList.contains(
            "is-open"
          ) &&
          !nav.contains(event.target)
        ) {
          closeMenu();
        }
      }
    );

    document.addEventListener(
      "keydown",
      function (event) {
        if (
          event.key !== "Escape" ||
          !nav.classList.contains(
            "is-open"
          )
        ) {
          return;
        }

        event.preventDefault();
        closeMenu();
        menuButton.focus();
      }
    );

    window.addEventListener(
      "resize",
      function () {
        if (window.innerWidth > 1000) {
          closeMenu();
        }
      }
    );
  }

  function initializeNavigations() {
    document
      .querySelectorAll(
        ".lm-fj.lm-fj-nav"
      )
      .forEach(
        initializeNavigation
      );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeNavigations
    );
  } else {
    initializeNavigations();
  }

  window.addEventListener(
    "load",
    initializeNavigations
  );
})();

(function () {
  "use strict";

  function initializeCountdown(card) {
    if (!card) {
      return;
    }

    var rawStart = String(
      card.getAttribute("data-start-utc") || ""
    ).trim();

    var daysElement = card.querySelector(
      "[data-lm-fj-countdown-days]"
    );

    var hoursElement = card.querySelector(
      "[data-lm-fj-countdown-hours]"
    );

    var minutesElement = card.querySelector(
      "[data-lm-fj-countdown-minutes]"
    );

    var secondsElement = card.querySelector(
      "[data-lm-fj-countdown-seconds]"
    );

    var displayElement = card.querySelector(
      "[data-lm-fj-countdown-display]"
    );

    var labelElement = card.querySelector(
      ".lm-fj-hero__countdown-label"
    );

    /*
      Reject missing or unresolved Ontraport fields.
    */
    if (
      !rawStart ||
      rawStart.indexOf("[") !== -1 ||
      !daysElement ||
      !hoursElement ||
      !minutesElement ||
      !secondsElement
    ) {
      card.classList.add(
        "is-countdown-unavailable"
      );

      return;
    }

    /*
      Expected Ontraport value:
      2026-08-14T16:00:00Z
    */
    var targetTimestamp = Date.parse(rawStart);

    if (!Number.isFinite(targetTimestamp)) {
      card.classList.add(
        "is-countdown-unavailable"
      );

      console.warn(
        "Unable to parse Forum Cal Start (UTC):",
        rawStart
      );

      return;
    }

    card.classList.remove(
      "is-countdown-unavailable"
    );

    /*
      Prevent duplicate intervals if Ontraport initializes
      the page or block more than once.
    */
    if (card.lmFjCountdownInterval) {
      window.clearInterval(
        card.lmFjCountdownInterval
      );
    }

    function padNumber(value) {
      return String(value).padStart(2, "0");
    }

    function setCountdownValues(
      days,
      hours,
      minutes,
      seconds
    ) {
      daysElement.textContent = String(days);
      hoursElement.textContent = padNumber(hours);
      minutesElement.textContent = padNumber(minutes);
      secondsElement.textContent = padNumber(seconds);
    }

    function updateCountdown() {
      var remainingMilliseconds =
        targetTimestamp - Date.now();

      if (remainingMilliseconds <= 0) {
        setCountdownValues(0, 0, 0, 0);

        card.classList.add(
          "is-countdown-complete"
        );

        if (labelElement) {
          labelElement.textContent =
            "The Forum has begun";
        }

        if (displayElement) {
          displayElement.setAttribute(
            "aria-label",
            "The Forum has begun"
          );
        }

        if (card.lmFjCountdownInterval) {
          window.clearInterval(
            card.lmFjCountdownInterval
          );

          card.lmFjCountdownInterval = null;
        }

        return;
      }

      var totalSeconds = Math.floor(
        remainingMilliseconds / 1000
      );

      var days = Math.floor(
        totalSeconds / 86400
      );

      var hours = Math.floor(
        (totalSeconds % 86400) / 3600
      );

      var minutes = Math.floor(
        (totalSeconds % 3600) / 60
      );

      var seconds =
        totalSeconds % 60;

      setCountdownValues(
        days,
        hours,
        minutes,
        seconds
      );

      if (displayElement) {
        displayElement.setAttribute(
          "aria-label",
          days +
            " days, " +
            hours +
            " hours, " +
            minutes +
            " minutes, and " +
            seconds +
            " seconds until the Forum begins"
        );
      }
    }

    updateCountdown();

    card.lmFjCountdownInterval =
      window.setInterval(
        updateCountdown,
        1000
      );
  }

  function initializeForumCountdowns() {
    document
      .querySelectorAll(
        "[data-lm-fj-countdown]"
      )
      .forEach(initializeCountdown);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeForumCountdowns
    );
  } else {
    initializeForumCountdowns();
  }

  window.addEventListener(
    "load",
    initializeForumCountdowns
  );
})();


/* Forum Journey — Information Form card: two-state display.

   The completion value arrives in the hidden merge feed span
   ([data-mf="infodone"]), because Ontraport resolves merge fields in
   text. On the live page that field merges as "Yes", so this is a
   Yes/No field, not a 0/1 field.

   This block only swaps copy and classes. The card's link is handled
   entirely by the [Page//Registration Confirmation URL] merge in the
   href, so nothing here reads or writes URLs. */
(function () {
  "use strict";

  /*
    An allowlist, deliberately. If the field ever merges a value we
    have not seen, falling through to "incomplete" shows the CTA to
    someone who may have already filled the form — annoying but
    harmless. Falling through to "complete" would hide the CTA from
    someone who has not, and we would never get their details.
  */
  var COMPLETE_VALUES = [
    "yes",
    "y",
    "1",
    "true",
    "on",
    "checked",
    "complete",
    "completed"
  ];

  /*
    An unresolved merge tag still contains its brackets, and
    Ontraport's own empty-value placeholder is "##". Either means we
    have no real answer, so treat the value as absent.
  */
  function clean(value) {
    var text = String(value == null ? "" : value).trim();

    if (!text || text.indexOf("[") !== -1 || text.indexOf("##") !== -1) {
      return "";
    }

    return text;
  }

  function isComplete(value) {
    return COMPLETE_VALUES.indexOf(clean(value).toLowerCase()) !== -1;
  }

  function readFeed(root) {
    var feed = {};

    Array.prototype.forEach.call(
      root.querySelectorAll(".lm-fj-mf"),
      function (el) {
        feed[el.getAttribute("data-mf")] = clean(el.textContent);
      }
    );

    return feed;
  }

  /*
    Incomplete copy is whatever the page was authored with; completed
    copy lives in the card's data-done-* attributes. Cache the authored
    wording on first run so the swap can go both ways and repeated runs
    stay idempotent.
  */
  function originals(card) {
    if (!card.__lmFjCopy) {
      card.__lmFjCopy = {};
    }

    return card.__lmFjCopy;
  }

  function swapText(card, selector, doneText, key) {
    var el = card.querySelector(selector);

    if (!el) {
      return;
    }

    var cache = originals(card);

    if (!(key in cache)) {
      cache[key] = el.textContent.trim();
    }

    var next = doneText || cache[key];

    if (el.textContent.trim() !== next) {
      el.textContent = next;
    }
  }

  /*
    The action element holds a label plus a decorative arrow span, so
    replace only its leading text node and leave the arrow alone.
  */
  function swapAction(card, doneText) {
    var el = card.querySelector("[data-lm-fj-info-action]");

    if (!el) {
      return;
    }

    var node = el.firstChild;

    while (node && node.nodeType !== 3) {
      node = node.nextSibling;
    }

    if (!node) {
      node = document.createTextNode("");
      el.insertBefore(node, el.firstChild);
    }

    var cache = originals(card);

    if (!("action" in cache)) {
      cache.action = node.nodeValue.trim();
    }

    var next = doneText || cache.action;

    if (node.nodeValue.trim() !== next) {
      node.nodeValue = next + " ";
    }

    el.style.removeProperty("display");
  }

  function applyState(root) {
    var card = root.querySelector("[data-lm-fj-info-card]");

    if (!card) {
      return;
    }

    var complete = isComplete(readFeed(root).infodone);

    card.classList.toggle("is-complete", complete);

    card.setAttribute(
      "data-completion-state",
      complete ? "complete" : "incomplete"
    );

    /*
      An older hosted script hid the pill outright when it saw the form
      was complete. Clear that first, in case it is still on the page.
    */
    var badge = card.querySelector("[data-lm-fj-info-badge]");

    if (badge) {
      badge.style.removeProperty("display");
    }

    /*
      The pill holds a checkmark plus a label. Swap only the label so
      the icon survives.
    */
    swapText(
      card,
      "[data-lm-fj-info-badge-label]",
      complete ? card.getAttribute("data-done-badge") : "",
      "badge"
    );

    swapText(
      card,
      "[data-lm-fj-info-tagline]",
      complete ? card.getAttribute("data-done-tagline") : "",
      "tagline"
    );

    swapText(
      card,
      "[data-lm-fj-info-title]",
      complete ? card.getAttribute("data-done-title") : "",
      "title"
    );

    swapText(
      card,
      "[data-lm-fj-info-description]",
      complete ? card.getAttribute("data-done-description") : "",
      "description"
    );

    swapAction(
      card,
      complete ? card.getAttribute("data-done-action") : ""
    );

    /*
      Nothing is left to do, so the card stops being a link. The href is
      only ever removed here, never written, which keeps this block free
      of any URL handling.
    */
    if (complete) {
      card.removeAttribute("href");
    }
  }

  function initializeInformationFormCards() {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-lm-fj-prepare]"),
      applyState
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeInformationFormCards
    );
  } else {
    initializeInformationFormCards();
  }

  window.addEventListener("load", initializeInformationFormCards);

  /*
    Ontraport injects blocks after first paint, so re-apply a few times
    while the page settles.
  */
  [200, 600, 1200, 2500, 4000].forEach(function (ms) {
    setTimeout(initializeInformationFormCards, ms);
  });
})();

(function () {
  "use strict";

  function getCurrentJourneyStep(eventTimestamp) {
    var now = new Date();

    var startOfToday = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );

    var eventDate = new Date(eventTimestamp);

    var startOfEventDay = Date.UTC(
      eventDate.getUTCFullYear(),
      eventDate.getUTCMonth(),
      eventDate.getUTCDate()
    );

    /*
      Whole calendar days between today and the event's day,
      so the step reflects the calendar-day boundary the copy
      describes (e.g. "One week before") rather than drifting
      with the event's time-of-day.
    */
    var daysRemaining = Math.round(
      (startOfEventDay - startOfToday) / 86400000
    );

    if (daysRemaining > 14) {
      return 0;
    }

    if (daysRemaining > 7) {
      return 1;
    }

    if (daysRemaining > 2) {
      return 2;
    }

    if (daysRemaining > 0) {
      return 3;
    }

    return 4;
  }


  function applyJourneyState(section) {
    var rawStart = String(
      section.getAttribute(
        "data-event-start-utc"
      ) || ""
    ).trim();

    var eventTimestamp =
      Date.parse(rawStart);

    /*
      Default to the first step when the Event timestamp
      is missing or has not resolved.
    */
    var currentStep =
      Number.isFinite(eventTimestamp)
        ? getCurrentJourneyStep(eventTimestamp)
        : 0;

    var items = section.querySelectorAll(
      "[data-lm-fj-timeline-item]"
    );

    items.forEach(function (item, index) {
      var isDone =
        index < currentStep;

      var isCurrent =
        index === currentStep;

      item.classList.toggle(
        "is-done",
        isDone
      );

      item.classList.toggle(
        "is-current",
        isCurrent
      );

      if (isCurrent) {
        item.setAttribute(
          "aria-current",
          "step"
        );
      } else {
        item.removeAttribute(
          "aria-current"
        );
      }
    });
  }


  function initializeJourneyReveal(section) {
    var timeline = section.querySelector(
      "[data-lm-fj-timeline]"
    );

    if (!timeline) {
      return;
    }

    document.documentElement.classList.add(
      "lm-fj-motion-ready"
    );

    if (
      !("IntersectionObserver" in window)
    ) {
      timeline.classList.add(
        "is-visible"
      );

      return;
    }

    var observer =
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }

            timeline.classList.add(
              "is-visible"
            );

            observer.unobserve(timeline);
          });
        },
        {
          threshold: 0.12
        }
      );

    observer.observe(timeline);
  }


  function initializeJourneySection(section) {
    if (
      section.dataset.lmFjJourneyReady ===
      "true"
    ) {
      return;
    }

    section.dataset.lmFjJourneyReady =
      "true";

    applyJourneyState(section);
    initializeJourneyReveal(section);

    /*
      Recheck periodically in case the participant leaves
      the page open while crossing a timeline threshold.
    */
    window.setInterval(
      function () {
        applyJourneyState(section);
      },
      900000
    );
  }


  function initializeJourneySections() {
    document
      .querySelectorAll(
        "[data-lm-fj-journey]"
      )
      .forEach(
        initializeJourneySection
      );
  }


  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeJourneySections
    );
  } else {
    initializeJourneySections();
  }
})();

(function () {
  "use strict";

  function setFlipState(card, isFlipped) {
    card.classList.toggle(
      "is-flipped",
      isFlipped
    );

    card.setAttribute(
      "aria-pressed",
      isFlipped ? "true" : "false"
    );
  }


  function initializeFlipCard(card) {
    if (
      card.dataset.lmFjReadyFlipReady ===
      "true"
    ) {
      return;
    }

    card.dataset.lmFjReadyFlipReady =
      "true";

    card.addEventListener(
      "click",
      function () {
        setFlipState(
          card,
          !card.classList.contains(
            "is-flipped"
          )
        );
      }
    );

    card.addEventListener(
      "keydown",
      function (event) {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();

          setFlipState(
            card,
            !card.classList.contains(
              "is-flipped"
            )
          );
        }

        if (event.key === "Escape") {
          setFlipState(card, false);
        }
      }
    );
  }


  function initializeReadyNote(section) {
    var note = section.querySelector(
      "[data-lm-fj-ready-note]"
    );

    if (!note) {
      return;
    }

    document.documentElement.classList.add(
      "lm-fj-motion-ready"
    );

    if (
      !("IntersectionObserver" in window)
    ) {
      note.classList.add("is-visible");
      return;
    }

    var observer =
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }

            note.classList.add(
              "is-visible"
            );

            observer.unobserve(note);
          });
        },
        {
          threshold: 0.12
        }
      );

    observer.observe(note);
  }


  function initializeReadySection(section) {
    if (
      section.dataset.lmFjReadyInitialized ===
      "true"
    ) {
      return;
    }

    section.dataset.lmFjReadyInitialized =
      "true";

    section
      .querySelectorAll(
        "[data-lm-fj-ready-flip]"
      )
      .forEach(initializeFlipCard);

    initializeReadyNote(section);
  }


  function initializeReadySections() {
    document
      .querySelectorAll(
        "[data-lm-fj-ready]"
      )
      .forEach(initializeReadySection);
  }


  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeReadySections
    );
  } else {
    initializeReadySections();
  }
})();

(function () {
  "use strict";

  function initializeTechSection(section) {
    if (
      !section ||
      section.dataset.lmFjTechReady === "true"
    ) {
      return;
    }

    section.dataset.lmFjTechReady = "true";

    var openButton = section.querySelector(
      "[data-lm-fj-tech-open]"
    );

    var modal = section.querySelector(
      "[data-lm-fj-tech-modal]"
    );

    var scrim = section.querySelector(
      "[data-lm-fj-tech-scrim]"
    );

    var closeButton = section.querySelector(
      "[data-lm-fj-tech-close]"
    );

    var backButton = section.querySelector(
      "[data-lm-fj-tech-back]"
    );

    var nextButton = section.querySelector(
      "[data-lm-fj-tech-next]"
    );

    var title = section.querySelector(
      "[data-lm-fj-tech-modal-title]"
    );

    var progress = section.querySelector(
      "[data-lm-fj-tech-progress]"
    );

    var startButton = section.querySelector(
      "[data-lm-fj-tech-start]"
    );

    var soundButton = section.querySelector(
      "[data-lm-fj-tech-sound]"
    );

    var video = section.querySelector(
      "[data-lm-fj-tech-video]"
    );

    var cameraNote = section.querySelector(
      "[data-lm-fj-tech-camera-note]"
    );

    var status = section.querySelector(
      "[data-lm-fj-tech-status]"
    );

    var level = section.querySelector(
      "[data-lm-fj-tech-level]"
    );

    if (
      !openButton ||
      !modal ||
      !scrim ||
      !closeButton ||
      !backButton ||
      !nextButton
    ) {
      return;
    }

    var currentStep = 1;
    var previousFocus = null;
    var mediaStream = null;
    var audioContext = null;
    var microphoneFrame = null;


    function getStep(number) {
      return section.querySelector(
        '[data-lm-fj-tech-step="' +
          number +
          '"]'
      );
    }


    function getCheckbox(number) {
      return section.querySelector(
        '[data-lm-fj-tech-check="' +
          number +
          '"]'
      );
    }


    function getFocusableElements() {
      return Array.prototype.slice.call(
        modal.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), video, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(function (element) {
        return !element.hidden &&
          element.offsetParent !== null;
      });
    }


    function stopMediaTest() {
      if (microphoneFrame) {
        window.cancelAnimationFrame(
          microphoneFrame
        );

        microphoneFrame = null;
      }

      if (mediaStream) {
        mediaStream
          .getTracks()
          .forEach(function (track) {
            track.stop();
          });

        mediaStream = null;
      }

      if (audioContext) {
        try {
          audioContext.close();
        } catch (error) {
          /* No action needed. */
        }

        audioContext = null;
      }

      if (video) {
        video.srcObject = null;
      }

      if (level) {
        level.style.width = "0%";
      }

      if (cameraNote) {
        cameraNote.hidden = false;
      }

      if (startButton) {
        startButton.disabled = false;
        startButton.textContent =
          "Start Camera & Microphone Test";
      }
    }


    function updateNextButton() {
      if (currentStep === 4) {
        nextButton.disabled = false;
        return;
      }

      var checkbox =
        getCheckbox(currentStep);

      nextButton.disabled = !(
        checkbox &&
        checkbox.checked
      );
    }


    function showStep(number) {
      currentStep = number;

      section
        .querySelectorAll(
          "[data-lm-fj-tech-step]"
        )
        .forEach(function (step) {
          var stepNumber = Number(
            step.getAttribute(
              "data-lm-fj-tech-step"
            )
          );

          var active =
            stepNumber === currentStep;

          step.hidden = !active;
          step.classList.toggle(
            "is-active",
            active
          );
        });

      section
        .querySelectorAll(
          "[data-lm-fj-tech-dot]"
        )
        .forEach(function (dot) {
          var dotNumber = Number(
            dot.getAttribute(
              "data-lm-fj-tech-dot"
            )
          );

          dot.classList.toggle(
            "is-active",
            dotNumber === currentStep
          );

          dot.classList.toggle(
            "is-complete",
            dotNumber < currentStep
          );
        });

      backButton.hidden =
        currentStep === 1 ||
        currentStep === 4;

      if (currentStep === 1) {
        title.textContent =
          "Test your camera and microphone";

        nextButton.textContent =
          "Next →";
      }

      if (currentStep === 2) {
        title.textContent =
          "Check your connection";

        nextButton.textContent =
          "Next →";
      }

      if (currentStep === 3) {
        title.textContent =
          "Join a Zoom test";

        nextButton.textContent =
          "Finish →";
      }

      if (currentStep === 4) {
        title.textContent =
          "You're all set";

        nextButton.textContent =
          "Done";

        if (progress) {
          progress.style.visibility =
            "hidden";
        }
      } else if (progress) {
        progress.style.visibility =
          "visible";
      }

      updateNextButton();

      var activeStep =
        getStep(currentStep);

      if (activeStep) {
        var firstFocusable =
          activeStep.querySelector(
            "button, a, input"
          );

        if (firstFocusable) {
          window.setTimeout(
            function () {
              firstFocusable.focus();
            },
            50
          );
        }
      }
    }


    function resetTechCheck() {
      stopMediaTest();

      section
        .querySelectorAll(
          "[data-lm-fj-tech-check]"
        )
        .forEach(function (checkbox) {
          checkbox.checked = false;
        });

      if (status) {
        status.textContent = "";
      }

      showStep(1);
    }


    function openModal() {
      previousFocus =
        document.activeElement;

      scrim.hidden = false;
      modal.hidden = false;

      document.body.style.overflow =
        "hidden";

      resetTechCheck();

      window.requestAnimationFrame(
        function () {
          closeButton.focus();
        }
      );
    }


    function closeModal() {
      stopMediaTest();

      modal.hidden = true;
      scrim.hidden = true;

      document.body.style.overflow = "";

      if (
        previousFocus &&
        typeof previousFocus.focus ===
          "function"
      ) {
        previousFocus.focus();
      }
    }


    function startMediaTest() {
      if (!status) {
        return;
      }

      if (
        !window.isSecureContext ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        status.textContent =
          "Your browser cannot run the in-page test. Continue through the steps and use Zoom's test meeting to confirm your camera and microphone.";

        return;
      }

      status.textContent =
        "Requesting access to your camera and microphone…";

      startButton.disabled = true;

      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true
        })
        .then(function (stream) {
          mediaStream = stream;

          if (video) {
            video.srcObject = stream;
          }

          if (cameraNote) {
            cameraNote.hidden = true;
          }

          status.textContent = "";

          startButton.textContent =
            "Test Running";

          try {
            var AudioContextClass =
              window.AudioContext ||
              window.webkitAudioContext;

            if (!AudioContextClass) {
              return;
            }

            audioContext =
              new AudioContextClass();

            var source =
              audioContext
                .createMediaStreamSource(
                  stream
                );

            var analyser =
              audioContext.createAnalyser();

            analyser.fftSize = 512;

            source.connect(analyser);

            var values =
              new Uint8Array(
                analyser.frequencyBinCount
              );

            function updateLevel() {
              analyser.getByteFrequencyData(
                values
              );

              var total = 0;

              for (
                var index = 0;
                index < values.length;
                index += 1
              ) {
                total += values[index];
              }

              var average =
                total / values.length;

              var percentage = Math.min(
                100,
                Math.round(
                  (average / 90) * 100
                )
              );

              if (level) {
                level.style.width =
                  percentage + "%";
              }

              microphoneFrame =
                window.requestAnimationFrame(
                  updateLevel
                );
            }

            updateLevel();
          } catch (error) {
            /*
              Camera preview still works when audio
              visualization is unavailable.
            */
          }
        })
        .catch(function (error) {
          startButton.disabled = false;
          startButton.textContent =
            "Try Camera & Microphone Again";

          if (
            error &&
            error.name === "NotAllowedError"
          ) {
            status.textContent =
              "Camera or microphone access was blocked. Allow permission in your browser settings, then try again.";
          } else if (
            error &&
            error.name === "NotFoundError"
          ) {
            status.textContent =
              "No camera or microphone was detected. Connect your device and try again.";
          } else {
            status.textContent =
              "We could not reach your camera or microphone. You can still continue and confirm everything through Zoom's test meeting.";
          }
        });
    }


    function playTestSound() {
      try {
        var AudioContextClass =
          window.AudioContext ||
          window.webkitAudioContext;

        if (!AudioContextClass) {
          return;
        }

        var soundContext =
          new AudioContextClass();

        var oscillator =
          soundContext.createOscillator();

        var gain =
          soundContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = 660;

        oscillator.connect(gain);
        gain.connect(
          soundContext.destination
        );

        gain.gain.setValueAtTime(
          0.0001,
          soundContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
          0.22,
          soundContext.currentTime + 0.05
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          soundContext.currentTime + 0.8
        );

        oscillator.start();
        oscillator.stop(
          soundContext.currentTime + 0.85
        );

        oscillator.addEventListener(
          "ended",
          function () {
            soundContext.close();
          }
        );
      } catch (error) {
        if (status) {
          status.textContent =
            "Your browser could not play the test sound. The Zoom test will also confirm your speakers.";
        }
      }
    }


    openButton.addEventListener(
      "click",
      openModal
    );

    closeButton.addEventListener(
      "click",
      closeModal
    );

    scrim.addEventListener(
      "click",
      closeModal
    );

    if (startButton) {
      startButton.addEventListener(
        "click",
        startMediaTest
      );
    }

    if (soundButton) {
      soundButton.addEventListener(
        "click",
        playTestSound
      );
    }

    section
      .querySelectorAll(
        "[data-lm-fj-tech-check]"
      )
      .forEach(function (checkbox) {
        checkbox.addEventListener(
          "change",
          updateNextButton
        );
      });

    backButton.addEventListener(
      "click",
      function () {
        if (currentStep <= 1) {
          return;
        }

        showStep(currentStep - 1);
      }
    );

    nextButton.addEventListener(
      "click",
      function () {
        if (currentStep === 4) {
          closeModal();
          return;
        }

        if (nextButton.disabled) {
          return;
        }

        if (currentStep === 1) {
          stopMediaTest();
        }

        showStep(currentStep + 1);
      }
    );

    section
      .querySelectorAll(
        "[data-lm-fj-tech-support]"
      )
      .forEach(function (link) {
        link.addEventListener(
          "click",
          function () {
            closeModal();
          }
        );
      });

    modal.addEventListener(
      "keydown",
      function (event) {
        if (event.key === "Escape") {
          event.preventDefault();
          closeModal();
          return;
        }

        if (event.key !== "Tab") {
          return;
        }

        var focusable =
          getFocusableElements();

        if (!focusable.length) {
          return;
        }

        var first = focusable[0];
        var last =
          focusable[
            focusable.length - 1
          ];

        if (
          event.shiftKey &&
          document.activeElement === first
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    );

    showStep(1);
  }


  function initializeTechSections() {
    document
      .querySelectorAll(
        "[data-lm-fj-tech]"
      )
      .forEach(
        initializeTechSection
      );
  }


  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeTechSections
    );
  } else {
    initializeTechSections();
  }
})();

(function () {
  "use strict";

  function initializeAgreementsCard(card) {
    if (
      !card ||
      card.dataset.lmFjAgreementsReady ===
        "true"
    ) {
      return;
    }

    card.dataset.lmFjAgreementsReady =
      "true";

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      card.classList.add("is-visible");
      return;
    }

    if (
      !("IntersectionObserver" in window)
    ) {
      card.classList.add("is-visible");
      return;
    }

    var observer =
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }

            card.classList.add(
              "is-visible"
            );

            observer.unobserve(card);
          });
        },
        {
          threshold: 0.12
        }
      );

    observer.observe(card);
  }


  function initializeAgreementsSection() {
    document
      .querySelectorAll(
        "[data-lm-fj-agreements]"
      )
      .forEach(
        initializeAgreementsCard
      );
  }


  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeAgreementsSection
    );
  } else {
    initializeAgreementsSection();
  }
})();
</script>