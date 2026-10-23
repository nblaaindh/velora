/* VELORA Café - semua tampilan dirender dari sini. */

/* ===== KONFIGURASI ===== */
const WA = "6281234567890";
const TAX = 0.1;
const SIZE_UP = 6000;
/* Topping / add-on per kategori: [nama, harga] */
const TOP = {
  "Coffee": [["Extra Shot", 8000], ["Oat Milk", 8000], ["Whipped Cream", 6000], ["Sirup Vanila", 5000]],
  "Signature Coffee": [["Extra Shot", 8000], ["Oat Milk", 8000], ["Whipped Cream", 6000], ["Salted Caramel Foam", 7000]],
  "Non-Coffee": [["Boba", 7000], ["Whipped Cream", 6000], ["Oat Milk", 8000], ["Cokelat Chip", 5000]],
  "Tea": [["Boba", 7000], ["Leci", 6000], ["Madu", 4000], ["Jelly", 5000]],
  "Pastry": [["Es Krim Vanila", 10000], ["Saus Cokelat", 5000], ["Whipped Cream", 6000]],
  "Main Course": [["Extra Telur", 6000], ["Extra Keju", 7000], ["Extra Saus", 4000], ["Porsi Nasi/Kentang", 8000]]
};
const topsFor = (p) => TOP[p.c] || [];
const tpPrice = (p, n) => { const t = topsFor(p).find((x) => x[0] === n); return t ? t[1] : 0; };
const tpSum = (p, a) => (a || []).reduce((s, n) => s + tpPrice(p, n), 0);
const CATS = [["Coffee", "☕"], ["Signature Coffee", "✨"], ["Non-Coffee", "🍵"], ["Tea", "🫖"], ["Pastry", "🥐"], ["Main Course", "🍝"]];
const DRINK = ["Coffee", "Signature Coffee", "Non-Coffee", "Tea"];
const PAYS = ["Tunai di kasir", "QRIS", "BCA", "BRI", "Mandiri", "BNI", "Kartu debit", "GoPay", "OVO", "DANA"];
const MERCHANT = "PT Velora Kafe Indonesia", NMID = "ID1023456789012";
/* Data cafe: dipakai di beranda dan struk, ubah di sini saja */
const CAFE = { addr: "Jl. Mesjid, Gg. Mesjid 1 No. 12, Tembung", get map() { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Jl. Mesjid Gg. Mesjid 1 No. 12, Tembung, Percut Sei Tuan, Deli Serdang, Sumatera Utara"); }, get hours() { const h = hrs(); return "Setiap hari, " + p2(h.o) + ".00 – " + p2(h.c) + ".00"; }, tel: "+62 812-3456-7890", ig: "@velora.cafe" };
const _pin = (k, d) => { try { return localStorage.getItem(k) || d; } catch (e) { return d; } };
let KASIR_PIN = _pin("vc_kasir_pin", "2112");
const KASIR_TAPS = 5;
const KASIR_TAP_WIN = 2000;
let APP_PIN = _pin("vc_app_pin", "1590");
const APP_PIN_LEN = 4;
const ACC = {
  BCA: ["Bank BCA", "8830 124 567"], BRI: ["Bank BRI", "0345 01 123456 50 3"], Mandiri: ["Bank Mandiri", "123 00 1234567 8"],
  BNI: ["Bank BNI", "0123 456 789"], "Kartu debit": ["Bank Mandiri (kartu debit)", "123 00 1234567 8"],
  GoPay: ["GoPay", "0812 3456 7890"], OVO: ["OVO", "0812 3456 7890"], DANA: ["DANA", "0812 3456 7890"]
};
const BASE_V = [
  { c: "WELCOME15", tag: "15% OFF", n: "Diskon 15% pesanan pertama", t: "%", v: 15, min: 50000, max: 25000, d: 14, first: 1 },
  { c: "HAPPY20", tag: "HAPPY HOUR", n: "20% semua minuman, jam 14.00–17.00", t: "%", v: 20, min: 40000, max: 20000, d: 7, base: "drink", hr: [14, 17] },
  { c: "PAIRING", tag: "GRATIS PASTRY", n: "Beli 2 minuman, gratis 1 pastry", t: "free", v: 0, min: 0, max: 46000, d: 14 },
  { c: "HEMAT20", tag: "Rp20.000 OFF", n: "Potongan Rp20.000", t: "rp", v: 20000, min: 120000, max: 20000, d: 30 },
  { c: "ONGKIR0", tag: "GRATIS ONGKIR", n: "Gratis ongkir semua saluran Delivery", t: "ship", v: 11000, min: 60000, max: 11000, d: 14 },
  { c: "ONGKIR5", tag: "ONGKIR Rp5.000", n: "Potongan ongkir Rp5.000 tanpa minimal", t: "ship", v: 5000, min: 0, max: 5000, d: 30 },
  { c: "GATHER30", tag: "Rp30.000 OFF", n: "Potongan Rp30.000 untuk berdua", t: "rp", v: 30000, min: 200000, max: 30000, d: 7 }
];
/* Voucher dinamis: bawaan + buatan kasir, bisa diaktif/nonaktifkan */
const readV = () => { try { return JSON.parse(localStorage.getItem("vc_vouch")) || {}; } catch (e) { return {}; } };
const VOUCHERS = [], ALL_V = [];
function applyVouchers() {
  const m = readV(), off = m.off || {};
  ALL_V.length = 0;
  BASE_V.concat(m.add || []).forEach((v) => ALL_V.push(Object.assign({}, v, { off: !!off[v.c] })));
  VOUCHERS.length = 0;
  ALL_V.filter((v) => !v.off).forEach((v) => VOUCHERS.push(v));
}
applyVouchers();
const CH = { ShopeeFood: { ship: 9000, svc: 1500, e: "🧡" }, GoFood: { ship: 10000, svc: 2000, e: "🛵" }, GrabFood: { ship: 11000, svc: 2500, e: "🟢" } };
const GALLERY = [["interior", "Interior", 1], ["coffee", "Kopi"], ["food", "Hidangan"], ["corner", "Sudut santai", 1], ["dessert", "Dessert"], ["people", "Bersama"]];
const STAFF_NAME = "Kasir VELORA";

const P = `Espresso|Coffee|24000|4.7|Double shot espresso pekat dengan crema tebal.|☕
Americano|Coffee|28000|4.6|Espresso dengan air panas, bersih dan tegas.|☕
Cappuccino|Coffee|36000|4.8|Espresso, susu steamed, dan foam lembut.|☕
Flat White|Coffee|38000|4.8|Microfoam halus dengan rasa kopi yang kuat.|☕
Caffe Latte|Coffee|36000|4.7|Espresso dengan susu creamy yang seimbang.|🥛
Velora Signature Latte|Signature Coffee|42000|4.9|Espresso, susu, dan sirup karamel gula aren.|✨|1
Spanish Latte|Signature Coffee|38000|4.8|Espresso dengan susu kental manis yang creamy.|☕|1
Caramel Macchiato|Signature Coffee|42000|4.7|Vanila, susu, espresso, dan saus karamel.|🍮
Salted Caramel Cold Brew|Signature Coffee|40000|4.8|Cold brew 18 jam dengan salted caramel foam.|🧊
Hazelnut Praline Latte|Signature Coffee|42000|4.7|Latte dengan praline hazelnut dan taburan kacang.|🌰
Matcha Latte|Non-Coffee|40000|4.8|Matcha Jepang dengan susu segar, manis seimbang.|🍵|1
Chocolate Hazelnut|Non-Coffee|38000|4.7|Cokelat pekat dengan sentuhan hazelnut.|🍫
Strawberry Cream Milk|Non-Coffee|36000|4.6|Susu segar, puree stroberi, dan krim ringan.|🍓
Taro Latte|Non-Coffee|36000|4.5|Taro lembut dengan susu dan aroma vanila.|💜
Earl Grey|Tea|28000|4.6|Teh hitam beraroma bergamot yang elegan.|🫖
Jasmine Green Tea|Tea|26000|4.5|Teh hijau melati yang ringan dan wangi.|🍃
Peach Iced Tea|Tea|30000|4.7|Teh dingin dengan potongan persik dan madu.|🍑
Lychee Rose Tea|Tea|32000|4.7|Teh bunga mawar dengan leci segar.|🌹
Butter Croissant|Pastry|28000|4.8|Croissant renyah berlapis dengan mentega Prancis.|🥐
Almond Croissant|Pastry|34000|4.8|Croissant isi krim almond dan taburan almond.|🥐
Pain au Chocolat|Pastry|32000|4.7|Pastry berlapis dengan dua batang cokelat.|🥖
Chocolate Lava Cake|Pastry|46000|4.9|Kue cokelat hangat dengan inti meleleh dan es krim vanila.|🍰|1
Classic Tiramisu|Pastry|44000|4.8|Mascarpone lembut, ladyfinger, dan kopi.|🍮
Chicken Steak|Main Course|68000|4.7|Dada ayam panggang, saus mushroom, kentang, sayur.|🍗
Beef Rice Bowl|Main Course|62000|4.7|Sapi tumis, nasi hangat, dan telur setengah matang.|🍚
Creamy Chicken Pasta|Main Course|58000|4.8|Fettuccine, ayam, dan saus krim parmesan.|🍝|1
Aglio Olio Prawn|Main Course|64000|4.7|Spaghetti, udang, bawang putih, cabai, olive oil.|🍤
Long Black|Coffee|26000|4.5|Double shot espresso di atas air panas, aroma kuat.|☕
Cortado|Coffee|34000|4.6|Espresso dan susu hangat seimbang, tanpa foam tebal.|☕
V60 Pour Over|Coffee|36000|4.7|Seduhan manual single origin, ringan dan beraroma.|🫘
Iced Americano|Coffee|28000|4.6|Espresso dengan air dingin dan es batu, segar.|🧊
Mocha|Coffee|38000|4.7|Espresso, cokelat, dan susu steamed yang lembut.|🍫
Affogato|Signature Coffee|40000|4.8|Es krim vanila disiram espresso panas.|🍨
Coconut Cold Brew|Signature Coffee|40000|4.7|Cold brew dengan susu kelapa dan sedikit gula aren.|🥥
Vanilla Cinnamon Latte|Signature Coffee|40000|4.6|Latte dengan sirup vanila dan taburan kayu manis.|✨
Brown Sugar Cream Latte|Signature Coffee|42000|4.8|Latte dengan brown sugar dan cream cap gurih.|🤎|1
Pandan Latte|Signature Coffee|38000|4.7|Espresso dengan susu pandan wangi khas.|🌿
Tiramisu Latte|Signature Coffee|44000|4.8|Latte rasa tiramisu dengan foam mascarpone dan kakao.|🍮
Hot Chocolate|Non-Coffee|34000|4.7|Cokelat Belgia hangat yang kental dan manis seimbang.|🍫
Red Velvet Latte|Non-Coffee|38000|4.6|Susu dengan rasa red velvet dan krim keju ringan.|❤️
Brown Sugar Milk|Non-Coffee|32000|4.6|Susu segar dengan sirup brown sugar karamel.|🥛
Vanilla Milkshake|Non-Coffee|36000|4.6|Milkshake vanila kental dengan whipped cream.|🥤
Mango Yoghurt Smoothie|Non-Coffee|38000|4.7|Mangga matang, yoghurt, dan es yang diblender halus.|🥭
Blueberry Yoghurt Smoothie|Non-Coffee|38000|4.6|Blueberry segar dan yoghurt, asam manis menyegarkan.|🫐
English Breakfast|Tea|26000|4.5|Teh hitam klasik yang pekat dan hangat.|🫖
Lemon Honey Tea|Tea|30000|4.6|Teh dengan lemon segar dan madu.|🍋
Thai Milk Tea|Tea|32000|4.7|Teh Thailand creamy dengan susu kental manis.|🧡
Matcha Lemonade|Tea|34000|4.6|Matcha dingin dengan lemonade, segar dan unik.|🍵
Cinnamon Roll|Pastry|30000|4.7|Roti gulung kayu manis dengan glaze cream cheese.|🥯
Chocolate Chip Cookie|Pastry|20000|4.6|Cookie renyah di tepi, lembut di tengah.|🍪
New York Cheesecake|Pastry|46000|4.8|Cheesecake padat lembut dengan dasar biskuit.|🍰
Basque Burnt Cheesecake|Pastry|48000|4.9|Cheesecake gosong di luar, creamy di dalam.|🧀|1
Waffle Ice Cream|Pastry|42000|4.7|Waffle hangat dengan es krim vanila dan sirup maple.|🧇
Nasi Goreng Velora|Main Course|56000|4.7|Nasi goreng bumbu rempah, telur mata sapi, dan ayam suwir.|🍳
Chicken Katsu Curry|Main Course|60000|4.7|Ayam katsu renyah dengan saus kari Jepang dan nasi.|🍛
Spaghetti Bolognese|Main Course|56000|4.6|Spaghetti dengan saus daging tomat dan keju parmesan.|🍝
Carbonara Beef Bacon|Main Course|60000|4.7|Fettuccine saus krim telur dan beef bacon.|🥓
Grilled Salmon|Main Course|92000|4.8|Salmon panggang, sayur panggang, dan saus lemon butter.|🐟
Club Sandwich|Main Course|52000|4.6|Roti panggang isi ayam, telur, sayur, dan keju.|🥪
Margherita Pizza|Main Course|64000|4.7|Pizza tipis dengan mozzarella, tomat, dan basil.|🍕
Air Mineral|Non-Coffee|8000|4.5|Air mineral dingin atau suhu ruang, 600 ml.|💧
Nasi Putih|Main Course|8000|4.6|Nasi putih hangat, pas untuk teman lauk.|🍚
Nasi Goreng Kampung|Main Course|38000|4.7|Nasi goreng pedas dengan teri, telur ceplok, dan kerupuk.|🍳
Ayam Penyet Sambal Ijo|Main Course|42000|4.8|Ayam goreng penyet, sambal hijau, lalapan, dan nasi.|🍗|1
Mie Goreng Medan|Main Course|36000|4.7|Mie goreng bumbu rempah dengan telur, sawi, dan acar.|🍜`
  .split("\n").map((l, id) => {
    const [n, c, p, r, d, e, b] = l.split("|");
    return { id, n, c, p: +p, p0: +p, r: +r, d, e, b: !!b, img: "images/" + n.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".jpg" };
  });

/* ===== MENU DINAMIS (diatur kasir) ===== */
const BASE_LEN = P.length;
const readMenu = () => { try { return JSON.parse(localStorage.getItem("vc_menu")) || {}; } catch (e) { return {}; } };
function applyMenu() {
  const m = readMenu(), add = m.add || [], st = m.st || {}, ed = m.ed || {};
  P.length = BASE_LEN;
  add.forEach((a, i) => P.push({ id: BASE_LEN + i, n: a.n, c: a.c, p: a.p, p0: a.p, r: 4.5, d: a.d, e: a.e, b: false, img: a.ph || "images/" + a.s + ".jpg", cu: true }));
  P.forEach((p) => {
    if (p.d0 === undefined) p.d0 = p.d;
    const e = ed[p.id] || {};
    p.p = e.p || p.p0; p.d = e.d || p.d0;
    p.x = !!(st[p.id] && st[p.id].x); p.h = !!(st[p.id] && st[p.id].h);
  });
}
function applyRatings() {
  let rv = []; try { rv = JSON.parse(localStorage.getItem("vc_rev")) || []; } catch (e) {}
  const a = {}; rv.forEach((x) => { const t = (a[x.pid] = a[x.pid] || { s: 0, n: 0 }); t.s += x.st; t.n++; });
  P.forEach((p) => { if (p.r0 === undefined) p.r0 = p.r; const t = a[p.id]; p.r = t ? (p.r0 * 3 + t.s) / (3 + t.n) : p.r0; p.rn = t ? t.n : 0; });
}
{ const _am = applyMenu; applyMenu = function () { _am(); applyRatings(); }; }
applyMenu();

const POPULARITY = {
  0: 180, 1: 220, 2: 340, 3: 280, 4: 300, 5: 420, 6: 380, 7: 260, 8: 310, 9: 240,
  10: 410, 11: 250, 12: 290, 13: 230, 14: 190, 15: 170, 16: 210, 17: 200,
  18: 320, 19: 270, 20: 240, 21: 390, 22: 350, 23: 300, 24: 280, 25: 330, 26: 260
};
const popScore = (p) => (POPULARITY[p.id] || 100) + p.r * 10;
const vis = () => P.filter((p) => !p.h);
const popular = (n) => vis().sort((a, b) => popScore(b) - popScore(a)).slice(0, n || 8);

/* ===== UTILITAS ===== */
const $ = (s) => document.querySelector(s);
const rp = (n) => "Rp" + Math.round(n).toLocaleString("id-ID");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const load = (k, f) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? f : v; } catch (e) { return f; } };
const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
const ICON = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  heart: '<path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20.5a8 8 0 0 1 16 0"/>',
  bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
  chat: '<path d="M20 11.5c0 4-3.6 7-8 7-1.1 0-2.1-.2-3-.5L4.5 20l1.2-3.6C4.4 15.2 4 13.4 4 11.5c0-4 3.6-7 8-7s8 3 8 7z"/><circle cx="8.6" cy="11.5" r=".6"/><circle cx="12" cy="11.5" r=".6"/><circle cx="15.4" cy="11.5" r=".6"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  tag: '<path d="M3 12.5V4a1 1 0 0 1 1-1h8.5a1 1 0 0 1 .7.3l7.5 7.5a1 1 0 0 1 0 1.4l-8.5 8.5a1 1 0 0 1-1.4 0L3.3 13.2a1 1 0 0 1-.3-.7z"/><circle cx="8" cy="8" r="1.2"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  pin: '<path d="M12 21s7-5.6 7-11a7 7 0 0 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
  bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  vol: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/>',
  mute: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
  play: '<path d="M8 5.5v13l11-6.5z"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r=".8"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  insta: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="16.8" cy="7.2" r=".7"/>'
};
/* Ikon kategori (garis, senada dengan ikon lain). Mau pakai foto? Isi CATIMG, mis. 'Coffee': 'images/cat-coffee.jpeg' */
const CATICON = {
  "Coffee": '<path d="M5 9.5h11V14a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z"/><path d="M16 10.5h1.4a2.4 2.4 0 0 1 0 4.8H16"/><path d="M8.5 3.5c0 1.1 1 1.3 1 2.5M12 3.5c0 1.1 1 1.3 1 2.5"/>',
  "Signature Coffee": '<path d="M4 11.5h10V15a4.5 4.5 0 0 1-4.5 4.5h-1A4.5 4.5 0 0 1 4 15z"/><path d="M14 12.5h1a2 2 0 0 1 0 4h-1"/><path d="M18.5 3l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/>',
  "Non-Coffee": '<path d="M7 8.5h10l-1.2 10.5a1 1 0 0 1-1 .9H9.2a1 1 0 0 1-1-.9z"/><path d="M13 8.5l2-5.5h3"/><path d="M7.6 13h8.8"/>',
  "Tea": '<path d="M5.5 11.5h9.5V15a4.5 4.5 0 0 1-4.5 4.5h-.5A4.5 4.5 0 0 1 5.5 15z"/><path d="M15 12.8l3.2-3.6"/><path d="M5.5 13H4.4a2 2 0 0 0 0 4h1.4"/><path d="M8 11.5V9.8h5.5v1.7"/><path d="M10.7 9.8V8.6"/>',
  "Pastry": '<path d="M3 15.5c0-4.2 3.2-8.5 9-8.5s9 4.3 9 8.5c0 .9-.7 1.4-1.5 1.1L17.8 16l-2.3 1.5h-7L6.2 16l-1.7.6C3.7 16.9 3 16.4 3 15.5z"/><path d="M9.2 7.5L8.3 16M14.8 7.5l.9 8.5M12 7v10.5"/>',
  "Main Course": '<path d="M5 3v6a2 2 0 0 0 4 0V3"/><path d="M7 3v18"/><path d="M17 21V3c-2 1.5-3 4-3 7 0 1.5 1 2.5 3 3"/>'
};
const CATIMG = {};
const catVis = (c, e) => CATIMG[c] ? `<span class="cvi"><img src="${CATIMG[c]}" alt="" loading="lazy"></span>` : CATICON[c] ? `<span class="cvi" aria-hidden="true"><svg viewBox="0 0 24 24">${CATICON[c]}</svg></span>` : `<span aria-hidden="true">${e}</span>`;
const svg = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;

/* Kode unik dihapus: bersihkan dari pesanan lama yang tersimpan */
(() => { const l = load("vc_orders", []); let ch = false; l.forEach((o) => { if (o.code) { o.grand = o.total; o.code = 0; ch = true; } }); if (ch) store("vc_orders", l); })();
const S = {
  view: "home", cat: "All", q: "", pay: PAYS[0], type: "Dine in", nm: "",
  cart: load("vc_cart", []).filter((i) => P[i.id] && !P[i.id].x && !P[i.id].h && i.q > 0),
  fav: load("vc_fav", []).filter((i) => P[i]),
  name: load("vc_name", ""),
  voucher: "", order: null, cur: null, orders: load("vc_orders", []),
  unlocked: false, /* selalu minta PIN setiap buka aplikasi */
  act: load("vc_act", { views: {}, carts: {}, favs: [] }),
  isKasir: false, vship: "", ch: "ShopeeFood", addr: load("vc_profile", {}).addr || "", claim: load("vc_claim", {}), kt: "orders", kf: "all", kq: "", mq: "", chat: null, unread: 0,
  pin: "", pinErr: "", pinLock: 0, pinTries: 0,
  _delId: null
};
S.prof = load("vc_profile", { nm: "", hp: "", addr: "" });
if (!S.name && S.prof.nm) S.name = S.prof.nm;
S.nm = S.name;
const persist = () => { store("vc_cart", S.cart); store("vc_fav", S.fav); };
const persistAct = () => store("vc_act", S.act);
const isD = (p) => DRINK.includes(p.c);
const unit = (i) => P[i.id].p + (i.sz === "Large" ? SIZE_UP : 0) + tpSum(P[i.id], i.tp);
const sub = () => S.cart.reduce((a, i) => a + unit(i) * i.q, 0);
const cnt = () => S.cart.reduce((a, i) => a + i.q, 0);
const vch = () => VOUCHERS.find((v) => v.c === S.voucher);
const okV = (v) => !vWhy(v);
const exAt = (v) => (S.claim[v.c] || 0) + v.d * 864e5;
const dMon = (t) => new Date(t).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
function vWhy(v) {
  if (!S.claim[v.c]) return "Klaim dulu di beranda";
  if (Date.now() > exAt(v)) return "Sudah kedaluwarsa";
  if (v.t === "ship" && S.type !== "Delivery") return "Khusus pesanan Delivery";
  if (isDel() && v.t !== "ship") return "Diskon menu hanya untuk Dine in dan Take away";
  const dq = S.cart.filter((i) => isD(P[i.id])).reduce((a, i) => a + i.q, 0), hh = new Date().getHours();
  if (v.first && S.orders.length) return "Hanya untuk pesanan pertama";
  if (v.hr && (hh < v.hr[0] || hh >= v.hr[1])) return "Hanya jam " + v.hr[0] + ".00–" + v.hr[1] + ".00";
  if (v.base === "drink" && !dq) return "Tambahkan minuman";
  if (v.t === "free" && (dq < 2 || !freeItem())) return dq < 2 ? "Beli minimal 2 minuman" : "Tambahkan 1 pastry";
  if (sub() < v.min) return "Kurang " + rp(v.min - sub()) + " lagi";
  return "";
}
const isDel = () => S.type === "Delivery";
const COD = "COD (bayar ke kurir)";
const cash = (p) => p === "Tunai di kasir" || p === COD;
const payListFor = (type) => (type === "Delivery" ? [COD, ...PAYS.filter((t) => t !== "Tunai di kasir" && t !== "Kartu debit")] : PAYS);
const payList = () => payListFor(S.type);
const shipHint = () => { const v = VOUCHERS.find((x) => x.c === "ONGKIR0"); if (!v) return ""; if (!S.claim[v.c]) return "🚚 Klaim voucher ONGKIR0 di beranda untuk gratis ongkir (min. belanja " + rp(v.min) + ")."; if (sub() < v.min) return "🚚 Belanja " + rp(v.min - sub()) + " lagi untuk gratis ongkir."; return S.vship === v.c ? "🚚 Gratis ongkir terpasang." : "🚚 Pilih voucher ONGKIR0 di bawah untuk gratis ongkir."; };
const shipAmt = () => (isDel() ? CH[S.ch].ship : 0);
const svcAmt = () => (isDel() ? CH[S.ch].svc : 0);
const shipDisc = () => { const v = VOUCHERS.find((x) => x.c === S.vship); return !v || vWhy(v) ? 0 : Math.min(v.v, shipAmt()); };
const feeRows = () => isDel() ? `<div class="srow"><span>Ongkir (${S.ch})</span><span>${rp(shipAmt())}</span></div>${shipDisc() ? `<div class="srow"><span>Gratis ongkir</span><span>-${rp(shipDisc())}</span></div>` : ""}${svcAmt() ? `<div class="srow"><span>Biaya layanan ${S.ch}</span><span>${rp(svcAmt())}</span></div>` : ""}` : "";
const feeO = (o, c) => o.ship ? `<div class="${c}"><span>Ongkir ${o.ch}</span><span>${rp(o.ship)}</span></div>${o.sd ? `<div class="${c}"><span>Gratis ongkir</span><span>-${rp(o.sd)}</span></div>` : ""}${o.svc ? `<div class="${c}"><span>Biaya layanan</span><span>${rp(o.svc)}</span></div>` : ""}` : "";
const freeItem = () => { const a = S.cart.filter((i) => P[i.id].c === "Pastry").map((i) => P[i.id].p); return a.length ? Math.min(...a) : 0; };
const disc = () => {
  const v = vch(); if (!v || !okV(v)) return 0;
  const base = v.base === "drink" ? S.cart.filter((i) => isD(P[i.id])).reduce((a, i) => a + unit(i) * i.q, 0) : sub();
  return Math.min(v.t === "free" ? freeItem() : v.t === "%" ? base * v.v / 100 : v.v, v.max, sub());
};
const taxAmt = () => (sub() - disc()) * TAX;
const total = () => sub() - disc() + taxAmt() + shipAmt() - shipDisc() + svcAmt();

/* ===== LAYAR PIN ===== */
function pinPage() {
  const locked = Date.now() < S.pinLock;
  const sisa = Math.ceil((S.pinLock - Date.now()) / 1000);
  const dots = Array.from({ length: APP_PIN_LEN }, (_, i) => `<span class="pin-dot ${i < S.pin.length ? "on" : ""}"></span>`).join("");
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];
  return `<div class="pin-wrap">
    <div class="pin-brand">VELORA</div>
    <div class="pin-tag">A Taste Above Ordinary.</div>
    <div class="pin-lock" aria-hidden="true">${svg("lock")}</div>
    <h2 class="pin-title">Masukkan PIN</h2>
    <p class="pin-sub">Untuk masuk ke aplikasi VELORA</p>
    <div class="pin-dots${S.pinErr ? " shake" : ""}" role="status" aria-label="PIN ${S.pin.length} dari ${APP_PIN_LEN}">${dots}</div>
    <div class="pin-err">${locked ? `Terkunci. Coba lagi dalam <b id="pinCd">${sisa}</b> detik.` : (S.pinErr || "")}</div>
    <div class="pin-pad${locked ? " off" : ""}">
      ${keys.map((k) => k === "" ? `<span></span>` :
        k === "⌫" ? `<button class="pin-key pin-del" data-pin-del aria-label="Hapus">⌫</button>` :
        `<button class="pin-key" data-pin-key="${k}">${k}</button>`
      ).join("")}
    </div>
    <p class="pin-legal">Dengan masuk kamu menyetujui Ketentuan Layanan dan Kebijakan Privasi VELORA.</p>
  </div>`;
}
let pinTimer = null;
function pinTick() {
  clearInterval(pinTimer);
  pinTimer = setInterval(() => {
    const left = Math.ceil((S.pinLock - Date.now()) / 1000), el = document.getElementById("pinCd");
    if (left <= 0) { clearInterval(pinTimer); S.pinErr = ""; if (!S.unlocked && !S.isKasir) render(); return; }
    if (el) el.textContent = left;
  }, 250);
}
function pinPress(k) {
  if (Date.now() < S.pinLock) return;
  if (S.pin.length >= APP_PIN_LEN) return;
  S.pin += k;
  S.pinErr = "";
  render();
  if (S.pin.length === APP_PIN_LEN) setTimeout(pinSubmit, 150);
}
function pinDel() {
  if (Date.now() < S.pinLock) return;
  S.pin = S.pin.slice(0, -1);
  S.pinErr = "";
  render();
}
function pinSubmit() {
  if (S.pin === APP_PIN) {
    S.unlocked = true;
    S.pin = ""; S.pinErr = ""; S.pinTries = 0;
    toast("Selamat datang di VELORA");
    render();
  } else {
    S.pinTries++;
    S.pin = "";
    if (S.pinTries >= 3) {
      S.pinLock = Date.now() + 30000; pinTick();
      S.pinTries = 0;
      S.pinErr = "Terlalu banyak percobaan. Terkunci 30 detik.";
    } else {
      S.pinErr = `PIN salah. Sisa ${3 - S.pinTries} percobaan.`;
    }
    render();
  }
}
function lockApp() {
  S.unlocked = false;
  S.pin = ""; S.pinErr = "";
  S.view = "home"; closeSheet(); render();
  toast("Aplikasi terkunci");
}

/* ===== REKOMENDASI ===== */
function related(id, n) {
  const base = P[id];
  const words = (base.n + " " + base.d).toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 4);
  const scored = P.filter((p) => p.id !== id && !p.h).map((p) => {
    let s = 0;
    if (p.c === base.c) s += 100;
    const t = (p.n + " " + p.d).toLowerCase();
    words.forEach((w) => { if (t.includes(w)) s += 3; });
    s += p.r * 2;
    return { p, s };
  });
  return scored.sort((a, b) => b.s - a.s).slice(0, n || 4).map((x) => x.p);
}
function trackView(id) { S.act.views[id] = (S.act.views[id] || 0) + 1; persistAct(); }
function trackCart(id) { S.act.carts[id] = (S.act.carts[id] || 0) + 1; persistAct(); }
function trackFav(id) {
  if (!S.act.favs.includes(id)) S.act.favs.push(id);
  else S.act.favs = S.act.favs.filter((x) => x !== id);
  persistAct();
}
function interestScores() {
  const catScore = {};
  const add = (cat, w) => { catScore[cat] = (catScore[cat] || 0) + w; };
  Object.entries(S.act.views).forEach(([id, n]) => { const p = P[id]; if (p) add(p.c, n * 1); });
  S.act.favs.forEach((id) => { const p = P[id]; if (p) add(p.c, 3); });
  Object.entries(S.act.carts).forEach(([id, n]) => { const p = P[id]; if (p) add(p.c, n * 2); });
  return catScore;
}
function forYou(n) {
  const cs = interestScores();
  const hasAct = Object.keys(cs).length > 0;
  if (!hasAct) return { list: popular(n || 6), note: "Rekomendasi awal untukmu." };
  const ranked = vis().map((p) => ({ p, s: (cs[p.c] || 0) * 10 + p.r * 2 + (p.b ? 5 : 0) }))
    .sort((a, b) => b.s - a.s).slice(0, n || 6).map((x) => x.p);
  return { list: ranked, note: "Dipilih berdasarkan aktivitasmu di VELORA." };
}

/* ===== KOMPONEN ===== */
const img = (p, cls) => `<div class="im ${cls || ""}"><span aria-hidden="true">${p.e}</span><img src="${p.img}" alt="${p.n}" loading="lazy" decoding="async" onload="this.parentNode.classList.add('ld')" onerror="this.remove()"></div>`;
const heart = (p) => `<button class="hb ${S.fav.includes(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="Favorit ${p.n}">♥</button>`;
const plus = (p) => p.x ? '<button class="pl off" disabled aria-label="Stok habis">×</button>' : `<button class="pl" data-add="${p.id}" aria-label="Tambah ${p.n}">+</button>`;
const foot = (p) => `<div class="ft"><b class="pr">${rp(p.p)}</b><span class="act">${heart(p)}${plus(p)}</span></div>`;
const vc = (p, pop) => `<article class="vc${p.x ? " sold" : ""}" data-open="${p.id}">${p.x ? '<span class="tag-pop out">Habis</span>' : pop ? '<span class="tag-pop">🔥 Populer</span>' : ""}${img(p)}<h3>${p.n}</h3><span class="rt">★ ${p.r.toFixed(1)}</span>${foot(p)}</article>`;
const row = (p) => `<article class="row${p.x ? " sold" : ""}" data-open="${p.id}">${img(p)}<div class="tx"><h3>${p.n}</h3><p>${p.d}</p><span class="rt">★ ${p.r.toFixed(1)}${p.x ? ' · <b class="soldt">Stok habis</b>' : ""}</span>${foot(p)}</div></article>`;
const empty = (e, t, m, btn) => `<div class="empty"><div class="big" aria-hidden="true">${e}</div><h3>${t}</h3><p>${m}</p>${btn || ""}</div>`;
const match = (q, cat) => vis().filter((p) => (cat === "All" || p.c === cat) && (p.n + " " + p.d + " " + p.c).toLowerCase().includes(q.trim().toLowerCase()));
const list = (a) => a.length ? a.map(row).join("") : empty("🔎", "Menu tidak ditemukan", "Coba kata kunci lain atau pilih kategori berbeda.");
const tpText = (i) => (i.tp && i.tp.length ? " · + " + i.tp.join(", ") : "");
const optText0 = (i) => (isD(P[i.id]) ? `${i.sz} · gula ${i.su.toLowerCase()} · ${i.ic.toLowerCase()}` : "Siap saji") + tpText(i);
const optText = (i) => optText0(i) + (i.nt ? " · Catatan: " + esc(i.nt) : "");

/* ===== HALAMAN PELANGGAN ===== */
function voucherHtml() {
  return `<h2 class="st">Voucher</h2><div class="hs">${VOUCHERS.map((v) => { const got = S.claim[v.c], ex = got && Date.now() > exAt(v), ok = got && !ex; return `<div class="vch ${v.t === "ship" ? "ship" : ""} ${ok ? "on" : ""}"><small>${v.tag}</small><h3>${v.n}</h3><p>Min. belanja ${rp(v.min)}${v.t === "%" ? " · maks. " + rp(v.max) : ""}<br>${ok ? "Berlaku s/d " + dMon(exAt(v)) : ex ? "Kedaluwarsa, klaim lagi" : "Berlaku " + v.d + " hari sejak diklaim"}</p><div class="vf"><code>${v.c}</code><button class="btn sm" data-claim="${v.c}" ${ok ? "disabled" : ""}>${ok ? "✓ Diklaim" : "Klaim"}</button></div></div>`; }).join("")}</div>`;
}
const CHG = {
  ShopeeFood: '<path d="M6.5 9.5h11l-.9 9H7.4z"/><path d="M9.3 9.5a2.7 2.7 0 0 1 5.4 0"/><path d="M10 13.5c.6 1 3.4 1 4 0s-.4-1.5-2-1.7-2.2-.8-1.8-1.6c.5-.9 2.8-.8 3.5 0"/>',
  GoFood: '<path d="M8 5.5v5a2 2 0 0 0 4 0v-5M10 5.5V19M16.5 5.5c-1.6 1.4-2 4.6-.2 6.3.4.4.2.8.2 1.2V19"/>',
  GrabFood: '<circle cx="7.5" cy="16.5" r="2.2"/><circle cx="17" cy="16.5" r="2.2"/><path d="M7.5 16.5H12l2.3-6.5H17M11 10H8.5"/><path d="M14.8 7h2.7"/>'
};
const chIcon = (k) => `<span class="chi ${k}" aria-hidden="true"><svg viewBox="0 0 24 24">${CHG[k]}</svg></span>`;
const channelsHtml = () => `<h2 class="st">Pesan Lewat</h2><div class="chg">${Object.entries(CH).map(([k, c]) => `<button class="chc ch-${k}${isDel() && S.ch === k ? " on" : ""}" data-chpick="${k}">${chIcon(k)}<span class="cht"><b>${k}</b><small>Ongkir ${rp(c.ship)}${c.svc ? " · layanan " + rp(c.svc) : ""}</small></span></button>`).join("")}</div>`;
const voucherPick = () => { const l = VOUCHERS.filter((v) => S.claim[v.c]); return l.length ? l.map((v) => { const w = vWhy(v), on = S.voucher === v.c || S.vship === v.c; return `<button class="vpk${on && !w ? " on" : ""}${w ? " off" : ""}" data-vch="${v.c}" ${w ? "disabled" : ""}><span class="vi">${v.t === "ship" ? "🚚" : "🏷️"}</span><span><b>${v.n}</b><small>${w || "Berlaku s/d " + dMon(exAt(v))}</small></span><span class="vr">${on && !w ? "✓" : ""}</span></button>`; }).join("") : '<p class="earn">Belum ada voucher diklaim. Klaim di beranda atau masukkan kode di bawah.</p>'; };
const delivPanel = () => !isDel() ? "" : `<div class="opt"><h4>Pesan lewat</h4><div class="chg">${Object.entries(CH).map(([k, c]) => `<button class="chc ch-${k}${S.ch === k ? " on" : ""}" data-ch="${k}">${chIcon(k)}<span class="cht"><b>${k}</b><small>Ongkir ${rp(c.ship)}${c.svc ? " · layanan " + rp(c.svc) : ""}</small></span></button>`).join("")}</div><p class="earn">${shipHint()}</p><p class="earn">Simulasi pesanan ${S.ch}. Diskon menu hanya untuk Dine in dan Take away, Delivery bisa memakai voucher gratis ongkir.</p><input class="fld" id="addr" placeholder="Alamat pengantaran lengkap" value="${esc(S.addr)}" aria-label="Alamat pengantaran" oninput="S.addr=this.value"></div>`;
const ini = () => esc((S.prof.nm || "").trim().charAt(0).toUpperCase()) || svg("user");
function profilePage() {
  const p = S.prof;
  const nOrd = S.orders.length, nVou = VOUCHERS.filter((v) => S.claim[v.c] && Date.now() <= exAt(v)).length, nFav = S.fav.filter((i) => P[i] && !P[i].h).length;
  const fld = (ic, id, ph, v, extra) => `<div class="pf-f"><span class="pf-i" aria-hidden="true">${svg(ic)}</span><input class="fld" id="${id}" placeholder="${ph}" value="${esc(v)}" aria-label="${ph}" ${extra || ""}></div>`;
  const row = (a, ic, t, sm) => `<button class="pf-row" ${a}><span class="pf-ri" aria-hidden="true">${svg(ic)}</span><span><b>${t}</b><small>${sm}</small></span>${svg("chevron")}</button>`;
  return `<div class="top"><span class="logo" data-kasir-tap>PROFILE</span></div>
  <section class="pf-hero"><div class="pav">${ini()}</div><h2>${esc(p.nm || "Profil Saya")}</h2><p>${esc(p.hp) || "Lengkapi profil agar checkout lebih cepat"}</p>
    <div class="pf-stats"><div><b>${nOrd}</b><small>Pesanan</small></div><div><b>${nVou}</b><small>Voucher</small></div><div><b>${nFav}</b><small>Favorit</small></div></div></section>
  <h3 class="pf-h">Data diri</h3>
  <div class="pf-card">
    ${fld("user", "pn", "Nama lengkap", p.nm, 'maxlength="40" autocomplete="off"')}
    ${fld("phone", "ph", "No. HP (08xxxxxxxxxx)", p.hp, 'type="tel" inputmode="numeric" maxlength="13"')}
    ${fld("pin", "pa", "Alamat utama untuk Delivery", p.addr, 'maxlength="150"')}
    <div class="err" id="perr2" role="alert"></div><button class="btn w" data-psave style="margin-top:0">Simpan Profil</button>
  </div>
  <h3 class="pf-h">Pintasan</h3>
  <div class="pf-list">${row("data-orders", "receipt", "Pesanan saya", "Riwayat dan status pesanan")}${row("data-myv", "tag", "Voucher saya", nVou + " voucher aktif")}${row('data-go="fav"', "heart", "Favorit", nFav + " menu tersimpan")}${row("data-info", "pin", "Info kafe", "Alamat, jam buka, dan kontak")}${row("data-lockapp", "lock", "Kunci aplikasi", "Kunci layar dengan PIN")}</div>
  <button class="pf-del" data-pdel>${svg("trash")}Hapus data profil</button>`;
}
function saveProfile() {
  const g = (i) => document.getElementById(i).value.trim(), er = (t) => { document.getElementById("perr2").textContent = t; };
  const nm = g("pn"), hp = g("ph"), ad = g("pa");
  if (nm.length < 2) return er("Nama minimal 2 karakter.");
  if (hp && !/^08[0-9]{8,11}$/.test(hp)) return er("No. HP diawali 08, total 10–13 digit.");
  if (ad && ad.length < 10) return er("Alamat minimal 10 karakter.");
  S.prof = { nm, hp, addr: ad }; store("vc_profile", S.prof);
  S.name = S.nm = nm; store("vc_name", nm); S.addr = ad;
  closeSheet(); render(); toast("Profil disimpan");
}
function delProfile() {
  if (!confirm("Hapus data profil (nama, HP, alamat)?")) return;
  S.prof = { nm: "", hp: "", addr: "" }; store("vc_profile", S.prof); S.addr = "";
  closeSheet(); render(); toast("Data profil dihapus");
}
function drawMyVouchers() {
  const l = VOUCHERS.filter((v) => S.claim[v.c]);
  openSheet(`<div class="panel" role="dialog" aria-modal="true" aria-label="Voucher saya"><button class="cl" data-close aria-label="Tutup">✕</button>
  <h2 class="st" style="margin-top:56px">Voucher Saya</h2>${l.length ? l.map((v) => { const ex = Date.now() > exAt(v); return `<div class="vpk${ex ? " off" : ""}"><span class="vi">${svg("tag")}</span><span><b>${v.n}</b><small>${v.c} · ${ex ? "Kedaluwarsa" : "Berlaku s/d " + dMon(exAt(v))}</small></span><span></span></div>`; }).join("") : empty(svg("tag"), "Belum ada voucher", "Klaim voucher di beranda.")}</div>`);
}
function claim(c) { S.claim[c] = Date.now(); store("vc_claim", S.claim); toast("Voucher " + c + " berhasil diklaim"); render(); }
function useV(c) {
  const v = VOUCHERS.find((x) => x.c === c), w = vWhy(v); if (w) return toast(w);
  const k = v.t === "ship" ? "vship" : "voucher"; S[k] = S[k] === c ? "" : c;
  toast(S[k] ? "Voucher " + c + " dipakai" : "Voucher dilepas");
}
function homeBody() {
  if (S.q.trim()) return list(match(S.q, "All"));
  const cb = P.findIndex((p) => p.n === "Salted Caramel Cold Brew");
  const pop = popular(8);
  const fy = forYou(6);
  return `${openBar("button")}<div class="ban"><small>COFFEE • KITCHEN • GATHER</small><h2>A Taste Above Ordinary.</h2><p>Exceptional coffee, delicious dishes, and moments worth sharing.</p><div class="acts"><button class="btn" data-go="explore">Explore Menu</button><button class="btn ghost" data-story>Our Story</button>${P[cb] && !P[cb].h ? `<button class="btn ghost" data-open="${cb}">Pilihan musim ini</button>` : ""}</div></div>
  ${voucherHtml()}<h2 class="st">Kategori</h2><div class="cats">${CATS.map(([c, e]) => `<button class="cat" data-cat="${c}">${catVis(c, e)}${c}</button>`).join("")}</div>
  <h2 class="st">Produk Populer</h2><div class="hs">${pop.map((p) => vc(p, true)).join("")}</div>
  <h2 class="st">Untukmu</h2><p class="rec-note">${fy.note}</p><div class="for-you">${fy.list.map(row).join("")}</div>
  <h2 class="st">Best Seller</h2><div class="hs">${vis().filter((p) => p.b).map((p) => vc(p)).join("")}</div>
  <h2 class="st" id="about">More Than Just a Café</h2><p class="about">VELORA adalah tempat menikmati kopi yang diseduh dengan teliti, hidangan berkualitas, dan waktu berharga bersama orang terdekat.</p>
  <h2 class="st">Moments at VELORA</h2><div class="gal">${GALLERY.map(([f, c, t]) => `<figure class="im ${t ? "t" : ""}"><span class="mono" aria-hidden="true">V</span><img src="images/gallery-${f}.jpg" alt="${c} VELORA Café" loading="lazy" onerror="this.remove()"><figcaption>${c}</figcaption></figure>`).join("")}</div>
  <h2 class="st">Visit VELORA</h2><div class="cardi inf-c">${infoRows()}</div>`;
}
function home() {
  const h = new Date().getHours(), g = h < 11 ? "Selamat pagi" : h < 15 ? "Selamat siang" : h < 18 ? "Selamat sore" : "Selamat malam";
  return `<div class="top"><span class="logo" data-kasir-tap>VELORA</span><div style="display:flex;gap:8px"><button class="ib" id="cbtn" data-chatlist aria-label="Chat kasir" title="Chat kasir">${chatBtn()}</button><button class="ib" data-go="cart" aria-label="Buka keranjang">${svg("bag")}${cnt() ? `<span class="bd">${cnt()}</span>` : ""}</button></div></div>
  <p class="hi">${g}, Selamat menikmati</p><h1>Apa yang ingin kamu nikmati hari ini?</h1>
  <input class="srch" type="search" placeholder="Cari menu favoritmu" value="${esc(S.q)}" aria-label="Cari menu" oninput="S.q=this.value;$('#hb').innerHTML=homeBody()">
  <div id="hb">${homeBody()}</div>`;
}
function explore() {
  return `<div class="top"><span class="logo" data-kasir-tap>EXPLORE</span></div>
  <input class="srch" type="search" placeholder="Cari kopi, pasta, pastry…" value="${esc(S.q)}" aria-label="Cari menu" oninput="S.q=this.value;$('#xl').innerHTML=list(match(S.q,S.cat))">
  <div class="chips">${["All", ...CATS.map((c) => c[0])].map((c) => `<button class="${S.cat === c ? "on" : ""}" data-chip="${c}" aria-pressed="${S.cat === c}">${c}</button>`).join("")}</div>
  <div id="xl">${list(match(S.q, S.cat))}</div>`;
}
function fav() {
  const a = P.filter((p) => S.fav.includes(p.id) && !p.h);
  return `<div class="top"><span class="logo" data-kasir-tap>FAVORITES</span></div>` + (a.length ? a.map(row).join("") : empty("🤍", "Belum ada favorit", "Ketuk ikon hati pada menu untuk menyimpannya di sini.", '<button class="btn" data-go="explore">Jelajahi menu</button>'));
}
function cart() {
  const top = `<div class="top"><span class="logo" data-kasir-tap>CART</span><button class="btn sm ol" data-orders>Pesanan saya</button></div>`;
  if (!S.cart.length) return top + empty("🛍️", "Keranjang masih kosong", "Pilih menu favoritmu lalu tambahkan ke keranjang.", '<button class="btn" data-go="explore">Mulai pesan</button>');
  return top + S.cart.map((i) => `<div class="ci">${img(P[i.id])}<div><h3>${P[i.id].n}</h3><small>${optText(i)}</small><b class="pr">${rp(unit(i))}</b></div><div class="qty"><button data-q="${i.k}" data-d="-1" aria-label="Kurangi">−</button><b>${i.q}</b><button data-q="${i.k}" data-d="1" aria-label="Tambah">+</button></div></div>`).join("") +
    `<div class="srow"><span>Subtotal</span><span>${rp(sub())}</span></div>${disc() ? `<div class="srow"><span>Voucher ${S.voucher}</span><span>-${rp(disc())}</span></div>` : ""}<div class="srow"><span>Pajak dan layanan ${TAX * 100}%</span><span>${rp(taxAmt())}</span></div>${feeRows()}<div class="srow t"><span>Total</span><span>${rp(total())}</span></div><button class="btn w" data-checkout>Checkout</button>`;
}
const V = { home, explore, fav, cart, profile: profilePage };

/* ===== HALAMAN KASIR ===== */
const KT = [["orders", "Pesanan"], ["menu", "Menu"], ["voucher", "Voucher"], ["chat", "Chat"], ["set", "Setelan"]];
function kasirShell(inner) {
  const w = S.orders.filter((o) => o.status === "wait").length;
  const proc = S.orders.filter((o) => PROC.includes(o.status)).length;
  const dn = S.orders.filter((o) => o.status === "done").length;
  const un = unreadCount("k");
  const badgeOf = (k) => (k === "chat" && un ? `<i>${un}</i>` : k === "orders" && w ? `<i>${w}</i>` : "");
  return `<div class="kasir-shell">
    <header class="kasir-head">
      <div class="kasir-brand">
        <span class="kb-logo">V</span>
        <div><b>VELORA POS</b><small>Panel Kasir · ${STAFF_NAME}</small></div>
      </div>
      <div class="kasir-head-actions">
        ${S.kt === "orders" && S.orders.length ? `<button class="kasir-btn danger" data-clear-all aria-label="Hapus semua riwayat" title="Hapus semua riwayat">🗑 Hapus</button>` : ""}
        <button class="kasir-btn" data-kasir-exit>Keluar</button>
      </div>
    </header>
    <nav class="kasir-tabs" aria-label="Menu kasir">${KT.map(([k, l]) => `<button class="${S.kt === k ? "on" : ""}" data-kt="${k}">${l}${badgeOf(k)}</button>`).join("")}</nav>
    ${S.kt === "orders" ? `<div class="kasir-stats">
      <div class="ks"><b>${w}</b><small>Menunggu</small></div>
      <div class="ks paid"><b>${proc}</b><small>Diproses</small></div>
      <div class="ks dn"><b>${dn}</b><small>Selesai</small></div>
    </div>` : ""}
    <div class="kasir-body">${inner}</div>
  </div>`;
}
const PROC = ["paid", "prep", "ready"];
const isPaidSt = (s) => s === "done" || PROC.includes(s);
const NEXT = { paid: ["prep", "Mulai Siapkan"], prep: ["ready", "Tandai Siap"], ready: ["done", "Selesaikan Pesanan"] };
const KF = [["all", "Semua"], ["wait", "Menunggu"], ["proc", "Diproses"], ["done", "Selesai"]];
const kMatch = (o, f) => f === "all" || (f === "proc" ? PROC.includes(o.status) : o.status === f);
function kFiltered() {
  const q = S.kq.trim().toLowerCase();
  return [...S.orders].reverse().filter((o) => kMatch(o, S.kf) && (!q || (o.id + " " + o.nm + " " + (o.hp || "")).toLowerCase().includes(q)));
}
function salesCard() {
  const t0 = new Date(); t0.setHours(0, 0, 0, 0);
  const po = S.orders.filter((o) => o.ts >= t0.getTime() && isPaidSt(o.status));
  const omzet = po.reduce((a, o) => a + o.grand, 0), tally = {};
  po.forEach((o) => o.items.forEach((i) => { tally[i.n] = (tally[i.n] || 0) + i.q; }));
  const top = Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 3), qty = Object.values(tally).reduce((a, n) => a + n, 0);
  return `<section class="ksum"><div class="ksum-h"><small>Penjualan hari ini</small><b>${rp(omzet)}</b></div>
  <div class="ksum-g"><div><b>${po.length}</b><small>Pesanan lunas</small></div><div><b>${qty}</b><small>Item terjual</small></div><div><b>${rp(po.length ? omzet / po.length : 0)}</b><small>Rata-rata</small></div></div>
  <h4>${top.length >= 3 ? "3 menu terlaris" : "Menu terlaris"}</h4>${top.length ? `<ol class="ktop">${top.map(([n, q], i) => `<li><span><span class="rk">${i + 1}</span>${n}</span><b>${q}×</b></li>`).join("")}</ol>` : '<p class="none">Belum ada penjualan hari ini.</p>'}</section>`;
}
function kTools() {
  if (!S.orders.length) return "";
  const n = (f) => S.orders.filter((o) => kMatch(o, f)).length;
  return `<div class="kfil">${KF.map(([k, l]) => `<button class="${S.kf === k ? "on" : ""}" data-kf="${k}">${l}<i>${n(k)}</i></button>`).join("")}</div>
  <div class="ktools"><input class="fld" id="kq" type="search" placeholder="Cari nama atau nomor pesanan" value="${esc(S.kq)}" aria-label="Cari pesanan" autocomplete="off" oninput="S.kq=this.value;$('#kl').innerHTML=kasirList()"></div>`;
}
function kActions(o) {
  if (o.status === "wait") return `${o.exp ? `<div class="kcd">Sisa waktu bayar <b data-cdx="${o.exp}">${cdText(o.exp)}</b></div>` : ""}<div class="kactions"><button class="kbtn ok" data-ok="${o.id}">✓ Konfirmasi Lunas</button><button class="kbtn no" data-no="${o.id}">✕ Tolak</button></div>`;
  if (["rejected", "expired", "cancelled"].includes(o.status)) return "";
  const n = NEXT[o.status], lbl = n && (o.status === "prep" && o.type === "Delivery" ? "Kirim / Antar" : n[1]);
  return `${o.rt ? `<div class="krt">★ ${o.rt.st}/5${o.rt.tx ? " · " + esc(o.rt.tx) : ""}</div>` : ""}<div class="kactions">${n ? `<button class="kbtn ok" data-next="${o.id}">${lbl}</button>` : ""}<button class="kbtn pr" data-kprint="${o.id}">Cetak Struk</button></div>`;
}
function kasirOrders() {
  return salesCard() + kTools() + `<div id="kl">${kasirList()}</div>`;
}
function kasirList() {
  const l = kFiltered();
  const inner = l.length ? l.map((o) => `
    <article class="kcard ${o.status}">
      <div class="khead">
        <div>
          <span class="kid">${o.id}</span>
          <small class="ksub">${esc(o.nm)} · ${o.type}${o.ch ? ` <span class="chb ${o.ch}">${o.ch}</span>` : ""}</small>${o.addr ? `<small class="ksub">📍 ${esc(o.addr)}</small>` : ""}${o.hp ? `<small class="ksub">📞 ${esc(o.hp)}</small>` : ""}
        </div>
        <div class="khead-right">
          ${badge(o.status, o)}
          <button class="kdel" data-chat="${o.id}" aria-label="Chat pelanggan" title="Chat pelanggan">${svg("chat")}${ukn(o.id)}</button>
          <button class="kdel" data-del-one="${o.id}" aria-label="Hapus pesanan ${o.id}" title="Hapus pesanan">🗑</button>
        </div>
      </div>
      <div class="kinfo">
        <div class="klabel">Pembayaran</div>
        <div class="kpay">${o.pay}</div>
        <div class="ktotal">${rp(o.grand)}</div>
      </div>
      <ul class="kitems">
        ${o.items.map((i) => `
          <li>
            <div class="kline1"><b>${i.q}×</b>${i.n}</div>
            <div class="kline2">${i.o}</div>
          </li>`).join("")}
      </ul>
      <div class="kmeta">
        <span>${dt(o.ts)}</span>
        
      </div>
      ${kActions(o)}
    </article>`).join("") : S.orders.length ? empty("🔎", "Tidak ada pesanan", "Coba ganti filter atau kata kunci pencarian.") : empty("🧾", "Belum ada pesanan", "Pesanan pelanggan akan muncul di sini.");
  return inner;
}

/* --- Kasir: kelola menu --- */
const plain = (t) => String(t).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
function kasirMenu() {
  return `<button class="kbtn ok kfull" data-madd>+ Tambah Produk</button>
  <div class="ktools"><input class="fld" id="mq" type="search" placeholder="Cari menu (nama atau kategori)" value="${esc(S.mq)}" aria-label="Cari menu" autocomplete="off" oninput="S.mq=this.value;$('#ml').innerHTML=kasirMenuList()"></div>
  <div id="ml">${kasirMenuList()}</div>`;
}
function kasirMenuList() {
  const all = P.filter((p) => !p.h), q = (S.mq || "").trim().toLowerCase();
  const l = q ? all.filter((p) => (plain(p.n) + " " + p.c).toLowerCase().includes(q)) : all;
  const info = q ? `${l.length} menu ditemukan untuk "${esc(S.mq.trim())}".` : `${all.filter((p) => p.x).length} dari ${all.length} produk ditandai habis. Perubahan langsung terlihat di sisi pelanggan.`;
  const gone = P.filter((p) => p.h && (!q || (plain(p.n) + " " + p.c).toLowerCase().includes(q)));
  const trash = gone.length ? `<h3 class="kcat">🗑 Menu terhapus (${gone.length})</h3>` + gone.map((p) => `<div class="mrow out"><div><b>${p.n}</b><small>${rp(p.p)} · ${p.c}</small></div><div class="mact"><button class="kbtn ok sm" data-mres="${p.id}">Pulihkan</button></div></div>`).join("") : "";
  if (!l.length) return `<p class="ksub2">${info}</p><p class="none">Menu tidak ditemukan. Coba kata kunci lain.</p>` + trash;
  return `<p class="ksub2">${info}</p>` +
    CATS.map(([c, e]) => { const a = l.filter((p) => p.c === c); return a.length ? `<h3 class="kcat">${e} ${c}</h3>` + a.map((p) => `<div class="mrow${p.x ? " out" : ""}"><div><b>${p.n}</b><small>${rp(p.p)}${p.cu ? " · produk baru" : ""}</small></div><div class="mact"><button class="kbtn pr sm" data-medit="${p.id}">Edit</button><button class="kbtn ${p.x ? "ok" : "no"} sm" data-mx="${p.id}">${p.x ? "Tersedia" : "Habis"}</button><button class="kdel" data-mdel="${p.id}" aria-label="Hapus ${p.n}" title="Hapus menu">🗑</button></div></div>`).join("") : ""; }).join("") + trash;
}
function saveMenu(fn) {
  const m = readMenu(); m.add = m.add || []; m.st = m.st || {};
  fn(m); store("vc_menu", m); applyMenu(); pruneCart(); render();
}
function toggleOut(id) {
  saveMenu((m) => { const s = (m.st[id] = m.st[id] || {}); s.x = !s.x; });
  toast(P[id].n + (P[id].x ? " ditandai habis" : " tersedia lagi"));
}
function delProduct(id) {
  if (!confirm("Hapus menu \"" + plain(P[id].n) + "\"? Menu hilang dari sisi pelanggan, tapi bisa dipulihkan lagi dari daftar Menu terhapus.")) return;
  saveMenu((m) => { const s = (m.st[id] = m.st[id] || {}); s.h = true; });
  toast("Menu dihapus. Bisa dipulihkan di bagian bawah daftar");
}
function restoreProduct(id) {
  saveMenu((m) => { const s = (m.st[id] = m.st[id] || {}); s.h = false; });
  toast(plain(P[id].n) + " dipulihkan ke menu");
}
let NEWPH = "";
const phBox = () => NEWPH ? `<img src="${NEWPH}" alt="Pratinjau foto produk">` : `<span>📷 Unggah foto produk<small>Opsional · JPG/PNG dari galeri atau kamera</small></span>`;
function showPhoto() {
  const b = document.getElementById("mprev"), x = document.getElementById("mphx"); if (!b) return;
  b.innerHTML = phBox(); b.classList.toggle("has", !!NEWPH); if (x) x.style.display = NEWPH ? "" : "none";
}
function clearPhoto() { NEWPH = ""; const f = document.getElementById("mf"); if (f) f.value = ""; showPhoto(); }
function pickPhoto(inp) {
  const f = inp.files && inp.files[0], er = document.getElementById("merr"); if (!f) return;
  if (!/^image\//.test(f.type)) { er.textContent = "File harus berupa gambar."; inp.value = ""; return; }
  er.textContent = "";
  const rd = new FileReader();
  rd.onerror = () => { er.textContent = "Gambar tidak bisa dibaca. Coba file lain."; };
  rd.onload = () => {
    const im = new Image();
    im.onerror = () => { er.textContent = "Gambar tidak bisa dibaca. Coba file lain."; };
    im.onload = () => {
      const k = Math.min(1, 720 / Math.max(im.width, im.height)), w = Math.max(1, Math.round(im.width * k)), h = Math.max(1, Math.round(im.height * k));
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, w, h); x.drawImage(im, 0, 0, w, h);
      NEWPH = c.toDataURL("image/jpeg", 0.8); showPhoto();
    };
    im.src = rd.result;
  };
  rd.readAsDataURL(f);
}
function drawAddProduct() {
  NEWPH = "";
  openSheet(`<div class="panel" role="dialog" aria-modal="true" aria-label="Tambah produk"><button class="cl" data-close aria-label="Tutup">✕</button>
  <h2 class="st" style="margin-top:56px">Tambah Produk</h2>
  <label class="mph" id="mprev" for="mf">${phBox()}</label>
  <input type="file" id="mf" accept="image/*" hidden onchange="pickPhoto(this)">
  <button type="button" class="kbtn no sm mphx" id="mphx" style="display:none" onclick="clearPhoto()">Hapus foto</button>
  <input class="fld" id="mn" placeholder="Nama produk" maxlength="40" aria-label="Nama produk" autocomplete="off">
  <select class="fld" id="mc" aria-label="Kategori">${CATS.map(([c]) => `<option>${c}</option>`).join("")}</select>
  <input class="fld" id="mp" type="number" inputmode="numeric" min="1000" max="1000000" step="500" placeholder="Harga (Rp)" aria-label="Harga">
  <input class="fld" id="md" placeholder="Deskripsi singkat (opsional)" maxlength="90" aria-label="Deskripsi">
  <input class="fld" id="me" placeholder="Emoji (opsional)" maxlength="4" aria-label="Emoji">
  <div class="err" id="merr" role="alert"></div><button class="btn w" data-msave>Simpan Produk</button></div>`);
}
function saveProduct() {
  const g = (i) => document.getElementById(i).value.trim(), err = (t) => { document.getElementById("merr").textContent = t; };
  const n = g("mn"), c = g("mc"), p = Math.round(+g("mp")), d = g("md"), e = g("me");
  if (n.length < 2) return err("Nama produk minimal 2 karakter.");
  if (P.some((x) => !x.h && x.n.toLowerCase() === esc(n).toLowerCase())) return err("Nama produk sudah ada.");
  if (!(p >= 1000 && p <= 1000000)) return err("Harga harus antara Rp1.000 dan Rp1.000.000.");
  const s = n.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const m = readMenu(); m.add = m.add || []; m.st = m.st || {};
  m.add.push({ n: esc(n), c, p, d: esc(d || "Menu baru dari VELORA."), e: esc(e || (CATS.find((x) => x[0] === c) || [])[1] || "🍽️"), s, ...(NEWPH ? { ph: NEWPH } : {}) });
  if (!store("vc_menu", m)) return err("Penyimpanan perangkat penuh. Pakai foto yang lebih kecil atau simpan tanpa foto.");
  NEWPH = ""; applyMenu(); pruneCart(); render();
  closeSheet(); toast(n + " ditambahkan ke menu");
}
function pruneCart() {
  const bad = S.cart.filter((i) => !P[i.id] || P[i.id].x || P[i.id].h);
  if (!bad.length) return false;
  S.cart = S.cart.filter((i) => !bad.includes(i)); persist();
  toast(bad.map((i) => (P[i.id] || {}).n || "Produk").join(", ") + " habis, dikeluarkan dari keranjang");
  return true;
}

/* --- Kasir: edit harga dan deskripsi menu --- */
const unesc = (s) => String(s).replace(/&(amp|lt|gt|quot);/g, (m, k) => ({ amp: "&", lt: "<", gt: ">", quot: '"' }[k]));
function drawEditProduct(id) {
  const p = P[id]; if (!p) return;
  openSheet(`<div class="panel" role="dialog" aria-modal="true" aria-label="Edit produk"><button class="cl" data-close aria-label="Tutup">✕</button>
  <h2 class="st" style="margin-top:56px">Edit ${p.n}</h2>
  <div class="opt"><h4>Harga (Rp)</h4><input class="fld" id="ep" type="number" inputmode="numeric" min="1000" max="1000000" step="500" value="${p.p}" aria-label="Harga"></div>
  <div class="opt"><h4>Deskripsi</h4><input class="fld" id="ed" maxlength="90" value="${esc(unesc(p.d))}" aria-label="Deskripsi"></div>
  <div class="err" id="eerr" role="alert"></div><button class="btn w" data-mesave="${id}">Simpan Perubahan</button>
  ${(readMenu().ed || {})[id] ? `<button class="btn w ol" data-mreset="${id}">Kembalikan ke awal</button>` : ""}</div>`);
}
function saveEdit(id) {
  const g = (i) => document.getElementById(i).value.trim(), err = (t) => { document.getElementById("eerr").textContent = t; };
  const p = Math.round(+g("ep")), d = g("ed");
  if (!(p >= 1000 && p <= 1000000)) return err("Harga harus antara Rp1.000 dan Rp1.000.000.");
  saveMenu((m) => { m.ed = m.ed || {}; m.ed[id] = { p, d: d ? esc(d) : "" }; });
  closeSheet(); toast("Menu " + P[id].n + " diperbarui");
}
function resetEdit(id) {
  saveMenu((m) => { if (m.ed) delete m.ed[id]; });
  closeSheet(); toast("Menu " + P[id].n + " dikembalikan ke awal");
}

/* --- Kasir: kelola voucher --- */
function saveV(fn) {
  const m = readV(); m.add = m.add || []; m.off = m.off || {};
  fn(m); store("vc_vouch", m); applyVouchers(); render();
}
function kasirVoucher() {
  return `<button class="kbtn ok kfull" data-vadd>+ Buat Voucher</button><p class="ksub2">${ALL_V.filter((v) => !v.off).length} dari ${ALL_V.length} voucher aktif. Voucher nonaktif tidak tampil dan tidak bisa dipakai pelanggan.</p>` +
    ALL_V.map((v) => `<div class="mrow${v.off ? " out" : ""}"><div><b>${v.n}</b><small>${v.c} · ${v.t === "%" ? v.v + "% (maks. " + rp(v.max) + ")" : v.t === "free" ? "Gratis pastry" : rp(v.v)} · min. ${rp(v.min)} · ${v.d} hari</small></div><div class="mact"><button class="kbtn ${v.off ? "ok" : "no"} sm" data-vtog="${v.c}">${v.off ? "Aktifkan" : "Nonaktifkan"}</button>${v.cu ? `<button class="kdel" data-vdel="${v.c}" aria-label="Hapus voucher ${v.c}" title="Hapus voucher">🗑</button>` : ""}</div></div>`).join("");
}
function drawAddVoucher() {
  openSheet(`<div class="panel" role="dialog" aria-modal="true" aria-label="Buat voucher"><button class="cl" data-close aria-label="Tutup">✕</button>
  <h2 class="st" style="margin-top:56px">Buat Voucher</h2>
  <input class="fld" id="vk" placeholder="Kode (huruf/angka, 3–12 karakter)" maxlength="12" aria-label="Kode voucher" autocomplete="off" style="text-transform:uppercase">
  <input class="fld" id="vn" placeholder="Nama voucher, misal: Diskon 10% akhir pekan" maxlength="60" aria-label="Nama voucher" autocomplete="off">
  <select class="fld" id="vt" aria-label="Jenis voucher"><option value="%">Diskon persen (%)</option><option value="rp">Potongan harga (Rp)</option><option value="ship">Potongan ongkir (Rp)</option></select>
  <input class="fld" id="vv" type="number" inputmode="numeric" placeholder="Nilai (persen atau Rp)" aria-label="Nilai">
  <input class="fld" id="vm" type="number" inputmode="numeric" placeholder="Minimal belanja (Rp, kosong = tanpa minimal)" aria-label="Minimal belanja">
  <input class="fld" id="vx" type="number" inputmode="numeric" placeholder="Maks. potongan (Rp, khusus persen)" aria-label="Maksimal potongan">
  <input class="fld" id="vd" type="number" inputmode="numeric" placeholder="Masa berlaku (hari sejak diklaim)" aria-label="Masa berlaku">
  <div class="err" id="verr" role="alert"></div><button class="btn w" data-vsave>Simpan Voucher</button></div>`);
}
function saveVoucher() {
  const g = (i) => document.getElementById(i).value.trim(), err = (t) => { document.getElementById("verr").textContent = t; };
  const c = g("vk").toUpperCase(), n = g("vn"), t = g("vt"), v = Math.round(+g("vv")), min = Math.round(+g("vm") || 0), mx = Math.round(+g("vx")), d = Math.round(+g("vd"));
  if (!/^[A-Z0-9]{3,12}$/.test(c)) return err("Kode 3–12 karakter, hanya huruf dan angka.");
  if (ALL_V.some((x) => x.c === c)) return err("Kode voucher sudah dipakai.");
  if (n.length < 4) return err("Nama voucher minimal 4 karakter.");
  if (t === "%" && !(v >= 1 && v <= 100)) return err("Persen harus 1–100.");
  if (t === "rp" && !(v >= 1000 && v <= 1000000)) return err("Potongan harus Rp1.000–Rp1.000.000.");
  if (t === "ship" && !(v >= 1000 && v <= 50000)) return err("Potongan ongkir harus Rp1.000–Rp50.000.");
  if (t === "%" && !(mx >= 1000 && mx <= 1000000)) return err("Maks. potongan harus Rp1.000–Rp1.000.000.");
  if (min < 0 || min > 10000000) return err("Minimal belanja maksimal Rp10.000.000.");
  if (!(d >= 1 && d <= 365)) return err("Masa berlaku 1–365 hari.");
  const tag = t === "%" ? v + "% OFF" : t === "rp" ? "Rp" + v.toLocaleString("id-ID") + " OFF" : "ONGKIR Rp" + v.toLocaleString("id-ID");
  saveV((m) => m.add.push({ c, tag, n: esc(n), t, v, min, max: t === "%" ? mx : v, d, cu: 1 }));
  closeSheet(); toast("Voucher " + c + " dibuat");
}
function toggleVoucher(c) {
  saveV((m) => { if (m.off[c]) delete m.off[c]; else m.off[c] = 1; });
  const v = ALL_V.find((x) => x.c === c);
  toast("Voucher " + c + (v && v.off ? " dinonaktifkan" : " diaktifkan"));
}
function delVoucher(c) {
  if (!confirm("Hapus voucher \"" + c + "\"?")) return;
  saveV((m) => { m.add = m.add.filter((v) => v.c !== c); delete m.off[c]; });
  toast("Voucher " + c + " dihapus");
}

/* --- Kasir: ubah PIN --- */
function kasirSet() { return hoursSec() + kasirSet0(); }
function kasirSet0() {
  const f = (id, l) => `<label class="slbl">${l}<input class="fld" id="${id}" type="password" inputmode="numeric" maxlength="4" placeholder="4 angka" autocomplete="off"></label>`;
  const snd = load("vc_snd", true), tk = TONES[load("vc_tone", "bell")] ? load("vc_tone", "bell") : "bell";
  return `<section class="kset"><h3>Notifikasi Suara</h3><p>Bunyi saat ada pesanan atau chat baru masuk. Ketuk nada untuk memilih dan mendengarkannya. Status: <b>${snd ? "aktif" : "mati"}</b>.</p><button class="kbtn ${snd ? "no" : "ok"} kfull" data-snd>${svg(snd ? "mute" : "vol")}${snd ? "Matikan Suara" : "Nyalakan Suara"}</button><div class="tonegrid">${Object.entries(TONES).map(([k, t]) => `<button class="tbtn${tk === k ? " on" : ""}" data-tone="${k}" aria-pressed="${tk === k}">${svg(tk === k ? "check" : "bell")}${t.n}</button>`).join("")}</div><button class="kbtn pr kfull" style="margin-top:10px" data-sndtest>${svg("play")}Tes Suara</button></section>
  <section class="kset"><h3>Ubah PIN Kasir</h3><p>PIN untuk membuka panel ini.</p>${f("sk0", "PIN lama")}${f("sk1", "PIN baru")}${f("sk2", "Ulangi PIN baru")}<div class="kerr" id="kerr1" role="alert"></div><button class="kbtn ok kfull" data-savepin="k">Simpan PIN Kasir</button></section>
  <section class="kset"><h3>Ubah PIN Aplikasi</h3><p>PIN yang dimasukkan pelanggan di layar kunci.</p>${f("sa1", "PIN baru")}${f("sa2", "Ulangi PIN baru")}<div class="kerr" id="kerr2" role="alert"></div><button class="kbtn ok kfull" data-savepin="a">Simpan PIN Aplikasi</button></section>`;
}
function savePin(w) {
  const v = (id) => document.getElementById(id).value.trim(), e = document.getElementById(w === "k" ? "kerr1" : "kerr2");
  const a = v(w === "k" ? "sk1" : "sa1"), b = v(w === "k" ? "sk2" : "sa2");
  if (w === "k" && v("sk0") !== KASIR_PIN) return (e.textContent = "PIN lama salah.");
  if (!/^[0-9]{4}$/.test(a)) return (e.textContent = "PIN baru harus 4 angka.");
  if (a !== b) return (e.textContent = "Ulangi PIN tidak sama.");
  try { localStorage.setItem(w === "k" ? "vc_kasir_pin" : "vc_app_pin", a); } catch (x) {}
  if (w === "k") KASIR_PIN = a; else APP_PIN = a;
  toast(w === "k" ? "PIN kasir diperbarui" : "PIN aplikasi diperbarui"); render();
}

/* --- Chat kasir - pelanggan (per pesanan) --- */
const QR_K = ["Pesanan diterima, sedang kami proses", "Pembayaran sudah kami terima", "Mohon kirim bukti transfer lewat chat ini", "Pesanan sudah siap"];
const QR_C = ["Saya sudah bayar", "Pesanan saya sudah diterima?", "Berapa lama lagi?", "Bisa ubah pesanan?"];
const chatAll = () => load("vc_chat", {});
const role = () => (S.isKasir ? "k" : "c");
const other = (m, r) => m.f === (r === "k" ? "c" : "k");
function unreadOf(id, r) {
  const n = (chatAll()[id] || []).filter((m) => other(m, r)).length;
  return Math.max(0, n - ((load("vc_seen2", {})[r] || {})[id] || 0));
}
const unreadCount = (r) => S.orders.reduce((a, o) => a + unreadOf(o.id, r), 0);
const ukn = (id) => { const n = unreadOf(id, "k"); return n ? `<i class="ub">${n}</i>` : ""; };
const ukc = (id) => { const n = unreadOf(id, "c"); return n ? `<i class="ub">${n}</i>` : ""; };
function markSeen(id, r) {
  const s = load("vc_seen2", {}), n = (chatAll()[id] || []).filter((m) => other(m, r)).length;
  s[r] = s[r] || {}; if (s[r][id] === n) return; s[r][id] = n; store("vc_seen2", s);
}
function chatAdd(id, f, t) { const c = chatAll(); (c[id] = c[id] || []).push({ f, t, ts: Date.now() }); store("vc_chat", c); }
let _ch = "";
function drawChat(id) {
  const o = S.orders.find((x) => x.id === id); if (!o) return toast("Pesanan tidak ditemukan");
  const r = role(), qr = r === "k" ? QR_K : QR_C;
  openSheet(`<div class="panel" role="dialog" aria-modal="true" aria-label="Chat pesanan ${id}"><button class="cl" data-close aria-label="Tutup">✕</button>
  <h2 class="st" style="margin-top:56px">Chat ${r === "k" ? esc(o.nm) : "Kasir"}</h2><p class="dd">Pesanan ${id} · ${rp(o.grand)} ${badge(o.status, o)}</p>
  <div class="cmsgs" id="cmsgs" aria-live="polite"></div>
  <div class="cq">${qr.map((q) => `<button data-cq="${esc(q)}">${esc(q)}</button>`).join("")}</div>
  <div class="cin"><input class="fld" id="cin" maxlength="300" placeholder="Tulis pesan…" aria-label="Pesan" autocomplete="off"><button class="btn sm" data-csend>Kirim</button></div>
  ${r === "c" ? `<button class="btn w ol" data-cback="${id}">Kembali ke pesanan</button>` : ""}</div>`);
  S.chat = id; _ch = ""; paintChat(true);
}
function paintChat(force) {
  const el = document.getElementById("cmsgs"); if (!el || !S.chat) return;
  const id = S.chat, r = role(), l = chatAll()[id] || [];
  const h = l.length ? l.map((m) => m.f === "s" ? `<div class="cm sys">${esc(m.t)}</div>` : `<div class="cm ${m.f === r ? "me" : "ot"}">${esc(m.t)}<small>${new Date(m.ts).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</small></div>`).join("") : '<p class="earn" style="text-align:center">Belum ada pesan. Mulai percakapan untuk konfirmasi pesanan.</p>';
  if (h !== _ch) { const nb = el.scrollHeight - el.scrollTop - el.clientHeight < 40; el.innerHTML = h; _ch = h; if (force || nb) el.scrollTop = el.scrollHeight; }
  markSeen(id, r);
}
function sendChat(t) {
  t = (t || "").trim(); if (!t || !S.chat) return;
  chatAdd(S.chat, role(), t.slice(0, 300));
  const i = document.getElementById("cin"); if (i) i.value = "";
  paintChat(true);
}
function reopen(id) {
  const o = S.orders.find((x) => x.id === id); if (!o) return closeSheet();
  o.status !== "wait" ? drawDone(o) : cash(o.pay) ? drawWait(o) : drawPay(o);
}
const chatBtn = () => { const n = unreadCount("c"); return svg("chat") + (n ? `<span class="bd">${n}</span>` : ""); };
function drawChatList() {
  const c = chatAll(), l = [...S.orders].reverse();
  openSheet(`<div class="panel" role="dialog" aria-modal="true" aria-label="Chat kasir"><button class="cl" data-close aria-label="Tutup">✕</button>
  <h2 class="st" style="margin-top:56px">Chat Kasir</h2><p class="dd">Pilih pesanan untuk mengobrol dengan kasir dan konfirmasi pesananmu.</p>
  ${l.length ? l.map((o) => { const m = (c[o.id] || []).slice(-1)[0], n = unreadOf(o.id, "c"); return `<button class="oi" data-chat="${o.id}"><span><b>${o.id}</b><small>${m ? esc(m.t.slice(0, 40)) : "Belum ada pesan"}</small></span><span>${n ? `<i class="ub">${n}</i>` : badge(o.status, o)}</span></button>`; }).join("") : empty(svg("chat"), "Belum ada pesanan", "Buat pesanan dulu, lalu kamu bisa chat kasir untuk konfirmasi.")}</div>`);
}
function kasirChat() {
  const c = chatAll(), last = (o) => c[o.id].slice(-1)[0];
  const l = S.orders.filter((o) => c[o.id] && c[o.id].length).sort((a, b) => last(b).ts - last(a).ts);
  return l.length ? l.map((o) => { const m = last(o), n = unreadOf(o.id, "k"); return `<button class="mrow" data-chat="${o.id}"><div><b>${esc(o.nm)} · ${o.id}</b><small>${m.f === "k" ? "Kamu: " : ""}${esc(m.t.slice(0, 60))}</small></div>${n ? `<i class="ub">${n}</i>` : badge(o.status, o)}</button>`; }).join("") : empty(svg("chat"), "Belum ada chat", "Pelanggan bisa mengirim pesan dari detail pesanannya.");
}
const KV = { kasir: () => kasirShell(S.kt === "menu" ? kasirMenu() : S.kt === "voucher" ? kasirVoucher() : S.kt === "chat" ? kasirChat() : S.kt === "set" ? kasirSet() : kasirOrders()) };

/* ===== RENDER + NAVIGASI ===== */
function tabs() {
  $("#tabs").innerHTML = [["home", "home", "Home"], ["explore", "search", "Explore"], ["fav", "heart", "Favorites"], ["cart", "bag", "Cart"], ["profile", "user", "Profile"]]
    .map(([k, i, l]) => `<button class="${S.view === k ? "on" : ""}" data-go="${k}" aria-label="${l}" ${S.view === k ? 'aria-current="page"' : ""}>${svg(i)}${l}${k === "cart" && cnt() ? `<span class="bd">${cnt()}</span>` : ""}</button>`).join("");
}
function render() {
  if (!S.unlocked && !S.isKasir) {
    $("#tabs").innerHTML = "";
    $("#main").innerHTML = pinPage();
    return;
  }
  if (S.isKasir) {
    $("#tabs").innerHTML = "";
    $("#main").innerHTML = KV.kasir();
    return;
  }
  tabs(); $("#main").innerHTML = V[S.view]();
}
function go(v) { S.view = v; closeSheet(); render(); const m = $("#main"); m.scrollTop = 0; m.classList.remove("fade"); void m.offsetWidth; m.classList.add("fade"); }
let tt;
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 2200); }
const openSheet = (h, keep) => {
  S.watch = null; S.chat = null; S.dn = null;
  const sh = $("#sheet"), old = keep && !sh.hidden ? sh.querySelector(".panel") : null, top = old ? old.scrollTop : 0;
  sh.innerHTML = h; sh.hidden = false;
  if (old) { const p = sh.querySelector(".panel"); if (p) { p.style.animation = "none"; p.scrollTop = top; } }
};
function closeSheet() { S.watch = null; S.chat = null; S.dn = null; $("#sheet").hidden = true; $("#sheet").innerHTML = ""; }

/* ===== FAVORIT + KERANJANG ===== */
function toggleFav(id) {
  const on = !S.fav.includes(id);
  S.fav = on ? [...S.fav, id] : S.fav.filter((x) => x !== id);
  persist(); trackFav(id);
  toast(on ? P[id].n + " disimpan ke favorit" : P[id].n + " dihapus dari favorit");
  if (S.view === "fav") render();
  else document.querySelectorAll("[data-fav]").forEach((b) => b.classList.toggle("on", S.fav.includes(+b.dataset.fav)));
}
function addCart(id, o) {
  if (P[id].x || P[id].h) return toast(P[id].n + " sedang habis");
  const nt = (o.nt || "").trim(), tp = (o.tp || []).slice().sort(), k = [id, o.sz, o.su, o.ic, nt, tp.join("+")].join("|"), f = S.cart.find((i) => i.k === k);
  f ? (f.q += o.q) : S.cart.push({ k, id, sz: o.sz, su: o.su, ic: o.ic, nt, tp, q: o.q });
  persist(); trackCart(id); tabs(); bump(); toast(P[id].n + " ditambahkan ke keranjang");
  if (S.view === "home") { const hb = document.querySelector('.top .ib[data-go="cart"]'); if (hb) hb.innerHTML = svg("bag") + (cnt() ? `<span class="bd">${cnt()}</span>` : ""); }
}
function quick(id) { if (P[id].x) return toast(P[id].n + " sedang habis"); isD(P[id]) || topsFor(P[id]).length ? openDetail(id) : addCart(id, { sz: null, su: null, ic: null, tp: [], q: 1 }); }
function chgQ(k, d) {
  const i = S.cart.find((x) => x.k === k); if (!i) return;
  i.q += d; if (i.q <= 0) S.cart = S.cart.filter((x) => x !== i);
  persist(); render();
}

/* ===== DETAIL PRODUK ===== */
let D = null;
function openDetail(id) {
  const p = P[id];
  D = { id, sz: "Regular", su: "Normal", ic: "Normal", q: 1, nt: "", tp: [] };
  if (!isD(p)) D.sz = D.su = D.ic = null;
  trackView(id);
  drawDetail();
}
function drawDetail(keep) {
  const p = P[D.id], u = p.p + (D.sz === "Large" ? SIZE_UP : 0) + tpSum(p, D.tp);
  const tops = topsFor(p).length ? `<div class="opt"><h4>Topping / Add-on (opsional)</h4><div class="seg">${topsFor(p).map(([n, pr]) => `<button class="${D.tp.includes(n) ? "on" : ""}" data-tp="${esc(n)}" aria-pressed="${D.tp.includes(n)}">${esc(n)} (+${rp(pr)})</button>`).join("")}</div></div>` : "";
  const seg = (t, k, arr) => `<div class="opt"><h4>${t}</h4><div class="seg">${arr.map((v) => `<button class="${D[k] === v ? "on" : ""}" data-o="${k}|${v}" aria-pressed="${D[k] === v}">${v}${k === "sz" && v === "Large" ? " (+" + rp(SIZE_UP) + ")" : ""}</button>`).join("")}</div></div>`;
  const rel = related(D.id, 4);
  openSheet(`<div class="panel" role="dialog" aria-modal="true" aria-label="${p.n}"><button class="cl" data-close aria-label="Tutup">✕</button>${img(p, "hero-im")}
  <div class="ptop"><h2>${p.n}</h2><span class="rt">★ ${p.r.toFixed(1)}${p.rn ? " (" + p.rn + ")" : ""}</span></div><p class="dd">${p.d}</p>${revList(p)}
  ${isD(p) ? seg("Ukuran", "sz", ["Regular", "Large"]) + seg("Tingkat gula", "su", ["Normal", "Less", "No sugar"]) + seg("Es atau panas", "ic", ["Normal", "Less", "No ice", "Hot"]) : ""}
  ${tops}
  <div class="opt"><h4>Catatan (opsional)</h4><input class="fld" maxlength="80" placeholder="Contoh: less ice, tanpa topping" value="${esc(D.nt || "")}" aria-label="Catatan pesanan" oninput="D.nt=this.value"></div>
  <div class="opt"><h4>Jumlah</h4><div class="qty"><button data-dq="-1" aria-label="Kurangi">−</button><b>${D.q}</b><button data-dq="1" aria-label="Tambah">+</button></div></div>
  ${p.x ? '<button class="btn w" disabled>Stok habis</button>' : `<button class="btn w" data-addd>Tambah ke keranjang · ${rp(u * D.q)}</button>`}
  <h2 class="st">Produk terkait</h2><div class="rel-grid">${rel.map((r) => vc(r)).join("")}</div>
  </div>`, keep);
}

/* ===== CHECKOUT ===== */
function drawCheckout(keep) {
  const v = vch();
  openSheet(`<div class="panel" role="dialog" aria-modal="true" aria-label="Checkout"><button class="cl" data-close aria-label="Tutup">✕</button>
  <h2 class="st" style="margin-top:56px">Checkout</h2>${isOpen() ? "" : `<div class="warn">${openNote()}. Pesanan belum bisa dibuat saat ini.</div>`}
  <input class="fld" id="nm" placeholder="Nama pelanggan" value="${esc(S.nm)}" aria-label="Nama pelanggan" oninput="S.nm=this.value">
  <div class="opt"><h4>Pesanan</h4><div class="seg">${["Dine in", "Take away", "Delivery"].map((t) => `<button class="${S.type === t ? "on" : ""}" data-type="${t}">${t}</button>`).join("")}</div></div>${tblPanel()}${delivPanel()}
  <div class="opt"><h4>Voucher</h4>${voucherPick()}<div class="vrow"><input class="fld" id="vcode" placeholder="Masukkan kode voucher" aria-label="Kode voucher"><button class="btn sm" data-vapply>Pakai</button></div></div>
  <div class="opt"><h4>Metode pembayaran (Simulasi Pembayaran)</h4><div class="seg">${payList().map((t) => `<button class="${S.pay === t ? "on" : ""}" data-pay="${t}">${t}</button>`).join("")}</div></div>
  <h2 class="st">Ringkasan</h2>${S.cart.map((i) => `<div class="srow"><span>${i.q}x ${P[i.id].n}</span><span>${rp(unit(i) * i.q)}</span></div>`).join("")}
  <div class="srow"><span>Subtotal</span><span>${rp(sub())}</span></div>${disc() ? `<div class="srow"><span>Diskon voucher</span><span>-${rp(disc())}</span></div>` : ""}<div class="srow"><span>Pajak dan layanan</span><span>${rp(taxAmt())}</span></div>${feeRows()}
  <div class="srow t" style="margin-bottom:0"><span>Total</span><span>${rp(total())}</span></div><button class="btn w" data-place>${cash(S.pay) ? "Pesan" : "Lanjut bayar"} · ${rp(total())}</button>
  <p class="earn" style="text-align:center">Simulasi Pembayaran — tidak ada transaksi uang nyata.</p></div>`, keep);
}
function applyCode() {
  const c = ($("#vcode").value || "").trim().toUpperCase();
  if (!VOUCHERS.find((x) => x.c === c)) return toast("Kode voucher tidak valid");
  if (!S.claim[c]) { S.claim[c] = Date.now(); store("vc_claim", S.claim); }
  useV(c); drawCheckout(true);
}
function place() {
  if (pruneCart()) { closeSheet(); render(); return; }
  if (!isOpen()) { toast("Kafe sedang tutup. " + openNote()); return; }
  const nm = S.nm.trim();
  if (!nm) { toast("Isi nama pelanggan terlebih dahulu"); $("#nm").focus(); return; }
  if (isDel() && S.addr.trim().length < 10) { toast("Isi alamat pengantaran minimal 10 karakter"); const a = $("#addr"); a && a.focus(); return; }
  if (S.type === "Dine in" && !S.tbl) { toast("Pilih nomor meja terlebih dahulu"); return; }
  S.name = nm; store("vc_name", nm);
  S.order = { id: "VC-" + Date.now().toString().slice(-6), nm, type: S.type, hp: S.prof.hp || "", ch: isDel() ? S.ch : "", addr: isDel() ? S.addr.trim() : "", ship: shipAmt(), sd: Math.round(shipDisc()), svc: svcAmt(), vs: shipDisc() ? S.vship : "", pay: S.pay, ts: Date.now(),
    items: S.cart.map((i) => ({ n: P[i.id].n, o: optText(i), q: i.q, p: unit(i), r: { id: i.id, sz: i.sz, su: i.su, ic: i.ic, nt: i.nt, tp: i.tp } })),
    sub: sub(), disc: Math.round(disc()), vc: disc() ? S.voucher : "", tax: Math.round(taxAmt()), total: Math.round(total()), status: "wait", exp: payMs(S.pay) ? Date.now() + payMs(S.pay) : 0, tb: S.type === "Dine in" ? S.tbl : "", qn: S.type === "Take away" ? nextQ() : "" };
  S.order.grand = S.order.total;
  const o = S.order;
  S.orders = load("vc_orders", S.orders); S.orders.push(o); store("vc_orders", S.orders);
  S.cart = []; S.voucher = ""; S.vship = ""; S.tbl = ""; persist();
  S.view = "home"; render();
  $("#main").scrollTop = 0;
  cash(o.pay) ? drawWait(o) : drawPay(o);
}
function sync() {
  KASIR_PIN = _pin("vc_kasir_pin", "2112"); APP_PIN = _pin("vc_app_pin", "1590");
  const l = load("vc_orders", null); if (l) S.orders = l;
  const g = (k) => { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } };
  if (S._ids) {
    const fr = S.orders.filter((o) => !S._ids.includes(o.id) && o.status === "wait");
    S._ids = S.orders.map((o) => o.id);
    if (S.isKasir && fr.length) { toast("Pesanan baru " + fr[fr.length - 1].id + " masuk"); beep(); if (S.kt === "orders" && S.view === "kasir") { const ae0 = document.activeElement; if (!(ae0 && /^(INPUT|TEXTAREA|SELECT)$/.test(ae0.tagName))) { const st0 = $("#main").scrollTop; render(); $("#main").scrollTop = st0; } } }
  }
  const sg = g("vc_orders") + "|" + g("vc_chat") + "|" + g("vc_menu") + "|" + g("vc_vouch"), mg = g("vc_menu") + "|" + g("vc_vouch");
  if (S._sg === undefined) { S._sg = sg; S._mg = mg; S.unread = unreadCount(role()); S._ids = S.orders.map((o) => o.id); }
  else if (sg !== S._sg) {
    const cb = $("#cbtn"); if (cb) cb.innerHTML = chatBtn();
    const ae = document.activeElement, typing = ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName) && $("#main").contains(ae);
    if (!typing) {
      const menuChanged = mg !== S._mg;
      S._sg = sg; S._mg = mg;
      if (menuChanged) { applyMenu(); applyVouchers(); pruneCart(); }
      if (S.isKasir || menuChanged) { const st = $("#main").scrollTop; render(); $("#main").scrollTop = st; }
      const u = unreadCount(role());
      if (u > S.unread && !S.chat) { toast("Pesan baru dari " + (S.isKasir ? "pelanggan" : "kasir")); beep(); }
      S.unread = u;
    }
  }
  S._st = S._st || {};
  S.orders.forEach((o) => {
    const prev = S._st[o.id]; S._st[o.id] = o.status;
    if (prev === undefined || prev === o.status || S.isKasir) return;
    if (S.dn === o.id && !$("#sheet").hidden) drawDone(o, true);
    if (S.watch !== o.id) toast("Pesanan " + o.id + ": " + ST_TOAST(o));
  });
  titleNote();
  if (S.chat) paintChat();
  if (!S.watch) return;
  const o = S.orders.find((x) => x.id === S.watch);
  if (o && o.status !== "wait") drawDone(o);
}
function checkStatus() {
  const id = S.watch; sync();
  if (S.watch === id) toast("Pembayaran belum diterima kasir");
}
setInterval(sync, 2000);
window.addEventListener("storage", sync);
function qrSvg(seed) {
  const N = 25, F = [[0, 0], [N - 7, 0], [0, N - 7]]; let h = 0, d = "";
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const rnd = () => (h = (h * 1664525 + 1013904223) >>> 0) / 4294967296;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const f = F.find(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7);
    let on;
    if (f) { const r = Math.max(Math.abs(x - f[0] - 3), Math.abs(y - f[1] - 3)); on = r === 3 || r <= 1; }
    else if (F.some(([a, b]) => x >= a - 1 && x <= a + 7 && y >= b - 1 && y <= b + 7)) on = false;
    else on = rnd() > 0.52;
    if (on) d += `M${x + 2} ${y + 2}h1v1h-1z`;
  }
  return `<svg viewBox="0 0 29 29" role="img" aria-label="Kode QRIS simulasi" shape-rendering="crispEdges"><rect width="29" height="29" fill="#fff"/><path d="${d}" fill="#1C1B19"/></svg>`;
}
function drawPay(o) {
  S.order = o;
  const a = ACC[o.pay], by = new Date(Date.now() + 30 * 60000), t = by.getHours() + ":" + String(by.getMinutes()).padStart(2, "0");
  const hint = /^(GoPay|OVO|DANA)$/.test(o.pay) ? "Kirim lewat aplikasi " + o.pay + " ke nomor di atas dengan nominal tepat."
    : o.pay === "Kartu debit" ? "Gunakan kartu debitmu di ATM atau mobile banking untuk transfer ke rekening di atas."
    : "Transfer lewat ATM, mobile banking, atau internet banking ke rekening di atas dengan nominal tepat.";
  const body = o.pay === "QRIS"
    ? `<div class="qr">${qrSvg(o.id)}</div><p class="dd" style="text-align:center">Scan dengan aplikasi bank atau e-wallet apa pun.<br><b>${MERCHANT}</b><br>NMID ${NMID}</p><button class="btn w ol" data-pqris>Cetak QRIS</button>`
    : `<div class="acc"><small>${a[0]}</small><b>${a[1]}</b><span>a.n. ${MERCHANT}</span><button class="btn sm" data-copy="${a[1].replace(/\s/g, "")}">Salin nomor</button></div><p class="dd" style="text-align:center;margin-top:10px">${hint}</p>`;
  openSheet(`<div class="panel" role="dialog" aria-modal="true" aria-label="Pembayaran"><button class="cl" data-close aria-label="Tutup">✕</button>
  <h2 class="st" style="margin-top:56px">Pembayaran ${o.pay}</h2><p class="dd">Pesanan ${o.id}</p>${cdBox(o)}
  <div class="srow t" style="border:0;margin:8px 0"><span>Total bayar</span><span>${rp(o.grand)}</span></div>${body}
  <div style="text-align:center;margin-top:16px">${badge("wait")}</div>
  <p class="earn" style="text-align:center">Setelah kamu bayar, kasir akan memverifikasi. Halaman ini otomatis berubah setelah pembayaran dikonfirmasi. (Simulasi Pembayaran)</p>
  <button class="btn w ol" data-chk>Cek status pembayaran</button><button class="btn w ol" data-chpay="${o.id}">Ganti metode bayar</button><button class="btn w ol" data-chat="${o.id}">${svg("chat")}Chat kasir${ukc(o.id)}</button><button class="btn w ol" data-orders>Pesanan saya</button></div>`);
  S.watch = o.id;
}
function drawChangePay(id) {
  S.orders = load("vc_orders", S.orders);
  const o = S.orders.find((x) => x.id === id); if (!o) return toast("Pesanan tidak ditemukan");
  if (o.status !== "wait" || (o.exp && Date.now() > o.exp)) return toast("Metode bayar hanya bisa diganti saat menunggu pembayaran");
  openSheet(`<div class="panel" role="dialog" aria-modal="true" aria-label="Ganti metode bayar"><button class="cl" data-close aria-label="Tutup">✕</button>
  <h2 class="st" style="margin-top:56px">Ganti metode bayar</h2><p class="dd">Pesanan ${o.id} · ${o.type} · ${rp(o.total)}</p>
  ${payListFor(o.type).map((m) => `<button class="vpk${m === o.pay ? " on" : ""}" data-setpay="${o.id}|${m}" ${m === o.pay ? "disabled" : ""}><span class="vi">${cash(m) ? "💵" : "💳"}</span><span><b>${m}</b><small>${m === o.pay ? "Metode saat ini" : cash(m) ? "Bayar langsung di kasir" : "Pembayaran non-tunai"}</small></span><span class="vr">${m === o.pay ? "✓" : ""}</span></button>`).join("")}
  <p class="earn">Batas waktu bayar dihitung ulang sesuai metode baru. (Simulasi Pembayaran)</p>
  <button class="btn w ol" data-cback="${o.id}">Kembali</button></div>`);
}
function changePay(id, m) {
  S.orders = load("vc_orders", S.orders);
  const o = S.orders.find((x) => x.id === id); if (!o) return toast("Pesanan tidak ditemukan");
  if (o.status !== "wait" || (o.exp && Date.now() > o.exp)) return toast("Metode bayar hanya bisa diganti saat menunggu pembayaran");
  if (!payListFor(o.type).includes(m) || m === o.pay) return;
  const old = o.pay;
  o.pay = m;
  o.grand = o.total;
  o.exp = payMs(m) ? Date.now() + payMs(m) : 0;
  store("vc_orders", S.orders);
  chatAdd(id, "s", "Metode bayar diganti dari " + old + " ke " + m);
  toast("Metode bayar diganti ke " + m);
  cash(m) ? drawWait(o) : drawPay(o);
}
function drawWait(o) {
  openSheet(`<div class="panel ok" role="dialog" aria-modal="true" aria-label="Pesanan diterima"><div class="big" aria-hidden="true">🧾</div><h2>Pesanan diterima</h2><p>Terima kasih, ${esc(o.nm)}. ${cash(o.pay) && o.pay === COD ? "Pesananmu akan diantar. Siapkan uang pas dan bayar ke kurir saat pesanan tiba." : "Silakan lakukan pembayaran di kasir."} Kasir akan mengonfirmasi setelah kamu bayar, dan halaman ini otomatis berubah.</p>
  ${cdBox(o)}${summary(o)}<button class="btn w ol" data-chk>Cek status pembayaran</button><button class="btn w ol" data-chpay="${o.id}">Ganti metode bayar</button><button class="btn w ol" data-chat="${o.id}">${svg("chat")}Chat kasir${ukc(o.id)}</button><button class="btn w ol" data-go="home">Kembali ke beranda</button></div>`);
  S.watch = o.id;
}
const summary = (o) => `<div class="box"><div class="srow"><span>Nomor pesanan</span><b>${o.id}</b></div><div class="srow"><span>${o.type}</span><span>${o.items.reduce((a, i) => a + i.q, 0)} item</span></div><div class="srow"><span>Pembayaran</span><span>${o.pay}</span></div>${o.tb ? `<div class="srow"><span>Nomor meja</span><b>${o.tb}</b></div>` : ""}${o.qn ? `<div class="srow"><span>Nomor antrean</span><b>${o.qn}</b></div>` : ""}${o.disc ? `<div class="srow"><span>Hemat voucher ${o.vc}</span><span>-${rp(o.disc)}</span></div>` : ""}${feeO(o, "srow")}<div class="srow t" style="margin-bottom:0"><span>Total bayar</span><span>${rp(o.grand)}</span></div></div>`;
function drawDone(o, quiet) {
  const ok = isPaidSt(o.status), ttl = stTitle(o);
  openSheet(`<div class="panel ok" role="dialog" aria-modal="true" aria-label="${ttl}"><div class="big" aria-hidden="true">${ok ? "✓" : "✕"}</div><h2>${ttl}</h2><p>${ok ? "Terima kasih, " + esc(o.nm) + ". " + ST_MSG(o, o.status) : ST_MSG(o, o.status)}</p>
  ${ok ? tracker(o) + etaP(o) : ""}${summary(o)}${revBtn(o)}<button class="btn w" data-struk="${o.id}">Lihat struk</button><button class="btn w ol" data-reorder="${o.id}">↻ Pesan lagi</button><button class="btn w ol" data-chat="${o.id}">${svg("chat")}Chat kasir${ukc(o.id)}</button><button class="btn w ol" data-go="home">Kembali ke beranda</button></div>`);
  S.dn = o.id;
  if (!quiet) toast(ok ? "Pembayaran " + o.id + " diterima" : "Pesanan " + o.id + ": " + ST_TOAST(o));
}
const payMs = (p) => p === COD ? 0 : (cash(p) ? 30 : /^(QRIS|GoPay|OVO|DANA)$/.test(p) ? 15 : 60) * 60000;
const cdText = (e) => { const t = Math.max(0, Math.round((e - Date.now()) / 1000)), h = Math.floor(t / 3600); return (h ? h + ":" : "") + String(Math.floor(t % 3600 / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0"); };
const hhmm = (t) => new Date(t).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":");
const cdBox = (o) => !o.exp ? "" : `<div class="cdbox"><span>Selesaikan pembayaran dalam</span><b id="cd" data-exp="${o.exp}">${cdText(o.exp)}</b><small>Batas bayar ${hhmm(o.exp)} · pesanan batal otomatis jika terlewat</small><button class="btn sm ol" data-cancel="${o.id}">Batalkan pesanan</button></div>`;
const nextQ = () => { const d = new Date().toDateString(), n = load("vc_orders", []).filter((o) => o.qn && new Date(o.ts).toDateString() === d).length + 1; return "A-" + String(n).padStart(3, "0"); };
const tblPanel = () => S.type === "Dine in" ? `<div class="opt"><h4>Nomor meja</h4><div class="seg tbl">${Array.from({ length: 12 }, (_, i) => String(i + 1)).map((n) => `<button class="${S.tbl === n ? "on" : ""}" data-tbl="${n}">${n}</button>`).join("")}</div></div>` : S.type === "Take away" ? '<p class="earn">Kamu akan mendapat nomor antrean setelah memesan.</p>' : "";
const etaP = (o) => { if (o.status !== "paid" && o.status !== "prep") return ""; const n = o.items.reduce((a, i) => a + i.q, 0), m = Math.min(25, 6 + n * 2) + (o.type === "Delivery" ? 15 : 0); return `<p class="earn" style="text-align:center">Perkiraan ${o.type === "Delivery" ? "tiba" : "siap"} ±${m} menit</p>`; };
function bump() { const b = $('#tabs [data-go="cart"]'); if (b) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); } }
function cancelOrder(id) {
  S.orders = load("vc_orders", S.orders); const o = S.orders.find((x) => x.id === id);
  if (!o || o.status !== "wait") return toast("Pesanan sudah tidak bisa dibatalkan");
  o.status = "cancelled"; store("vc_orders", S.orders); chatAdd(id, "s", ST_MSG(o, "cancelled")); S.watch = null; drawDone(o, true); toast("Pesanan " + id + " dibatalkan");
}
function shareRc(o) {
  if (!o) return;
  const t = ["VELORA Café · Struk " + o.id, CAFE.addr, CAFE.tel, dt(o.ts), o.type + (o.tb ? " · Meja " + o.tb : "") + (o.qn ? " · Antrean " + o.qn : ""), ...o.items.map((i) => i.q + "x " + i.n + " " + rp(i.p * i.q)), "Total " + rp(o.grand) + " (" + o.pay + ")"].join("\n");
  if (navigator.share) navigator.share({ title: "Struk " + o.id, text: t }).catch(() => {});
  else try { navigator.clipboard.writeText(t).then(() => toast("Struk disalin"), () => toast("Gagal menyalin")); } catch (e) { toast("Gagal menyalin"); }
}
setInterval(() => {
  S.orders = load("vc_orders", S.orders); let ch = false;
  S.orders.forEach((o) => { if (o.status === "wait" && o.exp && Date.now() > o.exp) { o.status = "expired"; chatAdd(o.id, "s", ST_MSG(o, "expired")); ch = true; } });
  if (ch) { store("vc_orders", S.orders); if (S.isKasir) { const y = $("#main").scrollTop; render(); $("#main").scrollTop = y; } else sync(); }
  const c = $("#cd"); if (c) c.textContent = cdText(+c.dataset.exp);
  document.querySelectorAll("[data-cdx]").forEach((e) => { e.textContent = cdText(+e.dataset.cdx); });
}, 1000);
const STATUS = { wait: "MENUNGGU PEMBAYARAN", paid: "LUNAS", prep: "DISIAPKAN", ready: "SIAP", done: "SELESAI", rejected: "DITOLAK", expired: "KEDALUWARSA", cancelled: "DIBATALKAN" };
const badge = (s, o) => `<span class="stt ${s}">${s === "ready" && o && o.type === "Delivery" ? "DIANTAR" : STATUS[s]}</span>`;
const STEPS = [["paid", "Lunas"], ["prep", "Disiapkan"], ["ready", "Siap"], ["done", "Selesai"]];
const tracker = (o) => {
  const i = STEPS.findIndex((s) => s[0] === o.status);
  return i < 0 ? "" : `<div class="trk" role="group" aria-label="Progres pesanan">${STEPS.map(([k, l], n) => `<span class="${n <= i ? "on" : ""}"><i></i>${k === "ready" && o.type === "Delivery" ? "Diantar" : l}</span>`).join("")}</div>`;
};
const stTitle = (o) => ({ paid: "Pembayaran berhasil", prep: "Pesanan disiapkan", ready: o.type === "Delivery" ? "Pesanan diantar" : "Pesanan siap", done: "Pesanan selesai", rejected: "Pembayaran ditolak", expired: "Waktu pembayaran habis", cancelled: "Pesanan dibatalkan" })[o.status] || "Pesanan";
const ST_MSG = (o, st) => ({
  paid: "Pembayaran dikonfirmasi lunas. Pesananmu segera kami siapkan.",
  rejected: "Pembayaran ditolak kasir. Hubungi kasir lewat chat ini.",
  expired: "Batas waktu pembayaran terlewat, pesanan dibatalkan otomatis. Silakan buat pesanan baru.",
  cancelled: "Pesanan dibatalkan. Kamu bisa membuat pesanan baru kapan saja.",
  prep: "Pesananmu sedang disiapkan.",
  ready: o.type === "Delivery" ? "Pesananmu sedang diantar ke alamatmu." : o.type === "Take away" ? "Pesananmu sudah siap, silakan diambil di kasir." : "Pesananmu sudah siap dan segera disajikan.",
  done: "Pesanan selesai. Sampai jumpa lagi di VELORA!"
})[st];
const ST_TOAST = (o) => ({ wait: "menunggu pembayaran", paid: "lunas", prep: "sedang disiapkan", ready: o.type === "Delivery" ? "sedang diantar" : "sudah siap", done: "selesai", rejected: "ditolak", expired: "waktu pembayaran habis", cancelled: "dibatalkan" })[o.status];
const rcHtml = (o) => `<div class="rc"><div class="c"><b class="rl">VELORA</b><br>Café<br><small>${CAFE.addr}<br>Buka ${CAFE.hours}<br>Telp/WA ${CAFE.tel}<br>IG ${CAFE.ig}<br>${MERCHANT}</small></div><hr>
  <div class="l"><span>No. Pesanan</span><b>${o.id}</b></div><div class="l"><span>Tanggal</span><span>${new Date(o.ts).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</span></div><div class="l"><span>Pelanggan</span><span>${esc(o.nm)}</span></div><div class="l"><span>Tipe</span><span>${o.type}</span></div>${o.tb ? `<div class="l"><span>Meja</span><b>${o.tb}</b></div>` : ""}${o.qn ? `<div class="l"><span>Antrean</span><b>${o.qn}</b></div>` : ""}<hr>
  ${o.items.map((i) => `<div class="l"><span>${i.q}x ${i.n}</span><span>${rp(i.p * i.q)}</span></div><div class="l s"><span>${i.o}</span><span>@${rp(i.p)}</span></div>`).join("")}<hr>
  <div class="l"><span>Subtotal</span><span>${rp(o.sub)}</span></div>${o.disc ? `<div class="l"><span>Voucher ${o.vc}</span><span>-${rp(o.disc)}</span></div>` : ""}<div class="l"><span>Pajak dan layanan ${TAX * 100}%</span><span>${rp(o.tax)}</span></div>
  ${feeO(o, "l")}<div class="l tt"><span>TOTAL BAYAR</span><span>${rp(o.grand)}</span></div><div class="l"><span>Metode</span><span>${o.pay}</span></div><div class="l"><span>Status</span><b>${STATUS[o.status]}</b></div><hr>
  <div class="bc"></div><div class="c">Terima kasih sudah berkunjung!<br>A Taste Above Ordinary.</div></div>`;
const qrisHtml = (o) => `<div class="rc"><div class="c"><b class="rl">VELORA</b><br>QRIS Pembayaran</div><div class="qr">${qrSvg(o.id)}</div><div class="c">${MERCHANT}<br>NMID ${NMID}<br><b>${rp(o.grand)}</b><br>Pesanan ${o.id}<br><small>Simulasi, tidak dapat dipindai</small></div></div>`;
function printHtml(h) { $("#pr").innerHTML = h; window.print(); }
function drawStruk(o) {
  if (!o) return toast("Struk tidak ditemukan");
  S.cur = o;
  openSheet(`<div class="panel" role="dialog" aria-modal="true" aria-label="Struk belanja"><button class="cl" data-close aria-label="Tutup">✕</button>
  <h2 class="st" style="margin-top:56px">Struk belanja</h2>${o.status === "wait" ? `<button class="btn w" data-repay="${o.id}">Lihat cara bayar</button><button class="btn w ol" data-chpay="${o.id}">Ganti metode bayar</button>` : ""}${tracker(o)}${revBtn(o)}${rcHtml(o)}<button class="btn w ol" data-reorder="${o.id}">↻ Pesan lagi</button>${isPaidSt(o.status) ? '<button class="btn w" data-printrc>Cetak atau simpan PDF</button><button class="btn w ol" data-share>Bagikan struk</button>' : `<p class="earn" style="text-align:center">${o.status === "wait" ? "Struk resmi bisa dicetak setelah pembayaran diterima kasir." : ST_MSG(o, o.status)}</p>`}<button class="btn w ol" data-chat="${o.id}">${svg("chat")}Chat kasir${ukc(o.id)}</button><button class="btn w ol" data-orders>Pesanan saya</button></div>`);
}
const dt = (ts) => new Date(ts).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });

/* ===== PESANAN SAYA ===== */
function drawOrders() {
  const l = [...S.orders].reverse();
  openSheet(`<div class="panel" role="dialog" aria-modal="true" aria-label="Pesanan saya"><button class="cl" data-close aria-label="Tutup">✕</button>
  <h2 class="st" style="margin-top:56px">Pesanan saya</h2>
  ${l.length ? l.map((o) => `
    <div class="oi-row">
      <button class="oi" data-struk="${o.id}">
        <span><b>${o.id}</b><small>${o.pay} · ${dt(o.ts)}</small></span>
        <span><b>${rp(o.grand)}</b>${badge(o.status, o)}</span>
      </button>
      <button class="oi-del" data-chat="${o.id}" aria-label="Chat kasir ${o.id}" title="Chat kasir">${svg("chat")}${ukc(o.id)}</button>
      <button class="oi-del" data-del-one="${o.id}" aria-label="Hapus pesanan ${o.id}" title="Hapus pesanan">🗑</button>
    </div>`).join("") : empty("🧾", "Belum ada pesanan", "Pesanan yang kamu buat muncul di sini.")}
  ${l.length ? `
    <div class="orders-actions">
      <button class="btn w ol danger-btn" data-clear-all>🗑 Hapus semua riwayat</button>
    </div>` : ""}
  </div>`);
}

/* ===== PINTU MASUK KASIR ===== */
let tapCount = 0, tapTimer = null;
function kasirTap() {
  tapCount++;
  clearTimeout(tapTimer);
  tapTimer = setTimeout(() => { tapCount = 0; }, KASIR_TAP_WIN);
  if (tapCount >= KASIR_TAPS) { tapCount = 0; openPinGate(); }
}
function openPinGate() {
  openSheet(`<div class="panel" role="dialog" aria-modal="true" aria-label="Verifikasi staf"><button class="cl" data-close aria-label="Tutup">✕</button>
  <h2 class="st" style="margin-top:56px">Verifikasi Staf</h2>
  <p class="dd">Area ini hanya untuk staf VELORA. Masukkan PIN akses.</p>
  <input class="fld" id="pin" type="password" inputmode="numeric" maxlength="4" placeholder="PIN akses" aria-label="PIN akses" autocomplete="off">
  <div class="err" id="perr" role="alert"></div>
  <button class="btn w" data-pin>Masuk</button></div>`);
  setTimeout(() => { const i = document.getElementById("pin"); if (i) i.focus(); }, 100);
}
function checkPin() {
  const el = document.getElementById("pin"); if (!el) return;
  const v = (el.value || "").trim();
  const err = document.getElementById("perr");
  if (!v) { if (err) err.textContent = "Masukkan PIN."; return; }
  if (v === KASIR_PIN) {
    S.isKasir = true; S.view = "kasir";
    closeSheet(); render(); $("#main").scrollTop = 0;
    toast("Akses kasir terbuka");
  } else {
    if (err) err.textContent = "PIN salah.";
    el.value = ""; el.focus();
  }
}
function exitKasir() { S.isKasir = false; S.kt = "orders"; S.view = "home"; render(); $("#main").scrollTop = 0; toast("Keluar dari panel kasir"); }
function copyTxt(t) { try { navigator.clipboard.writeText(t).then(() => toast("Nomor disalin"), () => toast("Salin manual: " + t)); } catch (e) { toast("Salin manual: " + t); } }
function setStatus(id, st) {
  const o = S.orders.find((x) => x.id === id); if (!o) return;
  if (o.status === "wait" && o.exp && Date.now() > o.exp && st === "paid") return toast("Waktu pembayaran sudah habis");
  o.status = st; store("vc_orders", S.orders);
  chatAdd(id, "s", ST_MSG(o, st));
  toast("Pesanan " + id + ": " + ST_TOAST(o)); render();
}

/* ===== NOTIFIKASI SUARA, JUDUL TAB ===== */
let _ac = null;
function audioCtx() {
  try { _ac = _ac || new (window.AudioContext || window.webkitAudioContext)(); if (_ac.state !== "running") _ac.resume(); } catch (e) {}
  return _ac;
}
function unlockAudio() {
  const c = audioCtx(); if (!c || S._au) return;
  try { const bf = c.createBuffer(1, 1, 22050), sr = c.createBufferSource(); sr.buffer = bf; sr.connect(c.destination); sr.start(0); if (c.state === "running") S._au = true; } catch (e) {}
}
["pointerdown", "touchstart", "touchend", "click", "keydown"].forEach((ev) => document.addEventListener(ev, unlockAudio, true));
document.addEventListener("visibilitychange", () => { if (!document.hidden && _ac && _ac.state !== "running") _ac.resume(); });
/* Pilihan nada notifikasi (dibuat dengan WebAudio, tanpa file suara). Default: Lonceng */
function tone(c, f, d, len, vol, type) {
  const os = c.createOscillator(), g = c.createGain(), t = c.currentTime + d;
  os.type = type || "sine"; os.frequency.value = f;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  os.connect(g); g.connect(c.destination); os.start(t); os.stop(t + len + 0.05);
}
const bellHit = (c, f, d, vol) => [[1, 1, 1.5], [2.76, 0.4, 0.9], [5.4, 0.15, 0.5]].forEach(([m, v, len]) => tone(c, f * m, d, len, vol * v));
const TONES = {
  bell: { n: "Lonceng", f: (c) => { bellHit(c, 988, 0, 0.5); bellHit(c, 740, 0.42, 0.5); } },
  chime: { n: "Chime Naik", f: (c) => { [1047, 1319, 1568, 2093].forEach((f, i) => tone(c, f, i * 0.13, 0.7, 0.32)); } },
  kasir: { n: "Ka-ching", f: (c) => { tone(c, 1200, 0, 0.06, 0.25, "square"); [[2093, 0.09], [3136, 0.09], [2637, 0.2]].forEach(([f, d]) => tone(c, f, d, 1, 0.3)); } },
  door: { n: "Bel Pintu", f: (c) => { tone(c, 659, 0, 0.9, 0.45); tone(c, 1318, 0, 0.5, 0.12); tone(c, 523, 0.5, 1.1, 0.45); tone(c, 1046, 0.5, 0.6, 0.12); } },
  klasik: { n: "Klasik", f: (c) => { [[880, 0], [1320, 0.16], [880, 0.5], [1320, 0.66]].forEach(([f, d]) => tone(c, f, d, 0.35, 0.5)); } }
};
function beep(force) {
  if (!force && !load("vc_snd", true)) return;
  try { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); } catch (e) {}
  const c = audioCtx(); if (!c) return false;
  const go = () => {
    (TONES[load("vc_tone", "bell")] || TONES.bell).f(c);
  };
  try {
    if (c.state === "running") { go(); return true; }
    c.resume().then(go, () => {});
    setTimeout(() => { if (c.state !== "running" && !S._auHint) { S._auHint = 1; toast("Ketuk layar sekali agar suara notifikasi aktif"); } }, 400);
  } catch (e) {}
  return c.state === "running";
}
function titleNote() {
  const n = S.isKasir ? S.orders.filter((o) => o.status === "wait").length + unreadCount("k") : 0;
  document.title = n ? "(" + n + ") VELORA POS" : "VELORA Café";
}
/* ===== JAM OPERASIONAL, ULASAN & RATING, PESAN LAGI ===== */
const p2 = (n) => String(n).padStart(2, "0");
const hrs = () => load("vc_hours", { o: 8, c: 22, f: false });
const isOpen = () => { const h = hrs(), n = new Date(), m = n.getHours() + n.getMinutes() / 60; return !h.f && m >= h.o && m < h.c; };
const openNote = () => { const h = hrs(); return h.f ? "Tutup sementara" : isOpen() ? "Buka · sampai " + p2(h.c) + ".00" : "Tutup · buka lagi pukul " + p2(h.o) + ".00"; };
const hoursSec = () => {
  const h = hrs(), opts = (v) => Array.from({ length: 24 }, (_, i) => `<option value="${i}"${i === v ? " selected" : ""}>${p2(i)}.00</option>`).join("");
  return `<section class="kset"><h3>Jam Operasional</h3><p>Pelanggan tidak bisa memesan di luar jam ini.</p><label class="slbl">Buka<select class="fld" id="ho">${opts(h.o)}</select></label><label class="slbl">Tutup<select class="fld" id="hc">${opts(h.c)}</select></label><label class="slbl chk"><input type="checkbox" id="hf"${h.f ? " checked" : ""}> Tutup sementara</label><div class="kerr" id="kerrh" role="alert"></div><button class="kbtn ok kfull" data-savehrs>Simpan Jam</button></section>`;
};
function saveHours() {
  const o = +document.getElementById("ho").value, c = +document.getElementById("hc").value, f = document.getElementById("hf").checked;
  if (c <= o) return (document.getElementById("kerrh").textContent = "Jam tutup harus setelah jam buka.");
  store("vc_hours", { o, c, f }); toast("Jam operasional disimpan"); render();
}
/* Bar status buka/tutup (beranda = tombol, sheet info = div) */
function openBar(tag) {
  const h = hrs(), on = isOpen();
  const t = h.f ? "Tutup sementara" : on ? "Buka sekarang" : "Sedang tutup";
  const s = h.f ? "Kami akan segera kembali" : on ? "Setiap hari · " + p2(h.o) + ".00 – " + p2(h.c) + ".00" : "Buka lagi pukul " + p2(h.o) + ".00";
  const go = tag === "button" ? `<span class="hrb-go">${svg("chevron")}</span>` : "";
  return `<${tag} class="hrb ${on ? "on" : "off"}" ${tag === "button" ? "data-info" : ""}><span class="hrb-i">${svg("clock")}</span><span class="hrb-t"><b>${t}</b><small>${s}</small></span>${go}</${tag}>`;
}
const infoRow = (ic, t, v) => `<div class="inf"><span class="inf-i">${svg(ic)}</span><span class="inf-t"><small>${t}</small><span class="inf-v">${v}</span></span></div>`;
function infoRows() {
  const h = hrs();
  return infoRow("pin", "Alamat", `<a href="${CAFE.map}" target="_blank" rel="noopener">${CAFE.addr}</a>`)
    + infoRow("clock", "Jam operasional", `Setiap hari · ${p2(h.o)}.00 – ${p2(h.c)}.00`)
    + infoRow("phone", "WhatsApp", `<a href="https://wa.me/${WA}" target="_blank" rel="noopener">${CAFE.tel}</a>`)
    + infoRow("insta", "Instagram", `<a href="https://instagram.com/velora.cafe" target="_blank" rel="noopener">${CAFE.ig}</a>`);
}
function drawInfo() {
  openSheet(`<div class="panel" role="dialog" aria-modal="true" aria-label="Info kafe"><button class="cl" data-close aria-label="Tutup">✕</button>
  <h2 class="st" style="margin-top:56px">VELORA Café</h2>${openBar("div")}
  <div class="cardi inf-c">${infoRows()}</div></div>`);
}
const stars = (k, n) => [1, 2, 3, 4, 5].map((i) => `<button class="star${i <= n ? " on" : ""}" data-star="${k}|${i}" aria-label="${i} bintang">★</button>`).join("");
const itemId = (it) => (it.r && it.r.id !== undefined ? it.r.id : P.findIndex((p) => p.n === it.n));
const revIds = (o) => [...new Set(o.items.map(itemId).filter((i) => i >= 0 && P[i]))];
const pendingRev = (o) => { const rv = load("vc_rev", []); return revIds(o).filter((id) => !rv.some((x) => x.oid === o.id && x.pid === id)); };
const revBtn = (o) => o.status !== "done" ? "" : (!o.rt || pendingRev(o).length) ? `<button class="btn w" data-rev="${o.id}">★ Beri rating dan ulasan</button>` : '<p class="earn" style="text-align:center">★ Terima kasih, rating dan ulasanmu sudah terkirim.</p>';
const revList = (p) => { const l = load("vc_rev", []).filter((x) => x.pid === p.id && x.tx).slice(-3).reverse(); return l.length ? `<div class="rvs"><h4>Ulasan pelanggan</h4>${l.map((x) => `<div class="rv"><b>${esc(x.nm)}</b> <span class="rs">${"★".repeat(x.st)}${"☆".repeat(5 - x.st)}</span><p>${esc(x.tx)}</p></div>`).join("")}</div>` : ""; };
let R = null;
function drawReview(oid) {
  const o = S.orders.find((x) => x.id === oid); if (!o) return;
  const l = pendingRev(o); if (o.rt && !l.length) return toast("Rating pesanan ini sudah terkirim");
  R = { oid, st: {} };
  openSheet(`<div class="panel" role="dialog" aria-modal="true" aria-label="Rating pesanan"><button class="cl" data-close aria-label="Tutup">✕</button>
  <h2 class="st" style="margin-top:56px">Rating Pesanan</h2><p class="dd">Pesanan ${o.id}. Ketuk bintang untuk menilai.</p>
  ${o.rt ? "" : `<div class="rvrow"><b>Pesanan secara keseluruhan</b><div data-sr="o">${stars("o", 0)}</div><input class="fld" data-rt="o" maxlength="120" placeholder="Bagaimana pesananmu? (opsional)" aria-label="Komentar pesanan"></div>`}
  ${l.length ? "<h2 class=\"st\">Per produk</h2>" : ""}${l.map((id) => `<div class="rvrow"><b>${P[id].n}</b><div data-sr="${id}">${stars(id, 0)}</div><input class="fld" data-rt="${id}" maxlength="100" placeholder="Komentar (opsional)" aria-label="Komentar ${P[id].n}"></div>`).join("")}
  <div class="err" id="rverr" role="alert"></div><button class="btn w" data-rvsend>Kirim</button></div>`);
}
function setStar(v) {
  const [k, n] = v.split("|"); if (!R) return;
  R.st[k] = +n; const el = document.querySelector('[data-sr="' + k + '"]'); if (el) el.innerHTML = stars(k, +n);
}
function sendReview() {
  const ks = Object.keys(R.st).filter((k) => R.st[k] > 0);
  if (!ks.length) return (document.getElementById("rverr").textContent = "Beri minimal 1 bintang.");
  const tx = (k) => { const e = document.querySelector('[data-rt="' + k + '"]'); return ((e && e.value) || "").trim(); };
  S.orders = load("vc_orders", S.orders);
  const o = S.orders.find((x) => x.id === R.oid), rv = load("vc_rev", []);
  ks.forEach((k) => { if (k === "o") { if (o) o.rt = { st: R.st.o, tx: tx("o"), ts: Date.now() }; } else rv.push({ pid: +k, oid: R.oid, st: R.st[k], tx: tx(k), nm: o ? o.nm : "Pelanggan", ts: Date.now() }); });
  store("vc_orders", S.orders); store("vc_rev", rv); applyRatings(); closeSheet(); render(); toast("Terima kasih atas rating dan ulasanmu");
}
function reorder(oid) {
  const o = S.orders.find((x) => x.id === oid); if (!o) return;
  let add = 0, skip = 0;
  o.items.forEach((it) => {
    const r = it.r || {}, id = itemId(it), p = P[id]; if (!p || p.x || p.h) return skip++;
    const d = isD(p); addCart(id, { sz: d ? r.sz || "Regular" : null, su: d ? r.su || "Normal" : null, ic: d ? r.ic || "Normal" : null, nt: r.nt || "", tp: r.tp || [], q: it.q }); add++;
  });
  closeSheet(); go("cart");
  toast(add ? add + " item dimasukkan ke keranjang" + (skip ? ", " + skip + " item sedang habis" : "") : "Semua item sedang habis");
}
/* ===== HAPUS RIWAYAT ===== */
function clearHistory(scope) {
  if (scope === "all") {
    if (!confirm("Hapus SEMUA riwayat pesanan? Tindakan ini tidak bisa dibatalkan.")) return;
    S.orders = [];
    store("vc_orders", []);
    toast("Semua riwayat pesanan dihapus");
  } else if (scope === "mine") {
    const nm = S.name || "";
    if (!nm) return toast("Nama pelanggan tidak diketahui");
    const before = S.orders.length;
    S.orders = S.orders.filter((o) => o.nm !== nm);
    store("vc_orders", S.orders);
    const removed = before - S.orders.length;
    toast(removed ? removed + " pesanan dihapus dari riwayat" : "Tidak ada riwayat untuk dihapus");
  } else if (scope === "one" && S._delId) {
    S.orders = S.orders.filter((o) => o.id !== S._delId);
    store("vc_orders", S.orders);
    toast("Pesanan " + S._delId + " dihapus");
    S._delId = null;
  }
  closeSheet();
  render();
}
function askDeleteOne(id) {
  S._delId = id;
  openSheet(`<div class="panel" role="dialog" aria-modal="true" aria-label="Hapus pesanan"><button class="cl" data-close aria-label="Tutup">✕</button>
  <h2 class="st" style="margin-top:56px">Hapus pesanan?</h2>
  <p class="dd">Pesanan <b>${id}</b> akan dihapus permanen dari riwayat. Tindakan ini tidak bisa dibatalkan.</p>
  <button class="btn w danger-btn" data-del-ok>Ya, hapus pesanan ini</button>
  <button class="btn w ol" data-close>Batal</button></div>`);
}

/* ===== EVENT ===== */
document.addEventListener("click", (e) => {
  const t = e.target, q = (s) => t.closest(s);
  let b;
  if ((b = q("[data-pin-key]"))) return pinPress(b.dataset.pinKey);
  if (q("[data-pin-del]")) return pinDel();
  if (q("[data-lockapp]")) return lockApp();
  if (q("[data-kasir-tap]")) return kasirTap();
  if (q("[data-kasir-exit]")) return exitKasir();
  if ((b = q("[data-kt]"))) { S.kt = b.dataset.kt; return render(); }
  if ((b = q("[data-kf]"))) { S.kf = b.dataset.kf; return render(); }
  if ((b = q("[data-next]"))) {
    try {
      const l = load("vc_orders", null); if (l) S.orders = l;
      const o = S.orders.find((x) => x.id === b.dataset.next), n = o && NEXT[o.status];
      if (!n) { render(); return toast("Status pesanan sudah berubah, daftar diperbarui"); }
      return setStatus(o.id, n[0]);
    } catch (err) { return toast("Gagal mengubah status: " + (err && err.message)); }
  }
  if ((b = q("[data-kprint]"))) { const o = S.orders.find((x) => x.id === b.dataset.kprint); return o && printHtml(rcHtml(o)); }
  if ((b = q("[data-tone]"))) { store("vc_tone", b.dataset.tone); unlockAudio(); beep(true); return render(); }
  if (q("[data-snd]")) { store("vc_snd", !load("vc_snd", true)); beep(); return render(); }
  if (q("[data-sndtest]")) { unlockAudio(); const ok = beep(true); return toast(ok === false ? "Browser memblokir suara. Cek volume / mode senyap" : "Tes suara dikirim"); }
  if ((b = q("[data-medit]"))) return drawEditProduct(+b.dataset.medit);
  if ((b = q("[data-mesave]"))) return saveEdit(+b.dataset.mesave);
  if ((b = q("[data-mreset]"))) return resetEdit(+b.dataset.mreset);
  if (q("[data-vadd]")) return drawAddVoucher();
  if (q("[data-vsave]")) return saveVoucher();
  if ((b = q("[data-vtog]"))) return toggleVoucher(b.dataset.vtog);
  if ((b = q("[data-vdel]"))) return delVoucher(b.dataset.vdel);
  if (q("[data-madd]")) return drawAddProduct();
  if (q("[data-msave]")) return saveProduct();
  if ((b = q("[data-mx]"))) return toggleOut(+b.dataset.mx);
  if ((b = q("[data-mres]"))) return restoreProduct(+b.dataset.mres);
  if ((b = q("[data-mdel]"))) return delProduct(+b.dataset.mdel);
  if ((b = q("[data-savepin]"))) return savePin(b.dataset.savepin);
  if (q("[data-chatlist]")) return drawChatList();
  if ((b = q("[data-chat]"))) return drawChat(b.dataset.chat);
  if ((b = q("[data-cq]"))) return sendChat(b.dataset.cq);
  if (q("[data-csend]")) return sendChat(($("#cin") || {}).value);
  if ((b = q("[data-cback]"))) return reopen(b.dataset.cback);
  if ((b = q("[data-fav]"))) return toggleFav(+b.dataset.fav);
  if ((b = q("[data-add]"))) return quick(+b.dataset.add);
  if ((b = q("[data-open]"))) return openDetail(+b.dataset.open);
  if ((b = q("[data-go]"))) return go(b.dataset.go);
  if ((b = q("[data-cat]"))) { S.cat = b.dataset.cat; S.q = ""; return go("explore"); }
  if ((b = q("[data-chip]"))) { S.cat = b.dataset.chip; return render(); }
  if ((b = q("[data-q]"))) return chgQ(b.dataset.q, +b.dataset.d);
  if ((b = q("[data-o]"))) { const [k, v] = b.dataset.o.split("|"); D[k] = v; return drawDetail(true); }
  if ((b = q("[data-dq]"))) { D.q = Math.max(1, D.q + +b.dataset.dq); return drawDetail(true); }
  if (q("[data-addd]")) { addCart(D.id, D); return closeSheet(); }
  if ((b = q("[data-type]"))) { S.type = b.dataset.type; if (!payList().includes(S.pay)) S.pay = payList()[0]; return drawCheckout(true); }
  if ((b = q("[data-chpay]"))) return drawChangePay(b.dataset.chpay);
  if ((b = q("[data-setpay]"))) { const [id, m] = b.dataset.setpay.split("|"); return changePay(id, m); }
  if ((b = q("[data-tp]"))) { const n = b.dataset.tp; D.tp = D.tp.includes(n) ? D.tp.filter((x) => x !== n) : [...D.tp, n]; return drawDetail(true); }
  if ((b = q("[data-pay]"))) { S.pay = b.dataset.pay; return drawCheckout(true); }
  if (q("[data-psave]")) return saveProfile();
  if (q("[data-pdel]")) return delProfile();
  if (q("[data-myv]")) return drawMyVouchers();
  if (q("[data-info]")) return drawInfo();
  if (q("[data-savehrs]")) return saveHours();
  if ((b = q("[data-rev]"))) return drawReview(b.dataset.rev);
  if ((b = q("[data-star]"))) return setStar(b.dataset.star);
  if (q("[data-rvsend]")) return sendReview();
  if ((b = q("[data-reorder]"))) return reorder(b.dataset.reorder);
  if ((b = q("[data-claim]"))) return claim(b.dataset.claim);
  if ((b = q("[data-chpick]"))) { S.ch = b.dataset.chpick; S.type = "Delivery"; if (!payList().includes(S.pay)) S.pay = payList()[0]; toast("Pesan lewat " + S.ch + ": pilih menu lalu checkout"); return go("explore"); }
  if ((b = q("[data-ch]"))) { S.ch = b.dataset.ch; return drawCheckout(true); }
  if ((b = q("[data-vch]"))) { useV(b.dataset.vch); return drawCheckout(true); }
  if (q("[data-vapply]")) return applyCode();
  if ((b = q("[data-copy]"))) return copyTxt(b.dataset.copy);
  if (q("[data-chk]")) return checkStatus();
  if ((b = q("[data-cancel]"))) return cancelOrder(b.dataset.cancel);
  if (q("[data-share]")) return shareRc(S.cur);
  if ((b = q("[data-tbl]"))) { S.tbl = b.dataset.tbl; return drawCheckout(true); }
  if ((b = q("[data-repay]"))) { const ro = S.orders.find((x) => x.id === b.dataset.repay); return ro && (cash(ro.pay) ? drawWait(ro) : drawPay(ro)); }
  if (q("[data-pqris]")) return printHtml(qrisHtml(S.order));
  if ((b = q("[data-struk]"))) return drawStruk(S.orders.find((x) => x.id === b.dataset.struk));
  if (q("[data-printrc]")) return printHtml(rcHtml(S.cur));
  if (q("[data-orders]")) return drawOrders();
  if (q("[data-pin]")) return checkPin();
  if ((b = q("[data-ok]"))) return setStatus(b.dataset.ok, "paid");
  if ((b = q("[data-no]"))) return setStatus(b.dataset.no, "rejected");
  if (q("[data-clear-all]")) return clearHistory("all");
  if (q("[data-clear-mine]")) return clearHistory("mine");
  if (q("[data-del-ok]")) return clearHistory("one");
  if ((b = q("[data-del-one]"))) return askDeleteOne(b.dataset.delOne);
  if (q("[data-story]")) { const a = document.getElementById("about"); return a && a.scrollIntoView({ behavior: "smooth" }); }
  if (q("[data-checkout]")) return drawCheckout();
  if (q("[data-place]")) return place();
  if (q("[data-close]") || t.id === "sheet") return closeSheet();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") return closeSheet();
  if (e.key === "Enter" && e.target && e.target.id === "pin") { e.preventDefault(); checkPin(); }
  if (e.key === "Enter" && e.target && e.target.id === "cin") { e.preventDefault(); sendChat(e.target.value); }
  if (!S.unlocked && !S.isKasir) {
    if (/^[0-9]$/.test(e.key)) pinPress(e.key);
    else if (e.key === "Backspace") { e.preventDefault(); pinDel(); }
  }
});

render();

(function () {
  const c = $("#clk"), b = $("#batL");
  const tick = () => { const d = new Date(); if (c) c.textContent = d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0"); };
  tick(); setInterval(tick, 10000);
  try { navigator.getBattery().then((x) => { const f = () => { b.style.width = Math.max(8, Math.round(x.level * 100)) + "%"; }; f(); x.onlevelchange = f; }); } catch (e) {}
})();

/* PWA: daftarkan service worker (hanya jalan di HTTPS atau localhost) */
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
