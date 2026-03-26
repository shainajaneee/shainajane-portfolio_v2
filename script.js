/* ═══════════════════════════════════════════════
   SHAINA JANE TANGUAN — Portfolio JS
═══════════════════════════════════════════════ */

/* ── THEME ── */
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  const current = html.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Init theme
(function() {
  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);
})();

/* ── CURSOR ── */
const cur = document.getElementById('cur');
const ring = document.getElementById('ring');
let mx = 0, my = 0, rx = 0, ry = 0;

if (cur && ring) {
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function tick() {
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  })();
  document.addEventListener('mouseover', e => {
    const hoverable = e.target.closest('a, button, .project-card, .tech-chip, .cert-card, .filter-btn');
    if (hoverable) {
      cur.style.width  = '16px'; cur.style.height = '16px';
      ring.style.width = '52px'; ring.style.height = '52px'; ring.style.opacity = '.75';
    } else {
      cur.style.width  = '10px'; cur.style.height = '10px';
      ring.style.width = '34px'; ring.style.height = '34px'; ring.style.opacity = '.45';
    }
  });
}

/* ── SCROLL PROGRESS ── */
const prog = document.getElementById('prog');
window.addEventListener('scroll', () => {
  if (prog) {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    prog.style.width = pct + '%';
  }
  // Nav shrink
  const nav = document.querySelector('.nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── REVEAL ON SCROLL ── */
window.revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => window.revealObs.observe(el));
/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '+';
  let current = 0;
  const interval = setInterval(() => {
    current = Math.min(current + 1, target);
    el.textContent = current + suffix;
    if (current >= target) clearInterval(interval);
  }, 60);
}
setTimeout(() => {
  document.querySelectorAll('[data-count]').forEach(animateCounter);
}, 900);

/* ── GALLERY CONTROLLER ── */
const galleryStates = {};

function buildGallery(card, pi, slides, autoDelay) {
  galleryStates[pi] = 0;
  const track = card.querySelector('.gallery-track');
  const counter = card.querySelector('.gallery-counter');
  const dotsEl = card.querySelector('.gallery-dots');
  const prevBtn = card.querySelector('.gallery-btn.prev');
  const nextBtn = card.querySelector('.gallery-btn.next');
  const total = slides.length;

  function goTo(idx) {
    galleryStates[pi] = idx;
    if (track) track.style.transform = `translateX(-${idx * 100}%)`;
    if (counter) counter.textContent = `${idx + 1} / ${total}`;
    if (dotsEl) {
      dotsEl.querySelectorAll('.gdot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', e => { e.stopPropagation(); goTo((galleryStates[pi] - 1 + total) % total); });
  if (nextBtn) nextBtn.addEventListener('click', e => { e.stopPropagation(); goTo((galleryStates[pi] + 1) % total); });
  if (dotsEl) {
    dotsEl.querySelectorAll('.gdot').forEach((d, i) => {
      d.addEventListener('click', e => { e.stopPropagation(); goTo(i); });
    });
  }

  if (total > 1) {
    setInterval(() => {
      if (!document.hidden) goTo((galleryStates[pi] + 1) % total);
    }, autoDelay);
  }
}

/* ── PROJECT CARD BUILDER ── */
function buildProjectCard(proj, idx, autoDelay) {
  const card = document.createElement('div');
  card.className = 'project-card reveal';
  card.style.transitionDelay = `${idx * 0.07}s`;

  const slidesHTML = proj.slides.map(s => `
    <div class="gallery-slide">
      <div class="gallery-slide-placeholder" style="background:linear-gradient(135deg,${s.bg},var(--surface2))">
        ${s.img
          ? `<img src="${s.img}" alt="${proj.name} screenshot" onerror="this.parentElement.innerHTML='<span style=\\'font-size:3.5rem\\'>${s.e}</span>'">`
          : `<span style="font-size:3.5rem">${s.e}</span>`
        }
      </div>
    </div>`).join('');

  const dotsHTML = proj.slides.map((_, i) =>
    `<button class="gdot ${i === 0 ? 'active' : ''}"></button>`
  ).join('');

  card.innerHTML = `
    <div class="card-gallery">
      <div class="gallery-track">${slidesHTML}</div>
      <span class="gallery-label">${proj.label}</span>
      <span class="gallery-counter">1 / ${proj.slides.length}</span>
      <button class="gallery-btn prev">‹</button>
      <button class="gallery-btn next">›</button>
      <div class="gallery-dots">${dotsHTML}</div>
    </div>
    <div class="card-content">
      <div class="card-top">
        <h3 class="card-name">${proj.name}</h3>
        <span class="card-arrow">${proj.url ? '↗' : '—'}</span>
      </div>
      <p class="card-desc">${proj.desc}</p>
      <p class="card-impact">${proj.impact}</p>
      <div class="card-chips">
        ${proj.chips.map(c => `<span class="card-chip">${c}</span>`).join('')}
      </div>
    </div>`;

  if (proj.url) {
    card.addEventListener('click', () => window.open(proj.url, '_blank'));
    card.querySelector('.card-arrow').addEventListener('click', e => {
      e.stopPropagation();
      window.open(proj.url, '_blank');
    });
  }

  buildGallery(card, `${Date.now()}-${idx}`, proj.slides, autoDelay || (3000 + idx * 350));
  
  // Add this line so the card actually fades in!
  if (window.revealObs) window.revealObs.observe(card); 

  return card;
}

/* ── RECOMMENDATIONS ── */
let recIndex = 0;

function initRecs(recs) {
  const body   = document.getElementById('recBody');
  const dots   = document.getElementById('recDots');
  const prevBtn = document.getElementById('recPrev');
  const nextBtn = document.getElementById('recNext');
  if (!body || !recs.length) return;

  function buildDots() {
    if (!dots) return;
    dots.innerHTML = recs.map((_, i) =>
      `<button class="rdot ${i === recIndex ? 'active' : ''}" data-i="${i}"></button>`
    ).join('');
    dots.querySelectorAll('.rdot').forEach(d => {
      d.addEventListener('click', () => goRec(parseInt(d.dataset.i)));
    });
  }

  function showRec(idx) {
    const r = recs[idx];
    body.style.opacity = '0';
    body.style.transform = 'translateX(10px)';
    setTimeout(() => {
      document.getElementById('recText').textContent = `"${r.text}"`;
      document.getElementById('recName').textContent = r.name;
      document.getElementById('recRole').textContent = r.role;
      document.getElementById('recStars').textContent = '★'.repeat(r.stars || 5);
      const av = document.getElementById('recAvatar');
      if (r.avatarImg) {
        av.innerHTML = `<img src="${r.avatarImg}" alt="${r.name}">`;
      } else {
        av.textContent = r.initials || r.name.slice(0, 2).toUpperCase();
      }
      body.style.opacity = '1';
      body.style.transform = 'translateX(0)';
      buildDots();
    }, 260);
  }

  function goRec(idx) { recIndex = (idx + recs.length) % recs.length; showRec(recIndex); }

  if (prevBtn) prevBtn.addEventListener('click', () => goRec(recIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goRec(recIndex + 1));

  showRec(0);
  // Auto-cycle
  setInterval(() => { if (!document.hidden) goRec(recIndex + 1); }, 7000);
}

/* ── TOAST ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── CONTACT FORM ── */
function initContactForm() {
  const btn = document.getElementById('formSubmit');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const name  = document.getElementById('fName')?.value.trim();
    const email = document.getElementById('fEmail')?.value.trim();
    const msg   = document.getElementById('fMsg')?.value.trim();
    if (!name || !email || !msg) { showToast('⚠️ Please fill all fields'); return; }
    window.location.href = `mailto:shaynatangguan8@gmail.com?subject=Message from ${encodeURIComponent(name)}&body=${encodeURIComponent(msg + '\n\nFrom: ' + email)}`;
    showToast('✓ Opening your email client...');
  });
}

/* ── FILTER (projects page) ── */
function initFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card[data-category]');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.style.display = match ? '' : 'none';
      });
    });
  });
}
function viewCert(imagePath) {
    const modal = document.getElementById("certModal");
    const modalImg = document.getElementById("fullCertImage");
    modal.style.display = "block";
    modalImg.src = imagePath;
}

/* ── EXPOSE GLOBALS ── */
window.toggleTheme = toggleTheme;
window.showToast   = showToast;
window.buildProjectCard = buildProjectCard;
window.initRecs    = initRecs;
window.initContactForm = initContactForm;
window.initFilter  = initFilter;