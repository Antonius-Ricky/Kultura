/* =============================================
   KULTURA TCG - Main JavaScript
   ============================================= */

// ── Loading Screen ──
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 500);
    }
  }, 1800);
});

// ── Navbar Scroll Effect ──
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ── Active Nav Link ──
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
setActiveNavLink();

// ── Hamburger Menu ──
const hamburger = document.querySelector('.nav-hamburger');
const navMobile = document.querySelector('.nav-mobile');
if (hamburger && navMobile) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMobile.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('active');
      navMobile.classList.remove('open');
    }
  });
}

// ── Scroll Reveal ──
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', initScrollReveal);

// ── Generate Particles ──
function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  const count = 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 15 + 8}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
}
document.addEventListener('DOMContentLoaded', initParticles);

// ── Floating Mini Cards ──
function initFloatingCards() {
  const container = document.querySelector('.floating-cards');
  if (!container) return;
  const emojis = ['🏛️','⚔️','🎴','🍛','🏯','🪆','🌺','🗺️'];
  const count = 8;
  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'float-card-mini';
    const rot = (Math.random() - 0.5) * 40;
    card.style.cssText = `
      left: ${Math.random() * 100}%;
      --rot: ${rot}deg;
      animation-duration: ${Math.random() * 15 + 12}s;
      animation-delay: ${Math.random() * 12}s;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    `;
    card.textContent = emojis[i % emojis.length];
    container.appendChild(card);
  }
}
document.addEventListener('DOMContentLoaded', initFloatingCards);

// ── 3D Card Tilt ──
function init3DTilt() {
  document.querySelectorAll('.hero-card, .card-large').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(600px) rotateY(${dx * 12}deg) rotateX(${-dy * 12}deg) translateZ(10px)`;
      card.style.animation = 'none';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      if (card.classList.contains('hero-card')) {
        card.style.animation = 'float-card 4s ease-in-out infinite';
      }
    });
  });
}
document.addEventListener('DOMContentLoaded', init3DTilt);

// ── Card Tilt on grid items ──
function initCardItemTilt() {
  document.querySelectorAll('.card-item, .expansion-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-8px) scale(1.02) perspective(500px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
document.addEventListener('DOMContentLoaded', initCardItemTilt);

// ── Load Cards JSON ──
let allCards = [];
async function loadCards() {
  try {
    const res = await fetch('cards.json');
    allCards = await res.json();
    return allCards;
  } catch (e) {
    console.warn('Could not load cards.json:', e);
    return [];
  }
}

// ── Card helpers ──
function renderCardEmoji(category) {
  const map = { 'Karakter': '👤', 'Makanan': '🍛', 'Bangunan': '🏛️', 'Pakaian': '👘', 'Kesenian': '🎨'};
  return map[category] || '🎴';
}

function rarityStarClass(rarity) {
  return `rarity-star-${rarity}`;
}

function cardNumFromId(id) {
  // KLT-YOG-001 → 001
  const parts = id.split('-');
  return parts[parts.length - 1] || id;
}

function renderCardItem(card) {
  const num      = cardNumFromId(card.id);
  const emoji    = renderCardEmoji(card.category);
  const hasImg   = card.image && card.image !== `assets/images/${card.id.toLowerCase()}.png`
                    ? '' : '';
  // Use card.image path if it looks like a real file, otherwise emoji fallback
  const imgPath  = card.image || '';
  const abilityTitle = card.category.toUpperCase();

  return `
    <a class="card-item reveal" href="card.html?id=${card.id}" title="${card.name}">
      <div class="card-holo"></div>
      <div class="holo-shine"></div>
      <div class="card-inner">
        <div class="card-header">
          <div class="card-header-name">${card.name}</div>
          <div class="card-header-num">
            <span class="card-rarity-star ${rarityStarClass(card.rarity)}">★</span>${num}
          </div>
        </div>
        <div class="card-art">
          ${imgPath ? `<img src="${imgPath}" alt="${card.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
          <div class="card-art-emoji" ${imgPath ? 'style="display:none"' : ''}>${emoji}</div>
        </div>
        <div class="card-footer">
          <div class="card-ability-title">${abilityTitle}</div>
          <div class="card-ability-desc">${card.effect}</div>
        </div>
      </div>
    </a>
  `;
}

// ── Cards Page Logic ──
async function initCardsPage() {
  const grid = document.getElementById('cards-grid');
  const searchInput = document.getElementById('search-input');
  const countEl = document.getElementById('cards-count');
  if (!grid) return;

  await loadCards();
  let activeCategory = 'all';
  let activeRarity = 'all';
  let searchQuery = '';

  function filterAndRender() {
    let filtered = allCards.filter(card => {
      const matchSearch = !searchQuery ||
        card.name.toLowerCase().includes(searchQuery) ||
        card.id.toLowerCase().includes(searchQuery);
      const matchCat = activeCategory === 'all' || card.category === activeCategory;
      const matchRarity = activeRarity === 'all' || card.rarity === activeRarity;
      return matchSearch && matchCat && matchRarity;
    });

    if (countEl) countEl.textContent = `${filtered.length} Kartu`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="no-results-icon">🔍</div>
          <p>Tidak ada kartu yang ditemukan</p>
        </div>
      `;
    } else {
      grid.innerHTML = filtered.map(renderCardItem).join('');
      initScrollReveal();
      initCardItemTilt();
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterAndRender();
    });
  }

  document.querySelectorAll('.filter-btn[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-cat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat;
      filterAndRender();
    });
  });

  document.querySelectorAll('.filter-btn[data-rarity]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-rarity]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRarity = btn.dataset.rarity;
      filterAndRender();
    });
  });

  filterAndRender();
}

// ── Card Detail Page Logic ──
async function initCardDetailPage() {
  const container = document.getElementById('card-detail-container');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const cardId = params.get('id');
  if (!cardId) { container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:60px">ID kartu tidak ditemukan.</p>'; return; }

  await loadCards();
  const card = allCards.find(c => c.id === cardId);
  if (!card) { container.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:60px">Kartu "${cardId}" tidak ditemukan.</p>`; return; }

  document.title = `${card.name} - Kultura TCG`;

  const related = allCards.filter(c => c.id !== card.id && (c.category === card.category || c.expansion === card.expansion)).slice(0, 3);

  const imgPath = card.image || '';
  const num     = cardNumFromId(card.id);
  const emoji   = renderCardEmoji(card.category);

  container.innerHTML = `
    <div class="card-detail-layout">
      <div class="card-detail-visual reveal">
        <div class="card-large">
          <div class="holo-shine"></div>
          <div class="card-large-inner">
            <div class="card-large-header">
              <span class="card-large-name">${card.name}</span>
              <span class="card-large-num">
                <span class="card-rarity-star ${rarityStarClass(card.rarity)}">★</span>${num}
              </span>
            </div>
            <div class="card-large-art">
              ${imgPath ? `<img src="${imgPath}" alt="${card.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
              <div class="card-large-art-emoji" ${imgPath ? 'style="display:none"' : ''}>${emoji}</div>
            </div>
            <div class="card-large-footer">
              <div class="card-large-ability-title">${card.category.toUpperCase()}</div>
              <div class="card-large-effect-text">${card.effect}</div>
            </div>
          </div>
        </div>
        <div style="margin-top:16px;text-align:center">
          <a href="cards.html" class="btn btn-outline btn-sm">← Kembali ke Kartu</a>
        </div>
      </div>
      <div class="card-detail-info reveal reveal-delay-1">
        <div class="card-id-tag">${card.id} · ${card.expansion}</div>
        <h1 class="card-detail-title">${card.name}</h1>
        <div class="card-detail-meta">
          <div class="meta-pill"><span>📂</span>${card.category}</div>
          <div class="meta-pill"><span>⭐</span>${card.rarity}</div>
          <div class="meta-pill"><span>📍</span>${card.region}</div>
          <div class="meta-pill"><span>🃏</span>${card.expansion}</div>
        </div>

        <div class="card-detail-section">
          <div class="card-detail-section-title">⚡ Efek Kartu</div>
          <p class="card-effect-text">${card.effect}</p>
        </div>

        <div class="card-detail-section">
          <div class="card-detail-section-title">📖 Lore</div>
          <p class="card-story-text">${card.story}</p>
        </div>

        ${related.length > 0 ? `
        <div class="card-detail-section">
          <div class="card-detail-section-title">🎴 Kartu Terkait</div>
          <div class="related-cards">
            ${related.map(rc => `
              <a href="card.html?id=${rc.id}" class="card-item">
                <div class="card-art" style="font-size:2rem">${renderCardEmoji(rc.category)}</div>
                <div class="card-info">
                  <div class="card-id" style="font-size:0.55rem">${rc.id}</div>
                  <div class="card-name" style="font-size:0.9rem">${rc.name}</div>
                </div>
              </a>
            `).join('')}
          </div>
        </div>` : ''}
      </div>
    </div>
  `;

  initScrollReveal();
  init3DTilt();
}

// ── Expansion Detail Page Logic ──
async function initExpansionDetailPage() {
  const grid = document.getElementById('expansion-cards-grid');
  if (!grid) return;

  await loadCards();
  const yogCards = allCards.filter(c => c.expansion === 'Yogyakarta Edition');
  let activeFilter = 'all';

  function render() {
    const filtered = activeFilter === 'all' ? yogCards : yogCards.filter(c => c.category === activeFilter);
    grid.innerHTML = filtered.map(renderCardItem).join('');
    initScrollReveal();
    initCardItemTilt();
  }

  document.querySelectorAll('.filter-btn[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-cat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.cat;
      render();
    });
  });

  render();
}

// ── Home Preview Cards ──
async function initHomePreviewCards() {
  const grid = document.getElementById('home-preview-grid');
  if (!grid) return;
  await loadCards();
  const preview = allCards.slice(0, 4);
  grid.innerHTML = preview.map(renderCardItem).join('');
  initScrollReveal();
  initCardItemTilt();
}

// ── Category Click (home page) ──
function initCategoryCards() {
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.cat;
      window.location.href = `cards.html?cat=${cat}`;
    });
  });
}
document.addEventListener('DOMContentLoaded', initCategoryCards);

// ── Handle cat param on cards page ──
function handleCatParam() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  if (cat) {
    const btn = document.querySelector(`.filter-btn[data-cat="${cat}"]`);
    if (btn) {
      setTimeout(() => btn.click(), 100);
    }
  }
}

// ── Initialize by page ──
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '') {
    initHomePreviewCards();
  }
  if (page === 'cards.html') {
    initCardsPage().then(handleCatParam);
  }
  if (page === 'card.html') {
    initCardDetailPage();
  }
  if (page === 'expansion-detail.html') {
    initExpansionDetailPage();
  }
});

// ── Smooth page links ──
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
  // No transition animation needed for same-page links - just let default behavior work
});

// ── Carousel ──
function initCarousel(trackId, prevId, nextId) {
  const track = document.getElementById(trackId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  if (!track || !prev || !next) return;

  let offset = 0;
  const itemWidth = 200 + 16; // approx card width + gap
  const maxOffset = () => -(track.children.length - 3) * itemWidth;

  next.addEventListener('click', () => {
    offset = Math.max(offset - itemWidth, maxOffset());
    track.style.transform = `translateX(${offset}px)`;
  });

  prev.addEventListener('click', () => {
    offset = Math.min(offset + itemWidth, 0);
    track.style.transform = `translateX(${offset}px)`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCarousel('carousel-track', 'carousel-prev', 'carousel-next');
});

/* =============================================
   WHERE TO BUY PAGE LOGIC
   ============================================= */

// ── Product price map ──
const PRODUCT_PRICES = {
  'Starter Deck - Rp 149.000': 149000,
  'Booster Pack - Rp 59.000':  59000,
  'Bundle Box - Rp 599.000':   599000,
};

function formatRupiah(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

// ── Order Total Calculator ──
function updateOrderTotal() {
  const productSelect = document.getElementById('order-product');
  const qtyInput      = document.getElementById('order-qty');
  const totalDisplay  = document.getElementById('order-total');
  if (!productSelect || !qtyInput || !totalDisplay) return;

  const price = PRODUCT_PRICES[productSelect.value] || 0;
  const qty   = Math.max(1, parseInt(qtyInput.value) || 1);
  totalDisplay.textContent = price ? formatRupiah(price * qty) : 'Rp —';
}

// ── Qty Controls ──
function initQtyControls() {
  const minus = document.getElementById('qty-minus');
  const plus  = document.getElementById('qty-plus');
  const input = document.getElementById('order-qty');
  if (!minus || !plus || !input) return;

  minus.addEventListener('click', () => {
    const v = parseInt(input.value) || 1;
    if (v > 1) { input.value = v - 1; updateOrderTotal(); }
  });

  plus.addEventListener('click', () => {
    const v = parseInt(input.value) || 1;
    if (v < 99) { input.value = v + 1; updateOrderTotal(); }
  });

  input.addEventListener('input', () => {
    let v = parseInt(input.value) || 1;
    v = Math.max(1, Math.min(99, v));
    input.value = v;
    updateOrderTotal();
  });
}

// ── "Pesan Langsung" buttons on product cards ──
function initProductBuyButtons() {
  document.querySelectorAll('.wtb-buy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productName = btn.dataset.product;
      const orderSection = document.getElementById('order-section');
      const productSelect = document.getElementById('order-product');

      if (orderSection) {
        orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      if (productSelect) {
        // Map button label to select option value
        const match = Object.keys(PRODUCT_PRICES).find(key =>
          key.toLowerCase().startsWith(productName.toLowerCase())
        );
        if (match) {
          productSelect.value = match;
          updateOrderTotal();
          // Highlight the select briefly
          productSelect.classList.add('highlight-flash');
          setTimeout(() => productSelect.classList.remove('highlight-flash'), 1000);
        }
      }
    });
  });
}

// ── Form Validation ──
function validateField(id, errorId, validatorFn) {
  const input = document.getElementById(id);
  const error = document.getElementById(errorId);
  if (!input || !error) return true;

  const msg = validatorFn(input.value.trim());
  error.textContent = msg;
  input.classList.toggle('error', !!msg);
  return !msg;
}

function validateOrderForm() {
  let valid = true;

  valid &= validateField('order-name', 'error-name', v =>
    !v ? 'Nama tidak boleh kosong.' : v.length < 3 ? 'Nama terlalu pendek.' : '');

  valid &= validateField('order-phone', 'error-phone', v =>
    !v ? 'Nomor WhatsApp tidak boleh kosong.' :
    !/^[0-9+\-\s]{8,15}$/.test(v) ? 'Format nomor tidak valid.' : '');

  valid &= validateField('order-email', 'error-email', v =>
    !v ? 'Email tidak boleh kosong.' :
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Format email tidak valid.' : '');

  valid &= validateField('order-product', 'error-product', v =>
    !v ? 'Pilih produk terlebih dahulu.' : '');

  valid &= validateField('order-address', 'error-address', v =>
    !v ? 'Alamat tidak boleh kosong.' : v.length < 10 ? 'Alamat terlalu singkat.' : '');

  // Payment validation
  const paymentError = document.getElementById('error-payment');
  const paymentSelected = document.querySelector('input[name="payment"]:checked');
  if (paymentError) {
    if (!paymentSelected) {
      paymentError.textContent = 'Pilih metode pembayaran.';
      valid = false;
    } else {
      paymentError.textContent = '';
    }
  }

  return !!valid;
}

// ── Form Submission ──
function initOrderForm() {
  const form       = document.getElementById('order-form');
  const successBox = document.getElementById('order-success');
  const resetBtn   = document.getElementById('order-reset-btn');
  const submitBtn  = document.getElementById('order-submit-btn');
  const submitText = document.getElementById('submit-text');
  const submitLoad = document.getElementById('submit-loading');
  if (!form) return;

  // Live-update total when product or qty changes
  const productSelect = document.getElementById('order-product');
  if (productSelect) productSelect.addEventListener('change', updateOrderTotal);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateOrderForm()) return;

    // Show loading state
    submitText.classList.add('hidden');
    submitLoad.classList.remove('hidden');
    submitBtn.disabled = true;

    // Simulate async processing (replace with real API call)
    await new Promise(resolve => setTimeout(resolve, 1600));

    // Show success
    form.classList.add('hidden');
    successBox.classList.remove('hidden');
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      successBox.classList.add('hidden');
      form.classList.remove('hidden');
      submitText.classList.remove('hidden');
      submitLoad.classList.add('hidden');
      submitBtn.disabled = false;
      document.getElementById('order-total').textContent = 'Rp —';
      // Clear all errors
      document.querySelectorAll('.wtb-form-error').forEach(el => el.textContent = '');
      document.querySelectorAll('.wtb-form-input').forEach(el => el.classList.remove('error'));
    });
  }

  // Real-time validation on blur
  ['order-name','order-phone','order-email','order-address'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur', () => {
        // trigger form validation for just that field
        validateField(id, 'error-' + id.replace('order-', ''), v => {
          if (!v) return id === 'order-address' ? 'Alamat tidak boleh kosong.' : 'Field ini wajib diisi.';
          return '';
        });
      });
    }
  });
}

// ── Initialise WTB page ──
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  if (page === 'where-to-buy.html') {
    initQtyControls();
    initOrderForm();
    initProductBuyButtons();
  }
});