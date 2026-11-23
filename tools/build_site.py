"""Writes every page of the ClipHeaven website with the same head, sky, menu and footer."""
import os
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/'
S = os.path.dirname(os.path.abspath(__file__)) + '/'

NAV = [('/', 'Home'), ('/showcase.html', 'Showcase'), ('/pricing.html', 'Pricing'), ('/help.html', 'Help'), ('/updates.html', "What's new")]

SKY = '''<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false">
  <symbol id="gate-art" viewBox="0 0 200 400">
    <defs><linearGradient id="gold" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#FFF1C9"/><stop offset=".45" stop-color="#EBBE55"/><stop offset="1" stop-color="#A9781F"/></linearGradient></defs>
    <path d="M6 400V120C6 60 60 18 196 10V400" fill="rgba(20,16,40,.35)" stroke="url(#gold)" stroke-width="8"/>
    <g stroke="url(#gold)" stroke-width="5" fill="none">
      <path d="M40 400V96M74 400V62M108 400V40M142 400V26M176 400V14"/>
      <path d="M6 250H196M6 330H196"/>
      <path d="M40 250c0-26 34-26 34 0M108 250c0-26 34-26 34 0M74 330c0-26 34-26 34 0M142 330c0-26 34-26 34 0"/>
      <circle cx="120" cy="170" r="30"/><circle cx="120" cy="170" r="14"/>
      <path d="M120 140v-14M120 200v14M90 170H76M150 170h14"/>
    </g>
    <g fill="url(#gold)"><circle cx="40" cy="96" r="7"/><circle cx="74" cy="62" r="7"/><circle cx="108" cy="40" r="7"/><circle cx="142" cy="26" r="7"/><circle cx="176" cy="14" r="7"/></g>
  </symbol>
  <filter id="liquid" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="noise"/>
    <feGaussianBlur in="noise" stdDeviation="2" result="soft"/>
    <feDisplacementMap in="SourceGraphic" in2="soft" scale="38" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</svg>
<div class="heaven" aria-hidden="true">
  <div class="sky sky-night"></div>
  <div class="sky sky-dusk" id="sky-dusk"></div>
  <div class="sky sky-dawn" id="sky-dawn"></div>
  <canvas id="stars"></canvas>
  <div class="rays" id="rays"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
  <div class="clouds far" id="clouds-far"></div>
  <div class="clouds mid" id="clouds-mid"></div>
  <div class="clouds near" id="clouds-near"></div>
  <canvas id="motes"></canvas>
</div>
<div class="progress" id="progress" aria-hidden="true"></div>'''

LOGO = '<svg class="logo" viewBox="0 0 32 32" aria-hidden="true"><ellipse cx="16" cy="6" rx="9" ry="3" fill="none" stroke="#EBBE55" stroke-width="2.4"/><path d="M9 11.5v15.5c0 1.2 1.3 1.9 2.3 1.3l13-7.8c1-.6 1-2 0-2.6l-13-7.7c-1-.6-2.3.1-2.3 1.3z" fill="currentColor"/></svg>'


def header(active):
    links = ''.join(f'<a href="{u}"{" aria-current=\"page\"" if u == active else ""}>{t}</a>' for u, t in NAV)
    return f'''<header class="nav">
  <div class="nav-in">
    <a class="brand" href="/" aria-label="ClipHeaven home">{LOGO}ClipHeaven</a>
    <nav class="links" aria-label="Pages">{links}</nav>
    <a class="btn btn-primary btn-sm js-waitlist nav-cta" href="/#waitlist">Join the waitlist</a>
    <button class="menu-btn" id="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><span></span><span></span><span></span></button>
  </div>
  <div class="menu" id="menu" hidden>
    <nav aria-label="Menu">{links}</nav>
    <a class="btn btn-primary btn-lg js-waitlist" href="/#waitlist">Join the waitlist</a>
  </div>
</header>'''


FOOTER = '''<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand"><a class="brand small" href="/">''' + LOGO + '''ClipHeaven</a><p class="muted">Viral clips, made while you sleep.</p></div>
      <div><h4>Product</h4><a href="/showcase.html">Showcase</a><a href="/pricing.html">Pricing</a><a href="/updates.html">What's new</a></div>
      <div><h4>Help</h4><a href="/help.html">Setup guide</a><a href="/#faq">FAQ</a><a href="/about.html">About &amp; contact</a></div>
      <div><h4>Legal</h4><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/tool.html">About the tool</a></div>
    </div>
    <p class="muted copy">© <span id="year">2026</span> ClipHeaven</p>
  </div>
</footer>
<div class="toast" id="toast" role="status" aria-live="polite" hidden></div>'''


def page(file, active, title, desc, main):
    html = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#070A16">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="https://highligh7heaven.github.io/img/app-home.jpg">
<meta property="og:type" content="website">
<link rel="stylesheet" href="/site.css">
</head>
<body>
{SKY}
{header(active)}
<main>
{main}
</main>
{FOOTER}
<script src="/site.js"></script>
</body>
</html>
'''
    open(OUT + file, 'w').write(html)


def page_hero(kicker, title, lede):
    return f'''  <section class="page-hero">
    <div class="wrap">
      <p class="kicker">{kicker}</p>
      <h1>{title}</h1>
      <p class="lede">{lede}</p>
    </div>
  </section>
'''


def cta(title, text):
    return f'''  <section class="section">
    <div class="wrap">
      <div class="final">
        <div class="halo-big" aria-hidden="true"><i></i></div>
        <h2>{title}</h2>
        <p>{text}</p>
        <a class="btn btn-primary btn-lg js-waitlist" href="/#waitlist">Join the waitlist</a>
      </div>
    </div>
  </section>
'''


# ---------- Home ----------
page('index.html', '/', 'ClipHeaven: viral clips, made while you sleep',
     'ClipHeaven finds the best moments from your favourite streamers and turns them into ready-to-post vertical clips with captions. You just post.',
     open(S + 'home_main.html').read())

# ---------- Showcase ----------
showcase = page_hero('Showcase', 'See what ClipHeaven makes.', 'From a live stream to a clip that\'s ready to post, and the app you post it from.') + '''
  <section class="section tight">
    <div class="wrap">
      <h2>The look: face on top, game below.</h2>
      <div class="split-demo">
        <div class="before">
          <span class="tag">Before · the stream</span>
          <div class="frame16"><div class="game-art"></div><div class="cam-art"></div></div>
          <p>A wide stream with a small facecam in the corner. On a phone, the face is tiny and the reaction gets lost.</p>
        </div>
        <div class="arrow" aria-hidden="true">→</div>
        <div class="after">
          <span class="tag good">After · the clip</span>
          <div class="frame9"><div class="cam-top"></div><div class="line"></div><div class="game-bottom"></div><span class="quote">“no way that just happened”</span></div>
          <p>The streamer's face fills the top, the game fills the bottom, and short quotes sit on the line between. Built for TikTok, Reels and Shorts.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section tight">
    <div class="wrap">
      <h2>A day with ClipHeaven.</h2>
      <ol class="timeline">
        <li><time>7:00</time><div><h3>The morning run starts</h3><p>ClipHeaven checks your streamers for last night's biggest moments. You're asleep.</p></div></li>
        <li><time>7:15</time><div><h3>Clips land in your app</h3><p>Each one cut, captioned and scored out of 10. You get a notification.</p></div></li>
        <li><time>12:30</time><div><h3>You post at lunch</h3><p>Open Post next: save, copy caption, post, next. About 30 seconds a clip.</p></div></li>
        <li><time>18:00</time><div><h3>The evening run</h3><p>A fresh batch from the afternoon streams, ready for prime time.</p></div></li>
        <li><time>21:00</time><div><h3>Check what's working</h3><p>See which streamers and clips do best, and tune tomorrow's picks.</p></div></li>
      </ol>
    </div>
  </section>

  <section class="section tight showcase">
    <div class="wrap">
      <h2>The app.</h2>
      <div class="shots">
        <figure><div class="phone sm tilt"><img src="/img/app-home.jpg" width="585" height="1266" loading="lazy" alt="Home: clips ready to post with AI scores."></div><figcaption>Home: what's ready to post</figcaption></figure>
        <figure><div class="phone sm tilt"><img src="/img/app-clips.jpg" width="585" height="1266" loading="lazy" alt="Clips: a grid of finished clips."></div><figcaption>Clips: everything you've made</figcaption></figure>
        <figure><div class="phone sm tilt"><img src="/img/app-clip.jpg" width="585" height="1266" loading="lazy" alt="Posting: save, copy caption, mark as posted or skip."></div><figcaption>Post next: save, copy, post</figcaption></figure>
        <figure><div class="phone sm tilt"><img src="/img/app-stats.jpg" width="585" height="1266" loading="lazy" alt="Stats: clips made and per streamer."></div><figcaption>Stats: see what works</figcaption></figure>
      </div>
      <p class="fine center">Example clips shown with placeholder pictures.</p>
    </div>
  </section>
''' + cta('Want this for your clip page?', 'Join the waitlist and be first in when ClipHeaven opens.')
page('showcase.html', '/showcase.html', 'Showcase · ClipHeaven', 'See the clips ClipHeaven makes and the app you post them from.', showcase)

# ---------- Pricing ----------
pricing = page_hero('Pricing', 'Simple pricing. No editing bill.', 'One plan for everything ClipHeaven does. Pay monthly, or once for life.') + '''
  <section class="section tight">
    <div class="wrap">
      <div class="plans">
        <article class="plan spot">
          <h3>Monthly</h3>
          <p class="price"><b>$25</b><span>/ month</span></p>
          <ul><li>Unlimited streamers</li><li>Clips every day on autopilot</li><li>AI scores and captions</li><li>Facecam-on-top look</li><li>The full ClipHeaven app</li></ul>
          <a class="btn btn-ghost js-waitlist" href="/#waitlist">Join the waitlist</a>
        </article>
        <article class="plan best spot">
          <span class="badge">Best value</span>
          <h3>Lifetime</h3>
          <p class="price"><b>$199</b><span>one time</span></p>
          <ul><li>Everything in Monthly</li><li>Pay once, keep it forever</li><li>All future updates</li><li>Early access to new features</li><li>Pays for itself in 8 months</li></ul>
          <a class="btn btn-primary js-waitlist" href="/#waitlist">Join the waitlist</a>
        </article>
      </div>
    </div>
  </section>

  <section class="section tight">
    <div class="wrap">
      <h2>ClipHeaven vs editing by hand.</h2>
      <div class="table-wrap">
        <table class="compare">
          <thead><tr><th scope="col"></th><th scope="col">Editing by hand</th><th scope="col" class="us">ClipHeaven</th></tr></thead>
          <tbody>
            <tr><th scope="row">Finding the moment</th><td>Watching hours of streams</td><td class="us">Done for you, scored out of 10</td></tr>
            <tr><th scope="row">Cutting and framing</th><td>An editing app, every clip</td><td class="us">Automatic, face on top</td></tr>
            <tr><th scope="row">Captions</th><td>Typed or fixed by hand</td><td class="us">Timed to the speech, swears bleeped</td></tr>
            <tr><th scope="row">Time per clip</th><td>Often 15–30 minutes</td><td class="us">About 30 seconds to post</td></tr>
            <tr><th scope="row">Clips a day</th><td>A few, if you have time</td><td class="us">20+ while you sleep</td></tr>
          </tbody>
        </table>
      </div>
      <p class="fine">Times are typical estimates and vary by clip and person.</p>
    </div>
  </section>

  <section class="section tight">
    <div class="wrap narrow">
      <h2>Money questions.</h2>
      <div class="faq">
        <details><summary>Is there anything else to pay for?</summary><p>ClipHeaven runs on your own free Google and GitHub accounts. Making lots of clips every day can use more of GitHub's free monthly minutes than the free plan includes; the setup guide explains your options, including free ones.</p></details>
        <details><summary>Can I cancel Monthly?</summary><p>Yes, any time from your Whop account. You keep access until the end of the month you paid for.</p></details>
        <details><summary>What does "Lifetime" mean?</summary><p>You pay once and keep ClipHeaven, including future updates, for as long as ClipHeaven is around.</p></details>
        <details><summary>When can I buy?</summary><p>At launch. Join the waitlist and you'll hear first, with early-bird pricing.</p></details>
      </div>
    </div>
  </section>
''' + cta('Lock in early-bird pricing.', 'Waitlist members hear first when ClipHeaven opens.')
page('pricing.html', '/pricing.html', 'Pricing · ClipHeaven', 'ClipHeaven pricing: $25 a month or $199 lifetime.', pricing)

# ---------- Help ----------
steps = [
 ('Make your own copy', '2 min', 'Accept the GitHub invite you get after buying, then make your own copy (a "fork") of ClipHeaven with one tap and switch on its Actions.'),
 ('Add your licence key', '1 min', 'Copy the licence key from your Whop membership and save it in your copy as a secret.'),
 ('Connect Twitch', '5 min', 'Register a free app at dev.twitch.tv and save its two keys. This lets ClipHeaven find streamers\' clips.'),
 ('Connect Google Drive', '15 min', 'The fiddly one, but you only do it once: a free Google Cloud project so finished clips can save to your Drive.'),
 ('Turn on AI titles', '2 min', 'Optional but recommended: a free Gemini key so ClipHeaven can watch clips, score them and write titles.'),
 ('Check and run', '5 min', 'Run the setup check, pick your streamers in the app, then make your first test clip.'),
]
steps_html = ''.join(f'<li class="hstep spot"><span class="step-n">{i}</span><div><h3>{t} <small>{m}</small></h3><p>{d}</p></div></li>' for i, (t, m, d) in enumerate(steps, 1))
help_page = page_hero('Help', 'Set up ClipHeaven in about 30 minutes.', 'You do this once, from your phone or a computer. Every step is free, and the app checks your setup for you.') + f'''
  <section class="section tight">
    <div class="wrap">
      <div class="need">
        <h2>What you'll need</h2>
        <ul class="chips"><li>A phone or computer</li><li>A Google account</li><li>A GitHub account</li><li>A Twitch account</li><li>Your ClipHeaven licence (from Whop)</li></ul>
      </div>
      <ol class="hsteps">{steps_html}</ol>
      <p class="fine">Buyers get the full guide, with every tap written out, in their copy of ClipHeaven.</p>
    </div>
  </section>

  <section class="section tight">
    <div class="wrap narrow">
      <h2>Fixing common problems.</h2>
      <div class="faq">
        <details><summary>A run stopped with a red cross</summary><p>Open the app: failed runs show what went wrong and how to fix it, often with a one-tap fix. Most often a key was pasted with a space at the end.</p></details>
        <details><summary>No clips showed up</summary><p>Check you've picked streamers in Settings and that they streamed recently. Quiet streamers can give fewer clips; try looking back more days.</p></details>
        <details><summary>Google says "This app isn't verified"</summary><p>That's normal for your own Google Cloud project. Tap Advanced, then Go to ClipHeaven. Only you use it.</p></details>
        <details><summary>Runs stopped after a while</summary><p>GitHub's free minutes may have run out for the month. The app's Stats tab shows your minutes, when they reset and your options.</p></details>
        <details><summary>Still stuck?</summary><p>Take a screenshot of what you see and get in touch from the <a href="/about.html">contact page</a>.</p></details>
      </div>
    </div>
  </section>
''' + cta('Ready when you are.', 'Join the waitlist to get ClipHeaven at launch.')
page('help.html', '/help.html', 'Help · ClipHeaven', 'How to set up ClipHeaven, step by step, and fix common problems.', help_page)

# ---------- What's new ----------
updates = [
 ('Nov 2026', 'New look for facecam clips', 'Gameplay clips with a facecam now get the streamer\'s face on top, the game below, a thin line between and calm quote captions.', 'Clips'),
 ('Nov 2026', 'Skip button', 'The posting screen has Save and Copy side by side, with Skip right next to Mark as posted.', 'App'),
 ('Nov 2026', 'The whole stream for gameplay', 'Gameplay without a facecam now shows the whole stream edge to edge, so nobody gets cropped out.', 'Clips'),
 ('Nov 2026', 'Quicker runs', 'Smarter face checks and faster speech-to-text cut minutes off every run.', 'Speed'),
 ('Nov 2026', 'Skip weak clips', 'Choose a minimum AI score; clips under it are never edited, saving time and minutes.', 'Clips'),
 ('Nov 2026', 'Smoother app', 'A liquid tab bar, a new design system and keyboard focus rings across the app.', 'App'),
]
up_html = ''.join(f'<li class="update spot"><div class="when"><time>{d}</time><span class="label">{tag}</span></div><div><h3>{t}</h3><p>{x}</p></div></li>' for d, t, x, tag in updates)
updates_page = page_hero("What's new", 'Always getting better.', 'ClipHeaven gets new features and fixes all the time. Here\'s the latest.') + f'''
  <section class="section tight">
    <div class="wrap narrow">
      <ol class="updates">{up_html}</ol>
    </div>
  </section>
''' + cta('Get every update.', 'Lifetime members get every new feature, forever.')
page('updates.html', '/updates.html', "What's new · ClipHeaven", 'The latest ClipHeaven features and improvements.', updates_page)

# ---------- About & contact ----------
about = page_hero('About', 'Made by a clipper, for clippers.', 'ClipHeaven started as one person\'s tool for running a clip page without spending every evening editing.') + '''
  <section class="section tight">
    <div class="wrap narrow prose">
      <p>Running a clip page means watching hours of streams, finding the moment, cutting it, framing it, captioning it and posting it, again and again. ClipHeaven does everything except the posting, so you can spend your time on what grows a page: posting consistently and picking the right streamers.</p>
      <p>It's built with a few rules that won't change:</p>
      <ul class="rules">
        <li><b>You post, always.</b> ClipHeaven never posts for you, so your accounts stay within each platform's rules.</li>
        <li><b>No fake views.</b> No bots, no tricks. Just good clips.</li>
        <li><b>Credit the streamer.</b> Every clip shows where it came from.</li>
        <li><b>Your stuff is yours.</b> Clips save to your own Google Drive, and your keys stay in your own accounts.</li>
      </ul>
    </div>
  </section>

  <section class="section tight" id="contact">
    <div class="wrap narrow">
      <div class="contact-card spot">
        <h2>Get in touch</h2>
        <p class="muted" id="contact-none">A contact email is coming soon. For now, join the waitlist and we'll reach out at launch.</p>
        <p id="contact-has" hidden><a class="btn btn-ghost btn-lg" id="contact-link" href="#">Email us</a></p>
      </div>
    </div>
  </section>
''' + cta('Come along for the ride.', 'Join the waitlist to hear when ClipHeaven opens.')
page('about.html', '/about.html', 'About & contact · ClipHeaven', 'Why ClipHeaven exists, the rules it follows, and how to get in touch.', about)
print('built')
