/* uz-or.com visit tracker.
 *
 * One request per page load, fire and forget. Sends nothing that identifies a
 * person: the session id is random and dies with the tab, and the country and
 * city are filled in by the edge, so no IP address is ever stored.
 *
 * Usage: <script src="/js/track.js" data-app="poster"></script>
 * Known app ids: site, poster, morse, pdf, whisper, converter.
 */
(function () {
  var ENDPOINT = 'https://uzor-analytics.uzorplay.workers.dev/e';
  var self = document.currentScript;
  var app = (self && self.dataset.app) || 'site';

  var host = location.hostname;
  var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '';
  // Local runs would otherwise bury real traffic under development noise.
  // Set localStorage.trackDev = '1' to record them anyway while testing.
  if (isLocal && localStorage.getItem('trackDev') !== '1') return;

  function sessionId() {
    try {
      var id = sessionStorage.getItem('uzor-sid');
      if (!id) {
        id = Math.random().toString(36).slice(2) + Date.now().toString(36);
        sessionStorage.setItem('uzor-sid', id);
      }
      return id;
    } catch (e) {
      return null;
    }
  }

  function device() {
    var w = window.innerWidth || 0;
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent) || w < 640) return 'mobile';
    if (/iPad|Tablet/i.test(navigator.userAgent) || w < 1024) return 'tablet';
    return 'desktop';
  }

  function browser() {
    var u = navigator.userAgent;
    var m =
      /Edg\/(\d+)/.exec(u) ? 'Edge ' + RegExp.$1 :
      /OPR\/(\d+)/.exec(u) ? 'Opera ' + RegExp.$1 :
      /Firefox\/(\d+)/.exec(u) ? 'Firefox ' + RegExp.$1 :
      /Chrome\/(\d+)/.exec(u) ? 'Chrome ' + RegExp.$1 :
      /Version\/(\d+).*Safari/.exec(u) ? 'Safari ' + RegExp.$1 :
      'other';
    return m;
  }

  var payload = {
    app: app,
    action: 'visit',
    session: sessionId(),
    path: location.pathname + location.search,
    ref: document.referrer || null,
    device: device(),
    browser: browser()
  };

  try {
    var blob = new Blob([JSON.stringify(payload)], { type: 'text/plain' });
    // text/plain keeps this a simple request, so no CORS preflight is needed.
    if (!navigator.sendBeacon || !navigator.sendBeacon(ENDPOINT, blob)) {
      fetch(ENDPOINT, { method: 'POST', body: JSON.stringify(payload), keepalive: true });
    }
  } catch (e) {
    /* analytics must never break the page */
  }
})();
