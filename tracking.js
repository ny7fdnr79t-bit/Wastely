/* Wastely conversion tracking for Google Ads.
   Uses the Google tag (AW-16825129496) already on every page.
   Paste each conversion label from Google Ads below (the part after the slash
   in send_to). Until a label is filled in, that conversion is simply skipped. */
(function () {
  var AW = 'AW-16825129496';
  var LABELS = {
    lead: '',  // "Quote form" conversion
    call: '',  // "Website phone tap" conversion
    text: ''   // "Website text tap" conversion
  };

  function send(kind, extra) {
    var label = LABELS[kind];
    if (!label || typeof window.gtag !== 'function') return;
    var params = { send_to: AW + '/' + label };
    for (var k in extra || {}) params[k] = extra[k];
    window.gtag('event', 'conversion', params);
  }

  // Phone and text taps. composedPath() also finds links inside page components.
  document.addEventListener('click', function (e) {
    var path = e.composedPath ? e.composedPath() : [e.target];
    for (var i = 0; i < path.length; i++) {
      var el = path[i];
      if (!el || el.tagName !== 'A') continue;
      var href = (el.getAttribute('href') || '').toLowerCase();
      if (href.indexOf('tel:') === 0) send('call');
      else if (href.indexOf('sms:') === 0) send('text');
      return;
    }
  }, true);

  // Quote form: count once when the thank-you page loads, but not for job applications.
  var p = location.pathname.toLowerCase();
  if (p === '/thanks' || p.indexOf('thanks.dc.html') !== -1) {
    var q = new URLSearchParams(location.search);
    if (q.get('from') !== 'careers') {
      var fire = function () {
        var key = 'ws-lead-' + (q.get('back') || '') + '-' + (history.length || 0);
        try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, '1'); } catch (err) {}
        send('lead');
      };
      if (document.readyState === 'complete') fire();
      else window.addEventListener('load', fire);
    }
  }
})();
