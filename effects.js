
// ============================================
// FREEMAN AI-PRO — LIGHTNING FAST WOW ENGINE
// Убрано: WebGL, Parallax, 3D Tilt, Click Burst
// Оставлено: Cursor, Magnetic, Scroll Progress, Audio, Glow
// ============================================

// ===== 1. CUSTOM CURSOR WITH LIGHT TRAIL =====
class CustomCursor {
  constructor() {
    // Не создаём на мобильных и тач-устройствах
    if (window.matchMedia('(pointer: coarse)').matches) return;

    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    this.trail = [];
    this.trailLength = 5;
    this.mouse = { x: -100, y: -100 };
    this.rafId = null;

    this.init();
  }

  init() {
    this.cursor.style.cssText = `
      position: fixed;
      width: 16px;
      height: 16px;
      border: 2px solid var(--glow-color, #38bdf8);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      transition: width 0.15s, height 0.15s, border-color 0.15s, background 0.15s;
      mix-blend-mode: difference;
      will-change: transform;
    `;
    document.body.appendChild(this.cursor);

    for (let i = 0; i < this.trailLength; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail';
      dot.style.cssText = `
        position: fixed;
        width: ${6 - i}px;
        height: ${6 - i}px;
        background: var(--glow-color, #38bdf8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 99998;
        transform: translate(-50%, -50%);
        opacity: ${0.4 - i * 0.07};
        will-change: transform;
      `;
      document.body.appendChild(dot);
      this.trail.push({ el: dot, x: -100, y: -100 });
    }

    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    let ticking = false;
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          this.cursor.style.left = this.mouse.x + 'px';
          this.cursor.style.top = this.mouse.y + 'px';
          ticking = false;
        });
      }
    });

    document.querySelectorAll('a, button, .card, .pkg, .mode-tab').forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor.style.width = '40px';
        this.cursor.style.height = '40px';
        this.cursor.style.borderColor = 'var(--glow-accent, #f97316)';
        this.cursor.style.background = 'rgba(249, 115, 22, 0.08)';
      });
      el.addEventListener('mouseleave', () => {
        this.cursor.style.width = '16px';
        this.cursor.style.height = '16px';
        this.cursor.style.borderColor = 'var(--glow-color, #38bdf8)';
        this.cursor.style.background = 'transparent';
      });
    });
  }

  animate() {
    let targetX = this.mouse.x;
    let targetY = this.mouse.y;

    this.trail.forEach((item) => {
      item.x += (targetX - item.x) * 0.25;
      item.y += (targetY - item.y) * 0.25;
      item.el.style.left = item.x + 'px';
      item.el.style.top = item.y + 'px';
      targetX = item.x;
      targetY = item.y;
    });

    this.rafId = requestAnimationFrame(() => this.animate());
  }
}

// ===== 2. MAGNETIC BUTTONS (ЛЁГКАЯ ВЕРСИЯ) =====
class MagneticButtons {
  constructor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    this.buttons = document.querySelectorAll('.btn, .mode-tab');
    this.init();
  }

  init() {
    this.buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => this.onMove(e, btn));
      btn.addEventListener('mouseleave', () => this.onLeave(btn));
    });
  }

  onMove(e, btn) {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  }

  onLeave(btn) {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.3s ease';
    setTimeout(() => { btn.style.transition = ''; }, 300);
  }
}

// ===== 3. SCROLL PROGRESS BAR =====
class ScrollProgress {
  constructor() {
    this.bar = document.createElement('div');
    this.bar.className = 'scroll-progress';
    this.bar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--glow-color), var(--glow-secondary), var(--glow-accent));
      z-index: 10001;
      width: 0%;
      box-shadow: 0 0 8px var(--glow-color);
    `;
    document.body.appendChild(this.bar);

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          this.bar.style.width = (scrollTop / Math.max(docHeight, 1)) * 100 + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}

// ===== 4. AUDIO VISUALIZER (DECORATIVE ONLY) =====
class AudioReactiveEnhanced {
  constructor() {
    this.bars = document.querySelectorAll('.wave-bar');
    this.rafId = null;
    this.animate();
  }

  animate() {
    const time = Date.now() * 0.003;
    this.bars.forEach((bar, i) => {
      const height = 15 + Math.abs(Math.sin(time + i * 0.8)) * 25 + Math.sin(time * 1.5 + i * 1.2) * 10;
      bar.style.height = height + '%';
    });

    this.rafId = requestAnimationFrame(() => this.animate());
  }
}

// ===== 5. GRADIENT MESH GLOW (CSS-ONLY) =====
class GradientMeshCards {
  constructor() {
    this.cards = document.querySelectorAll('.card, .pkg');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      const mesh = document.createElement('div');
      mesh.className = 'gradient-mesh';
      card.style.position = 'relative';
      card.insertBefore(mesh, card.firstChild);
    });
  }
}

// ===== 6. SMOOTH SCROLL =====
class SmoothScroll {
  constructor() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
}

// ===== 7. INTERSECTION OBSERVER REVEAL (ОПТИМИЗИРОВАННЫЙ) =====
class RevealOnScroll {
  constructor() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  new CustomCursor();
  new MagneticButtons();
  new ScrollProgress();
  new AudioReactiveEnhanced(); // Decorative wave animation only
  new GradientMeshCards();
  new SmoothScroll();
  new RevealOnScroll();

  console.log('%c⚡ FREEMAN AI-PRO — FAST MODE ACTIVATED ⚡', 'color: var(--glow-color); font-size: 18px; font-weight: bold;');
});


// ===== ПРОЦЕДУРНЫЙ ГЕНЕРАТОР МУЗЫКИ (Web Audio API) =====
class ProceduralMusicGenerator {
  constructor() {
    this.audioContext = null;
    this.isPlaying = false;
    this.isGenerating = false;
    this.currentStyle = 'cyberpunk';
    this.currentKey = 'C';
    this.currentScale = 'minor';
    this.bpm = 128;
    this.complexity = 5;
    this.energy = 7;
    this.duration = 60;
    this.generatedBuffer = null;
    this.sourceNode = null;
    this.analyser = null;
    this.visualizerCanvas = document.getElementById('musicVisualizer');
    this.visualizerCtx = this.visualizerCanvas?.getContext('2d');
    this.animationId = null;
    this.startTime = 0;
    this.pauseTime = 0;

    // Музыкальные константы
    this.NOTE_FREQUENCIES = {
      'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
      'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
      'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
    };

    this.SCALES = {
      minor: [0, 2, 3, 5, 7, 8, 10],
      major: [0, 2, 4, 5, 7, 9, 11],
      phrygian: [0, 1, 3, 5, 7, 8, 10],
      dorian: [0, 2, 3, 5, 7, 9, 10]
    };

    this.STYLES = {
      cyberpunk: {
        bpmRange: [110, 140],
        waveforms: ['sawtooth', 'square'],
        bassWave: 'sawtooth',
        leadWave: 'sawtooth',
        padWave: 'square',
        drumPattern: 'fourOnFloor',
        arpeggioSpeed: 8,
        reverb: 0.4,
        delay: 0.3,
        filterFreq: 800,
        resonance: 10
      },
      ambient: {
        bpmRange: [60, 90],
        waveforms: ['sine', 'triangle'],
        bassWave: 'sine',
        leadWave: 'sine',
        padWave: 'triangle',
        drumPattern: 'sparse',
        arpeggioSpeed: 2,
        reverb: 0.8,
        delay: 0.6,
        filterFreq: 2000,
        resonance: 5
      },
      techno: {
        bpmRange: [125, 150],
        waveforms: ['square', 'sawtooth'],
        bassWave: 'square',
        leadWave: 'square',
        padWave: 'sawtooth',
        drumPattern: 'hardGroove',
        arpeggioSpeed: 16,
        reverb: 0.2,
        delay: 0.15,
        filterFreq: 1200,
        resonance: 15
      },
      lofi: {
        bpmRange: [70, 95],
        waveforms: ['triangle', 'sine'],
        bassWave: 'triangle',
        leadWave: 'triangle',
        padWave: 'sine',
        drumPattern: 'boomBap',
        arpeggioSpeed: 4,
        reverb: 0.5,
        delay: 0.4,
        filterFreq: 3000,
        resonance: 3
      },
      epic: {
        bpmRange: [80, 120],
        waveforms: ['sawtooth', 'square', 'sine'],
        bassWave: 'sawtooth',
        leadWave: 'square',
        padWave: 'sine',
        drumPattern: 'orchestral',
        arpeggioSpeed: 4,
        reverb: 0.7,
        delay: 0.5,
        filterFreq: 1500,
        resonance: 8
      },
      trap: {
        bpmRange: [130, 160],
        waveforms: ['sine', 'triangle', 'square'],
        bassWave: 'sine',
        leadWave: 'triangle',
        padWave: 'sine',
        drumPattern: 'trap',
        arpeggioSpeed: 8,
        reverb: 0.3,
        delay: 0.2,
        filterFreq: 600,
        resonance: 12
      }
    };

    this.PRESETS = {
      nightdrive: { style: 'cyberpunk', bpm: 120, key: 'D', scale: 'minor', complexity: 6, energy: 6 },
      focus: { style: 'ambient', bpm: 75, key: 'C', scale: 'major', complexity: 3, energy: 3 },
      workout: { style: 'techno', bpm: 140, key: 'E', scale: 'minor', complexity: 8, energy: 9 },
      meditation: { style: 'ambient', bpm: 65, key: 'A', scale: 'dorian', complexity: 2, energy: 2 },
      presentation: { style: 'epic', bpm: 100, key: 'G', scale: 'major', complexity: 5, energy: 6 },
      gaming: { style: 'cyberpunk', bpm: 135, key: 'F', scale: 'phrygian', complexity: 7, energy: 8 }
    };

    this.init();
  }

  init() {
    this.bindControls();
    this.initVisualizer();
  }

  bindControls() {
    // Стили
    document.querySelectorAll('.style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentStyle = btn.dataset.style;
        this.updateStyleDefaults();
      });
    });

    // Тональность
    document.querySelectorAll('.key-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.key-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentKey = btn.dataset.key;
      });
    });

    // Гамма
    document.querySelectorAll('.scale-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentScale = btn.dataset.scale;
      });
    });

    // Слайдеры
    const bpmSlider = document.getElementById('bpmSlider');
    const complexitySlider = document.getElementById('complexitySlider');
    const energySlider = document.getElementById('energySlider');
    const durationSlider = document.getElementById('durationSlider');

    bpmSlider?.addEventListener('input', (e) => {
      this.bpm = parseInt(e.target.value);
      document.getElementById('bpmValue').textContent = this.bpm;
    });

    complexitySlider?.addEventListener('input', (e) => {
      this.complexity = parseInt(e.target.value);
      document.getElementById('complexityValue').textContent = this.complexity;
    });

    energySlider?.addEventListener('input', (e) => {
      this.energy = parseInt(e.target.value);
      document.getElementById('energyValue').textContent = this.energy;
    });

    durationSlider?.addEventListener('input', (e) => {
      this.duration = parseInt(e.target.value);
      document.getElementById('durationValue').textContent = this.duration + 'с';
    });

    // Кнопки
    document.getElementById('generateMusicBtn')?.addEventListener('click', () => this.generate());
    document.getElementById('playPauseBtn')?.addEventListener('click', () => this.togglePlay());
    document.getElementById('downloadBtn')?.addEventListener('click', () => this.download());
    document.getElementById('randomizeBtn')?.addEventListener('click', () => this.randomize());

    // Пресеты
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const preset = this.PRESETS[chip.dataset.preset];
        if (preset) this.applyPreset(preset);
      });
    });
  }

  updateStyleDefaults() {
    const style = this.STYLES[this.currentStyle];
    if (!style) return;

    const midBpm = Math.floor((style.bpmRange[0] + style.bpmRange[1]) / 2);
    this.bpm = midBpm;
    document.getElementById('bpmSlider').value = midBpm;
    document.getElementById('bpmValue').textContent = midBpm;
  }

  applyPreset(preset) {
    // Стиль
    this.currentStyle = preset.style;
    document.querySelectorAll('.style-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.style === preset.style);
    });

    // BPM
    this.bpm = preset.bpm;
    document.getElementById('bpmSlider').value = preset.bpm;
    document.getElementById('bpmValue').textContent = preset.bpm;

    // Тональность
    this.currentKey = preset.key;
    document.querySelectorAll('.key-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.key === preset.key);
    });

    // Гамма
    this.currentScale = preset.scale;
    document.querySelectorAll('.scale-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.scale === preset.scale);
    });

    // Сложность
    this.complexity = preset.complexity;
    document.getElementById('complexitySlider').value = preset.complexity;
    document.getElementById('complexityValue').textContent = preset.complexity;

    // Энергия
    this.energy = preset.energy;
    document.getElementById('energySlider').value = preset.energy;
    document.getElementById('energyValue').textContent = preset.energy;

    showToast(`⚡ Пресет загружен: ${preset.style}, ${preset.key} ${preset.scale}, ${preset.bpm} BPM`);
  }

  randomize() {
    const styles = Object.keys(this.STYLES);
    const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const scales = ['minor', 'major', 'phrygian', 'dorian'];

    this.currentStyle = styles[Math.floor(Math.random() * styles.length)];
    this.currentKey = keys[Math.floor(Math.random() * keys.length)];
    this.currentScale = scales[Math.floor(Math.random() * scales.length)];
    this.bpm = Math.floor(Math.random() * (180 - 60) + 60);
    this.complexity = Math.floor(Math.random() * 10) + 1;
    this.energy = Math.floor(Math.random() * 10) + 1;

    // Обновить UI
    document.querySelectorAll('.style-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.style === this.currentStyle);
    });
    document.querySelectorAll('.key-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.key === this.currentKey);
    });
    document.querySelectorAll('.scale-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.scale === this.currentScale);
    });

    document.getElementById('bpmSlider').value = this.bpm;
    document.getElementById('bpmValue').textContent = this.bpm;
    document.getElementById('complexitySlider').value = this.complexity;
    document.getElementById('complexityValue').textContent = this.complexity;
    document.getElementById('energySlider').value = this.energy;
    document.getElementById('energyValue').textContent = this.energy;

    showToast(`🎲 Рандом: ${this.currentStyle}, ${this.currentKey} ${this.currentScale}, ${this.bpm} BPM`);
  }

  getAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  getNoteFrequency(noteIndex, octave = 4) {
    const baseFreq = this.NOTE_FREQUENCIES[this.currentKey];
    const scale = this.SCALES[this.currentScale];
    const semitone = scale[noteIndex % scale.length];
    const octaveOffset = Math.floor(noteIndex / scale.length);
    const totalSemitones = semitone + (octaveOffset + octave - 4) * 12;
    return baseFreq * Math.pow(2, totalSemitones / 12);
  }

  createOscillator(freq, type, startTime, duration, gain = 0.3) {
    const ctx = this.getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);

    return { osc, gainNode };
  }

  createNoiseBuffer(duration) {
    const ctx = this.getAudioContext();
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  createReverb(duration = 2.0) {
    const ctx = this.getAudioContext();
    const convolver = ctx.createConvolver();
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = ctx.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length, 2);
        channelData[i] = (Math.random() * 2 - 1) * decay * 0.5;
      }
    }

    convolver.buffer = impulse;
    return convolver;
  }

  createDelay(time = 0.3, feedback = 0.4) {
    const ctx = this.getAudioContext();
    const delayNode = ctx.createDelay();
    const feedbackNode = ctx.createGain();
    const wetNode = ctx.createGain();

    delayNode.delayTime.value = time;
    feedbackNode.gain.value = feedback;
    wetNode.gain.value = 0.3;

    delayNode.connect(feedbackNode);
    feedbackNode.connect(delayNode);
    delayNode.connect(wetNode);

    return { input: delayNode, output: wetNode };
  }

  createFilter(type = 'lowpass', freq = 1000, Q = 10) {
    const ctx = this.getAudioContext();
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = Q;
    return filter;
  }

  generateDrumPattern(ctx, startTime, beatDuration, measures, style) {
    const styleConfig = this.STYLES[style];
    const pattern = styleConfig.drumPattern;
    const drums = [];

    for (let measure = 0; measure < measures; measure++) {
      const measureStart = startTime + measure * beatDuration * 4;

      if (pattern === 'fourOnFloor') {
        // Кик на каждую четверть
        for (let i = 0; i < 4; i++) {
          drums.push({ time: measureStart + i * beatDuration, type: 'kick', vel: 0.9 });
        }
        // Хай-хэт на каждую восьмую
        for (let i = 0; i < 8; i++) {
          drums.push({ time: measureStart + i * beatDuration / 2, type: 'hihat', vel: 0.4 });
        }
        // Снейр на 2 и 4
        drums.push({ time: measureStart + beatDuration, type: 'snare', vel: 0.7 });
        drums.push({ time: measureStart + beatDuration * 3, type: 'snare', vel: 0.7 });

      } else if (pattern === 'hardGroove') {
        // Агрессивный техно
        for (let i = 0; i < 4; i++) {
          drums.push({ time: measureStart + i * beatDuration, type: 'kick', vel: 1.0 });
        }
        for (let i = 0; i < 16; i++) {
          if (i % 2 === 0) {
            drums.push({ time: measureStart + i * beatDuration / 4, type: 'hihat', vel: 0.5 });
          }
        }
        drums.push({ time: measureStart + beatDuration, type: 'snare', vel: 0.9 });
        drums.push({ time: measureStart + beatDuration * 2 + beatDuration / 2, type: 'snare', vel: 0.5 });
        drums.push({ time: measureStart + beatDuration * 3, type: 'snare', vel: 0.9 });

      } else if (pattern === 'boomBap') {
        // Lo-fi хип-хоп
        drums.push({ time: measureStart, type: 'kick', vel: 0.9 });
        drums.push({ time: measureStart + beatDuration * 1.5, type: 'kick', vel: 0.6 });
        drums.push({ time: measureStart + beatDuration, type: 'snare', vel: 0.7 });
        drums.push({ time: measureStart + beatDuration * 3, type: 'snare', vel: 0.7 });
        for (let i = 0; i < 8; i++) {
          drums.push({ time: measureStart + i * beatDuration / 2, type: 'hihat', vel: 0.3 });
        }

      } else if (pattern === 'trap') {
        // Трэп с тройками
        drums.push({ time: measureStart, type: 'kick', vel: 1.0 });
        drums.push({ time: measureStart + beatDuration * 1.5, type: 'kick', vel: 0.8 });
        drums.push({ time: measureStart + beatDuration, type: 'snare', vel: 0.9 });
        drums.push({ time: measureStart + beatDuration * 3, type: 'snare', vel: 0.9 });
        // Хай-хэт роллы
        for (let i = 0; i < 12; i++) {
          drums.push({ time: measureStart + i * beatDuration / 3, type: 'hihat', vel: 0.4 });
        }

      } else if (pattern === 'sparse') {
        // Ambient — редкие удары
        if (measure % 2 === 0) {
          drums.push({ time: measureStart, type: 'kick', vel: 0.5 });
        }
        if (measure % 4 === 2) {
          drums.push({ time: measureStart + beatDuration * 2, type: 'snare', vel: 0.4 });
        }
        for (let i = 0; i < 4; i++) {
          drums.push({ time: measureStart + i * beatDuration, type: 'hihat', vel: 0.15 });
        }

      } else if (pattern === 'orchestral') {
        // Эпический оркестровый
        if (measure % 4 === 0) {
          drums.push({ time: measureStart, type: 'kick', vel: 1.0 });
          drums.push({ time: measureStart + beatDuration / 2, type: 'kick', vel: 0.8 });
        }
        if (measure % 4 === 2) {
          drums.push({ time: measureStart + beatDuration * 2, type: 'snare', vel: 0.8 });
        }
        for (let i = 0; i < 4; i++) {
          drums.push({ time: measureStart + i * beatDuration, type: 'hihat', vel: 0.2 });
        }
      }
    }

    return drums;
  }

  generateBassLine(ctx, startTime, beatDuration, measures, style) {
    const styleConfig = this.STYLES[style];
    const bassNotes = [];
    const scale = this.SCALES[this.currentScale];
    const complexity = this.complexity;

    for (let measure = 0; measure < measures; measure++) {
      const measureStart = startTime + measure * beatDuration * 4;

      if (style === 'cyberpunk' || style === 'techno') {
        // Арпеджированный бас
        const pattern = complexity > 5 ? [0, 0, 3, 0, 5, 0, 3, 0] : [0, 0, 0, 0, 5, 0, 0, 0];
        for (let i = 0; i < 8; i++) {
          if (pattern[i] !== undefined) {
            const noteIdx = pattern[i];
            const freq = this.getNoteFrequency(noteIdx, 2);
            bassNotes.push({ time: measureStart + i * beatDuration / 2, freq, duration: beatDuration / 2, vel: 0.6 });
          }
        }
      } else if (style === 'trap') {
        // 808-style бас
        const noteIdx = measure % 4 < 2 ? 0 : 5;
        const freq = this.getNoteFrequency(noteIdx, 1);
        bassNotes.push({ time: measureStart, freq, duration: beatDuration * 2, vel: 0.8 });
        if (complexity > 5) {
          bassNotes.push({ time: measureStart + beatDuration * 2, freq: this.getNoteFrequency(3, 1), duration: beatDuration * 2, vel: 0.6 });
        }
      } else if (style === 'ambient' || style === 'lofi') {
        // Длинные ноты
        const noteIdx = measure % 2 === 0 ? 0 : 3;
        const freq = this.getNoteFrequency(noteIdx, 2);
        bassNotes.push({ time: measureStart, freq, duration: beatDuration * 4, vel: 0.4 });
      } else {
        // Стандартный бас
        const pattern = [0, 0, 3, 0, 5, 3, 0, 0];
        for (let i = 0; i < 4; i++) {
          const noteIdx = pattern[i * 2];
          const freq = this.getNoteFrequency(noteIdx, 2);
          bassNotes.push({ time: measureStart + i * beatDuration, freq, duration: beatDuration, vel: 0.5 });
        }
      }
    }

    return bassNotes;
  }

  generateLeadLine(ctx, startTime, beatDuration, measures, style) {
    const styleConfig = this.STYLES[style];
    const leadNotes = [];
    const scale = this.SCALES[this.currentScale];
    const complexity = this.complexity;
    const energy = this.energy;

    for (let measure = 0; measure < measures; measure++) {
      const measureStart = startTime + measure * beatDuration * 4;

      if (style === 'cyberpunk') {
        // Быстрые арпеджио
        const arpSpeed = styleConfig.arpeggioSpeed;
        const step = beatDuration * 4 / arpSpeed;
        for (let i = 0; i < arpSpeed; i++) {
          const noteIdx = [0, 2, 4, 7, 4, 2, 0, 2][i % 8];
          const octave = 4 + Math.floor(i / 8);
          const freq = this.getNoteFrequency(noteIdx, octave);
          leadNotes.push({ time: measureStart + i * step, freq, duration: step * 0.8, vel: 0.3 + energy * 0.03 });
        }
      } else if (style === 'techno') {
        // Агрессивный лид
        for (let i = 0; i < 4; i++) {
          const noteIdx = i % 2 === 0 ? 0 : 7;
          const freq = this.getNoteFrequency(noteIdx, 5);
          leadNotes.push({ time: measureStart + i * beatDuration, freq, duration: beatDuration, vel: 0.4 });
        }
      } else if (style === 'ambient') {
        // Пэды
        const noteIdx = measure % 4 === 0 ? 0 : measure % 4 === 2 ? 4 : 2;
        const freq = this.getNoteFrequency(noteIdx, 4);
        leadNotes.push({ time: measureStart, freq, duration: beatDuration * 4, vel: 0.25 });
      } else if (style === 'lofi') {
        // Мелодичные фразы
        const melody = [0, 2, 4, 2, 0, 3, 2, 0];
        for (let i = 0; i < 8; i++) {
          if (Math.random() < complexity / 10) {
            const freq = this.getNoteFrequency(melody[i], 4);
            leadNotes.push({ time: measureStart + i * beatDuration / 2, freq, duration: beatDuration / 2, vel: 0.3 });
          }
        }
      } else if (style === 'epic') {
        // Широкие интервалы
        const noteIdx = measure % 2 === 0 ? 0 : 4;
        const freq = this.getNoteFrequency(noteIdx, 4);
        leadNotes.push({ time: measureStart, freq, duration: beatDuration * 2, vel: 0.35 });
        if (measure % 2 === 1) {
          const freq2 = this.getNoteFrequency(7, 5);
          leadNotes.push({ time: measureStart + beatDuration * 2, freq: freq2, duration: beatDuration * 2, vel: 0.4 });
        }
      } else if (style === 'trap') {
        // Мелодичный трэп
        const melody = [0, 0, 2, 4, 4, 2, 0, 3];
        for (let i = 0; i < 8; i++) {
          const freq = this.getNoteFrequency(melody[i], 4);
          leadNotes.push({ time: measureStart + i * beatDuration / 2, freq, duration: beatDuration / 2, vel: 0.35 });
        }
      }
    }

    return leadNotes;
  }

  generatePadLine(ctx, startTime, beatDuration, measures, style) {
    const padNotes = [];

    for (let measure = 0; measure < measures; measure++) {
      const measureStart = startTime + measure * beatDuration * 4;

      if (style === 'cyberpunk' || style === 'techno') {
        // Короткие пэды
        const chord = [0, 3, 5];
        chord.forEach((noteIdx, i) => {
          const freq = this.getNoteFrequency(noteIdx, 4);
          padNotes.push({ time: measureStart, freq, duration: beatDuration * 2, vel: 0.15 });
        });
      } else if (style === 'ambient' || style === 'epic') {
        // Длинные пэды
        const chord = measure % 4 === 0 ? [0, 4, 7] : measure % 4 === 2 ? [3, 7, 10] : [0, 4, 7];
        chord.forEach(noteIdx => {
          const freq = this.getNoteFrequency(noteIdx, 3);
          padNotes.push({ time: measureStart, freq, duration: beatDuration * 4, vel: 0.2 });
        });
      } else {
        // Стандартные пэды
        const chord = [0, 2, 4];
        chord.forEach(noteIdx => {
          const freq = this.getNoteFrequency(noteIdx, 3);
          padNotes.push({ time: measureStart, freq, duration: beatDuration * 2, vel: 0.15 });
        });
      }
    }

    return padNotes;
  }

  async generate() {
    if (this.isGenerating) return;
    this.isGenerating = true;

    const btn = document.getElementById('generateMusicBtn');
    const btnText = document.getElementById('genBtnText');
    const spinner = document.getElementById('genBtnSpinner');

    btn.disabled = true;
    btnText.textContent = '🔮 Генерация...';
    spinner.style.display = 'inline-block';

    document.getElementById('musicStatus').textContent = 'Генерация...';

    try {
      const ctx = this.getAudioContext();
      const sampleRate = ctx.sampleRate;
      const totalDuration = this.duration;
      const beatDuration = 60 / this.bpm;
      const measures = Math.ceil(totalDuration / (beatDuration * 4));

      // Создаём OfflineAudioContext для рендеринга
      const offlineCtx = new OfflineAudioContext(2, sampleRate * totalDuration, sampleRate);

      const styleConfig = this.STYLES[this.currentStyle];
      const masterGain = offlineCtx.createGain();
      masterGain.gain.value = 0.7;

      // Эффекты
      const reverb = this.createReverbForContext(offlineCtx, styleConfig.reverb * 2);
      const delay = this.createDelayForContext(offlineCtx, styleConfig.delay, 0.3);
      const filter = this.createFilterForContext(offlineCtx, 'lowpass', styleConfig.filterFreq, styleConfig.resonance);

      masterGain.connect(filter);
      filter.connect(offlineCtx.destination);

      // Генерация партий
      const drums = this.generateDrumPattern(offlineCtx, 0, beatDuration, measures, this.currentStyle);
      const bassNotes = this.generateBassLine(offlineCtx, 0, beatDuration, measures, this.currentStyle);
      const leadNotes = this.generateLeadLine(offlineCtx, 0, beatDuration, measures, this.currentStyle);
      const padNotes = this.generatePadLine(offlineCtx, 0, beatDuration, measures, this.currentStyle);

      // Рендеринг ударных
      const noiseBuffer = this.createNoiseBufferForContext(offlineCtx, 0.1);
      drums.forEach(drum => {
        if (drum.type === 'kick') {
          this.renderKick(offlineCtx, drum.time, drum.vel, masterGain);
        } else if (drum.type === 'snare') {
          this.renderSnare(offlineCtx, drum.time, drum.vel, noiseBuffer, masterGain);
        } else if (drum.type === 'hihat') {
          this.renderHiHat(offlineCtx, drum.time, drum.vel, noiseBuffer, masterGain);
        }
      });

      // Рендеринг баса
      bassNotes.forEach(note => {
        this.renderBass(offlineCtx, note.time, note.freq, note.duration, note.vel, styleConfig.bassWave, masterGain);
      });

      // Рендеринг лида
      leadNotes.forEach(note => {
        this.renderLead(offlineCtx, note.time, note.freq, note.duration, note.vel, styleConfig.leadWave, masterGain);
      });

      // Рендеринг пэдов
      padNotes.forEach(note => {
        this.renderPad(offlineCtx, note.time, note.freq, note.duration, note.vel, styleConfig.padWave, masterGain);
      });

      // Рендеринг
      const renderedBuffer = await offlineCtx.startRendering();
      this.generatedBuffer = renderedBuffer;

      // Обновление UI
      document.getElementById('playPauseBtn').disabled = false;
      document.getElementById('downloadBtn').disabled = false;
      document.getElementById('musicStatus').textContent = 'Готово к воспроизведению';

      // Обновление инфо
      document.getElementById('trackStyle').textContent = this.getStyleName(this.currentStyle);
      document.getElementById('trackKey').textContent = `${this.currentKey} ${this.currentScale}`;
      document.getElementById('trackBpm').textContent = `${this.bpm} BPM`;

      showToast('✅ Трек сгенерирован! Нажмите Играть для прослушивания.');

    } catch (err) {
      console.error('Generation error:', err);
      showToast('❌ Ошибка генерации: ' + err.message, 'error');
      document.getElementById('musicStatus').textContent = 'Ошибка генерации';
    } finally {
      this.isGenerating = false;
      btn.disabled = false;
      btnText.textContent = '🎼 Сгенерировать трек';
      spinner.style.display = 'none';
    }
  }

  getStyleName(style) {
    const names = {
      cyberpunk: 'Cyberpunk Synthwave',
      ambient: 'Ambient Drone',
      techno: 'Techno Industrial',
      lofi: 'Lo-Fi Chill',
      epic: 'Epic Cinematic',
      trap: 'AI Trap'
    };
    return names[style] || style;
  }

  // Рендеринг инструментов для OfflineContext
  renderKick(ctx, time, velocity, output) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.15);

    gain.gain.setValueAtTime(velocity, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

    osc.connect(gain);
    gain.connect(output);

    osc.start(time);
    osc.stop(time + 0.3);
  }

  renderSnare(ctx, time, velocity, noiseBuffer, output) {
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 800;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(velocity * 0.6, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(output);

    noise.start(time);
    noise.stop(time + 0.2);

    // Тональный компонент
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 220;
    oscGain.gain.setValueAtTime(velocity * 0.3, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    osc.connect(oscGain);
    oscGain.connect(output);
    osc.start(time);
    osc.stop(time + 0.1);
  }

  renderHiHat(ctx, time, velocity, noiseBuffer, output) {
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(velocity * 0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(output);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  renderBass(ctx, time, freq, duration, velocity, waveType, output) {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = waveType;
    osc.frequency.value = freq;

    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 2;

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(velocity * 0.5, time + 0.02);
    gain.gain.setValueAtTime(velocity * 0.5, time + duration - 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(output);

    osc.start(time);
    osc.stop(time + duration + 0.1);
  }

  renderLead(ctx, time, freq, duration, velocity, waveType, output) {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = waveType;
    osc.frequency.value = freq;

    filter.type = 'lowpass';
    filter.frequency.value = 3000;
    filter.Q.value = 1;

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(velocity * 0.3, time + 0.05);
    gain.gain.setValueAtTime(velocity * 0.3, time + duration - 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(output);

    osc.start(time);
    osc.stop(time + duration + 0.1);
  }

  renderPad(ctx, time, freq, duration, velocity, waveType, output) {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = waveType;
    osc1.frequency.value = freq;
    osc2.type = waveType === 'sine' ? 'triangle' : 'sine';
    osc2.frequency.value = freq * 1.005; // Детюн

    filter.type = 'lowpass';
    filter.frequency.value = 1500;
    filter.Q.value = 0.5;

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(velocity * 0.2, time + 0.5);
    gain.gain.setValueAtTime(velocity * 0.2, time + duration - 1);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(output);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.1);
    osc2.stop(time + duration + 0.1);
  }

  createReverbForContext(ctx, duration) {
    const convolver = ctx.createConvolver();
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = ctx.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length, 2);
        channelData[i] = (Math.random() * 2 - 1) * decay * 0.5;
      }
    }

    convolver.buffer = impulse;
    return convolver;
  }

  createDelayForContext(ctx, time, feedback) {
    const delayNode = ctx.createDelay();
    const feedbackNode = ctx.createGain();
    const wetNode = ctx.createGain();

    delayNode.delayTime.value = time;
    feedbackNode.gain.value = feedback;
    wetNode.gain.value = 0.3;

    delayNode.connect(feedbackNode);
    feedbackNode.connect(delayNode);
    delayNode.connect(wetNode);

    return { input: delayNode, output: wetNode };
  }

  createFilterForContext(ctx, type, freq, Q) {
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = Q;
    return filter;
  }

  createNoiseBufferForContext(ctx, duration) {
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  togglePlay() {
    if (!this.generatedBuffer) return;

    const btn = document.getElementById('playPauseBtn');

    if (this.isPlaying) {
      this.stop();
      btn.textContent = '▶️ Играть';
      document.getElementById('musicStatus').textContent = 'Пауза';
      document.getElementById('trackWaveform').classList.remove('playing');
    } else {
      this.play();
      btn.textContent = '⏸️ Пауза';
      document.getElementById('musicStatus').textContent = 'Воспроизведение...';
      document.getElementById('trackWaveform').classList.add('playing');
    }
  }

  play() {
    if (!this.generatedBuffer) return;

    const ctx = this.getAudioContext();
    this.sourceNode = ctx.createBufferSource();
    this.sourceNode.buffer = this.generatedBuffer;

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;

    this.sourceNode.connect(this.analyser);
    this.analyser.connect(ctx.destination);

    this.sourceNode.start(0);
    this.isPlaying = true;
    this.startTime = ctx.currentTime;

    this.sourceNode.onended = () => {
      this.isPlaying = false;
      document.getElementById('playPauseBtn').textContent = '▶️ Играть';
      document.getElementById('musicStatus').textContent = 'Готово к воспроизведению';
      document.getElementById('trackWaveform').classList.remove('playing');
      cancelAnimationFrame(this.animationId);
    };

    this.startVisualizer();
    this.startTimer();
  }

  stop() {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
      } catch (e) {}
      this.sourceNode = null;
    }
    this.isPlaying = false;
    cancelAnimationFrame(this.animationId);
  }

  startTimer() {
    const updateTimer = () => {
      if (!this.isPlaying) return;

      const ctx = this.getAudioContext();
      const current = ctx.currentTime - this.startTime;
      const total = this.generatedBuffer.duration;

      const formatTime = (t) => {
        const mins = Math.floor(t / 60);
        const secs = Math.floor(t % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };

      document.getElementById('musicTimer').textContent = `${formatTime(current)} / ${formatTime(total)}`;

      requestAnimationFrame(updateTimer);
    };

    updateTimer();
  }

  initVisualizer() {
    if (!this.visualizerCanvas || !this.visualizerCtx) return;

    const resize = () => {
      const rect = this.visualizerCanvas.parentElement.getBoundingClientRect();
      this.visualizerCanvas.width = rect.width * window.devicePixelRatio;
      this.visualizerCanvas.height = 220 * window.devicePixelRatio;
      this.visualizerCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);
  }

  startVisualizer() {
    if (!this.analyser || !this.visualizerCtx) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const canvas = this.visualizerCanvas;
    const ctx = this.visualizerCtx;
    const dpr = window.devicePixelRatio || 1;

    const draw = () => {
      this.animationId = requestAnimationFrame(draw);

      this.analyser.getByteFrequencyData(dataArray);

      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      // Фоновая сетка
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const y = height * (i + 1) / 6;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Основные столбцы
      const barCount = 64;
      const barWidth = width / barCount;
      const gap = 2;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor(i * bufferLength / barCount);
        const value = dataArray[dataIndex];
        const barHeight = (value / 255) * height * 0.85;

        const x = i * barWidth + gap / 2;
        const y = height - barHeight;

        // Градиент по высоте
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        const hue = 200 + (i / barCount) * 60;
        gradient.addColorStop(0, `hsla(${hue}, 80%, 50%, 0.8)`);
        gradient.addColorStop(0.5, `hsla(${hue + 20}, 90%, 60%, 0.9)`);
        gradient.addColorStop(1, `hsla(${hue + 40}, 100%, 70%, 1)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth - gap, barHeight, 4);
        ctx.fill();

        // Отражение
        ctx.fillStyle = `hsla(${hue}, 80%, 50%, 0.15)`;
        ctx.beginPath();
        ctx.roundRect(x, height, barWidth - gap, barHeight * 0.3, 4);
        ctx.fill();
      }

      // Обновление индикаторов инструментов
      this.updateInstrumentMeters(dataArray, bufferLength);
    };

    draw();
  }

  updateInstrumentMeters(dataArray, bufferLength) {
    // Низкие частоты — бочка/бас
    const bassEnergy = dataArray.slice(0, 8).reduce((a, b) => a + b, 0) / 8;
    // Средние — снейр/лид
    const midEnergy = dataArray.slice(8, 32).reduce((a, b) => a + b, 0) / 24;
    // Высокие — хай-хэт/пэды
    const highEnergy = dataArray.slice(32, 64).reduce((a, b) => a + b, 0) / 32;
    // Очень высокие — FX
    const fxEnergy = dataArray.slice(64, 100).reduce((a, b) => a + b, 0) / 36;

    const setFill = (id, value) => {
      const el = document.querySelector(`#${id} .inst-fill`);
      if (el) el.style.width = Math.min(value * 1.5, 100) + '%';
    };

    setFill('instDrums', bassEnergy / 255 * 100);
    setFill('instBass', bassEnergy / 255 * 80);
    setFill('instLead', midEnergy / 255 * 100);
    setFill('instPad', highEnergy / 255 * 100);
    setFill('instFX', fxEnergy / 255 * 100);
  }

  download() {
    if (!this.generatedBuffer) return;

    const wavData = this.audioBufferToWav(this.generatedBuffer);
    const blob = new Blob([wavData], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `freeman-ai-${this.currentStyle}-${this.currentKey}-${this.currentScale}-${this.bpm}bpm.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('💾 WAV файл скачан!');
  }

  audioBufferToWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const dataLength = buffer.length * blockAlign;
    const bufferLength = 44 + dataLength;

    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    // RIFF chunk
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    this.writeString(view, 8, 'WAVE');

    // fmt chunk
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);

    // data chunk
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    // Write interleaved data
    const offset = 44;
    const channels = [];
    for (let i = 0; i < numChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    let index = 0;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset + index, intSample, true);
        index += 2;
      }
    }

    return arrayBuffer;
  }

  writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}

// Инициализация генератора при загрузке
let musicGenerator;
document.addEventListener('DOMContentLoaded', () => {
  musicGenerator = new ProceduralMusicGenerator();
});
