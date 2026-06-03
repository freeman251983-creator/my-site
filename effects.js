
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

// ===== 4. AUDIO REACTIVE ENHANCED =====
class AudioReactiveEnhanced {
  constructor() {
    this.bars = document.querySelectorAll('.wave-bar');
    this.isPlaying = false;
    this.rafId = null;
    this.init();
  }

  init() {
    const btn = document.getElementById('playAudioBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      this.isPlaying = !this.isPlaying;
      if (this.isPlaying) {
        this.animate();
      } else {
        cancelAnimationFrame(this.rafId);
        this.bars.forEach(bar => { bar.style.height = '15%'; });
      }
    });
  }

  animate() {
    if (!this.isPlaying) return;

    const time = Date.now() * 0.005;
    this.bars.forEach((bar, i) => {
      const height = 15 + Math.abs(Math.sin(time + i * 0.8)) * 70 + Math.random() * 10;
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
  new AudioReactiveEnhanced();
  new GradientMeshCards();
  new SmoothScroll();
  new RevealOnScroll();

  console.log('%c⚡ FREEMAN AI-PRO — FAST MODE ACTIVATED ⚡', 'color: var(--glow-color); font-size: 18px; font-weight: bold;');
});
