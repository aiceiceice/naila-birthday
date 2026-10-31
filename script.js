/* =========================================================
   Birthday Website for Naila
   From Fajar ❤️
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initPetalsCanvas();
  initIntroSequence();
  initAudioPlayer();
  initCakeCandles();
  initFlipCards();
  initOpenWhenModals();
  initLightboxGallery();
  initInteractiveClickHearts();
});

/* ---------------------------------------------------------
   1. Falling Rose Petals Canvas
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
   2. Audio Synthesizer (Gentle romantic melody)
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
      if (musicText) musicText.textContent = 'Play Music';
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

  const chords = [
    [261.63, 329.63, 392.0, 493.88], // Cmaj7
    [220.0, 261.63, 329.63, 392.0],  // Am7
    [174.61, 220.0, 261.63, 329.63], // Fmaj7
    [196.0, 246.94, 293.66, 392.0]   // G
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
    gain.gain.exponentialRampToValueAtTime(0.07, audioCtx.currentTime + delay + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + duration + 0.1);
  }

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
   3. Wax Seal Envelope Intro
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

    burstHeartsConfetti(window.innerWidth / 2, window.innerHeight / 2);

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
    }, 1200);
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

    burstMassiveConfetti();

    if (wishMessage) {
      wishMessage.classList.remove('hidden');
    }

    blowBtn.innerHTML = '<span>✨ Doa Terkirim! Amiin 🤲 ✨</span>';
    blowBtn.disabled = true;
    blowBtn.style.opacity = '0.85';
    blowBtn.style.cursor = 'default';
  });
}

/* ---------------------------------------------------------
   5. Flip Cards
--------------------------------------------------------- */
function initFlipCards() {
  const cards = document.querySelectorAll('.reason-card');
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('is-flipped');
      const rect = card.getBoundingClientRect();
      burstHeartsConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
    });
  });
}

/* ---------------------------------------------------------
   6. "Buka Pas..." Modal Messages (Natural & Grounded)
--------------------------------------------------------- */
const capsuleMessages = {
  miss: {
    title: 'Pas Lagi Kangen Berat 💭',
    icon: '💭',
    text: `Kalo lagi kangen, inget ya sayang kalo aku di sini juga sama kangennya wkwk. Jarak emang ngeselin, tapi sabar dikit yaa. Nanti pas ketemu langsung, kita jalan-jalan bareng dan makan yang enak-enak sepuasnya! You're always in my thoughts.`
  },
  stress: {
    title: 'Pas Lagi Capek / Banyak Pikiran 🌿',
    icon: '🌸',
    text: `Tarik nafas pelan-pelan dulu yuk sayang. Kamu udah berusaha sebaik mungkin hari ini, jangan terlalu keras sama diri sendiri ya. Kalo butuh temen cerita atau cuma pengen ngomel-ngomel, telepon aku aja kapanpun kamu butuh.`
  },
  smile: {
    title: 'Pas Butuh Mood Booster 🥰',
    icon: '✨',
    text: `Tau ga? Senyum kamu itu manis banget tau. Kalo lagi bad mood, coba inget hal-hal lucu pas kita video call atau hal random yang pernah kita ketawain bareng. Semangat ya sayang!`
  },
  ldr: {
    title: 'Soal LDR Kita ✈️',
    icon: '✈️',
    text: `Ngejalanin LDR emang banyak tantangannya, tapi makasih ya sayang udah saling percaya dan jaga komitmen bareng aku sejauh ini. Semoga segera tiba harinya kita ga perlu pamit-pamitan lagi karena udah satu kota. I believe in us! ❤️`
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
    burstHeartsConfetti(window.innerWidth / 2, window.innerHeight / 2, 15);
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
   7. Lightbox for Photo Gallery
--------------------------------------------------------- */
function initLightboxGallery() {
  const polaroids = document.querySelectorAll('.polaroid-frame');
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  if (!lightbox) return;

  polaroids.forEach((card) => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-full-img');
      const caption = card.getAttribute('data-caption') || '';
      if (imgSrc) {
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = caption;
        lightbox.classList.remove('hidden');
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
}

/* ---------------------------------------------------------
   8. Tap Anywhere Floating Heart Sparkles
--------------------------------------------------------- */
function initInteractiveClickHearts() {
  window.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('.intro-envelope') || e.target.closest('.polaroid-frame')) return;
    spawnClickHeart(e.clientX, e.clientY);
  });
}

function spawnClickHeart(x, y) {
  const heart = document.createElement('div');
  const hearts = ['❤️', '✨', '🥰', '🌸', '💖'];
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  heart.style.position = 'fixed';
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.transform = 'translate(-50%, -50%) scale(0.6)';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '99999';
  heart.style.fontSize = '1.6rem';
  heart.style.transition = 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
  document.body.appendChild(heart);

  requestAnimationFrame(() => {
    heart.style.transform = `translate(-50%, -100px) scale(1.3)`;
    heart.style.opacity = '0';
  });

  setTimeout(() => {
    heart.remove();
  }, 900);
}

/* ---------------------------------------------------------
   9. Confetti Engine
--------------------------------------------------------- */
function burstHeartsConfetti(originX, originY, count = 30) {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#ff477e', '#ff7597', '#f7d070', '#ffe5ec', '#ffffff'];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 2.5;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 8 - 4
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
      p.vy += 0.2;
      p.vx *= 0.98;
      p.alpha -= 0.016;
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
  burstHeartsConfetti(window.innerWidth * 0.35, window.innerHeight * 0.5, 50);
  setTimeout(() => {
    burstHeartsConfetti(window.innerWidth * 0.65, window.innerHeight * 0.5, 50);
  }, 180);
  setTimeout(() => {
    burstHeartsConfetti(window.innerWidth * 0.5, window.innerHeight * 0.4, 70);
  }, 360);
}
