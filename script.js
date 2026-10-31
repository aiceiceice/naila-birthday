/* =========================================================
   Romantic Birthday Experience for Naila
   Created with all the love by Muhammad Fajar Andikha
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initPetalsCanvas();
  initIntroSequence();
  initAudioPlayer();
  initCakeCandles();
  initFlipCards();
  initOpenWhenModals();
  initMessageJar();
  initInteractiveClickHearts();
});

/* ---------------------------------------------------------
   1. Falling Rose Petals & Floating Sparkles Canvas
--------------------------------------------------------- */
function initPetalsCanvas() {
  const canvas = document.getElementById('petalsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const maxPetals = window.innerWidth < 600 ? 25 : 45;

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 12 + 8;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 1.5 - 0.75;
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 2 - 1;
      this.opacity = Math.random() * 0.5 + 0.35;
      this.color = Math.random() > 0.4 ? 'rgba(255, 143, 171, ' : 'rgba(255, 182, 193, ';
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.8 + this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y > height + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
      ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < maxPetals; i++) {
    petals.push(new Petal());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ---------------------------------------------------------
   2. Dreamy Romantic Web Audio Synthesizer
--------------------------------------------------------- */
let audioCtx = null;
let isPlaying = false;
let melodyInterval = null;

function initAudioPlayer() {
  const toggleBtn = document.getElementById('musicToggleBtn');
  const musicText = toggleBtn ? toggleBtn.querySelector('.music-text') : null;

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startMelody();
      toggleBtn.classList.add('playing');
      if (musicText) musicText.textContent = 'Pause Music';
    } else {
      stopMelody();
      toggleBtn.classList.remove('playing');
      if (musicText) musicText.textContent = 'Play Romantic Melody';
    }
  });
}

function startMelody() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  isPlaying = true;

  // Romantic music chord progression: Cmaj7 - Am7 - Fmaj7 - G6
  const chords = [
    [261.63, 329.63, 392.0, 493.88], // C, E, G, B (Cmaj7)
    [220.0, 261.63, 329.63, 392.0],  // A, C, E, G (Am7)
    [174.61, 220.0, 261.63, 329.63], // F, A, C, E (Fmaj7)
    [196.0, 246.94, 293.66, 392.0]   // G, B, D, G (G)
  ];

  let chordIndex = 0;
  let noteIndex = 0;

  function playNote(freq, duration = 1.2, delay = 0) {
    if (!isPlaying || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + delay + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + duration + 0.1);
  }

  // Play gentle arpeggiated romantic chords
  melodyInterval = setInterval(() => {
    if (!isPlaying) return;
    const currentChord = chords[chordIndex];
    const freq = currentChord[noteIndex];

    playNote(freq, 1.8);

    noteIndex++;
    if (noteIndex >= currentChord.length) {
      noteIndex = 0;
      chordIndex = (chordIndex + 1) % chords.length;
    }
  }, 480);
}

function stopMelody() {
  isPlaying = false;
  if (melodyInterval) {
    clearInterval(melodyInterval);
    melodyInterval = null;
  }
}

/* ---------------------------------------------------------
   3. Wax Seal Intro & Envelope Opening Sequence
--------------------------------------------------------- */
function initIntroSequence() {
  const introOverlay = document.getElementById('introOverlay');
  const mainContent = document.getElementById('mainContent');
  const envelopeBox = document.getElementById('envelopeBox');
  const waxSeal = document.getElementById('waxSeal');
  const openSurpriseBtn = document.getElementById('openSurpriseBtn');

  function openEnvelope() {
    if (envelopeBox.classList.contains('open')) return;
    envelopeBox.classList.add('open');

    // Trigger sweet heart confetti
    burstHeartsConfetti(window.innerWidth / 2, window.innerHeight / 2);

    // Auto-start music if not playing yet
    const musicBtn = document.getElementById('musicToggleBtn');
    if (!isPlaying) {
      startMelody();
      if (musicBtn) {
        musicBtn.classList.add('playing');
        const text = musicBtn.querySelector('.music-text');
        if (text) text.textContent = 'Pause Music';
      }
    }

    setTimeout(() => {
      introOverlay.classList.add('fade-out');
      mainContent.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1300);
  }

  if (waxSeal) waxSeal.addEventListener('click', openEnvelope);
  if (openSurpriseBtn) openSurpriseBtn.addEventListener('click', openEnvelope);
  if (envelopeBox) envelopeBox.addEventListener('click', openEnvelope);
}

/* ---------------------------------------------------------
   4. Birthday Cake & Candle Ceremony
--------------------------------------------------------- */
function initCakeCandles() {
  const blowBtn = document.getElementById('blowCandlesBtn');
  const flames = [
    document.getElementById('flame1'),
    document.getElementById('flame2'),
    document.getElementById('flame3')
  ];
  const wishMessage = document.getElementById('wishMessage');

  if (!blowBtn) return;

  blowBtn.addEventListener('click', () => {
    flames.forEach((flame) => {
      if (flame) flame.classList.add('extinguished');
    });

    // Massive confetti celebration
    burstMassiveConfetti();

    if (wishMessage) {
      wishMessage.classList.remove('hidden');
    }

    blowBtn.innerHTML = '<span>✨ Wish Sent to the Stars! ✨</span>';
    blowBtn.disabled = true;
    blowBtn.style.opacity = '0.85';
    blowBtn.style.cursor = 'default';
  });
}

/* ---------------------------------------------------------
   5. Flip Cards for "Reasons Why I Adore You"
--------------------------------------------------------- */
function initFlipCards() {
  const cards = document.querySelectorAll('.reason-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
      // Spawn subtle burst around the card
      const rect = card.getBoundingClientRect();
      burstHeartsConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
    });
  });
}

/* ---------------------------------------------------------
   6. "Open When..." Love Capsule Modals
--------------------------------------------------------- */
const capsuleMessages = {
  miss: {
    title: 'When You Miss Me 💌',
    icon: '💭',
    text: `My dearest Naila, whenever you miss me, close your eyes and put your hand on your heart. Hear that steady rhythm? That is proof of how deeply and constantly you are loved. No matter the distance, time, or busy days, you are always the first thought when I wake up and the last prayer when I sleep. I am never further away than a call or a heartbeat.`
  },
  stress: {
    title: 'When You Feel Overwhelmed 🌿',
    icon: '🌸',
    text: `Take a deep breath right now, my love. Relax your shoulders. You do not have to carry everything all at once. You are doing so much better than you give yourself credit for. I believe in your strength, but remember you don’t always have to be strong alone — lean on me anytime. Everything will turn out wonderfully. I am right beside you.`
  },
  smile: {
    title: 'When You Need a Smile 🥰',
    icon: '✨',
    text: `Did you know that science says smiling makes you 100x cuter? Not that you need it, because you're already the prettiest girl in the world! Think of all our silliest inside jokes, our cozy food dates, and remember that there is someone out here completely and utterly crazy about you.`
  },
  doubt: {
    title: 'How Much Do I Love You? 💖',
    icon: '💍',
    text: `If I had a flower for every time you crossed my mind, I could walk through an eternal garden. My love for you isn't temporary or conditional — it grows deeper with every conversation, every smile, and every moment we share. You are my dream come true, Naila. Today, tomorrow, and for all our years ahead.`
  }
};

function initOpenWhenModals() {
  const modal = document.getElementById('loveModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalCloseBtn');
  const confirmBtn = document.getElementById('modalConfirmBtn');
  const modalIcon = document.getElementById('modalIcon');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');

  const capsuleBtns = document.querySelectorAll('.capsule-btn');

  function openModal(type) {
    const data = capsuleMessages[type];
    if (!data || !modal) return;

    modalIcon.textContent = data.icon;
    modalTitle.textContent = data.title;
    modalText.textContent = data.text;

    modal.classList.remove('hidden');
    burstHeartsConfetti(window.innerWidth / 2, window.innerHeight / 2, 18);
  }

  function closeModal() {
    if (modal) modal.classList.add('hidden');
  }

  capsuleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-modal');
      openModal(type);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (confirmBtn) confirmBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
}

/* ---------------------------------------------------------
   7. Interactive Message Jar
--------------------------------------------------------- */
const loveNotes = [
  "You are the best chapter in the story of my life. Happy Birthday, Naila! ❤️",
  "Every time I hear your voice, my entire day gets 1000% brighter. ✨",
  "I promise to always celebrate your victories, comfort your tears, and love you endlessly. 🌸",
  "Thank you for being the sweetest, most genuine person in my life. 🥂",
  "My favorite place in the world is simply being right next to you. 🏡",
  "Your smile is my daily dose of sunshine and happiness. ☀️",
  "May this year bring all your biggest dreams into reality. You deserve every blessing! 🌟",
  "Falling in love with you was the easiest, best thing I ever did. 💖",
  "To the girl of my dreams: Happy Birthday, beautiful! Forever yours, Fajar. 🎂"
];

function initMessageJar() {
  const drawBtn = document.getElementById('drawNoteBtn');
  const jarDisplay = document.getElementById('jarDisplay');
  if (!drawBtn || !jarDisplay) return;

  let lastIndex = -1;

  drawBtn.addEventListener('click', () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * loveNotes.length);
    } while (newIndex === lastIndex && loveNotes.length > 1);

    lastIndex = newIndex;

    jarDisplay.style.opacity = '0';
    jarDisplay.style.transform = 'translateY(10px)';

    setTimeout(() => {
      jarDisplay.textContent = `"${loveNotes[newIndex]}"`;
      jarDisplay.style.opacity = '1';
      jarDisplay.style.transform = 'translateY(0)';
    }, 250);

    const rect = drawBtn.getBoundingClientRect();
    burstHeartsConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
  });
}

/* ---------------------------------------------------------
   8. Tap Anywhere Floating Heart Sparkles
--------------------------------------------------------- */
function initInteractiveClickHearts() {
  window.addEventListener('click', (e) => {
    // Avoid double firing if clicking form buttons directly
    if (e.target.closest('button') || e.target.closest('.intro-envelope')) return;
    spawnClickHeart(e.clientX, e.clientY);
  });
}

function spawnClickHeart(x, y) {
  const heart = document.createElement('div');
  const hearts = ['❤️', '💖', '✨', '💕', '🥰', '🌸'];
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  heart.style.position = 'fixed';
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.transform = 'translate(-50%, -50%) scale(0.5)';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '99999';
  heart.style.fontSize = '1.8rem';
  heart.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
  document.body.appendChild(heart);

  requestAnimationFrame(() => {
    heart.style.transform = `translate(-50%, -120px) scale(1.4)`;
    heart.style.opacity = '0';
  });

  setTimeout(() => {
    heart.remove();
  }, 1000);
}

/* ---------------------------------------------------------
   9. High Performance Confetti Engine
--------------------------------------------------------- */
function burstHeartsConfetti(originX, originY, count = 35) {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#ff477e', '#ff7597', '#f7d070', '#ffe5ec', '#ffffff', '#a6c1ee'];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 10 - 5
    });
  }

  function frame() {
    let alive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of particles) {
      if (p.alpha <= 0) continue;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // gravity
      p.vx *= 0.98;
      p.alpha -= 0.015;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }

    if (alive) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(frame);
}

function burstMassiveConfetti() {
  burstHeartsConfetti(window.innerWidth * 0.3, window.innerHeight * 0.5, 60);
  setTimeout(() => {
    burstHeartsConfetti(window.innerWidth * 0.7, window.innerHeight * 0.5, 60);
  }, 200);
  setTimeout(() => {
    burstHeartsConfetti(window.innerWidth * 0.5, window.innerHeight * 0.4, 80);
  }, 400);
}
