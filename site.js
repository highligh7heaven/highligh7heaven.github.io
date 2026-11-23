// ClipHeaven website: the settings you change are at the top.
(function () {
  // Your Google Form link (from forms.google.com → Send → link). Leave "" until you have one.
  var WAITLIST_URL = "";
  // Your contact email. Leave "" to hide the Contact link.
  var CONTACT_EMAIL = "";
  // The big headlines, shown one after another.
  var HEADLINES = [
    "Viral clips, made while you sleep.",
    "Your favourite streamers. Zero editing.",
    "20 clips a day. You just post.",
    "The best moments, already captioned.",
    "Grow a clip page from your phone."
  ];
  var SECONDS_EACH = 3.5;

  document.documentElement.classList.add("js");
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // waitlist buttons
  document.querySelectorAll(".js-waitlist").forEach(function (a) {
    if (WAITLIST_URL) { a.href = WAITLIST_URL; a.target = "_blank"; a.rel = "noopener"; }
  });
  var btn = document.getElementById("waitlist-btn"), soon = document.getElementById("waitlist-soon");
  if (!WAITLIST_URL && btn && soon) {
    btn.addEventListener("click", function (e) { e.preventDefault(); soon.hidden = false; toast("The waitlist opens in a few days ✨"); });
  }

  // contact (About page)
  if (CONTACT_EMAIL) {
    var link = document.getElementById("contact-link"), has = document.getElementById("contact-has"), none = document.getElementById("contact-none");
    if (link) { link.href = "mailto:" + CONTACT_EMAIL; link.textContent = "Email " + CONTACT_EMAIL; }
    if (has) has.hidden = false; if (none) none.hidden = true;
  }

  // a little message at the bottom of the screen
  var toastEl = document.getElementById("toast"), toastTimer;
  function toast(text) {
    if (!toastEl) return;
    toastEl.textContent = text; toastEl.hidden = false;
    toastEl.style.animation = "none"; void toastEl.offsetWidth; toastEl.style.animation = "";
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.hidden = true; }, 2600);
  }

  // menu on phones
  var menuBtn = document.getElementById("menu-btn"), menu = document.getElementById("menu");
  if (menuBtn && menu) {
    function setMenu(open) { menu.hidden = !open; menuBtn.setAttribute("aria-expanded", open ? "true" : "false"); menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu"); }
    menuBtn.addEventListener("click", function () { setMenu(menu.hidden); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
  }

  // numbers count up when they come into view
  document.querySelectorAll("[data-count]").forEach(function (el) {
    var to = +el.getAttribute("data-count"), suffix = el.getAttribute("data-suffix") || "";
    if (calm || !("IntersectionObserver" in window)) return;
    el.textContent = "0" + suffix;
    var seen = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return; seen.disconnect();
      var t0 = performance.now();
      (function step(now) { var k = Math.min(1, (now - t0) / 1200), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e) + suffix; if (k < 1) requestAnimationFrame(step); })(t0);
    });
    seen.observe(el);
  });

  // phones lean toward your mouse (desktop) and cards get a soft light where you point
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine && !calm) {
    document.querySelectorAll(".tilt").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = "perspective(900px) rotateY(" + (x * 10).toFixed(2) + "deg) rotateX(" + (-y * 10).toFixed(2) + "deg) translateY(-4px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }
  document.querySelectorAll(".spot").forEach(function (el) {
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px"); el.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  // a thin line at the top fills up as you read down the page
  var bar = document.getElementById("progress");
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // rotating headline
  var rot = document.getElementById("rotator"), i = 0;
  if (rot && HEADLINES.length > 1) {
    setInterval(function () {
      if (document.hidden) return;
      i = (i + 1) % HEADLINES.length;
      if (calm) { rot.textContent = HEADLINES[i]; return; }
      rot.classList.add("out");
      setTimeout(function () { rot.textContent = HEADLINES[i]; rot.classList.remove("out"); }, 300);
    }, SECONDS_EACH * 1000);
  }

  // ---------- Heaven: the sky rises as you scroll ----------
  var dusk = document.getElementById("sky-dusk"), dawn = document.getElementById("sky-dawn"), rays = document.getElementById("rays");
  var far = document.getElementById("clouds-far"), mid = document.getElementById("clouds-mid"), near = document.getElementById("clouds-near");
  var starsC = document.getElementById("stars"), motesC = document.getElementById("motes");
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5), W = 0, H = 0, stars = [], motes = [], progress = 0, scrollY = 0;
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function size() {
    W = window.innerWidth; H = window.innerHeight;
    [starsC, motesC].forEach(function (c) { if (!c) return; c.width = W * dpr; c.height = H * dpr; c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0); });
    var n = Math.round(W * H / 5000);
    stars = []; for (var k = 0; k < n; k++) stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + .3, t: Math.random() * 6.28, s: .5 + Math.random() * 1.5 });
    var m = Math.round(W * H / 26000);
    motes = []; for (var j = 0; j < m; j++) motes.push(newMote(true));
  }
  function newMote(anywhere) { return { x: Math.random() * W, y: anywhere ? Math.random() * H : H + 10, r: Math.random() * 2.2 + .6, v: .2 + Math.random() * .6, w: Math.random() * 6.28 }; }
  function onScroll() {
    scrollY = window.scrollY || 0;
    var max = Math.max(1, document.documentElement.scrollHeight - H);
    progress = clamp(scrollY / max);
    if (bar) bar.style.transform = "scaleX(" + progress.toFixed(4) + ")";
    if (dusk) dusk.style.opacity = clamp((progress - .12) / .35).toFixed(3);
    if (dawn) dawn.style.opacity = clamp((progress - .55) / .35).toFixed(3);
    if (rays) rays.style.opacity = (clamp((progress - .5) / .4) * .9).toFixed(3);
    // clouds rise past you at different speeds (parallax), deeper layers slower
    if (far) far.style.transform = "translate3d(0," + (-progress * 60) + "vh,0)";
    if (mid) mid.style.transform = "translate3d(0," + (-progress * 110) + "vh,0)";
    if (near) near.style.transform = "translate3d(0," + (-progress * 170) + "vh,0)";
  }
  var t0 = performance.now();
  function frame(now) {
    var t = (now - t0) / 1000;
    if (starsC) {
      var g = starsC.getContext("2d"), a = 1 - clamp(progress / .45);
      g.clearRect(0, 0, W, H);
      if (a > 0.01) {
        for (var k = 0; k < stars.length; k++) {
          var st = stars[k], tw = calm ? .8 : .55 + .45 * Math.sin(t * st.s + st.t);
          g.globalAlpha = a * tw; g.fillStyle = "#fff"; g.beginPath(); g.arc(st.x, (st.y - scrollY * .05 + H * 10) % H, st.r, 0, 6.283); g.fill();
        }
      }
    }
    if (motesC) {
      var m2 = motesC.getContext("2d"), b = clamp((progress - .3) / .4);
      m2.clearRect(0, 0, W, H);
      if (b > 0.01) {
        for (var j = 0; j < motes.length; j++) {
          var mo = motes[j];
          if (!calm) { mo.y -= mo.v; mo.x += Math.sin(t + mo.w) * .25; if (mo.y < -10) motes[j] = newMote(false); }
          var glow = m2.createRadialGradient(mo.x, mo.y, 0, mo.x, mo.y, mo.r * 4);
          glow.addColorStop(0, "rgba(255,240,200," + (.9 * b) + ")"); glow.addColorStop(1, "rgba(255,240,200,0)");
          m2.fillStyle = glow; m2.beginPath(); m2.arc(mo.x, mo.y, mo.r * 4, 0, 6.283); m2.fill();
        }
      }
    }
    if (!calm && !document.hidden) requestAnimationFrame(frame);
  }
  size(); onScroll();
  var lastW = window.innerWidth;  // phones resize the height when the address bar hides; only rebuild the sky when the width changes
  window.addEventListener("resize", function () { if (window.innerWidth !== lastW) { lastW = window.innerWidth; size(); } else { H = window.innerHeight; } onScroll(); if (calm) frame(performance.now()); });
  window.addEventListener("scroll", function () { onScroll(); if (calm) frame(performance.now()); }, { passive: true });
  document.addEventListener("visibilitychange", function () { if (!document.hidden && !calm) requestAnimationFrame(frame); });
  requestAnimationFrame(frame);

  // sections fade up as they come into view
  var items = document.querySelectorAll(".step, .feat, .plan, .shots figure, .faq details, .final, .timeline li, .hstep, .update, .rules li, .split-demo > div, .table-wrap, .contact-card");
  if ("IntersectionObserver" in window && !calm) {
    items.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }
})();
