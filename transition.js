(function () {
  if (window.wsSubmit) return;
  var el = null, label = null, t0 = 0, leaving = false;
  function build() {
    el = document.createElement('div');
    el.setAttribute('aria-live', 'polite');
    el.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#0E2438;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;opacity:0;pointer-events:all;font-family:Inter,system-ui,sans-serif';
    el.innerHTML = '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true"><circle cx="32" cy="32" r="29" stroke="rgba(177,205,198,0.22)" stroke-width="2"/><circle data-ring cx="32" cy="32" r="29" stroke="#B1CDC6" stroke-width="2" stroke-linecap="round" stroke-dasharray="182" stroke-dashoffset="182" transform="rotate(-90 32 32)"/><path data-tick d="M21 33l7.5 7.5L43.5 25" stroke="#FCFCED" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="36" stroke-dashoffset="36"/></svg><div data-label style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#B1CDC6">Sending your details</div>';
    document.body.appendChild(el);
    label = el.querySelector('[data-label]');
  }
  function start() {
    if (el) return;
    build(); t0 = performance.now();
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' });
    el.querySelector('svg').animate([{ transform: 'translateY(8px) scale(.94)' }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' });
    el.querySelector('[data-ring]').animate([{ strokeDashoffset: 182 }, { strokeDashoffset: 0 }], { duration: 900, delay: 150, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
  }
  function go(url) {
    if (leaving) return; leaving = true;
    if (!el) start();
    var wait = Math.max(0, 1050 - (performance.now() - t0));
    setTimeout(function () {
      label.textContent = 'Sent';
      el.querySelector('[data-tick]').animate([{ strokeDashoffset: 36 }, { strokeDashoffset: 0 }], { duration: 380, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
      setTimeout(function () { location.href = url; }, 520);
    }, wait);
  }
  window.addEventListener('pageshow', function (ev) { if (ev.persisted && el) { el.remove(); el = null; leaving = false; } });

  /* ---- Delivery: only report success when an email service confirms it. ----
     WEB3FORMS_KEY: paste the access key from web3forms.com to make it the main
     service. FormSubmit stays as the backup, so a lead is only lost if both fail. */
  var WEB3FORMS_KEY = '';
  var PHONE = '(343) 801-1914', PHONE_E164 = '+13438011914';

  function post(url, body, ms) {
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, ms);
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body), signal: ctl ? ctl.signal : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { clearTimeout(timer); return { ok: r.ok, json: j }; }); })
      .catch(function () { clearTimeout(timer); return { ok: false, json: {} }; });
  }
  function viaWeb3(d) {
    if (!WEB3FORMS_KEY) return Promise.resolve(false);
    var b = { access_key: WEB3FORMS_KEY, subject: d._subject || 'Wastely website enquiry', from_name: 'Wastely website' };
    if (d.email) b.replyto = d.email;
    for (var k in d) if (k.charAt(0) !== '_') b[k] = d[k];
    return post('https://api.web3forms.com/submit', b, 15000).then(function (r) { return r.ok && (r.json.success === true || r.json.success === 'true'); });
  }
  function viaFormSubmit(d, to) {
    return post('https://formsubmit.co/ajax/' + (to || 'go@wastely.ca'), d, 15000).then(function (r) { return r.ok && (r.json.success === true || r.json.success === 'true'); });
  }
  function send(d, to) {
    // Careers-only addresses skip Web3Forms so applications still reach the right inbox.
    var first = (!to || to === 'go@wastely.ca') ? viaWeb3(d) : Promise.resolve(false);
    return first.then(function (ok) { return ok || viaFormSubmit(d, to); });
  }
  function fail() {
    if (!el) build();
    leaving = false;
    el.style.opacity = '1';
    el.style.padding = '24px';
    el.innerHTML = '<div role="alert" style="max-width:420px;text-align:center;display:flex;flex-direction:column;gap:18px;color:#FCFCED">' +
      '<div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#B1CDC6">Not sent</div>' +
      '<div style="font-weight:800;font-size:26px;line-height:1.1;text-transform:uppercase">That didn’t go through</div>' +
      '<div style="font-size:16px;line-height:1.6;color:#AEC1CD">Your details are still on the page. Call or text us and we\u2019ll take it from there, or go back and send it again.</div>' +
      '<a href="tel:' + PHONE_E164 + '" style="display:block;padding:16px;background:#B1CDC6;color:#0E2438;font-weight:700;font-size:17px;text-decoration:none">Call ' + PHONE + '</a>' +
      '<a href="sms:' + PHONE_E164 + '" style="display:block;padding:16px;border:1px solid rgba(252,252,237,0.3);color:#FCFCED;font-weight:600;font-size:16px;text-decoration:none">Text us</a>' +
      '<button type="button" data-retry style="padding:12px;background:none;border:none;color:#B1CDC6;font:inherit;font-size:15px;text-decoration:underline;cursor:pointer">Back to the form</button></div>';
    el.querySelector('[data-retry]').addEventListener('click', function () { el.remove(); el = null; });
  }
  window.wsSubmit = { start: start, go: go, send: send, fail: fail };
})();
