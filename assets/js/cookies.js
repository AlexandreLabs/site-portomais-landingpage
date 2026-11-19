/**
 * Desenvolvimento: Foco Publicidade Comunicação Digital
 * Versão: 1.0
 * Data: 08/08/2026
 * Projeto: Porto Mais — Consentimento de cookies (LGPD)
 */
(function () {
  "use strict";

  var STORAGE_KEY = "portomais_cookie_consent";
  var GTM_ID = ""; // preencher com o ID do Google Tag Manager do cliente

  var defaultPrefs = {
    necessary: true,
    analytics: false,
    marketing: false,
    updatedAt: null
  };

  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return Object.assign({}, defaultPrefs, JSON.parse(raw));
    } catch (e) {
      return null;
    }
  }

  function saveConsent(prefs) {
    var payload = {
      necessary: true,
      analytics: !!prefs.analytics,
      marketing: !!prefs.marketing,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return payload;
  }

  function loadGTM() {
    if (window.__pmGtmLoaded || !GTM_ID) return;
    window.__pmGtmLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js"
    });

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID;
    document.head.appendChild(script);
  }

  function applyConsent(prefs) {
    if (prefs && (prefs.analytics || prefs.marketing)) {
      loadGTM();
    }
  }

  function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  function hideBanner() {
    var banner = qs("#cookieConsent");
    if (!banner) return;
    banner.classList.remove("is-visible");
    window.setTimeout(function () {
      banner.hidden = true;
    }, 320);
  }

  function showBanner() {
    var banner = qs("#cookieConsent");
    if (!banner) return;
    banner.hidden = false;
    window.requestAnimationFrame(function () {
      banner.classList.add("is-visible");
    });
  }

  function openPrefs() {
    var panel = qs("#cookiePrefs");
    var banner = qs("#cookieConsent");
    if (!panel) return;
    panel.hidden = false;
    if (banner) banner.classList.add("is-prefs-open");

    var consent = readConsent() || defaultPrefs;
    var analytics = qs("#cookieAnalytics");
    var marketing = qs("#cookieMarketing");
    if (analytics) analytics.checked = !!consent.analytics;
    if (marketing) marketing.checked = !!consent.marketing;
  }

  function closePrefs() {
    var panel = qs("#cookiePrefs");
    var banner = qs("#cookieConsent");
    if (panel) panel.hidden = true;
    if (banner) banner.classList.remove("is-prefs-open");
  }

  function acceptAll() {
    var prefs = saveConsent({ analytics: true, marketing: true });
    applyConsent(prefs);
    closePrefs();
    hideBanner();
  }

  function acceptNecessary() {
    var prefs = saveConsent({ analytics: false, marketing: false });
    applyConsent(prefs);
    closePrefs();
    hideBanner();
  }

  function savePreferences() {
    var analytics = qs("#cookieAnalytics");
    var marketing = qs("#cookieMarketing");
    var prefs = saveConsent({
      analytics: analytics ? analytics.checked : false,
      marketing: marketing ? marketing.checked : false
    });
    applyConsent(prefs);
    closePrefs();
    hideBanner();
  }

  function bindEvents() {
    var acceptBtn = qs("[data-cookie-accept]");
    var necessaryBtn = qs("[data-cookie-necessary]");
    var prefsBtn = qs("[data-cookie-prefs]");
    var saveBtn = qs("[data-cookie-save]");
    var closeBtn = qs("[data-cookie-close-prefs]");
    var reopenBtns = document.querySelectorAll("[data-cookie-reopen]");

    if (acceptBtn) acceptBtn.addEventListener("click", acceptAll);
    if (necessaryBtn) necessaryBtn.addEventListener("click", acceptNecessary);
    if (prefsBtn) prefsBtn.addEventListener("click", openPrefs);
    if (saveBtn) saveBtn.addEventListener("click", savePreferences);
    if (closeBtn) closeBtn.addEventListener("click", closePrefs);

    reopenBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();

        var privacyModalEl = qs("#privacyModal");
        if (privacyModalEl && window.bootstrap) {
          var instance = bootstrap.Modal.getInstance(privacyModalEl);
          if (instance && privacyModalEl.classList.contains("show")) {
            privacyModalEl.addEventListener(
              "hidden.bs.modal",
              function onHidden() {
                privacyModalEl.removeEventListener("hidden.bs.modal", onHidden);
                showBanner();
                openPrefs();
              }
            );
            instance.hide();
            return;
          }
        }

        showBanner();
        openPrefs();
      });
    });
  }

  function openPrivacyFromHash() {
    if (location.hash !== "#politica-privacidade") return;
    var privacyModalEl = qs("#privacyModal");
    if (!privacyModalEl || !window.bootstrap) return;
    bootstrap.Modal.getOrCreateInstance(privacyModalEl).show();
  }

  function init() {
    bindEvents();
    openPrivacyFromHash();
    window.addEventListener("hashchange", openPrivacyFromHash);

    var consent = readConsent();

    if (consent) {
      applyConsent(consent);
      return;
    }

    showBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.PortoMaisCookies = {
    getConsent: readConsent,
    reopen: function () {
      showBanner();
      openPrefs();
    }
  };
})();
