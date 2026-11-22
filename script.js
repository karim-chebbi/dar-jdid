
/* ---------- helpers ---------- */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const money = n => (Math.round(n * 100) / 100).toString().replace(/\.0+$/, '') + ' DT';
const FREE_SHIP = 200, SHIP_COST = 8, COUPON = { code: 'CHBAB10', pct: 10 };
let uid = 0;

/* ---------- inline SVG garment art (no external images needed) ---------- */
const INK = '#0f1226';
const SHAPES = {
  tunic: { d: 'M70 30 L100 45 L130 30 L175 60 L160 100 L140 90 L140 215 L60 215 L60 90 L40 100 L25 60 Z',
    x: (a, b) => `<path d="M84 32 L100 64 L116 32" fill="none" stroke="${b}" stroke-width="6" stroke-linejoin="round"/><rect x="60" y="198" width="80" height="17" fill="${b}"/><path d="M100 64 V198" stroke="${b}" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>` },
  cap: { d: 'M48 175 L68 78 Q100 48 132 78 L152 175 Z',
    x: (a, b) => `<rect x="44" y="168" width="112" height="24" rx="6" fill="${b}" stroke="${INK}" stroke-width="3"/><path d="M100 56 Q150 36 158 92" stroke="${b}" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="153" y="90" width="10" height="34" rx="4" fill="${b}" stroke="${INK}" stroke-width="2"/>` },
  pants: { d: 'M60 30 H140 L152 215 H108 L100 100 L92 215 H48 Z',
    x: (a, b) => `<rect x="60" y="30" width="80" height="16" fill="${b}"/><path d="M92 46 v18 M108 46 v18" stroke="${b}" stroke-width="3" stroke-linecap="round"/>` },
  slide: { d: 'M20 165 Q22 120 70 115 L120 112 Q160 112 196 160 L196 168 Q110 182 20 172 Z',
    x: (a, b) => `<path d="M14 168 Q105 192 198 166 L198 180 Q105 206 14 182 Z" fill="${b}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` },
  shirt: { d: 'M70 30 L100 42 L130 30 L178 62 L160 104 L142 92 L142 200 L58 200 L58 92 L40 104 L22 62 Z',
    x: (a, b, u, d) => `<clipPath id="c${u}"><path d="${d}"/></clipPath><g clip-path="url(#c${u})" fill="${b}"><rect x="0" y="120" width="200" height="9"/><rect x="0" y="146" width="200" height="9"/><rect x="0" y="172" width="200" height="9"/></g><path d="M80 32 L100 56 L120 32" fill="none" stroke="${b}" stroke-width="5" stroke-linejoin="round"/>` },
  bomber: { d: 'M62 40 L100 52 L138 40 L182 84 L172 156 L146 150 L146 196 L54 196 L54 150 L28 156 L18 84 Z',
    x: (a, b) => `<rect x="54" y="182" width="92" height="14" fill="${b}"/><path d="M78 42 L100 56 L122 42" fill="none" stroke="${b}" stroke-width="7" stroke-linejoin="round"/><path d="M100 56 V182" stroke="${b}" stroke-width="3"/><path d="M26 140 L47 144" stroke="${b}" stroke-width="9"/><path d="M174 140 L153 144" stroke="${b}" stroke-width="9"/>` },
  burnous: { d: 'M100 18 Q58 18 54 74 L22 206 Q100 232 178 206 L146 74 Q142 18 100 18 Z',
    x: (a, b) => `<ellipse cx="100" cy="58" rx="26" ry="30" fill="${b}" stroke="${INK}" stroke-width="3"/><path d="M30 186 Q100 212 170 186" fill="none" stroke="${b}" stroke-width="8"/>` },
  kaftan: { d: 'M74 24 L100 40 L126 24 L162 62 L152 98 L136 88 L148 228 L52 228 L64 88 L48 98 L38 62 Z',
    x: (a, b) => `<rect x="95" y="40" width="10" height="188" fill="${b}"/><rect x="52" y="214" width="96" height="14" fill="${b}"/>` }
};
function art(type, a, b) {
  const u = ++uid, s = SHAPES[type];
  return `<svg viewBox="0 0 200 240" aria-hidden="true"><defs><pattern id="p${u}" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#fff" fill-opacity=".25"/></pattern></defs>
  <path d="${s.d}" fill="${a}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="${s.d}" fill="url(#p${u})"/>${s.x(a, b, u, s.d)}</svg>`;
}

/* ---------- data ---------- */
const PRODUCTS = [
  { id: 1, name: 'Jebba Street Tunic', cat: 'Tops', price: 120, shape: 'tunic', a: '#ffb81c', b: '#1556c0', bg: '#e9f0ff', tag: 'Bestseller', desc: 'The classic jebba, cut boxy with contrast trim. Soft cotton-linen blend.' },
  { id: 2, name: 'Chechia Cap Remix', cat: 'Headwear', price: 45, shape: 'cap', a: '#e8432e', b: '#ffb81c', bg: '#fff1d6', tag: 'New', desc: 'Wool-felt chechia with a modern tassel. One size, stretch band inside.' },
  { id: 3, name: 'Sirwal Joggers', cat: 'Bottoms', price: 85, shape: 'pants', a: '#2bb7a0', b: '#0f1226', bg: '#dff7f1', desc: 'Drop-crotch sirwal reborn as joggers. Drawstring waist, ultra comfy.' },
  { id: 4, name: 'Balgha Slides', cat: 'Shoes', price: 95, shape: 'slide', a: '#ffb81c', b: '#e8432e', bg: '#ffe6e1', tag: 'Limited', desc: 'Hand-stitched leather balgha with a street-ready rubber sole.' },
  { id: 5, name: 'Fouta Oversized Shirt', cat: 'Tops', price: 75, shape: 'shirt', a: '#fff6e8', b: '#e8432e', bg: '#e9f0ff', desc: 'Woven fouta stripes on an oversized shirt. Light, breezy, very Djerba.' },
  { id: 6, name: 'Blouza Bomber', cat: 'Outerwear', price: 140, shape: 'bomber', a: '#1556c0', b: '#ffb81c', bg: '#fff1d6', tag: 'New', desc: 'Sidi Bou Said blue bomber with embroidered blouza-style trim.' },
  { id: 7, name: 'Burnous Hooded Cape', cat: 'Outerwear', price: 190, shape: 'burnous', a: '#c89b6d', b: '#0f1226', bg: '#f3ece0', desc: 'Warm handwoven wool burnous with a deep hood. Winter essential.' },
  { id: 8, name: 'Kaftan Duster', cat: 'Outerwear', price: 160, shape: 'kaftan', a: '#e8432e', b: '#fff6e8', bg: '#dff7f1', desc: 'Long open kaftan to throw over anything. Lightweight and flowing.' }
];
const sizesFor = p => p.cat === 'Shoes' ? ['38', '39', '40', '41', '42', '43', '44', '45'] : p.cat === 'Headwear' ? ['One size'] : ['S', 'M', 'L', 'XL'];

/* ---------- state ---------- */
let cart = [], couponOn = false, filter = 'All';
try { cart = JSON.parse(localStorage.getItem('dj_cart') || '[]'); couponOn = localStorage.getItem('dj_coupon') === '1'; } catch (e) {}
const save = () => { try { localStorage.setItem('dj_cart', JSON.stringify(cart)); localStorage.setItem('dj_coupon', couponOn ? '1' : '0'); } catch (e) {} };
const byId = id => PRODUCTS.find(p => p.id === id);

/* ---------- toast ---------- */
let tt;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2400); }

/* ---------- products ---------- */
function renderFilters() {
  const cats = ['All', ...new Set(PRODUCTS.map(p => p.cat))];
  $('#filters').innerHTML = cats.map(c => `<button class="pill ${c === filter ? 'on' : ''}" data-cat="${c}" role="tab" aria-selected="${c === filter}">${c}</button>`).join('');
}
function renderGrid() {
  const list = PRODUCTS.filter(p => filter === 'All' || p.cat === filter);
  $('#grid').innerHTML = list.map((p, i) => `
    <article class="card" data-id="${p.id}" style="animation-delay:${i * 50}ms">
      <div class="thumb" style="background-color:${p.bg}">${p.tag ? `<span class="tag">${p.tag}</span>` : ''}${art(p.shape, p.a, p.b)}</div>
      <div class="info">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="row"><span class="price">${money(p.price)}</span>
          <select class="size" aria-label="Size for ${p.name}">${sizesFor(p).map(s => `<option>${s}</option>`).join('')}</select></div>
        <button class="btn" data-add="${p.id}">Add to cart</button>
      </div>
    </article>`).join('');
}
function setFilter(c) { filter = c; renderFilters(); renderGrid(); }

/* ---------- cart ---------- */
const count = () => cart.reduce((n, i) => n + i.qty, 0);
const subtotal = () => cart.reduce((n, i) => n + byId(i.id).price * i.qty, 0);
function totals() {
  const sub = subtotal(), disc = couponOn ? sub * COUPON.pct / 100 : 0;
  const after = sub - disc, ship = sub === 0 ? 0 : (after >= FREE_SHIP ? 0 : SHIP_COST);
  return { sub, disc, ship, total: after + ship, after };
}
function addToCart(id, size) {
  const row = cart.find(i => i.id === id && i.size === size);
  row ? row.qty++ : cart.push({ id, size, qty: 1 });
  renderCart(); toast(`${byId(id).name} added 🛍️`);
  const b = $('#badge'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
}
function renderCart() {
  save();
  $('#badge').textContent = count();
  const body = $('#cartBody'), foot = $('#cartFoot');
  if (!cart.length) {
    body.innerHTML = `<div class="empty"><b>Your cart is empty</b>Time to find your next fit.<br><br><button class="btn" id="goShop">Browse the collection</button></div>`;
    foot.hidden = true; return;
  }
  foot.hidden = false;
  body.innerHTML = cart.map(i => {
    const p = byId(i.id);
    return `<div class="item">
      <div class="t" style="background-color:${p.bg}">${art(p.shape, p.a, p.b)}</div>
      <div><h4>${p.name}</h4><small>Size: ${i.size}</small><br>
        <div class="qty"><button data-act="dec" data-id="${i.id}" data-size="${i.size}" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button data-act="inc" data-id="${i.id}" data-size="${i.size}" aria-label="Increase quantity">+</button></div></div>
      <div class="rt"><b>${money(p.price * i.qty)}</b><button class="rm" data-act="rm" data-id="${i.id}" data-size="${i.size}">Remove</button></div>
    </div>`;
  }).join('');
  const t = totals();
  $('#sub').textContent = money(t.sub);
  $('#discLine').hidden = !couponOn; $('#disc').textContent = '−' + money(t.disc);
  $('#shipCost').textContent = t.ship ? money(t.ship) : 'Free';
  $('#total').textContent = money(t.total);
  const left = FREE_SHIP - t.after;
  $('#shipTxt').textContent = left > 0 ? `Add ${money(left)} more for free shipping 🚚` : '🎉 You’ve unlocked free shipping!';
  $('#shipBar').style.width = Math.min(100, t.after / FREE_SHIP * 100) + '%';
  $('#coupon').value = couponOn ? COUPON.code : '';
  $('#couponMsg').textContent = couponOn ? '✓ CHBAB10 applied' : '';
  $('#couponMsg').style.color = '#1a7f6e';
}
function openCart() { $('#drawer').classList.add('on'); $('#overlay').classList.add('on'); $('#drawer').setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
function closeCart() { $('#drawer').classList.remove('on'); $('#overlay').classList.remove('on'); $('#drawer').setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }

/* ---------- checkout ---------- */
const GOVS = ['Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte', 'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia', 'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Sfax', 'Gafsa', 'Tozeur', 'Kebili', 'Gabès', 'Médenine', 'Tataouine'];
function openCheckout() {
  if (!cart.length) return toast('Your cart is empty');
  const t = totals();
  $('#coBody').innerHTML = `
    <h3>Almost there 🎉</h3>
    <div class="sum">${cart.map(i => `<div class="line"><span>${i.qty}× ${byId(i.id).name} (${i.size})</span><span>${money(byId(i.id).price * i.qty)}</span></div>`).join('')}
      <div class="line"><span>Shipping</span><span>${t.ship ? money(t.ship) : 'Free'}</span></div>
      <div class="line tot"><span>Total to pay</span><span>${money(t.total)}</span></div></div>
    <form id="coForm" style="display:grid;gap:.9rem">
      <label>Full name<input name="n" required autocomplete="name"></label>
      <div class="f2">
        <label>Phone<input name="ph" required inputmode="tel" autocomplete="tel" pattern="(\\+216|00216)?\\s?[2-9][0-9]{7}" placeholder="20 000 000" title="Tunisian phone number, 8 digits"></label>
        <label>Governorate<select name="g" class="fld" required>${GOVS.map(g => `<option>${g}</option>`).join('')}</select></label>
      </div>
      <label>Delivery address<textarea name="a" required style="min-height:80px" placeholder="Street, city, postal code"></textarea></label>
      <p style="font-size:.82rem;color:#4a4d66">💵 Payment: cash on delivery. No card needed.</p>
      <div style="display:flex;gap:.7rem"><button class="btn alt" type="button" id="coCancel">Back</button><button class="btn" style="flex:1" type="submit">Confirm order</button></div>
    </form>`;
  closeCart(); $('#checkout').showModal();
}
function confirmOrder(name) {
  const no = 'DJ-' + Math.floor(10000 + Math.random() * 90000);
  cart = []; couponOn = false; renderCart();
  $('#coBody').innerHTML = `<div class="done"><div class="big">💙</div><h3>Merci, ${name.split(' ')[0]}!</h3>
    <p style="margin:.8rem 0 1.4rem">Order <b>${no}</b> is confirmed. We’ll call you shortly to confirm delivery. Pay when it arrives.</p>
    <button class="btn" id="coClose">Keep shopping</button></div>`;
}

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const t = e.target;
  const cat = t.closest('[data-cat]'); if (cat) return setFilter(cat.dataset.cat);
  const f = t.closest('[data-filter]'); if (f) return setFilter(f.dataset.filter);
  const add = t.closest('[data-add]');
  if (add) { const card = add.closest('.card'); return addToCart(+add.dataset.add, card.querySelector('select.size').value); }
  const act = t.closest('[data-act]');
  if (act) {
    const id = +act.dataset.id, size = act.dataset.size, row = cart.find(i => i.id === id && i.size === size);
    if (!row) return;
    if (act.dataset.act === 'inc') row.qty++;
    if (act.dataset.act === 'dec') row.qty--;
    if (act.dataset.act === 'rm' || row.qty <= 0) cart = cart.filter(i => i !== row);
    return renderCart();
  }
  if (t.closest('#goShop')) { closeCart(); location.hash = '#shop'; }
  if (t.closest('#coCancel') || t.closest('#coClose')) $('#checkout').close();
});
$('#openCart').onclick = openCart; $('#closeCart').onclick = closeCart; $('#overlay').onclick = closeCart;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });
$('#checkoutBtn').onclick = openCheckout;
$('#checkout').addEventListener('submit', e => {
  if (e.target.id !== 'coForm') return;
  e.preventDefault(); /* TODO: send the order to your backend / WhatsApp / Google Sheet here */
  confirmOrder(new FormData(e.target).get('n').trim());
});
$('#applyCoupon').onclick = () => {
  const v = $('#coupon').value.trim().toUpperCase(), m = $('#couponMsg');
  if (v === COUPON.code) { couponOn = true; renderCart(); toast('Promo applied: −10% 🎁'); }
  else { couponOn = false; renderCart(); m.textContent = 'Invalid code'; m.style.color = '#e8432e'; }
};
$('#burger').onclick = () => { const o = $('#links').classList.toggle('open'); $('#burger').setAttribute('aria-expanded', o); };
$$('#links a').forEach(a => a.addEventListener('click', () => $('#links').classList.remove('open')));

/* Contact form (front-end only — connect to Formspree / your API to receive messages) */
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  if (!f.checkValidity()) { f.reportValidity(); return; }
  f.reset(); $('#contactOk').classList.add('show');
  setTimeout(() => $('#contactOk').classList.remove('show'), 6000);
});
$('#news').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast('You’re on the list! 💌'); });

/* ---------- init ---------- */
$('#yr').textContent = new Date().getFullYear();
$('#marq').innerHTML = (['JEBBA', 'CHECHIA', 'FOUTA', 'BALGHA', 'KAFTAN', 'BURNOUS', 'MADE IN TUNISIA'].map(w => `<span>${w} ✦</span>`).join('')).repeat(4);
$('#heroArt').innerHTML = art('tunic', '#ffb81c', '#1556c0');
renderFilters(); renderGrid(); renderCart();
