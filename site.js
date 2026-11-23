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
    btn.addEventListener("click", function (e) { e.preventDefault(); soon.hidden = false; toast("The waitlist opens in a few days"); });
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
      setTimeout(function () { rot.textContent = HEADLINES[i]; rot.classList.remove("out"); }, 200);
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
  // one glowing dot drawn once, then stamped for every speck (much cheaper than a new gradient per speck per frame)
  var sprite = document.createElement("canvas"); sprite.width = sprite.height = 32;
  (function () { var g = sprite.getContext("2d"), gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, "rgba(255,240,200,1)"); gr.addColorStop(.35, "rgba(255,240,200,.5)"); gr.addColorStop(1, "rgba(255,240,200,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 32, 32); })();
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
    story(); gates();
  }

  // ---------- 1. the scroll story: which step the phone shows ----------
  var storyTrack = document.getElementById("story"), stage = storyTrack && storyTrack.querySelector(".story-stage");
  var ring = document.getElementById("score-ring"), scoreNum = document.getElementById("score-num"), lastStep = -1, lastScore = -1;
  function story() {
    if (!storyTrack || !stage) return;
    var r = storyTrack.getBoundingClientRect(), p = clamp(-r.top / Math.max(1, r.height - H)), f = p * 5;
    var step = Math.min(4, Math.floor(f));
    if (step !== lastStep) { stage.setAttribute("data-step", String(step)); lastStep = step; }
    stage.classList.toggle("late", step === 3 && f - 3 > .5);
    var score = step < 2 ? 0 : step > 2 ? 9 : Math.round(9 * clamp((f - 2) * 1.6));
    if (score !== lastScore && ring && scoreNum) { lastScore = score; scoreNum.textContent = score; ring.style.strokeDashoffset = (314.16 * (1 - score / 10)).toFixed(1); }
  }

  // ---------- 3. the gates of heaven open as you reach them ----------
  var gateBox = document.getElementById("gates"), gl = gateBox && gateBox.querySelector(".gate.left"), gr = gateBox && gateBox.querySelector(".gate.right"), glow = gateBox && gateBox.querySelector(".gate-light");
  function gates() {
    if (!gateBox || calm) return;
    var r = gateBox.getBoundingClientRect(), o = clamp((H * .92 - r.top) / (H * .55)), e = o * o * (3 - 2 * o);
    gl.style.transform = "rotateY(" + (-e * 108).toFixed(2) + "deg)";
    gr.style.transform = "rotateY(" + (e * 108).toFixed(2) + "deg)";
    glow.style.opacity = Math.sin(o * Math.PI).toFixed(3);
    glow.style.transform = "translate(-50%,-50%) scaleX(" + (.05 + e * 3).toFixed(3) + ")";
    gateBox.style.opacity = o > .97 ? "0" : "1";
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
      m2.clearRect(0, 0, W, H); m2.globalAlpha = 1;
      if (b > 0.01) {
        for (var j = 0; j < motes.length; j++) {
          var mo = motes[j];
          if (!calm) { mo.y -= mo.v; mo.x += Math.sin(t + mo.w) * .25; if (mo.y < -10) motes[j] = newMote(false); }
          var d = mo.r * 8; m2.globalAlpha = .9 * b; m2.drawImage(sprite, mo.x - d / 2, mo.y - d / 2, d, d);
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

  // ---------- 2. try the app: the posting flow, with three example clips ----------
  var tryApp = document.getElementById("tryapp");
  if (tryApp) {
    var CLIPS = [
      { img: "/img/demo1.jpg", title: "Did he really just clutch a 1v4?", meta: "Streamer A \u00b7 0:18 \u00b7 Today", score: 9, why: "Huge reaction right at the peak.", caption: "He really clutched a 1v4 #clips #streamerA" },
      { img: "/img/demo2.jpg", title: "Chat could not believe this ending", meta: "Streamer B \u00b7 0:21 \u00b7 Today", score: 8, why: "Chat exploded the second it happened.", caption: "Nobody saw this ending coming #clips #streamerB" },
      { img: "/img/demo3.jpg", title: "The craziest reaction of the week", meta: "Streamer C \u00b7 0:16 \u00b7 Today", score: 9, why: "Biggest sound spike of the stream.", caption: "The reaction says it all #clips #streamerC" }
    ];
    var at = 0, posted = 0, $ = function (id) { return document.getElementById(id); }, tt;
    var vid = tryApp.querySelector(".app-video");
    function appToast(text) { var t = $("try-toast"); t.textContent = text; t.hidden = false; t.style.animation = "none"; void t.offsetWidth; t.style.animation = ""; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 1400); }
    function showClip() {
      var c = CLIPS[at];
      $("try-img").src = c.img; $("try-title").textContent = c.title; $("try-meta").textContent = c.meta;
      $("try-score").textContent = c.score + "/10"; $("try-why").textContent = c.why; $("try-count").textContent = (at + 1) + " of " + CLIPS.length;
      ["try-save", "try-copy"].forEach(function (id) { var b = $(id); b.classList.remove("done"); b.textContent = id === "try-save" ? "Save video" : "Copy caption"; });
      vid.classList.remove("out", "skip");
    }
    function next(kind) {
      if (kind === "posted") posted++;
      vid.classList.add(kind === "posted" ? "out" : "skip");
      setTimeout(function () {
        at++;
        if (at >= CLIPS.length) {
          $("try-done").hidden = false;
          $("try-done-title").textContent = posted ? (posted === 1 ? "1 clip posted" : posted + " clips posted") : "All caught up";
          $("try-done-sub").textContent = posted ? "That took seconds. Now imagine 20 a day." : "Skipped clips wait for you in the app.";
          return;
        }
        showClip();
      }, calm ? 0 : 220);
    }
    $("try-save").addEventListener("click", function () { this.classList.add("done"); this.textContent = "Saved"; appToast("Saved to Photos (demo)"); });
    $("try-copy").addEventListener("click", function () {
      var b = this, text = CLIPS[at].caption;
      function ok() { b.classList.add("done"); b.textContent = "Copied"; appToast("Caption copied"); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, ok); else ok();
    });
    $("try-post").addEventListener("click", function () { appToast("Marked as posted"); next("posted"); });
    $("try-skip").addEventListener("click", function () { appToast("Skipped"); next("skip"); });
    $("try-again").addEventListener("click", function () { at = 0; posted = 0; $("try-done").hidden = true; showClip(); });
  }

})();
