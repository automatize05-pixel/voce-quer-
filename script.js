/* ==================================================
   CONFIGURAÇÕES — edita aqui
   ================================================== */
const partnerName = "Maria";
const startDate   = new Date("2024-02-14T00:00:00");

// Fotos do slideshow: [src, legenda]
const PHOTOS = [
  ["assets/couple.jpg",        "O nosso começo... 🌸"],
  ["assets/couplebeach.png",   "A nossa praia favorita 🌊"],
  ["assets/coupleshpping.png", "As nossas aventuras juntos 🛍️"],
];

// Capítulos
const CHAPTERS = [
  "Capítulo I — O Início",
  "Capítulo II — O Que Sinto",
  "Capítulo III — Para Sempre",
];

// Palavras de amor flutuantes
const LOVE_WORDS = [
  "para sempre", "te amo", "minha vida",
  "forever", "amor", "contigo", "sempre",
  "my love", "eterno", "juntos",
];

/* ==================================================
   DOM
   ================================================== */
const introSection      = document.getElementById('intro-section');
const experienceSection = document.getElementById('experience-section');
const introText1        = document.getElementById('intro-text-1');
const introText2        = document.getElementById('intro-text-2');
const btnDiscover       = document.getElementById('btn-discover');
const musicControl      = document.getElementById('music-control');
const bgMusic           = document.getElementById('bg-music');

let isMusicPlaying  = false;
let petalsInterval  = null;
let particleTimer   = null;
let currentSlide    = 0;
let slideTimer      = null;
let noEscaping      = false; // controla se o botão Não está a fugir

/* ==================================================
   INIT
   ================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initSkyCanvas();
  initParticles();
  startIntro();
});

/* ==================================================
   UTILITÁRIOS
   ================================================== */
const sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * Digita texto caractere a caractere com efeito humano.
 * @param {HTMLElement} el       Elemento alvo
 * @param {string}      text     Texto a digitar
 * @param {number}      speed    ms por caractere base (default 36)
 * @param {boolean}     cursor   Manter cursor piscante no final
 */
async function typeText(el, text, speed = 36, cursor = false) {
  el.classList.remove('hidden');
  el.innerHTML = '';
  const cur = '<span class="cursor"></span>';

  for (let i = 0; i <= text.length; i++) {
    const jitter = (Math.random() * 18) - 9;
    el.innerHTML = text.slice(0, i) + (i < text.length || cursor ? cur : '');
    await sleep(Math.max(10, speed + jitter));
  }
}

/** Mostra elemento via class CSS .visible (usa CSS transition). */
function showVisible(el, delayMs = 0) {
  el.classList.remove('hidden');
  setTimeout(() => {
    void el.offsetWidth;
    el.classList.add('visible');
  }, delayMs);
}

/* ==================================================
   ESTRELAS & SHOOTING STARS (Canvas)
   ================================================== */
function initSkyCanvas() {
  const canvas = document.getElementById('sky-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Estrelas estáticas
  const stars = Array.from({ length: 200 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.4 + 0.2,
    a: Math.random(),
    speed: 0.003 + Math.random() * 0.005,
  }));

  // Estrela cadente
  let shooting = null;
  const scheduleShoot = () => {
    const delay = 4000 + Math.random() * 8000;
    setTimeout(() => {
      shooting = {
        x: Math.random() * canvas.width * 0.6,
        y: Math.random() * canvas.height * 0.3,
        len: 0, maxLen: 120 + Math.random() * 80,
        dx: 3 + Math.random() * 2,
        dy: 1.5 + Math.random() * 1.5,
        alpha: 1,
      };
      scheduleShoot();
    }, delay);
  };
  scheduleShoot();

  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Estrelas
    stars.forEach(s => {
      s.a += s.speed;
      const opacity = 0.35 + 0.45 * Math.abs(Math.sin(s.a));
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${opacity})`;
      ctx.fill();
    });

    // Estrela cadente
    if (shooting) {
      const s = shooting;
      if (s.len < s.maxLen) {
        s.len += 6;
      } else {
        s.alpha -= 0.04;
      }
      if (s.alpha <= 0) { shooting = null; }
      else {
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.dx * (s.len / 6), s.y - s.dy * (s.len / 6));
        grad.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.dx * (s.len / 6), s.y - s.dy * (s.len / 6));
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.5;
        ctx.stroke();
        s.x += s.dx;
        s.y += s.dy;
      }
    }

    requestAnimationFrame(drawFrame);
  }
  drawFrame();
}

/* ==================================================
   PARTÍCULAS DE PÓ
   ================================================== */
function initParticles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const container = document.getElementById('particles-container');

  particleTimer = setInterval(() => {
    const p    = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 2.2 + 0.6;
    Object.assign(p.style, {
      width:     `${size}px`,
      height:    `${size}px`,
      left:      `${Math.random() * 100}vw`,
      bottom:    '-6px',
      opacity:   '0',
      boxShadow: `0 0 ${size * 3}px rgba(255,255,255,0.5)`,
    });
    container.appendChild(p);

    const dur = 8000 + Math.random() * 9000;
    p.animate([
      { transform: 'translateY(0)',      opacity: 0   },
      { opacity: 0.45, offset: 0.1 },
      { opacity: 0.35, offset: 0.85 },
      { transform: 'translateY(-106vh)', opacity: 0   },
    ], { duration: dur, easing: 'linear', fill: 'forwards' })
      .onfinish = () => p.remove();
  }, 380);
}

/* ==================================================
   PALAVRAS DE AMOR FLUTUANTES
   ================================================== */
function startLoveWords() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.getElementById('love-words-layer');

  setInterval(() => {
    const word = document.createElement('div');
    word.className   = 'love-word';
    word.textContent = LOVE_WORDS[Math.floor(Math.random() * LOVE_WORDS.length)];
    Object.assign(word.style, {
      left:     `${5 + Math.random() * 88}vw`,
      top:      `${100 + Math.random() * 20}vh`,
      fontSize: `${0.75 + Math.random() * 0.6}rem`,
      opacity:  '0',
    });
    layer.appendChild(word);

    const swing = (Math.random() - 0.5) * 10; // vw
    word.animate([
      { transform: `translate(0, 0) rotate(${(Math.random()-0.5)*6}deg)`, opacity: 0     },
      { opacity: 0.22, offset: 0.1 },
      { opacity: 0.18, offset: 0.8 },
      { transform: `translate(${swing}vw, -80vh) rotate(${(Math.random()-0.5)*8}deg)`,  opacity: 0  },
    ], { duration: 10000 + Math.random() * 8000, easing: 'ease-out', fill: 'forwards' })
      .onfinish = () => word.remove();
  }, 1400);
}

/* ==================================================
   AURORA BOREAL
   ================================================== */
function activateAurora() {
  document.getElementById('aurora-layer').classList.add('active');
}

/* ==================================================
   1. TELA INICIAL
   ================================================== */
async function startIntro() {
  await sleep(400);
  await typeText(introText1, "Antes de tudo... existe algo que eu preciso te perguntar.", 40, false);
  await sleep(1000);
  await typeText(introText2, "Você quer?", 55, false);
  await sleep(350);
  btnDiscover.classList.remove('hidden');
  btnDiscover.classList.add('fade-in');
}

/* ==================================================
   MÚSICA
   ================================================== */
btnDiscover.addEventListener('click', () => {
  bgMusic.volume = 0;
  bgMusic.play().then(() => {
    isMusicPlaying = true;
    fadeAudioIn(bgMusic, 0, 0.6, 4000); // sobe o volume suavemente em 4s
  }).catch(() => {});
  musicControl.classList.remove('hidden');

  introSection.style.transition = 'opacity 0.7s ease';
  introSection.style.opacity    = '0';
  introSection.style.pointerEvents = 'none';
  setTimeout(() => { introSection.style.display = 'none'; startExperience(); }, 700);
});

musicControl.addEventListener('click', () => {
  if (isMusicPlaying) { bgMusic.pause(); musicControl.textContent = '🔇'; }
  else                { bgMusic.play();  musicControl.textContent = '🎵'; }
  isMusicPlaying = !isMusicPlaying;
});

/** Sobe o volume de `from` para `to` em `durationMs`. */
function fadeAudioIn(audio, from, to, durationMs) {
  audio.volume = from;
  const steps    = 60;
  const stepTime = durationMs / steps;
  const delta    = (to - from) / steps;
  let step = 0;
  const t = setInterval(() => {
    step++;
    audio.volume = Math.min(to, from + delta * step);
    if (step >= steps) clearInterval(t);
  }, stepTime);
}

/* ==================================================
   2. EXPERIÊNCIA PRINCIPAL
   ================================================== */
async function startExperience() {
  experienceSection.classList.remove('hidden');
  void experienceSection.offsetWidth;
  experienceSection.classList.add('active');
  activateAurora();

  // Capítulo I antes dos objectos
  await showChapter(CHAPTERS[0]);
  await sleep(400);

  animateDress();
  await sleep(650);
  animateRing();   // dispara altar no onfinish
  await sleep(380);
  animateRose();
}

/* ==================================================
   CAPÍTULOS
   ================================================== */
async function showChapter(text) {
  const el = document.getElementById('chapter-title');
  el.textContent = text;
  el.classList.remove('hidden');
  void el.offsetWidth;
  el.classList.add('visible');
  await sleep(1800);
  el.classList.remove('visible');
  await sleep(700);
  el.classList.add('hidden');
}

/* ==================================================
   ANIMAÇÃO DOS OBJECTOS
   ================================================== */
function animateDress() {
  const dress = document.getElementById('dress');
  dress.classList.remove('hidden');
  dress.animate([
    { transform: 'translate(-50%, -130px) rotate(-12deg)', opacity: 0 },
    { transform: 'translate(-50%, 28vh)   rotate(4deg)',   opacity: 1, offset: 0.55 },
    { transform: 'translate(-50%, 62vh)   rotate(0deg)',   opacity: 0 },
  ], { duration: 1700, easing: 'cubic-bezier(0.25,0.46,0.45,0.94)', fill: 'forwards' })
    .onfinish = () => dress.classList.add('hidden');
}

function animateRing() {
  const ring = document.getElementById('ring');
  ring.classList.remove('hidden');
  ring.animate([
    { transform: 'translate(-50%, -130px) scale(0.4)', opacity: 0 },
    { transform: 'translate(-50%, 36vh)   scale(1.18)', opacity: 1, offset: 0.83 },
    { transform: 'translate(-50%, 40vh)   scale(1)',    opacity: 1, offset: 0.93 },
    { transform: 'translate(-50%, 40vh)   scale(1)',    opacity: 0 },
  ], { duration: 1550, easing: 'cubic-bezier(0.34,1.56,0.64,1)', fill: 'forwards' })
    .onfinish = () => { ring.classList.add('hidden'); createFlash(); showAltar(); };
}

function animateRose() {
  const rose = document.getElementById('rose');
  rose.classList.remove('hidden');
  rose.animate([
    { transform: 'translate(calc(-50% - 14vw), -130px) rotate(0deg)',   opacity: 0   },
    { transform: 'translate(calc(-50% - 4vw),   24vh)  rotate(155deg)', opacity: 0.9, offset: 0.58 },
    { transform: 'translate(calc(-50% + 6vw),   62vh)  rotate(300deg)', opacity: 0   },
  ], { duration: 2100, easing: 'ease-in-out', fill: 'forwards' })
    .onfinish = () => rose.classList.add('hidden');
}

/* ==================================================
   FLASH + ALTAR + VELAS
   ================================================== */
function createFlash() {
  const f = document.createElement('div');
  f.className = 'flash-effect';
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 500);
}

function showAltar() {
  const altarContainer  = document.getElementById('altar-container');
  const altarGlow       = document.querySelector('.altar-glow');
  const altarStructure  = document.querySelector('.altar-structure');

  altarContainer.classList.remove('hidden');

  requestAnimationFrame(() => {
    altarGlow.style.opacity = '1';
    altarStructure.animate([
      { transform: 'translateY(30px) scaleX(0)', opacity: 0 },
      { transform: 'translateY(0)    scaleX(1)', opacity: 1 },
    ], { duration: 1300, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'forwards' });
  });

  // Velas acendem com delay
  setTimeout(() => {
    const candles = document.getElementById('candles-container');
    candles.classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('candle-left').classList.add('lit');
      setTimeout(() => document.getElementById('candle-right').classList.add('lit'), 500);
    }, 300);
  }, 600);

  setTimeout(startPhaseTwo, 1100);
}

/* ==================================================
   FASE 2 — CONTEÚDO EMOCIONAL
   ================================================== */
async function startPhaseTwo() {
  startPetals(260);
  startLoveWords();

  const contentArea = document.getElementById('content-area');
  contentArea.classList.remove('hidden');

  // --- Cap. I: Slideshow ---
  await sleep(400);
  await showSlideshow();
  await sleep(600);

  // --- Cap. II: Texto romântico ---
  await showChapter(CHAPTERS[1]);
  await sleep(300);

  const romanticText = document.getElementById('romantic-text');
  await typeText(
    romanticText,
    "O meu mundo ficou mais bonito no dia em que te encontrei... e desde então, só cresce o que sinto por ti.",
    36, false
  );
  await sleep(500);

  const partnerNameEl = document.getElementById('partner-name');
  await typeText(partnerNameEl, `Para ${partnerName} ❤️`, 52, false);
  await sleep(500);

  startTimer();
  await sleep(1600);

  // --- Cap. III: Clímax ---
  await showChapter(CHAPTERS[2]);
  await sleep(200);

  showProposal();
}

/* ==================================================
   SLIDESHOW
   ================================================== */
async function showSlideshow() {
  const container = document.getElementById('slideshow-container');
  container.classList.remove('hidden');
  container.classList.add('fade-in');

  // Actualiza caption da primeira foto
  updateCaption(0);

  // Auto-avança de 3s em 3s
  await sleep(3000);
  nextSlide();
  await sleep(3000);
  nextSlide();
  // Mantém a 3.ª foto até avançar
  await sleep(2500);
}

function nextSlide() {
  const slides   = document.querySelectorAll('.slide');
  const dots     = document.querySelectorAll('.dot');

  slides[currentSlide].classList.remove('active-slide');
  dots[currentSlide].classList.remove('active-dot');

  currentSlide = (currentSlide + 1) % slides.length;

  slides[currentSlide].classList.add('active-slide');
  dots[currentSlide].classList.add('active-dot');
  updateCaption(currentSlide);
}

function updateCaption(idx) {
  const caption = document.getElementById('slide-caption');
  caption.style.opacity = '0';
  setTimeout(() => {
    caption.textContent = PHOTOS[idx][1];
    caption.style.opacity = '1';
  }, 400);
}

/* ==================================================
   CONTADOR
   ================================================== */
function startTimer() {
  const timerContainer = document.getElementById('timer-container');
  showVisible(timerContainer);
  updateTimer();
  setInterval(updateTimer, 1000);
}

function updateTimer() {
  const diff    = Date.now() - startDate.getTime();
  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000)  / 60000);
  const seconds = Math.floor((diff % 60000)    / 1000);
  document.getElementById('t-days').textContent    = days;
  document.getElementById('t-hours').textContent   = hours;
  document.getElementById('t-minutes').textContent = minutes;
  document.getElementById('t-seconds').textContent = seconds;
}

/* ==================================================
   PEDIDO FINAL — com pausa dramática
   ================================================== */
async function showProposal() {
  // Pausa dramática: escurece tudo
  const dark = document.getElementById('dramatic-dark');
  dark.classList.add('dark');
  await sleep(2200); // deixa escurecer

  // A proposta aparece sobre o escuro (z-index alto)
  const finalProposal = document.getElementById('final-proposal');
  await typeText(finalProposal, `${partnerName}, queres casar comigo?`, 58, true);
  await sleep(600);

  // Mostra botões
  const btns = document.getElementById('interaction-buttons');
  btns.classList.remove('hidden');
  void btns.offsetWidth;
  btns.classList.add('visible');

  setupNoButton();
  document.getElementById('btn-yes').addEventListener('click', handleYes, { once: true });
  document.getElementById('btn-yes-obvious').addEventListener('click', handleYes, { once: true });
}

/* ==================================================
   BOTÃO "NÃO" QUE FOGE
   ================================================== */
function setupNoButton() {
  const noBtn = document.getElementById('btn-no');

  // No mobile: toca para mover; desktop: hover faz fugir
  const flee = (e) => {
    if (noEscaping) return;
    e.preventDefault();

    const vw   = window.innerWidth;
    const vh   = window.innerHeight;
    const rect = noBtn.getBoundingClientRect();

    // Calcula posição oposta ao cursor/toque
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top  + rect.height / 2);
    const dist = 200;

    let nx = rect.left - dx / Math.hypot(dx, dy) * dist;
    let ny = rect.top  - dy / Math.hypot(dx, dy) * dist;

    // Mantém dentro da viewport
    nx = Math.min(Math.max(10, nx), vw - rect.width - 10);
    ny = Math.min(Math.max(10, ny), vh - rect.height - 10);

    noBtn.style.position = 'fixed';
    noBtn.style.left     = `${nx}px`;
    noBtn.style.top      = `${ny}px`;
    noBtn.style.zIndex   = '500';
    noBtn.style.transition = 'left 0.3s ease, top 0.3s ease';
  };

  noBtn.addEventListener('mousemove', flee);
  noBtn.addEventListener('touchstart', flee, { passive: false });
}

/* ==================================================
   RESPOSTA POSITIVA
   ================================================== */
async function handleYes() {
  // Levanta o escuro
  const dark = document.getElementById('dramatic-dark');
  dark.classList.remove('dark');
  dark.classList.add('lifting');

  // Esconde botões
  const btns = document.getElementById('interaction-buttons');
  btns.style.opacity       = '0';
  btns.style.pointerEvents = 'none';

  // Acelera pétalas
  startPetals(70);
  createConfetti();

  await sleep(300);

  const container = document.getElementById('final-message-container');
  container.classList.remove('hidden');
  void container.offsetWidth;
  container.classList.add('visible');

  const msg = document.getElementById('final-message');
  await typeText(msg, "Então vamos escrever o nosso para sempre... I love you ❤️", 40, false);
}

/* ==================================================
   CHUVA DE PÉTALAS
   ================================================== */
function startPetals(interval = 260) {
  if (petalsInterval) clearInterval(petalsInterval);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const container = document.getElementById('particles-container');
  const colors    = ['#ff4d6d','#ff758f','#ff8fa3','#c9184a','#d4af37','#ffb3c1','#ffd6e0'];

  petalsInterval = setInterval(() => {
    const petal     = document.createElement('div');
    petal.className = 'petal';
    const size      = 10 + Math.random() * 9;
    const color     = colors[Math.floor(Math.random() * colors.length)];
    const swing     = (Math.random() - 0.5) * 38;

    Object.assign(petal.style, {
      width:     `${size}px`,
      height:    `${size}px`,
      background: color,
      left:      `${Math.random() * 100}vw`,
      top:       `-${size + 5}px`,
      boxShadow: `0 0 7px ${color}99`,
    });
    container.appendChild(petal);

    const dur = 4200 + Math.random() * 3600;
    petal.animate([
      { transform: `translate(0, 0) rotate(0deg)`,                                             opacity: 0    },
      { opacity: 0.85, offset: 0.08 },
      { opacity: 0.7,  offset: 0.85 },
      { transform: `translate(${swing}vw, 108vh) rotate(${360 + Math.random()*360}deg)`,       opacity: 0    },
    ], { duration: dur, easing: 'ease-in', fill: 'forwards' })
      .onfinish = () => petal.remove();
  }, interval);
}

/* ==================================================
   CONFETTI
   ================================================== */
function createConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const container = document.getElementById('particles-container');
  const colors    = ['#d4af37','#ff4d6d','#ffffff','#ff758f','#a8edea','#ffd6e0'];

  for (let i = 0; i < 200; i++) {
    setTimeout(() => {
      const c     = document.createElement('div');
      c.className = 'confetti';
      c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      if (Math.random() > 0.5) c.style.borderRadius = '50%';
      if (Math.random() > 0.6) { c.style.width = '6px'; c.style.height = '14px'; }
      c.style.left = '50vw';
      c.style.top  = '50vh';
      container.appendChild(c);

      const angle = Math.random() * Math.PI * 2;
      const speed = 15 + Math.random() * 28;
      const tx = Math.cos(angle) * speed * 13;
      const ty = Math.sin(angle) * speed * 13;

      c.animate([
        { transform: `translate(0,0) scale(0) rotate(0deg)`,                                              opacity: 1 },
        { transform: `translate(${tx}px,${ty}px) scale(1) rotate(${Math.random()*720}deg)`,               opacity: 1, offset: 0.72 },
        { transform: `translate(${tx*1.3}px,${ty*1.3+320}px) scale(0) rotate(${Math.random()*1080}deg)`, opacity: 0 },
      ], { duration: 1900 + Math.random() * 900, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' })
        .onfinish = () => c.remove();
    }, Math.random() * 380);
  }
}
