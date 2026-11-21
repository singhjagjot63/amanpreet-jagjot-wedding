// ============ ENTRY GATE ============
(function () {
  var gate = document.getElementById('entryScreen');
  if (!gate) return;
  var opened = false;

  function open() {
    if (opened) return;
    opened = true;
    gate.classList.add('closing');
    document.body.classList.remove('entry-locked');
    document.dispatchEvent(new CustomEvent('wedding:startMusic'));
    window.scrollTo(0, 0);
    setTimeout(function () { if (gate.parentNode) gate.parentNode.removeChild(gate); }, 950);
  }

  gate.addEventListener('click', open);
  gate.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
})();

// ============ COUNTDOWN ============
(function () {
  var target = new Date('2026-12-31T19:00:00').getTime();
  var els = ['cdDays', 'cdHours', 'cdMins', 'cdSecs'].map(function (id) { return document.getElementById(id); });
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) { els.forEach(function (e) { e.textContent = '00'; }); return; }
    els[0].textContent = pad(Math.floor(diff / 86400000));
    els[1].textContent = pad(Math.floor(diff / 3600000) % 24);
    els[2].textContent = pad(Math.floor(diff / 60000) % 60);
    els[3].textContent = pad(Math.floor(diff / 1000) % 60);
  }
  tick();
  setInterval(tick, 1000);
})();

// ============ NAV ============
(function () {
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () { nav.classList.toggle('scrolled', window.scrollY > 50); });
  var btn = document.getElementById('menuBtn');
  var links = document.getElementById('navLinks');
  btn.addEventListener('click', function () { links.classList.toggle('open'); });
  links.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { links.classList.remove('open'); }); });
})();

// ============ PETALS ============
(function () {
  var container = document.getElementById('petals');
  if (!container) return;
  for (var i = 0; i < 16; i++) {
    var p = document.createElement('div');
    p.className = 'petal';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (10 + Math.random() * 10) + 's';
    p.style.animationDelay = (-Math.random() * 18) + 's';
    p.style.opacity = (0.25 + Math.random() * 0.4).toString();
    p.style.transform = 'scale(' + (0.6 + Math.random() * 0.7) + ')';
    container.appendChild(p);
  }
})();

// ============ MUSIC (background track) ============
(function () {
  var btn = document.getElementById('musicToggle');
  var label = document.getElementById('musicLabel');
  var audio = document.getElementById('bgMusic');
  if (!btn || !audio) return;
  audio.volume = 0.55;

  function setUI(playing) {
    btn.classList.toggle('playing', playing);
    btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    label.textContent = playing ? 'Music Off' : 'Music On';
  }

  function play() {
    var p = audio.play();
    if (p && typeof p.catch === 'function') {
      p.then(function () { setUI(true); }).catch(function () { setUI(false); });
    } else {
      setUI(true);
    }
  }

  btn.addEventListener('click', function () {
    if (audio.paused) {
      play();
    } else {
      audio.pause();
      setUI(false);
    }
  });

  // Browsers may auto-pause audio in the background — keep the UI in sync.
  audio.addEventListener('play', function () { setUI(true); });
  audio.addEventListener('pause', function () { setUI(false); });

  // Try to start softly on first user interaction (autoplay policies).
  var started = false;
  function autoStart() {
    if (started) return;
    started = true;
    play();
    document.removeEventListener('click', autoStart);
    document.removeEventListener('touchstart', autoStart);
  }
  document.addEventListener('click', autoStart);
  document.addEventListener('touchstart', autoStart);
  document.addEventListener('wedding:startMusic', function () { if (audio.paused) play(); });
})();

// ============ INVITATION MODALS ============
(function () {
  var cards = document.querySelectorAll('.invite-card');
  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var modal = document.getElementById(card.getAttribute('data-target'));
      if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
    });
  });
  document.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', function () {
      el.closest('.modal').classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach(function (m) { m.classList.remove('open'); });
      document.body.style.overflow = '';
    }
  });
})();

// ============ SCROLL REVEAL ============
(function () {
  var targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (t) { t.classList.add('active'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('active'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });
  targets.forEach(function (t) { observer.observe(t); });
})();
