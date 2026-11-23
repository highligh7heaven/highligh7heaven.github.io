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
    btn.addEventListener("click", function (e) { e.preventDefault(); soon.hidden = false; });
  }

  // contact link
  var contact = document.getElementById("contact");
  if (CONTACT_EMAIL && contact) { contact.href = "mailto:" + CONTACT_EMAIL; contact.textContent = CONTACT_EMAIL; contact.hidden = false; }
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

  // sections fade up as they come into view
  var items = document.querySelectorAll(".step, .feat, .plan, .shots figure, .faq details, .final");
  if ("IntersectionObserver" in window && !calm) {
    items.forEach(function (el) { el.classList.add("reveal"); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }
})();
