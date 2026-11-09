/* =========================================================
   Ryan Barbosa — Portfólio
   script.js — interações, animações e pequenas funcionalidades
   Organização: cada bloco cuida de uma única responsabilidade.
   ========================================================= */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ---------------------------------------------------------
     1. Ano atual no footer
  --------------------------------------------------------- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const birthDate = new Date(2005, 9, 24);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayThisYear = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  if (today < birthdayThisYear) age -= 1;

  const ageEl = document.getElementById('ryan-age');
  if (ageEl) ageEl.dataset.count = String(age);
  const ageTextEl = document.getElementById('ryan-age-text');
  if (ageTextEl) ageTextEl.textContent = String(age);

  /* ---------------------------------------------------------
     2. Navbar: estado ao rolar + link ativo por seção
  --------------------------------------------------------- */
  const nav = document.getElementById('main-nav');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const onScrollNav = () => {
    if (window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === id
            );
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------------------------------------------------------
     3. Menu hamburger (mobile)
  --------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobilePanel = document.getElementById('mobile-panel');

  if (menuToggle && mobilePanel) {
    const closeMenu = () => {
      menuToggle.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobilePanel.classList.remove('open');
    };
    const openMenu = () => {
      menuToggle.classList.add('menu-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      mobilePanel.classList.add('open');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = mobilePanel.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    mobilePanel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---------------------------------------------------------
     4. Scroll reveal (fade-in + stagger) via IntersectionObserver
  --------------------------------------------------------- */
  const revealTargets = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------
     5. Contadores animados (seção Sobre)
  --------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (Number.isNaN(target) || prefersReducedMotion) {
      el.textContent = String(target || el.textContent);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => counterObserver.observe(el));
  }

  /* ---------------------------------------------------------
     6. Efeito de digitação — painel de código no Hero
  --------------------------------------------------------- */
  const codeLines = [
    { html: '<span class="kw">const</span> <span class="pl">dev</span> = {' },
    { html: '&nbsp;&nbsp;<span class="pl">name:</span> <span class="str">\'Ryan Barbosa\'</span>,' },
    { html: '&nbsp;&nbsp;<span class="pl">role:</span> <span class="str">\'Front-End Developer\'</span>,' },
    { html: '&nbsp;&nbsp;<span class="pl">stack:</span> [<span class="str">\'JS\'</span>, <span class="str">\'Tailwind\'</span>, <span class="str">\'Firebase\'</span>],' },
    { html: '&nbsp;&nbsp;<span class="fn">available</span>: <span class="kw">true</span>' },
    { html: '};' },
  ];

  const typeTarget = document.getElementById('hero-code');

  function typeHeroCode() {
    if (!typeTarget) return;

    if (prefersReducedMotion) {
      typeTarget.innerHTML = codeLines
        .map((l) => `<span class="code-line">${l.html}</span>`)
        .join('');
      return;
    }

    typeTarget.innerHTML = '';
    let lineIndex = 0;

    const typeLine = () => {
      if (lineIndex >= codeLines.length) return;

      const lineEl = document.createElement('span');
      lineEl.className = 'code-line';
      typeTarget.appendChild(lineEl);

      const plainText = codeLines[lineIndex].html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
      let charIndex = 0;
      const speed = 16;

      const typeChar = () => {
        if (charIndex <= plainText.length) {
          lineEl.textContent = plainText.slice(0, charIndex);
          charIndex++;
          setTimeout(typeChar, speed);
        } else {
          // linha finalizada: aplica o HTML colorido definitivo
          lineEl.innerHTML = codeLines[lineIndex].html;
          lineIndex++;
          setTimeout(typeLine, 90);
        }
      };
      typeChar();
    };

    typeLine();
  }

  if (typeTarget && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            typeHeroCode();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    heroObserver.observe(typeTarget);
  }

  /* ---------------------------------------------------------
     7. Terminal animado — seção GitHub
  --------------------------------------------------------- */
  const terminalScript = [
    { prompt: true, text: 'whoami' },
    { prompt: false, text: 'ryan-barbosa' },
    { prompt: true, text: 'stack --list' },
    { prompt: false, text: 'HTML · CSS · JavaScript · Tailwind · Firebase' },
    { prompt: true, text: 'status' },
    { prompt: false, text: 'available for freelance projects ✓', accent: true },
  ];

  const terminalBody = document.getElementById('terminal-body');

  function renderTerminalStatic() {
    if (!terminalBody) return;
    terminalBody.innerHTML = terminalScript
      .map((line) =>
        line.prompt
          ? `<div class="terminal-line"><span class="prompt-sign">$</span> ${line.text}</div>`
          : `<div class="terminal-line ${line.accent ? 'text-[var(--code-str)]' : 'text-[var(--text-1)]'}">${line.text}</div>`
      )
      .join('');
  }

  function typeTerminal() {
    if (!terminalBody) return;
    if (prefersReducedMotion) {
      renderTerminalStatic();
      return;
    }

    terminalBody.innerHTML = '';
    let i = 0;

    const nextLine = () => {
      if (i >= terminalScript.length) return;
      const line = terminalScript[i];
      const row = document.createElement('div');
      row.className = 'terminal-line';
      terminalBody.appendChild(row);

      if (line.prompt) {
        row.innerHTML = '<span class="prompt-sign">$</span> ';
        let c = 0;
        const typeChar = () => {
          if (c <= line.text.length) {
            row.innerHTML = `<span class="prompt-sign">$</span> ${line.text.slice(0, c)}<span class="code-caret"></span>`;
            c++;
            setTimeout(typeChar, 28);
          } else {
            row.innerHTML = `<span class="prompt-sign">$</span> ${line.text}`;
            i++;
            setTimeout(nextLine, 220);
          }
        };
        typeChar();
      } else {
        row.className = `terminal-line ${line.accent ? 'text-[var(--code-str)]' : 'text-[var(--text-1)]'}`;
        row.textContent = line.text;
        i++;
        setTimeout(nextLine, 320);
      }
    };

    nextLine();
  }

  if (terminalBody && 'IntersectionObserver' in window) {
    const terminalObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            typeTerminal();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    terminalObserver.observe(terminalBody);
  }

  /* ---------------------------------------------------------
     8. Grid de fundo animado (canvas) — partículas conectadas
  --------------------------------------------------------- */
  const canvas = document.getElementById('hero-canvas');

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width, height, particles;
    const PARTICLE_COUNT = 46;
    const MAX_DIST = 130;

    function resize() {
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    }

    function createParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < MAX_DIST * window.devicePixelRatio) {
            ctx.strokeStyle = `rgba(91, 140, 255, ${0.12 * (1 - dist / (MAX_DIST * window.devicePixelRatio))})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        ctx.fillStyle = 'rgba(91, 140, 255, 0.55)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6 * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(step);
    }

    resize();
    createParticles();
    step();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        createParticles();
      }, 200);
    });
  } else if (canvas) {
    canvas.style.display = 'none';
  }

  /* ---------------------------------------------------------
     9. Glow que segue o cursor (somente desktop, sutil)
  --------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursor-glow');
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (cursorGlow && isFinePointer && !prefersReducedMotion) {
    let raf = null;
    window.addEventListener('pointermove', (e) => {
      cursorGlow.style.opacity = '1';
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
      });
    });
    window.addEventListener('pointerleave', () => {
      cursorGlow.style.opacity = '0';
    });
  } else if (cursorGlow) {
    cursorGlow.remove();
  }

  /* ---------------------------------------------------------
     10. Formulário de contato (validação + feedback simulado)
     Sem backend configurado — pronto para receber uma action
     real (ex: Firebase, Formspree, endpoint próprio, etc).
  --------------------------------------------------------- */
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('!border-red-400/60');
        } else {
          field.classList.remove('!border-red-400/60');
        }
      });

      if (!valid) {
        formStatus.textContent = 'Preencha os campos obrigatórios antes de enviar.';
        formStatus.className = 'text-sm mt-4 text-red-400';
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      // TODO: substituir por uma chamada real (fetch para API,
      // Firebase, Formspree, etc). Por enquanto, simula o envio.
      setTimeout(() => {
        formStatus.textContent =
          'Mensagem enviada! Ryan normalmente responde em até 24h.';
        formStatus.className = 'text-sm mt-4 text-[var(--code-str)]';
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        form.reset();
      }, 900);
    });
  }

  /* ---------------------------------------------------------
     11. Rolagem suave para links internos (fallback)
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  });
})();