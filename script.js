/* ============================================================
   ÍTALO CAVALCANTE TATTOO — script.js
   ============================================================ */

/* ------------------------------------------------------------
   1. DADOS DO PORTFÓLIO
   ------------------------------------------------------------
   ⚠️  IMAGENS PROVISÓRIAS.

   Para publicar com os trabalhos reais:
   1. Coloque as fotografias em  assets/portfolio/
      Ex.: assets/portfolio/realismo-01.jpg
   2. Substitua o campo `src` de cada item pelo caminho local.
   3. Atualize `title`, `category` e `alt` conforme o trabalho real.
   4. Ajuste `ratio` ('tall' | 'square' | 'wide') para a proporção da foto.

   Categorias válidas:
   'realismo' | 'preto-cinza' | 'animais' | 'colorido' | 'amplos'
------------------------------------------------------------ */

const CATEGORY_LABELS = {
  'realismo':   'Realismo',
  'preto-cinza': 'Preto e Cinza',
  'animais':    'Animais & Composições',
  'colorido':   'Colorido',
  'amplos':     'Grandes Projetos',
};

const portfolioItems = [
  {
    id: 1,
    title: 'Projeto Na Perna',
    category: 'realismo',
    ratio: 'tall',
    alt: 'Medalha de São Bento em realismo preto e cinza',
    src: 'fotos/Medalha de São Bento.jpg',
  },
  {
    id: 2,
    title: 'Onça Selvagem com Flores',
    category: 'animais',
    ratio: 'square',
    alt: 'Tatuagem em preto e cinza com degradê suave',
    src: 'fotos/Onça Selvagem com Flores.jpg',
  },
  {
    id: 3,
    title: 'Retrato animal',
    category: 'animais',
    ratio: 'tall',
    alt: 'Tatuagem realista de um cachorro',
    src: 'fotos/Tatuagem realista de um cachorro.jpg',
  },
  {
    id: 4,
    title: 'Projeto Personalizado',
    category: 'preto-cinza',
    ratio: 'tall',
    alt: 'Tatuagem Tres Anjos masculino no peito',
    src: 'fotos/tres anjin masculino peito.webp',
  },
  {
    id: 5,
    title: 'Projeto Personalizado',
    category: 'colorido',
    ratio: 'tall',
    alt: 'Iron maiden colorido na perna',
    src: 'fotos/IronMaiden.jpg',
  },
    {
    id: 6,
    title: 'Fechamento Na Dorsal',
    category: 'amplos',
    ratio: 'tall',
    alt: 'Fechamento Dorsal Leão',
    src: 'fotos/fechamento costas Leão.jpg',
  },
    {
    id: 7,
    title: 'Fechamento Na Dorsal',
    category: 'amplos',
    ratio: 'tall',
    alt: 'Fechamento Dorsal Tigre',
    src: 'fotos/fechamento costas Tigre.jpg',
  },
];

/* ------------------------------------------------------------
   2. UTILITÁRIOS
   ------------------------------------------------------------ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Cria um placeholder elegante quando a imagem falha. */
function makePlaceholder(label = 'Ítalo Cavalcante Tattoo') {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
      <defs>
        <radialGradient id="g" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stop-color="#1c1c1c"/>
          <stop offset="100%" stop-color="#101010"/>
        </radialGradient>
      </defs>
      <rect width="600" height="800" fill="url(#g)"/>
      <rect x="24" y="24" width="552" height="752" fill="none"
            stroke="#c9a55c" stroke-opacity="0.28" stroke-dasharray="6 8"/>
      <text x="300" y="400" text-anchor="middle" fill="#c9a55c"
            font-family="Georgia, serif" font-size="30" opacity="0.85">
        ${label}
      </text>
      <text x="300" y="440" text-anchor="middle" fill="#7d7d78"
            font-family="Helvetica, Arial, sans-serif" font-size="15"
            letter-spacing="4">IMAGEM PROVISÓRIA</text>
    </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.trim());
}

const PLACEHOLDER_SRC = makePlaceholder();

/** Aplica fallback em qualquer <img data-fallback> do documento. */
function attachImageFallbacks(root = document) {
  root.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener(
      'error',
      () => {
        if (img.dataset.failed) return;
        img.dataset.failed = 'true';
        img.src = PLACEHOLDER_SRC;
        img.classList.add('is-placeholder');
      },
      { once: true }
    );
    // Se a imagem já falhou antes do listener ser anexado
    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event('error'));
    }
  });
}

/* ------------------------------------------------------------
   3. HEADER — estado ao rolar
   ------------------------------------------------------------ */

const header = document.getElementById('header');

function onScroll() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ------------------------------------------------------------
   4. MENU MOBILE
   ------------------------------------------------------------ */

const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

function closeMenu() {
  if (!menuBtn || !nav) return;
  nav.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Abrir menu');
  document.body.style.removeProperty('overflow');
}

function toggleMenu() {
  if (!menuBtn || !nav) return;
  const isOpen = nav.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
  menuBtn.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

if (menuBtn) {
  menuBtn.addEventListener('click', toggleMenu);
}

if (nav) {
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 860) closeMenu();
});

/* ------------------------------------------------------------
   5. GALERIA — renderização, filtros e lightbox
   ------------------------------------------------------------ */

const galleryEl = document.getElementById('gallery');
const filterChips = Array.from(document.querySelectorAll('.chip[data-filter]'));

let currentFilter = 'all';
let visibleItems = [...portfolioItems];

function buildGalleryItem(item) {
  const figure = document.createElement('figure');
  figure.className = 'gallery__item';
  figure.dataset.category = item.category;
  figure.dataset.id = String(item.id);
  figure.setAttribute('role', 'button');
  figure.setAttribute('tabindex', '0');
  figure.setAttribute('aria-label', `Ampliar: ${item.title}`);

  const img = document.createElement('img');
  img.src = item.src;
  img.alt = item.alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.width = 900;
  img.height = item.ratio === 'tall' ? 1200 : 900;
  img.dataset.fallback = '';

  const overlay = document.createElement('figcaption');
  overlay.className = 'gallery__overlay';
  overlay.innerHTML = `
    <span class="gallery__cat">${CATEGORY_LABELS[item.category] || ''}</span>
    <span class="gallery__title">${item.title}</span>
  `;

  figure.append(img, overlay);

  // Abrir lightbox
  figure.addEventListener('click', () => openLightbox(item.id));
  figure.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(item.id);
    }
  });

  return figure;
}

function renderGallery(filter = 'all') {
  if (!galleryEl) return;

  currentFilter = filter;
  visibleItems = filter === 'all'
    ? [...portfolioItems]
    : portfolioItems.filter((i) => i.category === filter);

  galleryEl.innerHTML = '';

  if (visibleItems.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'gallery__note';
    empty.textContent = 'Nenhum trabalho nesta categoria por enquanto. Fale comigo no WhatsApp para ver mais.';
    galleryEl.appendChild(empty);
    return;
  }

  const frag = document.createDocumentFragment();
  visibleItems.forEach((item) => frag.appendChild(buildGalleryItem(item)));
  galleryEl.appendChild(frag);

  attachImageFallbacks(galleryEl);
}

function setActiveFilter(filter) {
  filterChips.forEach((chip) => {
    const active = chip.dataset.filter === filter;
    chip.classList.toggle('is-active', active);
    chip.setAttribute('aria-selected', String(active));
  });
  renderGallery(filter);
}

filterChips.forEach((chip) => {
  chip.addEventListener('click', () => setActiveFilter(chip.dataset.filter));
});

// Cards de "Estilo Artístico" → filtram a galeria
document.querySelectorAll('[data-goto-filter]').forEach((card) => {
  card.addEventListener('click', () => {
    const filter = card.dataset.gotoFilter;
    setActiveFilter(filter);
    document.getElementById('portfolio')?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  });
});

renderGallery('all');

/* ------------------------------------------------------------
   6. LIGHTBOX
   ------------------------------------------------------------ */

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let lightboxIndex = 0;
let lastFocused = null;

function openLightbox(id) {
  if (!lightbox || visibleItems.length === 0) return;

  const idx = visibleItems.findIndex((i) => i.id === id);
  if (idx === -1) return;

  lightboxIndex = idx;
  lastFocused = document.activeElement;

  updateLightbox();
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => lightbox.classList.add('is-open'));
  lightboxClose?.focus();
}

function updateLightbox() {
  const item = visibleItems[lightboxIndex];
  if (!item || !lightboxImg) return;

  lightboxImg.src = item.src;
  lightboxImg.alt = item.alt;
  lightboxImg.onerror = () => {
    lightboxImg.onerror = null;
    lightboxImg.src = PLACEHOLDER_SRC;
  };

  if (lightboxCaption) {
    lightboxCaption.textContent = `${CATEGORY_LABELS[item.category] || ''} · ${item.title}`;
  }
}

function closeLightbox() {
  if (!lightbox || lightbox.hidden) return;

  lightbox.classList.remove('is-open');
  document.body.style.removeProperty('overflow');

  const finish = () => {
    lightbox.hidden = true;
    if (lightboxImg) lightboxImg.src = '';
  };

  if (prefersReducedMotion) finish();
  else setTimeout(finish, 300);

  if (lastFocused instanceof HTMLElement) lastFocused.focus();
}

function showNext() {
  if (visibleItems.length === 0) return;
  lightboxIndex = (lightboxIndex + 1) % visibleItems.length;
  updateLightbox();
}

function showPrev() {
  if (visibleItems.length === 0) return;
  lightboxIndex = (lightboxIndex - 1 + visibleItems.length) % visibleItems.length;
  updateLightbox();
}

lightboxClose?.addEventListener('click', closeLightbox);
lightboxNext?.addEventListener('click', showNext);
lightboxPrev?.addEventListener('click', showPrev);

lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox || lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});

/* ------------------------------------------------------------
   7. ANO DO RODAPÉ
   ------------------------------------------------------------ */

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ------------------------------------------------------------
   8. REVEAL ON SCROLL
   ------------------------------------------------------------ */

const revealEls = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------
   9. FALLBACKS DE IMAGEM (hero, CTA, sobre)
   ------------------------------------------------------------ */

attachImageFallbacks(document);