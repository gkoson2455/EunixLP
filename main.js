(function () {
  'use strict';

  var contactEmail = 'hello@eunix.dev';

  // 1. Fill text from content.json (elements with data-cms="section.key").
  //    If the file can't be loaded, the text already written in index.html stays.
  fetch('content.json')
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (data) {
      document.querySelectorAll('[data-cms]').forEach(function (el) {
        var value = el.getAttribute('data-cms').split('.').reduce(function (o, k) {
          return o && o[k];
        }, data);
        if (typeof value === 'string' && value) el.textContent = value;
      });
      if (data.contact && data.contact.email) contactEmail = data.contact.email;
    })
    .catch(function () {});

  // 2. Contact form: opens the visitor's email app with the enquiry filled in.
  var form = document.getElementById('f');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var body = 'Name: ' + d.get('name') + '\nEmail: ' + d.get('email') +
                 '\nService: ' + d.get('type') + '\n\n' + d.get('msg');
      document.getElementById('ok').style.display = 'block';
      location.href = 'mailto:' + contactEmail +
        '?subject=' + encodeURIComponent('Project enquiry from ' + d.get('name')) +
        '&body=' + encodeURIComponent(body);
    });
  }

  // 3. Hero: drifting dot wave.
  var c = document.getElementById('wave');
  if (!c) return;
  var x = c.getContext('2d'), w, h, t = 0;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function size() {
    w = c.clientWidth; h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr;
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw() {
    x.clearRect(0, 0, w, h);
    var cols = Math.floor(w / 14), rows = 9;
    for (var r = 0; r < rows; r++) {
      for (var i = 0; i <= cols; i++) {
        var px = i * (w / cols), k = r / rows;
        var y = h * (.35 + .6 * k) + Math.sin(i * .16 + t + r * .5) * 18 * (1 - k * .4) + Math.sin(i * .05 - t * .7) * 22;
        var a = .15 + .6 * k * (.5 + .5 * Math.sin(i * .12 + t));
        x.fillStyle = 'rgba(34,199,214,' + a.toFixed(2) + ')';
        x.beginPath(); x.arc(px, y, 1 + k * 1.2, 0, 6.283); x.fill();
      }
    }
    if (!still) { t += .012; requestAnimationFrame(draw); }
  }

  size(); draw();
  window.addEventListener('resize', function () { size(); if (still) draw(); });
})();