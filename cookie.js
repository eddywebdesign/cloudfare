/* cookie.js — Studio PAV | Cross-browser, cookie-based consent */
(function () {
  'use strict';

  var KEY = 'pav_cookie_consent';
  var EXPIRE_DAYS = 365;

  /* ── Storage: real cookie (works in all browsers incl. Safari private) ── */
  function setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var d = new Date();
      d.setTime(d.getTime() + days * 864e5);
      expires = '; expires=' + d.toUTCString();
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
  }

  function getCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') { c = c.substring(1); }
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }
    return null;
  }

  /* ── Apply consent (block Maps when rejected) ── */
  function applyConsent(choice) {
    if (choice !== 'rejected') { return; }
    document.querySelectorAll('iframe[src*="google.com/maps"]').forEach(function (f) {
      var d = document.createElement('div');
      d.style.cssText = 'background:#1a2a3a;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;height:300px;border-radius:4px;padding:20px;text-align:center';
      d.innerHTML = '<p style="color:rgba(255,255,255,.7);font-size:.85rem;font-family:DM Sans,sans-serif;line-height:1.6">Mappa non disponibile.<br><a href="https://maps.google.com/?q=Via+Bolzoni+5+Piacenza" target="_blank" rel="noopener" style="color:#5baee0">Apri in Google Maps \u2192</a></p>';
      f.parentNode.replaceChild(d, f);
    });
  }

  /* ── Show/hide banner via class (cross-browser safe) ── */
  function showBanner(banner) {
    banner.className = (banner.className + ' cookie-banner--visible').replace(/^\s+/, '');
  }

  function hideBanner(banner) {
    banner.className = banner.className.replace(/\s*cookie-banner--visible/g, '');
  }

  /* ── Init ── */
  function init() {
    /* Remove legacy #cookie-bar if present */
    var old = document.getElementById('cookie-bar');
    if (old && old.parentNode) { old.parentNode.removeChild(old); }

    var consent = getCookie(KEY);

    if (consent) {
      applyConsent(consent);
      return;
    }

    var banner = document.getElementById('cookie-banner');
    if (!banner) { return; }

    showBanner(banner);

    var btnAccept = document.getElementById('cookie-accept');
    var btnReject = document.getElementById('cookie-reject');

    function handleAccept() {
      setCookie(KEY, 'accepted', EXPIRE_DAYS);
      hideBanner(banner);
      cleanup();
    }

    function handleReject() {
      setCookie(KEY, 'rejected', EXPIRE_DAYS);
      hideBanner(banner);
      applyConsent('rejected');
      cleanup();
    }

    function cleanup() {
      if (btnAccept) { btnAccept.onclick = null; }
      if (btnReject) { btnReject.onclick = null; }
    }

    if (btnAccept) { btnAccept.onclick = handleAccept; }
    if (btnReject) { btnReject.onclick = handleReject; }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
