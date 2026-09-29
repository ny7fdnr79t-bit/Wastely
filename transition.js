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
  window.wsSubmit = { start: start, go: go };
})();
