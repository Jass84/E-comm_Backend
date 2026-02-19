'use strict';

/* ══════════════════════════════
   DATA
══════════════════════════════ */
const PRODUCTS = [
  /* ── WOMEN ── */
  { id:1,  title:'Floral Wrap Midi Dress',       brand:'AND',           price:1799, old:3599, discount:50, rating:4.5, reviews:2341, badge:'Sale',     images:['assets/images/product1.svg','assets/images/product2.svg'], cat:'women', sizes:['XS','S','M','L','XL'], colors:['Red','White'],  sub:'Dresses' },
  { id:3,  title:'Printed Kurta Set',             brand:'Biba',          price:999,  old:1999, discount:50, rating:4.6, reviews:3104, badge:'New',      images:['assets/images/product3.svg','assets/images/product4.svg'], cat:'women', sizes:['S','M','L','XL'],     colors:['Blue','Green'], sub:'Kurtas & Suits' },
  { id:5,  title:'Embroidered Anarkali',          brand:'Global Desi',   price:1649, old:2999, discount:45, rating:4.7, reviews:1450, badge:'Sale',     images:['assets/images/product5.svg','assets/images/product2.svg'], cat:'women', sizes:['S','M','L'],          colors:['Pink','Gold'],  sub:'Kurtas & Suits' },
  { id:7,  title:'High-Rise Flare Jeans',         brand:'Pepe Jeans',    price:1499, old:2799, discount:46, rating:4.5, reviews:2068, badge:'Sale',     images:['assets/images/product2.svg','assets/images/product6.svg'], cat:'women', sizes:['26','28','30','32'],   colors:['Blue','Black'], sub:'Jeans' },
  { id:9,  title:'Boho Printed Maxi Skirt',       brand:'Forever New',   price:1199, old:2199, discount:45, rating:4.4, reviews:876,  badge:'New',      images:['assets/images/product1.svg','assets/images/product3.svg'], cat:'women', sizes:['XS','S','M','L'],     colors:['Multicolor'],   sub:'Skirts' },
  { id:10, title:'Ruffle Sleeve Crop Top',        brand:'H&M',           price:599,  old:1099, discount:46, rating:4.2, reviews:1243, badge:'Hot',      images:['assets/images/product4.svg','assets/images/product5.svg'], cat:'women', sizes:['XS','S','M','L','XL'], colors:['White','Black'], sub:'Tops & Tees' },
  { id:11, title:'Strappy Palazzo Set',           brand:'W for Woman',   price:1349, old:2499, discount:46, rating:4.5, reviews:956,  badge:'Top Pick', images:['assets/images/product6.svg','assets/images/product1.svg'], cat:'women', sizes:['S','M','L','XL'],     colors:['Teal','Cream'], sub:'Co-ord Sets' },
  { id:12, title:'Velvet Wrap Blazer',            brand:'AND',           price:2499, old:4499, discount:44, rating:4.6, reviews:612,  badge:'New',      images:['assets/images/product2.svg','assets/images/product4.svg'], cat:'women', sizes:['S','M','L'],          colors:['Black','Wine'],  sub:'Jackets' },

  /* ── MEN ── */
  { id:2,  title:'Slim Fit Stretch Chinos',       brand:'Arrow',         price:1299, old:2499, discount:48, rating:4.3, reviews:1820, badge:'Top Pick', images:['assets/images/product2.svg','assets/images/product3.svg'], cat:'men', sizes:['28','30','32','34','36'], colors:['Khaki','Navy'], sub:'Trousers' },
  { id:4,  title:'Puffer Quilted Jacket',         brand:'Roadster',      price:2199, old:4299, discount:49, rating:4.4, reviews:983,  badge:'Hot',      images:['assets/images/product4.svg','assets/images/product1.svg'], cat:'men', sizes:['S','M','L','XL','XXL'],   colors:['Olive','Black'], sub:'Jackets' },
  { id:6,  title:'Graphic Oversized Tee',         brand:'H&M',           price:699,  old:1299, discount:46, rating:4.2, reviews:678,  badge:'New',      images:['assets/images/product6.svg','assets/images/product5.svg'], cat:'men', sizes:['S','M','L','XL','XXL'],   colors:['White','Grey'], sub:'T-Shirts' },
  { id:8,  title:'Checked Formal Shirt',          brand:'Peter England', price:899,  old:1699, discount:47, rating:4.3, reviews:1122, badge:'Top Pick', images:['assets/images/product3.svg','assets/images/product4.svg'], cat:'men', sizes:['38','40','42','44'],       colors:['Blue','White'], sub:'Shirts' },
  { id:13, title:'Slim Fit Jogger Pants',         brand:'U.S. Polo',     price:1099, old:1999, discount:45, rating:4.4, reviews:2341, badge:'Sale',     images:['assets/images/product5.svg','assets/images/product6.svg'], cat:'men', sizes:['S','M','L','XL','XXL'],   colors:['Grey','Black'], sub:'Track Pants' },
  { id:14, title:'Raw Hem Straight Jeans',        brand:'Levis',         price:1899, old:3499, discount:46, rating:4.6, reviews:3104, badge:'Hot',      images:['assets/images/product1.svg','assets/images/product2.svg'], cat:'men', sizes:['28','30','32','34','36'], colors:['Blue','Grey'],  sub:'Jeans' },
  { id:15, title:'Classic Oxford Button-Down',    brand:'Van Heusen',    price:1199, old:2199, discount:45, rating:4.5, reviews:1456, badge:'New',      images:['assets/images/product3.svg','assets/images/product5.svg'], cat:'men', sizes:['38','40','42','44','46'], colors:['White','Mint'], sub:'Shirts' },
  { id:16, title:'Performance Track Suit',        brand:'Roadster',      price:1799, old:3299, discount:45, rating:4.3, reviews:789,  badge:'Top Pick', images:['assets/images/product4.svg','assets/images/product6.svg'], cat:'men', sizes:['S','M','L','XL','XXL'],   colors:['Black','Blue'], sub:'Track Suits' },

  /* ── KIDS ── */
  { id:17, title:'Unicorn Print Frock',           brand:'Pantaloons',    price:599,  old:1199, discount:50, rating:4.7, reviews:1234, badge:'New',      images:['assets/images/product1.svg','assets/images/product3.svg'], cat:'kids', sizes:['2-3Y','4-5Y','6-7Y','8-9Y'], colors:['Pink','White'],   sub:'Frocks' },
  { id:18, title:'Cartoon Graphic Tee — Boys',   brand:'H&M',           price:399,  old:799,  discount:50, rating:4.5, reviews:876,  badge:'Hot',      images:['assets/images/product2.svg','assets/images/product4.svg'], cat:'kids', sizes:['3-4Y','5-6Y','7-8Y','9-10Y'], colors:['Blue','Red'],   sub:'T-Shirts' },
  { id:19, title:'Floral Party Dress — Girls',   brand:'AND',           price:849,  old:1599, discount:47, rating:4.6, reviews:654,  badge:'Sale',     images:['assets/images/product5.svg','assets/images/product1.svg'], cat:'kids', sizes:['2-3Y','4-5Y','6-7Y'],     colors:['Yellow','Pink'],  sub:'Party Wear' },
  { id:20, title:'Denim Shorts — Boys',          brand:'Roadster',      price:499,  old:999,  discount:50, rating:4.3, reviews:543,  badge:'Top Pick', images:['assets/images/product6.svg','assets/images/product2.svg'], cat:'kids', sizes:['4-5Y','6-7Y','8-9Y','10-11Y'], colors:['Blue'],       sub:'Shorts' },
  { id:21, title:'Embroidered Salwar Set',        brand:'Biba',          price:749,  old:1499, discount:50, rating:4.8, reviews:987,  badge:'New',      images:['assets/images/product3.svg','assets/images/product6.svg'], cat:'kids', sizes:['3-4Y','5-6Y','7-8Y','9-10Y'], colors:['Green','Pink'], sub:'School Uniform' },
  { id:22, title:'School Uniform Set',            brand:'Pantaloons',    price:649,  old:1199, discount:46, rating:4.4, reviews:432,  badge:'Hot',      images:['assets/images/product4.svg','assets/images/product5.svg'], cat:'kids', sizes:['4-5Y','6-7Y','8-9Y'],     colors:['White','Navy'],  sub:'School Uniform' },

  /* ── HOME ── */
  { id:23, title:'Luxe 400TC Cotton Bedsheet Set', brand:'Pantaloons',  price:1299, old:2499, discount:48, rating:4.6, reviews:2134, badge:'Sale',     images:['assets/images/product1.svg','assets/images/product2.svg'], cat:'home', sizes:['Single','Double','King'], colors:['White','Grey','Blue'], sub:'Bedsheets' },
  { id:24, title:'Scented Pillar Candle Set×3',   brand:'W for Woman',  price:699,  old:1299, discount:46, rating:4.5, reviews:876,  badge:'New',      images:['assets/images/product3.svg','assets/images/product4.svg'], cat:'home', sizes:['One Size'],               colors:['Ivory','Sage'],        sub:'Candles' },
  { id:25, title:'Woven Cotton Throw Blanket',    brand:'Pantaloons',   price:1499, old:2799, discount:46, rating:4.7, reviews:1234, badge:'Hot',      images:['assets/images/product5.svg','assets/images/product6.svg'], cat:'home', sizes:['One Size'],               colors:['Taupe','Mustard'],     sub:'Blankets' },
  { id:26, title:'Boho Macramé Wall Hanging',     brand:'Forever New',  price:899,  old:1699, discount:47, rating:4.4, reviews:654,  badge:'Top Pick', images:['assets/images/product2.svg','assets/images/product3.svg'], cat:'home', sizes:['30cm','50cm','80cm'],     colors:['Natural','Black'],     sub:'Wall Art' },
  { id:27, title:'Premium Cookware Set 5Pc',      brand:'Pantaloons',   price:3499, old:6499, discount:46, rating:4.8, reviews:987,  badge:'Sale',     images:['assets/images/product1.svg','assets/images/product4.svg'], cat:'home', sizes:['One Size'],               colors:['Black','Silver'],      sub:'Cookware' },
  { id:28, title:'Morrocan Print Curtains Pair',  brand:'W for Woman',  price:1199, old:2199, discount:45, rating:4.3, reviews:432,  badge:'New',      images:['assets/images/product5.svg','assets/images/product2.svg'], cat:'home', sizes:['4ft','5ft','7ft'],        colors:['Rust','Teal'],         sub:'Curtains' },

  /* ── BEAUTY ── */
  { id:29, title:'Vitamin C Brightening Serum',  brand:'Pantaloons',   price:799,  old:1499, discount:47, rating:4.7, reviews:3421, badge:'Hot',      images:['assets/images/product3.svg','assets/images/product5.svg'], cat:'beauty', sizes:['30ml','50ml'],          colors:['N/A'],  sub:'Serums' },
  { id:30, title:'Matte Velvet Lipstick',         brand:'AND',          price:349,  old:699,  discount:50, rating:4.6, reviews:2345, badge:'New',      images:['assets/images/product6.svg','assets/images/product1.svg'], cat:'beauty', sizes:['One Size'],             colors:['Ruby Red','Nude','Rose'], sub:'Lipsticks' },
  { id:31, title:'Argan Oil Hair Repair Mask',   brand:'Global Desi',  price:599,  old:1099, discount:46, rating:4.5, reviews:1234, badge:'Sale',     images:['assets/images/product2.svg','assets/images/product4.svg'], cat:'beauty', sizes:['150g','250g'],          colors:['N/A'],  sub:'Hair Masks' },
  { id:32, title:'SPF 50 Daily Sunscreen',        brand:'Biba',         price:449,  old:849,  discount:47, rating:4.8, reviews:4321, badge:'Top Pick', images:['assets/images/product3.svg','assets/images/product6.svg'], cat:'beauty', sizes:['50ml','100ml'],         colors:['N/A'],  sub:'Sunscreen' },
  { id:33, title:'Highlighter Glow Palette',      brand:'H&M',          price:649,  old:1199, discount:46, rating:4.4, reviews:876,  badge:'Hot',      images:['assets/images/product1.svg','assets/images/product3.svg'], cat:'beauty', sizes:['One Size'],             colors:['Gold','Rose Gold'],      sub:'Makeup' },
  { id:34, title:'Keratin Smooth Shampoo 400ml', brand:'Forever New',  price:499,  old:999,  discount:50, rating:4.5, reviews:654,  badge:'New',      images:['assets/images/product4.svg','assets/images/product2.svg'], cat:'beauty', sizes:['200ml','400ml'],        colors:['N/A'],  sub:'Shampoos' },
];

const MEGA_DATA = {
  women: {
    cols: [
      { h:'Indian Wear', li:['Kurtas & Suits','Sarees','Lehengas','Salwar Kameez','Blouses','Dupattas'] },
      { h:'Western Wear', li:['Tops & Tees','Dresses','Jeans','Trousers','Skirts','Shorts'] },
      { h:'Fusion', li:['Tunics','Palazzos','Shrugs','Jackets','Co-ord Sets','Jumpsuits'] },
    ],
    img: 'assets/images/cat-women.svg',
  },
  men: {
    cols: [
      { h:'Topwear', li:['T-Shirts','Shirts','Sweatshirts','Jackets','Blazers','Suits'] },
      { h:'Bottomwear', li:['Jeans','Trousers','Shorts','Track Pants','Joggers','Chinos'] },
      { h:'Ethnic', li:['Kurtas','Sherwanis','Dhoti Pants','Nehru Jackets','Pathani Sets','Bandhgalas'] },
    ],
    img: 'assets/images/cat-men.svg',
  },
  kids: {
    cols: [
      { h:'Girls', li:['Dresses','Tops','Leggings','Frocks','School Uniform','Party Wear'] },
      { h:'Boys', li:['T-Shirts','Shorts','Jeans','Shirts','Track Suits','Ethnic Wear'] },
      { h:'Accessories', li:['Bags','Shoes','Caps','Sunglasses','Socks','Hair Accessories'] },
    ],
    img: 'assets/images/cat-kids.svg',
  },
  home: {
    cols: [
      { h:'Bed & Bath', li:['Bedsheets','Pillowcases','Towels','Blankets','Comforters','Cushions'] },
      { h:'Décor', li:['Wall Art','Candles','Vases','Photo Frames','Rugs','Curtains'] },
      { h:'Kitchen', li:['Cookware','Dinnerware','Cutlery','Storage','Appliances','Bar Ware'] },
    ],
    img: 'assets/images/cat-home.svg',
  },
  beauty: {
    cols: [
      { h:'Skin Care', li:['Moisturisers','Serums','Sunscreen','Face Wash','Toners','Eye Care'] },
      { h:'Makeup', li:['Lipsticks','Foundation','Eye Shadow','Blush','Mascara','BB Cream'] },
      { h:'Hair Care', li:['Shampoos','Conditioners','Hair Oils','Hair Masks','Serums','Styling'] },
    ],
    img: 'assets/images/hero3.svg',
  },
};

const BRANDS = ['Pantaloons','Roadster','H&M','Zara','U.S. Polo','Van Heusen','Biba','AND','Arrow','Levis','Peter England','Global Desi','Forever New','W for Woman'];

/* ══════════════════════════════
   UTILS
══════════════════════════════ */
function showToast(msg, good = true) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${good ? '#4caf50' : '#f44336'}" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg> ${msg}`;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ══════════════════════════════
   CART
══════════════════════════════ */
function getCart() { try { return JSON.parse(localStorage.getItem('cm_cart') || '[]'); } catch { return []; } }
function saveCart(c) {
  localStorage.setItem('cm_cart', JSON.stringify(c));
  updateCartBadge();
  // Badge bump animation
  document.querySelectorAll('.cart-count').forEach(el => {
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 420);
  });
}
function updateCartBadge() {
  const n = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = n || '0');
}
function addToCart(product, size) {
  const cart = getCart();
  const key = `${product.id}_${size}`;
  const idx = cart.findIndex(i => i.key === key);
  if (idx > -1) { cart[idx].qty++; } else {
    cart.push({ key, id: product.id, title: product.title, brand: product.brand, price: product.price, old: product.old, size, img: product.images[0], qty: 1 });
  }
  saveCart(cart);
  showToast('Added to bag! 🛍️');
}
function removeFromCart(key) { saveCart(getCart().filter(i => i.key !== key)); renderCartPage(); }
function changeQty(key, delta) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.key === key);
  if (idx === -1) return;
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  saveCart(cart);
  renderCartPage();
}

/* ══════════════════════════════
   WISHLIST
══════════════════════════════ */
function getWishlist() { try { return JSON.parse(localStorage.getItem('cm_wish') || '[]'); } catch { return []; } }
function saveWishlist(w) { localStorage.setItem('cm_wish', JSON.stringify(w)); updateWishBadge(); }
function updateWishBadge() {
  const n = getWishlist().length;
  document.querySelectorAll('.wish-count').forEach(el => { el.textContent = n; el.style.display = n ? 'flex' : 'none'; });
}
function toggleWishlist(pid, btn) {
  const w = getWishlist();
  const id = String(pid);
  const idx = w.indexOf(id);
  if (idx > -1) { w.splice(idx, 1); btn && btn.classList.remove('active'); showToast('Removed from wishlist'); }
  else { w.push(id); btn && btn.classList.add('active'); showToast('Added to wishlist ♥'); }
  saveWishlist(w);
}

/* ══════════════════════════════
   SEARCH
══════════════════════════════ */
function initSearch() {
  document.querySelectorAll('.nav-search input').forEach(input => {
    const wrap = input.closest('.nav-search');
    let dropdown = wrap.querySelector('.search-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'search-dropdown';
      wrap.style.position = 'relative';
      wrap.appendChild(dropdown);
    }
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { dropdown.classList.remove('show'); return; }
      const results = PRODUCTS.filter(p => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)).slice(0, 5);
      if (!results.length) { dropdown.innerHTML = '<div class="sd-empty">No results found</div>'; dropdown.classList.add('show'); return; }
      dropdown.innerHTML = results.map(p => `
        <a class="sd-item" href="product.html?pid=${p.id}">
          <img src="${p.images[0]}" alt="${p.title}">
          <div class="sd-info">
            <div class="sd-brand">${p.brand}</div>
            <div class="sd-title">${p.title}</div>
            <div class="sd-price">₹${p.price.toLocaleString()} <span>₹${p.old.toLocaleString()}</span></div>
          </div>
        </a>
      `).join('');
      dropdown.classList.add('show');
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) { window.location.href = `category.html?q=${encodeURIComponent(q)}`; }
      }
      if (e.key === 'Escape') { dropdown.classList.remove('show'); input.blur(); }
    });
    document.addEventListener('click', e => { if (!wrap.contains(e.target)) dropdown.classList.remove('show'); });
  });
}

/* ══════════════════════════════
   SIGN IN MODAL
══════════════════════════════ */
function initAuthModal() {
  // Create modal if not exists
  if (document.getElementById('authModal')) return;
  const modal = document.createElement('div');
  modal.id = 'authModal';
  modal.innerHTML = `
    <div class="auth-backdrop"></div>
    <div class="auth-box">
      <button class="auth-close">&times;</button>
      <div class="auth-logo">ClassMora</div>
      <div class="auth-tabs">
        <button class="auth-tab active" data-panel="signin">Sign In</button>
        <button class="auth-tab" data-panel="register">Register</button>
      </div>
      <div id="signin" class="auth-panel active">
        <div class="auth-field"><label>Email</label><input type="email" placeholder="Enter your email" id="siEmail"></div>
        <div class="auth-field"><label>Password</label><input type="password" placeholder="Enter password" id="siPass"></div>
        <button class="auth-submit" id="siBtn">Sign In</button>
        <div class="auth-sep">or continue with</div>
        <div class="auth-social">
          <button class="auth-soc-btn">Google</button>
          <button class="auth-soc-btn">Facebook</button>
        </div>
        <div class="auth-note"><a href="#">Forgot Password?</a></div>
      </div>
      <div id="register" class="auth-panel">
        <div class="auth-field"><label>Full Name</label><input type="text" placeholder="Your full name" id="regName"></div>
        <div class="auth-field"><label>Email</label><input type="email" placeholder="Enter your email" id="regEmail"></div>
        <div class="auth-field"><label>Password</label><input type="password" placeholder="Create password" id="regPass"></div>
        <button class="auth-submit" id="regBtn">Create Account</button>
        <div class="auth-note">By registering, you agree to our <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a></div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Tabs
  modal.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      modal.querySelectorAll('.auth-tab,.auth-panel').forEach(el => el.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.panel).classList.add('active');
    });
  });

  // Close
  modal.querySelector('.auth-close').addEventListener('click', () => closeModal());
  modal.querySelector('.auth-backdrop').addEventListener('click', () => closeModal());

  // Sign in submit
  document.getElementById('siBtn').addEventListener('click', () => {
    const email = document.getElementById('siEmail').value.trim();
    const pass  = document.getElementById('siPass').value;
    if (!email || !pass) { showToast('Please fill all fields', false); return; }
    localStorage.setItem('cm_user', JSON.stringify({ name: email.split('@')[0], email }));
    closeModal(); showToast('Welcome back! 👋'); updateUserNav();
  });

  // Register submit
  document.getElementById('regBtn').addEventListener('click', () => {
    const name  = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass  = document.getElementById('regPass').value;
    if (!name || !email || !pass) { showToast('Please fill all fields', false); return; }
    localStorage.setItem('cm_user', JSON.stringify({ name, email }));
    closeModal(); showToast(`Welcome, ${name}! 🎉`); updateUserNav();
  });

  function closeModal() { modal.classList.remove('open'); }
}

function openAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.add('open');
}

function updateUserNav() {
  const user = JSON.parse(localStorage.getItem('cm_user') || 'null');
  document.querySelectorAll('.signin-link').forEach(el => {
    if (user) {
      el.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${user.name.split(' ')[0]}`;
      el.href = '#';
      el.onclick = (e) => { e.preventDefault(); if(confirm('Sign out?')){ localStorage.removeItem('cm_user'); location.reload(); } };
    } else {
      el.textContent = 'Sign In';
      el.onclick = (e) => { e.preventDefault(); openAuthModal(); };
    }
  });
}

/* ══════════════════════════════
   DARK MODE
══════════════════════════════ */
function initDarkMode() {
  const toggles = document.querySelectorAll('#darkToggle');
  const applyDark = (on) => {
    document.body.classList.toggle('dark-mode', on);
    localStorage.setItem('cm_dark', on ? '1' : '0');
    toggles.forEach(t => t.checked = on);
  };
  const saved = localStorage.getItem('cm_dark') === '1';
  applyDark(saved);
  toggles.forEach(t => t.addEventListener('change', () => applyDark(t.checked)));
}

/* ══════════════════════════════
   PRODUCT GRID RENDER
══════════════════════════════ */
/* colour name → rough CSS colour for swatch dots */
const COLOR_MAP = {
  red:'#e53935',white:'#fff',black:'#212121',blue:'#1e88e5',navy:'#1a237e',
  green:'#43a047',pink:'#e91e8c',gold:'#f9a825',wine:'#880e4f',teal:'#00897b',
  khaki:'#9e9d24',olive:'#558b2f',grey:'#9e9e9e',gray:'#9e9e9e',beige:'#d7ccc8',
  cream:'#fff8e1',mustard:'#f9a825',taupe:'#8d6e63',rust:'#bf360c',sage:'#aed581',
  ivory:'#fffff0',natural:'#d7c4a3',mint:'#b2dfdb',rose:'#f48fb1',nude:'#d7a99b',
  multicolor:'linear-gradient(135deg,#e53935,#f9a825,#43a047,#1e88e5)',
  silver:'#bdbdbd',yellow:'#fdd835',ruby:'#b71c1c',
};
function colorSwatch(c) {
  const key = c.toLowerCase().replace(/[^a-z]/g,'');
  const bg  = COLOR_MAP[key] || '#ccc';
  const border = (key === 'white' || key === 'cream' || key === 'ivory') ? '1.5px solid #ccc' : '1.5px solid transparent';
  return `<span class="pc-color-dot" title="${c}" style="background:${bg};border:${border}"></span>`;
}

function renderGrid(containerId, list) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!list.length) {
    el.innerHTML = `<div class="no-results" style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#888">
      <div style="font-size:3rem;margin-bottom:12px">🔍</div>
      <h3 style="font-size:1.1rem;margin:0 0 6px">No products found</h3>
      <p style="margin:0;font-size:.88rem">Try adjusting your filters or browse another category.</p></div>`;
    return;
  }
  const wishlist = getWishlist();
  el.innerHTML = list.map(p => {
    const sizes   = (p.sizes  || []).slice(0, 5);
    const colors  = (p.colors || []).filter(c => c !== 'N/A').slice(0, 5);
    const savings = p.old - p.price;
    return `
    <div class="product-card" data-pid="${p.id}">
      <div class="pc-img">
        <img src="${p.images[0]}" alt="${p.title}" loading="lazy" data-img0="${p.images[0]}" data-img1="${p.images[1] || p.images[0]}">
        ${p.badge ? `<span class="badge badge-${p.badge === 'Sale' ? 'sale' : p.badge === 'New' ? 'new' : 'hot'}">${p.badge}</span>` : ''}
        <div class="pc-discount-ribbon">${p.discount}% OFF</div>
        <button class="wl-btn ${wishlist.includes(String(p.id)) ? 'active' : ''}" title="Wishlist" data-pid="${p.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <button class="pc-quick" data-pid="${p.id}">Quick View</button>
      </div>
      <div class="pc-body">
        <div class="pc-meta-row">
          <span class="pc-brand">${p.brand}</span>
          ${p.sub ? `<span class="pc-sub-tag">${p.sub}</span>` : ''}
        </div>
        <div class="pc-title">${p.title}</div>
        <div class="pc-rating">
          ${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}
          <span class="rating-pill">★ ${p.rating}</span>
          <span class="review-ct">(${p.reviews.toLocaleString()})</span>
        </div>
        <div class="pc-price">
          <span class="now">₹${p.price.toLocaleString()}</span>
          <span class="old">₹${p.old.toLocaleString()}</span>
          <span class="off">${p.discount}% off</span>
        </div>
        <div class="pc-savings">You save ₹${savings.toLocaleString()}</div>
        ${colors.length ? `<div class="pc-colors">${colors.map(colorSwatch).join('')}${p.colors.filter(c=>c!=='N/A').length > 5 ? `<span class="pc-more-colors">+${p.colors.filter(c=>c!=='N/A').length-5}</span>`:''}</div>` : ''}
        ${sizes.length ? `<div class="pc-sizes">${sizes.map(s => `<span class="pc-size-tag">${s}</span>`).join('')}${p.sizes.length>5?`<span class="pc-more-colors">+${p.sizes.length-5}</span>`:''}</div>` : ''}
      </div>
      <button class="pc-atc" data-pid="${p.id}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        Add to Bag
      </button>
    </div>`;
  }).join('');

  el.querySelectorAll('.pc-img img').forEach(img => {
    img.addEventListener('mouseenter', () => { img.src = img.dataset.img1; });
    img.addEventListener('mouseleave', () => { img.src = img.dataset.img0; });
  });
  el.querySelectorAll('.wl-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggleWishlist(btn.dataset.pid, btn); });
  });
  el.querySelectorAll('.pc-quick').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); window.location.href = `product.html?pid=${btn.dataset.pid}`; });
  });
  el.querySelectorAll('.pc-atc').forEach(btn => {
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); addToCart(PRODUCTS.find(x => x.id == btn.dataset.pid), 'M'); });
  });
  el.querySelectorAll('.product-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', e => { if (e.target.closest('button')) return; window.location.href = `product.html?pid=${card.dataset.pid}`; });
  });
}

/* ══════════════════════════════
   CAROUSEL
══════════════════════════════ */
function initCarousel(id, dotsId) {
  const wrap = document.getElementById(id);
  if (!wrap) return;
  const slides = wrap.querySelector('.slides');
  const items  = wrap.querySelectorAll('.slide');
  const dotsEl = document.getElementById(dotsId);
  let cur = 0, timer;
  if (dotsEl) {
    items.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => { stop(); go(i); start(); });
      dotsEl.appendChild(d);
    });
  }
  function go(n) {
    cur = (n + items.length) % items.length;
    slides.style.transform = `translateX(-${cur * 100}%)`;
    dotsEl?.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === cur));
  }
  function start() { timer = setInterval(() => go(cur + 1), 5000); }
  function stop()  { clearInterval(timer); }
  wrap.querySelector('.carousel-prev')?.addEventListener('click', () => { stop(); go(cur - 1); start(); });
  wrap.querySelector('.carousel-next')?.addEventListener('click', () => { stop(); go(cur + 1); start(); });
  wrap.addEventListener('mouseenter', stop);
  wrap.addEventListener('mouseleave', start);
  start();
}

/* ══════════════════════════════
   MEGA MENU
══════════════════════════════ */
function initMegaMenu() {
  document.querySelectorAll('.nav-item[data-cat]').forEach(item => {
    const cat  = item.dataset.cat;
    const data = MEGA_DATA[cat];
    const menu = item.querySelector('.mega');
    if (!data || !menu) return;
    const cols = data.cols.map(c => `
      <div class="mega-col">
        <h5>${c.h}</h5>
        <ul>${c.li.map(l => `<li><a href="category.html?cat=${cat}&sub=${encodeURIComponent(l)}">${l}</a></li>`).join('')}</ul>
      </div>`).join('');
    menu.innerHTML = `
      <div class="mega-inner">
        ${cols}
        <div class="mega-img">
          <img src="${data.img}" alt="${cat}">
          <div class="mega-img-label">${cat.charAt(0).toUpperCase()+cat.slice(1)} Collection</div>
        </div>
      </div>`;
  });
  // Mark active nav item by current page
  const cat = new URLSearchParams(location.search).get('cat');
  if (cat) document.querySelectorAll(`.nav-item[data-cat="${cat}"]`).forEach(el => el.classList.add('active'));
}

/* ══════════════════════════════
   STICKY NAV
══════════════════════════════ */
function initStickyNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 10), { passive: true });
}

/* ══════════════════════════════
   BRAND LOGOS STRIP
══════════════════════════════ */
function initBrandStrip() {
  const el = document.getElementById('brandLogos');
  if (!el) return;
  const all = [...BRANDS, ...BRANDS];
  el.innerHTML = all.map(b => `<div class="brand-logo-item">${b}</div>`).join('');
}

/* ══════════════════════════════
   FILTERS
══════════════════════════════ */
function initFilters() {
  document.querySelectorAll('.filter-toggle').forEach((btn, idx) => {
    btn.addEventListener('click', () => { btn.classList.toggle('open'); btn.nextElementSibling.classList.toggle('show'); });
    if (idx < 2) { btn.classList.add('open'); btn.nextElementSibling.classList.add('show'); }
  });
  document.getElementById('clearAll')?.addEventListener('click', () => {
    document.querySelectorAll('.filter-body input[type=checkbox]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.size-btn.active').forEach(b => b.classList.remove('active'));
  });
}

/* ══════════════════════════════
   CATEGORY PAGE
══════════════════════════════ */
const CAT_META = {
  women:  { label:'Women',        desc:'Explore the latest Indian & Western wear for women',  color:'#d81b2a', img:'assets/images/cat-women.svg' },
  men:    { label:'Men',          desc:'Sharp formals, casuals & ethnic wear for men',         color:'#1a237e', img:'assets/images/cat-men.svg'   },
  kids:   { label:'Kids',         desc:'Cute, comfy & colourful styles for your little ones', color:'#e65100', img:'assets/images/cat-kids.svg'  },
  home:   { label:'Home & Living',desc:'Refresh your space with premium décor & essentials',  color:'#2e7d32', img:'assets/images/cat-home.svg'  },
  beauty: { label:'Beauty',       desc:'Skin care, makeup & hair care from top brands',       color:'#880e4f', img:'assets/images/hero3.svg'     },
  sale:   { label:'Sale 🔥',      desc:'Up to 60% off — limited time deals across all categories', color:'#bf360c', img:'assets/images/offer1.svg' },
  all:    { label:'All Products', desc:'Browse the complete ClassMora collection',             color:'#1a1a1a', img:'assets/images/hero1.svg'     },
};

function initCategoryPage() {
  const grid = document.getElementById('categoryGrid');
  if (!grid) return;

  const params = new URLSearchParams(location.search);
  const cat    = (params.get('cat') || 'all').toLowerCase();
  const q      = params.get('q') || '';
  const sub    = params.get('sub') || '';
  const meta   = CAT_META[cat] || CAT_META['all'];

  /* ---------- Page title ---------- */
  document.title = (q ? `Search: ${q}` : meta.label) + ' — ClassMora';

  /* ---------- Category hero banner ---------- */
  const hero = document.getElementById('catHero');
  if (hero) {
    hero.style.background = `linear-gradient(135deg, ${meta.color}ee 0%, ${meta.color}99 100%)`;
    hero.innerHTML = `
      <div class="cat-hero-inner">
        <div class="cat-hero-text">
          <div class="cat-hero-tag">${q ? 'Search Results' : 'ClassMora'}</div>
          <h1>${q ? `"${q}"` : meta.label}</h1>
          <p>${q ? `Showing products matching your search` : meta.desc}</p>
          ${sub ? `<div class="cat-hero-sub-pill">${sub}</div>` : ''}
        </div>
        <img src="${meta.img}" alt="${meta.label}" class="cat-hero-img">
      </div>`;
  }

  /* ---------- Breadcrumb ---------- */
  const bc = document.getElementById('catBreadcrumb');
  if (bc) {
    bc.innerHTML = `
      <a href="index.html">Home</a>
      <span class="sep">›</span>
      ${q ? `<span>Search</span><span class="sep">›</span><span>${q}</span>` :
        cat !== 'all' ? `<span>${meta.label}</span>${sub ? `<span class="sep">›</span><span>${sub}</span>` : ''}` :
        '<span>All Products</span>'}`;
  }

  /* ---------- Filter list heading ---------- */
  const catHeading = document.getElementById('catHeading');
  if (catHeading) catHeading.textContent = q ? `Showing results for "${q}"` : meta.label;

  /* ---------- Build product list ---------- */
  let baseList = PRODUCTS.filter(p => {
    if (q)   return p.title.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase());
    if (sub) return p.sub === sub && (cat === 'all' || p.cat === cat);
    if (cat === 'sale') return p.discount >= 45;
    if (cat === 'all')  return true;
    return p.cat === cat;
  });

  /* ---------- Populate brand filters dynamically ---------- */
  const brandBody = document.getElementById('filterBrands');
  if (brandBody) {
    const brands = [...new Set(baseList.map(p => p.brand))].sort();
    brandBody.innerHTML = brands.map(b => `
      <label><input type="checkbox" value="${b}" data-filter="brand"> ${b}</label>`).join('');
  }

  /* ---------- Populate sub-category filters ---------- */
  const subBody = document.getElementById('filterSubs');
  if (subBody && cat !== 'all') {
    const subs = [...new Set(baseList.map(p => p.sub).filter(Boolean))].sort();
    subBody.innerHTML = subs.map(s => `
      <label><input type="checkbox" value="${s}" data-filter="sub"> ${s}</label>`).join('');
    document.getElementById('filterSubGroup')?.removeAttribute('hidden');
  }

  let currentList = [...baseList];
  renderGrid('categoryGrid', currentList);
  updateCount(currentList.length);

  /* ---------- Filters apply ---------- */
  function applyFilters() {
    const checkedBrands = [...document.querySelectorAll('[data-filter="brand"]:checked')].map(c => c.value);
    const checkedSubs   = [...document.querySelectorAll('[data-filter="sub"]:checked')].map(c => c.value);
    const checkedPrices = [...document.querySelectorAll('[data-filter="price"]:checked')].map(c => c.value);
    const activeSizes   = [...document.querySelectorAll('.size-btn.active')].map(b => b.textContent.trim());

    currentList = baseList.filter(p => {
      if (checkedBrands.length && !checkedBrands.includes(p.brand)) return false;
      if (checkedSubs.length   && !checkedSubs.includes(p.sub))     return false;
      if (activeSizes.length   && !(p.sizes || []).some(s => activeSizes.includes(s))) return false;
      if (checkedPrices.length) {
        const inRange = checkedPrices.some(r => {
          if (r === 'u999')  return p.price < 999;
          if (r === '1-2k')  return p.price >= 1000 && p.price < 2000;
          if (r === '2-4k')  return p.price >= 2000 && p.price < 4000;
          if (r === '4k+')   return p.price >= 4000;
          return true;
        });
        if (!inRange) return false;
      }
      return true;
    });
    applySortAndRender();
    updateCount(currentList.length);
  }

  function applySortAndRender() {
    const v = document.getElementById('sortSelect')?.value || 'recommended';
    const sorted = [...currentList];
    if (v === 'price_asc')  sorted.sort((a,b) => a.price - b.price);
    if (v === 'price_desc') sorted.sort((a,b) => b.price - a.price);
    if (v === 'rating')     sorted.sort((a,b) => b.rating - a.rating);
    if (v === 'discount')   sorted.sort((a,b) => b.discount - a.discount);
    renderGrid('categoryGrid', sorted);
  }

  document.addEventListener('change', e => {
    if (e.target.matches('[data-filter]') || e.target.id === 'sortSelect') {
      if (e.target.id === 'sortSelect') applySortAndRender();
      else applyFilters();
    }
  });
  document.addEventListener('click', e => {
    if (e.target.matches('.size-btn')) {
      e.target.classList.toggle('active');
      applyFilters();
    }
  });
  document.getElementById('clearAll')?.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(el => el.checked = false);
    document.querySelectorAll('.size-btn.active').forEach(b => b.classList.remove('active'));
    currentList = [...baseList];
    renderGrid('categoryGrid', currentList);
    updateCount(currentList.length);
  });

  initFilters();
}

function updateCount(n) {
  document.querySelectorAll('.product-count').forEach(el => el.textContent = `${n} Products`);
}

/* ══════════════════════════════
   PRODUCT DETAIL PAGE
══════════════════════════════ */
function initProductPage() {
  const main = document.getElementById('pdpMain');
  if (!main) return;
  const pid = new URLSearchParams(location.search).get('pid');
  const p   = PRODUCTS.find(x => x.id == pid) || PRODUCTS[0];
  document.title = `${p.title} — ClassMora`;
  document.getElementById('pdpBrand').textContent   = p.brand;
  document.getElementById('pdpTitle').textContent   = p.title;
  document.getElementById('pdpPrice').textContent   = `₹${p.price.toLocaleString()}`;
  document.getElementById('pdpOld').textContent     = `₹${p.old.toLocaleString()}`;
  document.getElementById('pdpOff').textContent     = `(${p.discount}% off)`;
  document.getElementById('pdpRating').textContent  = `★ ${p.rating}`;
  document.getElementById('pdpReviews').textContent = `${p.reviews.toLocaleString()} ratings`;
  const mainImg = document.getElementById('pdpMainImg');
  if (mainImg) mainImg.src = p.images[0];

  const thumbs = document.getElementById('pdpThumbs');
  if (thumbs) {
    thumbs.innerHTML = p.images.map((src, i) => `<img class="thumb ${i===0?'selected':''}" src="${src}" alt="View ${i+1}">`).join('');
    thumbs.querySelectorAll('.thumb').forEach(t => {
      t.addEventListener('click', () => {
        thumbs.querySelectorAll('.thumb').forEach(x => x.classList.remove('selected'));
        t.classList.add('selected');
        if (mainImg) { mainImg.style.opacity = '0'; setTimeout(() => { mainImg.src = t.src; mainImg.style.opacity = '1'; }, 150); }
      });
    });
  }

  /* ── sizes from data ── */
  let selSize = (p.sizes || ['M'])[0];
  const sz = document.getElementById('pdpSizes');
  if (sz && p.sizes) {
    sz.innerHTML = p.sizes.map(s =>
      `<button class="size-chip${s===selSize?' selected':''}" data-size="${s}">${s}</button>`).join('');
    sz.querySelectorAll('.size-chip').forEach(c => {
      c.addEventListener('click', () => {
        sz.querySelectorAll('.size-chip').forEach(x => x.classList.remove('selected'));
        c.classList.add('selected'); selSize = c.dataset.size;
      });
    });
  }

  /* ── colors from data ── */
  const validColors = (p.colors || []).filter(c => c !== 'N/A');
  let colorsRow = document.getElementById('pdpColors');
  if (!colorsRow) {
    colorsRow = document.createElement('div');
    colorsRow.id = 'pdpColors';
    colorsRow.className = 'pdp-colors-row';
    sz?.insertAdjacentElement('afterend', colorsRow);
  }
  if (validColors.length) {
    colorsRow.innerHTML = `<div class="pdp-colors-label">Colour: <strong>${validColors[0]}</strong></div>
      <div class="pdp-colors-swatches">
        ${validColors.map((c,i) => {
          const key = c.toLowerCase().replace(/[^a-z]/g,'');
          const bg  = COLOR_MAP[key] || '#ccc';
          const border = (key==='white'||key==='cream'||key==='ivory') ? '2px solid #ccc' : '2px solid transparent';
          return `<button class="pdp-color-swatch${i===0?' active':''}" title="${c}" style="background:${bg};border:${border}" data-color="${c}"></button>`;
        }).join('')}
      </div>`;
    colorsRow.querySelectorAll('.pdp-color-swatch').forEach(btn => {
      btn.addEventListener('click', () => {
        colorsRow.querySelectorAll('.pdp-color-swatch').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        colorsRow.querySelector('.pdp-colors-label strong').textContent = btn.dataset.color;
      });
    });
  } else {
    colorsRow.remove();
  }

  /* ── product specs below description ── */
  const tabDesc = document.getElementById('tab-desc');
  if (tabDesc) {
    tabDesc.innerHTML = `
      <p>Elevate your wardrobe with this beautifully crafted <strong>${p.sub || p.cat}</strong>. Made from premium breathable fabric, it offers all-day comfort without compromising on style.</p>
      <table class="spec-table">
        <tr><th>Brand</th><td>${p.brand}</td></tr>
        <tr><th>Category</th><td>${p.sub || '—'}</td></tr>
        <tr><th>Available Sizes</th><td>${(p.sizes||[]).join(', ')}</td></tr>
        ${validColors.length ? `<tr><th>Available Colours</th><td>${validColors.join(', ')}</td></tr>` : ''}
        <tr><th>Rating</th><td>★ ${p.rating} / 5 (${p.reviews.toLocaleString()} ratings)</td></tr>
        <tr><th>MRP</th><td>₹${p.old.toLocaleString()} <span style="color:var(--success);font-weight:600">(${p.discount}% off)</span></td></tr>
        <tr><th>Delivery</th><td>Free delivery on orders above ₹999</td></tr>
        <tr><th>Return Policy</th><td>30-day hassle-free returns</td></tr>
      </table>`;
  }

  const wBtn = document.getElementById('pdpWishBtn');
  if (wBtn) {
    if (getWishlist().includes(String(p.id))) wBtn.classList.add('active');
    wBtn.addEventListener('click', () => toggleWishlist(p.id, wBtn));
  }
  document.getElementById('pdpCartBtn')?.addEventListener('click', () => addToCart(p, selSize));

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn,.tab-pane').forEach(el => el.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab)?.classList.add('active');
    });
  });
}

/* ══════════════════════════════
   CART PAGE
══════════════════════════════ */
function renderCartPage() {
  const wrap = document.getElementById('cartItems');
  if (!wrap) return;
  const cart = getCart();
  if (!cart.length) {
    wrap.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>
        <h3>Your bag is empty!</h3>
        <p>Looks like you haven't added anything yet.<br>Explore our latest collections.</p>
        <a href="index.html"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg> Continue Shopping</a>
      </div>`;
    document.getElementById('cartSummary')?.classList.add('hidden');
    const bc = document.getElementById('bagItemCount'); if (bc) bc.textContent = '0 Items';
    return;
  }
  document.getElementById('cartSummary')?.classList.remove('hidden');
  wrap.innerHTML = cart.map(i => `
    <div class="cart-item" data-key="${i.key}">
      <div class="ci-thumb"><img src="${i.img}" alt="${i.title}"></div>
      <div class="ci-body">
        <div class="ci-top">
          <div>
            <div class="ci-brand">${i.brand}</div>
            <div class="ci-title">${i.title}</div>
            <div class="ci-meta"><span>Size: ${i.size}</span><span>Qty: ${i.qty}</span></div>
          </div>
        </div>
        <div class="ci-bottom">
          <div class="ci-price-block">
            <span class="ci-price-now">₹${(i.price*i.qty).toLocaleString()}</span>
            <span class="ci-price-old">₹${(i.old*i.qty).toLocaleString()}</span>
            <span class="ci-price-off">${Math.round((1-i.price/i.old)*100)}% off</span>
          </div>
          <div class="ci-actions">
            <div class="qty-ctrl">
              <button class="qty-btn" data-key="${i.key}" data-d="-1">−</button>
              <span class="qty-val">${i.qty}</span>
              <button class="qty-btn" data-key="${i.key}" data-d="1">+</button>
            </div>
            <button class="rm-btn" data-key="${i.key}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg> Remove
            </button>
          </div>
        </div>
      </div>
    </div>`).join('');
  wrap.querySelectorAll('.qty-btn').forEach(btn => btn.addEventListener('click', () => changeQty(btn.dataset.key, parseInt(btn.dataset.d))));
  wrap.querySelectorAll('.rm-btn').forEach(btn => btn.addEventListener('click', () => removeFromCart(btn.dataset.key)));

  const mrp = cart.reduce((s,i) => s+i.old*i.qty, 0);
  const total = cart.reduce((s,i) => s+i.price*i.qty, 0);
  const disc = mrp - total;
  const del  = total >= 999 ? 0 : 99;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('smMrp',   `₹${mrp.toLocaleString()}`);
  set('smDisc',  `-₹${disc.toLocaleString()}`);
  set('smDel',   del === 0 ? 'FREE' : `₹${del}`);
  set('smTotal', `₹${(total+del).toLocaleString()}`);
  const savEl = document.getElementById('smSaving');
  if (savEl && disc > 0) { savEl.style.display='flex'; const sp=savEl.querySelector('span'); if(sp) sp.textContent=`You will save ₹${disc.toLocaleString()} on this order!`; }
  const bc = document.getElementById('bagItemCount');
  if (bc) { const n=cart.reduce((s,i)=>s+i.qty,0); bc.textContent=n+' Item'+(n!==1?'s':''); }
}

/* ══════════════════════════════
   NEWSLETTER
══════════════════════════════ */
function initNewsletter() {
  document.getElementById('nlForm')?.addEventListener('submit', e => {
    e.preventDefault(); showToast('Subscribed! 🎉 Thank you!'); e.target.reset();
  });
}

/* ══════════════════════════════
   ANNOUNCEMENT TICKER
══════════════════════════════ */
function initAnnouncementClose() {
  document.getElementById('annClose')?.addEventListener('click', () => {
    const ann = document.querySelector('.announcement');
    if (ann) { ann.style.maxHeight = '0'; ann.style.padding = '0'; ann.style.overflow = 'hidden'; ann.style.transition = 'all .3s'; }
  });
}

/* ══════════════════════════════
   TOPBAR SIGN IN LINKS
══════════════════════════════ */
function initTopbarAuth() {
  document.querySelectorAll('.signin-link').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const user = JSON.parse(localStorage.getItem('cm_user') || 'null');
      if (user) { if (confirm(`Sign out, ${user.name}?`)) { localStorage.removeItem('cm_user'); location.reload(); } }
      else openAuthModal();
    });
  });
  document.querySelectorAll('.register-link').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      openAuthModal();
      setTimeout(() => document.querySelector('.auth-tab[data-panel="register"]')?.click(), 50);
    });
  });
}

/* ══════════════════════════════
   SCROLL REVEAL
══════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.section, .trust-item, .cat-card, .product-card, .offer-card, .footer-col, .cart-item, .product-layout, .section-hd');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
    io.observe(el);
  });

  // Stagger product grids
  document.querySelectorAll('.product-grid, .cat-grid, .trust-inner').forEach(grid => {
    grid.classList.add('stagger');
    const gridIo = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); gridIo.unobserve(e.target); } });
    }, { threshold: 0.05 });
    gridIo.observe(grid);
  });
}

/* ══════════════════════════════
   BACK TO TOP
══════════════════════════════ */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.innerHTML = '&#8679;';
  btn.title = 'Back to top';
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ══════════════════════════════
   ANNOUNCEMENT TICKER
══════════════════════════════ */
function initAnnouncementTicker() {
  const ann = document.querySelector('.announcement');
  if (!ann || ann.querySelector('.ann-ticker')) return;
  const text = ann.textContent.trim();
  const btn  = ann.querySelector('#annClose');
  ann.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'ann-ticker-wrap';
  const ticker = document.createElement('div');
  ticker.className = 'ann-ticker';
  // duplicate for seamless loop
  ticker.innerHTML = `<span>${text}</span><span>${text}</span><span>${text}</span><span>${text}</span>`;
  wrap.appendChild(ticker);
  ann.appendChild(wrap);
  if (btn) ann.appendChild(btn);
}

/* ══════════════════════════════
   BOOT
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  updateWishBadge();
  initStickyNav();
  initMegaMenu();
  initBrandStrip();
  initNewsletter();
  initDarkMode();
  initSearch();
  initAuthModal();
  initTopbarAuth();
  updateUserNav();
  initAnnouncementClose();
  initAnnouncementTicker();
  initScrollReveal();
  initBackToTop();

  // Home page
  renderGrid('productGrid', PRODUCTS.slice(0, 4));
  renderGrid('newGrid', [...PRODUCTS].reverse().slice(0, 4));
  initCarousel('hero', 'heroDots');

  // Category page
  initCategoryPage();

  // Product page
  initProductPage();

  // Cart page
  renderCartPage();
});
