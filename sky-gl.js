// ClipHeaven: a real-time sky. Night with stars at the top of the page, rising through soft lit clouds
// into a golden sunrise at the bottom. One full-screen WebGL shader, drawn at reduced resolution and
// scaled up (clouds are soft anyway), with automatic quality drop if the device struggles.
(function () {
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canvas = document.createElement("canvas");
  canvas.id = "skygl"; canvas.setAttribute("aria-hidden", "true");
  var gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
  if (!gl) return;  // no WebGL: the CSS sky stays
  var host = document.querySelector(".heaven"); if (!host) return;
  host.insertBefore(canvas, host.firstChild);
  document.documentElement.classList.add("gl");

  var VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  var FS = [
    "precision highp float;",
    "uniform vec2 R;uniform float T,P,Q,C;uniform vec2 M;",
    "float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}",
    "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
    "float fbm(vec2 p){float v=0.,a=.5;mat2 r=mat2(.8,.6,-.6,.8);for(int i=0;i<5;i++){v+=a*n(p);p=r*p*2.02+vec2(1.7,9.2);a*=.5;}return v;}",
    // one cloud layer: domain-warped fbm, shaped into puffs
    "float cloud(vec2 p,float cov){vec2 q=vec2(fbm(p+vec2(0.,T*.02)),fbm(p+vec2(5.2,1.3)));float d=fbm(p+1.6*q);return smoothstep(cov,cov+.34,d);}",
    "void main(){",
    "  vec2 uv=gl_FragCoord.xy/R;vec2 s=(gl_FragCoord.xy-.5*R)/R.y;",
    "  s+=M*.03;",                                                     // the sky leans a little with the mouse
    // sky colours: night -> dusk -> dawn as P goes 0 -> 1
    "  vec3 nightT=vec3(.02,.03,.09),nightB=vec3(.07,.06,.20);",
    "  vec3 duskT=vec3(.09,.05,.22),duskB=vec3(.42,.15,.30);",
    "  vec3 dawnT=vec3(.22,.11,.30),dawnB=vec3(.50,.25,.32);",
    "  float a=smoothstep(.08,.5,P),b=smoothstep(.5,.95,P);",
    "  vec3 top=mix(mix(nightT,duskT,a),dawnT,b),bot=mix(mix(nightB,duskB,a),dawnB,b);",
    "  vec3 col=mix(bot,top,smoothstep(-.1,1.,uv.y));",
    // the sun rises from below the bottom edge to high up as you scroll
    "  vec2 sun=vec2(.12,mix(-.85,.42,smoothstep(.25,1.,P)));",
    "  float sd=length(s-sun);",
    "  vec3 sunC=vec3(1.,.86,.62);",
    "  col+=sunC*(.55*exp(-sd*3.4)+.10*exp(-sd*1.2))*smoothstep(.2,.7,P);",
    "  col+=vec3(1.,.97,.9)*smoothstep(.07,.05,sd)*smoothstep(.45,.8,P);",
    // stars, only at night
    "  vec2 g=(gl_FragCoord.xy/R.y)*90.;vec2 gi=floor(g),gf=fract(g)-.5;float st=h(gi);",
    "  vec2 off=vec2(h(gi+3.1),h(gi+7.7))-.5;float sdist=length(gf-off*.6);",
    "  float star=step(.93,st)*smoothstep(.12,.0,sdist)*(.6+.4*sin(T*(1.+st*3.)+st*40.))*smoothstep(.45,.0,P);",
    "  col+=vec3(.9,.92,1.)*star;",
    // clouds: three layers at different depths; the camera rises through them as you scroll
    "  vec3 lit=mix(vec3(.42,.42,.58),vec3(.66,.52,.56),smoothstep(.2,.9,P));",
    "  vec3 shade=mix(vec3(.08,.08,.20),vec3(.34,.18,.30),smoothstep(.15,.9,P));",
    "  for(int L=0;L<3;L++){",
    "    float fl=float(L),sc=1.4+fl*.9,sp=(.012+fl*.008);",
    "    vec2 cp=s*sc+vec2(T*sp+fl*13.,-P*(2.2+fl*1.6)+fl*7.);",
    "    float band=smoothstep(.0,.35,uv.y+.25-fl*.12+P*.2)*smoothstep(1.3,.4,uv.y+fl*.1);",
    "    float c=cloud(cp,.46+.06*fl-C)*band;",
    "    if(c<.002)continue;",
    // light comes from the sun's side: compare density a step towards the sun = silver lining
    "    vec2 toS=normalize(sun-s+vec2(0.,.001))*.06;",
    "    float c2=cloud(cp+toS*sc,.46+.06*fl-C)*band;",
    "    float light=clamp(.55+(c-c2)*2.2,0.,1.);",
    "    float rim=pow(clamp(1.-c2*1.4,0.,1.),3.)*exp(-sd*1.2)*smoothstep(.3,.8,P);",
    "    vec3 cc=mix(shade,lit,light)+sunC*rim*.55;",
    "    float al=c*(.55+.15*fl)*Q;",
    "    col=mix(col,cc,al);",
    "  }",
    // a sea of clouds below you as you reach heaven: a dense layer whose top edge is puffy
    "  float seaTop=mix(-.9,-.08,smoothstep(.45,1.,P));",
    "  float edge=seaTop+.18*fbm(vec2(s.x*2.2+T*.01,3.))+.06*fbm(vec2(s.x*7.,T*.02));",
    "  float sea=smoothstep(edge+.02,edge-.10,s.y);",
    "  float seaLight=.62+.38*fbm(s*4.+vec2(T*.01,0.));",
    "  vec3 seaC=mix(vec3(.26,.15,.30),vec3(.56,.40,.46),seaLight);",
    "  seaC+=sunC*.22*smoothstep(edge-.05,edge+.01,s.y);",
    "  col=mix(col,seaC,sea*smoothstep(.45,.7,P));",
    // light shafts streaming down from the sun near the end
    "  float ang=atan(s.x-sun.x,s.y-sun.y);",
    "  float rays=fbm(vec2(ang*6.,T*.05))*exp(-sd*.8)*smoothstep(.5,.95,P);",
    "  col+=sunC*rays*.12;",
    // gentle vignette and grain so it never looks flat or banded
    "  col*=1.-.25*length(uv-.5);",
    "  col+=(h(gl_FragCoord.xy+T)-.5)*.015;",
    "  gl_FragColor=vec4(col,1.);",
    "}"].join("\n");

  function sh(type, src) { var x = gl.createShader(type); gl.shaderSource(x, src); gl.compileShader(x); if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x)); return x; }
  var prog;
  try { prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog)); }
  catch (e) { canvas.remove(); document.documentElement.classList.remove("gl"); return; }
  gl.useProgram(prog);
  var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var uC = gl.getUniformLocation(prog, "C"), uR = gl.getUniformLocation(prog, "R"), uT = gl.getUniformLocation(prog, "T"), uP = gl.getUniformLocation(prog, "P"), uQ = gl.getUniformLocation(prog, "Q"), uM = gl.getUniformLocation(prog, "M");

  var tAcc = 0, scale = window.innerWidth < 760 ? .45 : .55, W = 0, H = 0, mx = 0, my = 0, tmx = 0, tmy = 0, P = 0, tP = 0, t0 = performance.now(), slow = 0, fast = 0, last = 0;
  function size() { W = Math.max(2, Math.round(window.innerWidth * scale)); H = Math.max(2, Math.round(window.innerHeight * scale)); canvas.width = W; canvas.height = H; gl.viewport(0, 0, W, H); }
  function prog_() { var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); tP = Math.min(1, Math.max(0, (window.scrollY || 0) / max)); }
  window.addEventListener("resize", size); window.addEventListener("scroll", prog_, { passive: true });
  window.addEventListener("pointermove", function (e) { tmx = e.clientX / window.innerWidth - .5; tmy = .5 - e.clientY / window.innerHeight; }, { passive: true });
  size(); prog_(); P = tP;
  var running = false;
  function kick() { if (!running) { running = true; requestAnimationFrame(draw); } }
  function draw(now) {
    running = false;
    var dt = now - last; last = now;
    // keep it smooth: if frames take too long, draw fewer pixels; if there's headroom, draw more
    if (dt > 26) { slow++; fast = 0; if (slow > 20 && scale > .28) { scale -= .07; size(); slow = 0; } } else if (dt < 15) { fast++; slow = 0; if (fast > 120 && scale < .6) { scale += .05; size(); fast = 0; } }
    var root = document.documentElement, fixed = { night: .02, sunset: .55, heaven: 1 }[root.getAttribute("data-sky")];
    var target = fixed === undefined ? tP : fixed;
    P += (target - P) * (fixed === undefined ? .12 : .045); mx += (tmx - mx) * .05; my += (tmy - my) * .05;
    var still = calm || root.getAttribute("data-motion") === "calm";
    if (!still) tAcc += Math.min(dt, 50) / 1000;
    gl.uniform2f(uR, W, H); gl.uniform1f(uT, 20 + tAcc); gl.uniform1f(uP, P); gl.uniform1f(uQ, 1); gl.uniform2f(uM, mx, my);
    gl.uniform1f(uC, { few: -.08, some: 0, lots: .07 }[root.getAttribute("data-clouds")] || 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!document.hidden && (!calm || Math.abs(target - P) > .002)) kick();
  }
  window.addEventListener("ch:settings", kick);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) kick(); });
  if (calm) window.addEventListener("scroll", kick, { passive: true });
  kick();
})();
