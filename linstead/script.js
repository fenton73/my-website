/* =====================================================================
   LINSTEAD & CO. — preview interactions
   Vanilla JS · no dependencies · works from file:// with no server
   Handles: waitlist/notify-me capture (localStorage + console),
            product colourway switching, scroll reveal.
   ===================================================================== */
(function () {
  'use strict';

  /* ---- Footer year ---- */
  document.querySelectorAll('#yr').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Waitlist storage helpers ---- */
  var STORE_KEY = 'linstead_waitlist';

  function readList() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveEntry(entry) {
    var list = readList();
    list.push(entry);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) {}
    return list;
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  /* ---- Generic notify/waitlist form binding ---- */
  function bindForm(formId, emailId, msgId, opts) {
    var form = document.getElementById(formId);
    if (!form) return;
    var email = document.getElementById(emailId);
    var msg   = document.getElementById(msgId);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = (email.value || '').trim();

      if (!validEmail(value)) {
        msg.dataset.state = 'err';
        msg.textContent = 'Please enter a valid email address.';
        email.focus();
        return;
      }

      var colourField = form.querySelector('input[name="colour"]');
      var entry = {
        email: value,
        colour: colourField ? colourField.value : (opts && opts.colour) || 'Waitlist',
        source: opts && opts.source ? opts.source : formId,
        at: new Date().toISOString()
      };

      var list = saveEntry(entry);

      // Preview stand-in for a real backend:
      console.log('[Linstead & Co.] Waitlist sign-up captured →', entry);
      console.log('[Linstead & Co.] Total sign-ups stored locally:', list.length);

      msg.dataset.state = 'ok';
      msg.textContent = (opts && opts.okText)
        ? opts.okText
        : "You're on the list — we'll be in touch before the next drop.";

      form.reset();
      // Re-sync any colour hint after reset
      if (colourField && opts && opts.currentColour) {
        colourField.value = opts.currentColour();
      }
    });
  }

  /* ---- Homepage waitlist banner ---- */
  bindForm('waitlist-form', 'wl-email', 'wl-msg', {
    colour: 'General waitlist',
    source: 'homepage-banner',
    okText: "You're on the list. We'll email you before Drop 02 lands."
  });

  /* =====================================================================
     PRODUCT PAGE — colour switcher
     ===================================================================== */
  var swatches   = document.querySelectorAll('.swatch[data-colour]');
  var photo      = document.getElementById('pdp-photo');
  var photoLabel = document.getElementById('pdp-photo-label');
  var nameEl     = document.getElementById('colour-name');
  var hintEl     = document.getElementById('hint-colour');
  var colourField= document.getElementById('pdp-colour-field');
  var TINTS = ['ph--natural2', 'ph--loden', 'ph--charcoal'];
  var currentColourName = 'Undyed Natural';

  function setColour(btn) {
    var name = btn.getAttribute('data-name');
    var tint = btn.getAttribute('data-tint');
    currentColourName = name;

    swatches.forEach(function (s) { s.setAttribute('aria-pressed', s === btn ? 'true' : 'false'); });

    if (photo) {
      TINTS.forEach(function (t) { photo.classList.remove(t); });
      photo.classList.add(tint);
    }
    if (photoLabel) photoLabel.textContent = '[ Lookbook photo — ' + name + ' ]';
    if (nameEl)      nameEl.textContent = name;
    if (hintEl)      hintEl.textContent = name;
    if (colourField) colourField.value = name;
  }

  if (swatches.length) {
    swatches.forEach(function (btn) {
      btn.addEventListener('click', function () { setColour(btn); });
    });

    // Deep-link support: product.html?c=loden
    var params = new URLSearchParams(window.location.search);
    var c = params.get('c');
    if (c) {
      var match = document.querySelector('.swatch[data-colour="' + c + '"]');
      if (match) setColour(match);
    }
  }

  /* ---- Product notify-me form ---- */
  bindForm('pdp-form', 'pdp-email', 'pdp-msg', {
    source: 'product-page',
    currentColour: function () { return currentColourName; },
    okText: "Thank you — we'll email you the moment it's back."
  });
  // Keep the hidden colour field in sync after a reset
  var pdpForm = document.getElementById('pdp-form');
  if (pdpForm && colourField) {
    pdpForm.addEventListener('reset', function () {
      setTimeout(function () { colourField.value = currentColourName; }, 0);
    });
  }

  /* =====================================================================
     SCROLL REVEAL (respects reduced-motion via CSS)
     ===================================================================== */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

})();
