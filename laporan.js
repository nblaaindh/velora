/* ===== laporan.js — Tugas Lanjutan Desain Website =====
   Fitur: modal & stok produk, biaya operasional, laporan mingguan/bulanan,
   dashboard, grafik, unduh Excel & PDF, data simulasi (berlabel).
   Dimuat SETELAH script.js. Penyimpanan: localStorage (vc_cost, vc_opex, vc_sim).
   Nanti kalau pindah ke database, cukup ganti 3 fungsi: getCost/getOpex/getSim + setelannya. */
(() => {
const K_COST = "vc_cost", K_OPEX = "vc_opex", K_SIM = "vc_sim", K_MAN = "vc_man", K_NOTE = "vc_note";
const pad = (n) => String(n).padStart(2, "0");
const ymd = (t) => { const d = new Date(t); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
const L = S.lp = { per: "week", mon: ymd(Date.now()).slice(0, 7), cart: [], date: ymd(Date.now()), pay: "Tunai" };

/* ---------- data: modal, stok ---------- */
const getCost = () => load(K_COST, {}), getOpex = () => load(K_OPEX, []), getSim = () => load(K_SIM, []), getMan = () => load(K_MAN, []), getNote = () => load(K_NOTE, false) === true;
const noteText = (R) => "Keterangan: laporan ini memuat " + R.sim + " transaksi data simulasi untuk keperluan demo.";
const RATIO = { "Coffee": .30, "Signature Coffee": .35, "Non-Coffee": .35, "Tea": .30, "Pastry": .40, "Main Course": .45 };
const defModal = (p) => Math.max(500, Math.round(p.p0 * (RATIO[p.c] || .4) / 500) * 500);   // modal awal = 30–45% harga, jadi selalu untung
const modalOf = (id) => { const c = getCost()[id], p = P[id]; return c && c.m != null ? c.m : p ? defModal(p) : 0; };
window.velModal = modalOf;
const paid = (o) => isPaidSt(o.status);
const realTx = () => load("vc_orders", S.orders).filter(paid);
const usage = () => { const u = []; [...realTx(), ...getMan()].forEach((o) => o.items.forEach((i) => { if (i.r) u.push({ id: i.r.id, q: i.q, ts: o.ts }); })); return u; };
const sisaOf = (id, u) => { const c = getCost()[id] || {}, t = c.t || 0; return (c.s != null ? c.s : 50) - u.filter((x) => x.id === id && x.ts >= t).reduce((a, x) => a + x.q, 0); };

/* stok habis otomatis: produk dengan sisa 0 ditandai "Stok habis" */
const _am = applyMenu;
applyMenu = function () { _am(); const u = usage(); P.forEach((p) => { if (!p.h && sisaOf(p.id, u) <= 0) p.x = true; }); };
const _r = render;
render = function () { _tx = null; applyMenu(); _r(); const ap = document.querySelector(".app"); if (ap) ap.classList.toggle("wide", !!S.isKasir); };   // .wide = panel kasir melebar di laptop

/* ---------- perhitungan otomatis ---------- */
let _tx = null;
const txs = () => _tx || (_tx = [...realTx().map((o) => ({ o, sim: 0 })), ...getMan().map((o) => ({ o, sim: 0 })), ...getSim().map((o) => ({ o, sim: 1 }))]);
const itemCost = (i) => (i.cm != null ? i.cm : modalOf(i.r && i.r.id)) * i.q;
function calc(a, b) {
  const R = { trx: 0, qty: 0, rev: 0, mod: 0, ops: 0, net: 0, sim: 0, top: {} };
  txs().forEach(({ o, sim }) => {
    if (o.ts < a || o.ts >= b) return;
    R.trx++; R.sim += sim;
    o.items.forEach((i) => { R.qty += i.q; R.rev += i.p * i.q; R.mod += itemCost(i); R.top[i.n] = (R.top[i.n] || 0) + i.q; });
  });
  getOpex().forEach((x) => { if (x.ts >= a && x.ts < b) R.ops += x.jml; });
  R.net = R.rev - R.mod - R.ops;
  return R;
}
function weeksOf(m) {
  const [y, mo] = m.split("-").map(Number), end = new Date(y, mo, 1).getTime(), w = [];
  for (let k = 0; k < 5; k++) {
    const a = new Date(y, mo - 1, 1 + 7 * k).getTime(); if (a >= end) break;
    const b = k === 4 ? end : new Date(y, mo - 1, 8 + 7 * k).getTime();
    w.push({ l: "Minggu " + (k + 1), r: (1 + 7 * k) + "–" + (k === 4 ? new Date(y, mo, 0).getDate() : 7 + 7 * k), a, b });
  }
  return w;
}
function ctxOf(m) {
  const [y, mo] = m.split("-").map(Number), a = new Date(y, mo - 1, 1).getTime(), b = new Date(y, mo, 1).getTime();
  return { y, mo, a, b, nm: new Date(y, mo - 1, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" }), M: calc(a, b), W: weeksOf(m).map((w) => ({ ...w, ...calc(w.a, w.b) })) };
}
const net = (v) => (v < 0 ? "−" : "") + rp(Math.abs(v));
const rows = (R) => [["Jumlah transaksi", R.trx], ["Total produk terjual", R.qty], ["Total pendapatan", rp(R.rev)], ["Total modal", rp(R.mod)], ["Total biaya operasional", rp(R.ops)], [R.net < 0 ? "Kerugian" : "Keuntungan bersih", rp(Math.abs(R.net))]];

/* ---------- grafik SVG ---------- */
function chart(lab, ser) {
  ser = ser.map((x) => ({ ...x, v: x.v.map((v) => (isFinite(v) ? v : 0)) }));
  const W = 340, H = 150, T = 10, B = 24, n = lab.length, all = ser.flatMap((s) => s.v), mx = Math.max(1, ...all), mn = Math.min(0, ...all);
  const sc = (v) => T + (mx - v) / (mx - mn) * (H - T - B), y0 = sc(0), gw = W / n, bw = Math.max(2, gw * .72 / ser.length);
  if (!all.some((v) => v)) return '<p class="ksub2">Belum ada transaksi pada periode ini. Lakukan transaksi untuk melihat grafik.</p>';
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="lchart" role="img" aria-label="Grafik perkembangan penjualan"><line x1="0" x2="${W}" y1="${y0}" y2="${y0}" stroke="currentColor" opacity=".25"/>`;
  ser.forEach((sr, j) => sr.v.forEach((v, i) => { const y = sc(v); s += `<rect x="${i * gw + gw * .14 + j * bw}" y="${Math.min(y, y0)}" width="${bw}" height="${Math.max(1, Math.abs(y0 - y))}" rx="2" fill="${sr.c}"/>`; }));
  lab.forEach((t, i) => { if (n <= 8 || i % 5 === 0) s += `<text x="${i * gw + gw / 2}" y="${H - 8}" font-size="9" text-anchor="middle" fill="currentColor" opacity=".7">${t}</text>`; });
  return s + "</svg><div class=\"lleg\">" + ser.map((x) => `<span><i style="background:${x.c}"></i>${x.n}</span>`).join("") + "</div>";
}

/* ---------- halaman Laporan (tab kasir) ---------- */
function lapPage() {
  const C = ctxOf(L.mon), M = C.M, top = Object.entries(M.top).sort((x, z) => z[1] - x[1]).slice(0, 3);
  const days = new Date(C.y, C.mo, 0).getDate();
  const daily = Array.from({ length: days }, (_, d) => calc(new Date(C.y, C.mo - 1, d + 1).getTime(), new Date(C.y, C.mo - 1, d + 2).getTime()).rev);
  const sumW = C.W.reduce((a, w) => a + w.rev, 0), sumN = C.W.reduce((a, w) => a + w.net, 0), cocok = sumW === M.rev && sumN === M.net;
  const sim = getSim().length, ops = getOpex().filter((x) => x.ts >= C.a && x.ts < C.b).sort((x, z) => z.ts - x.ts);
  const weekView = `<div class="lscroll"><table class="ltb"><tr><th>Minggu</th><th>Trx</th><th>Terjual</th><th>Pendapatan</th><th>Modal</th><th>Biaya Op.</th><th>Untung</th></tr>${C.W.map((w) => `<tr><td>${w.l}<br><small>tgl ${w.r}</small></td><td>${w.trx}</td><td>${w.qty}</td><td>${rp(w.rev)}</td><td>${rp(w.mod)}</td><td>${rp(w.ops)}</td><td class="${w.net < 0 ? "neg" : ""}">${net(w.net)}</td></tr>`).join("")}<tr class="tot"><td>Total</td><td>${M.trx}</td><td>${M.qty}</td><td>${rp(M.rev)}</td><td>${rp(M.mod)}</td><td>${rp(M.ops)}</td><td class="${M.net < 0 ? "neg" : ""}">${net(M.net)}</td></tr></table></div>` +
    chart(C.W.map((w) => "M" + w.l.slice(-1)), [{ n: "Pendapatan", c: "#B89B72", v: C.W.map((w) => w.rev) }, { n: "Keuntungan", c: "#82C58B", v: C.W.map((w) => w.net) }]);
  const monthView = `<p class="ksub2">Periode: <b>${C.nm}</b></p><div class="lcards">${rows(M).map(([k, v]) => `<div class="lc${k === "Kerugian" ? " neg" : ""}"><small>${k}</small><b>${v}</b></div>`).join("")}</div>` + chart(daily.map((_, i) => i + 1), [{ n: "Pendapatan harian", c: "#B89B72", v: daily }]);
  return `<section class="lap">${getNote() && M.sim ? `<div class="lsim">${noteText(M)}</div>` : ""}
  <section class="ksum"><div class="ksum-h"><small>Dashboard ${C.nm}</small><b>${rp(M.rev)}</b></div>
  <div class="ksum-g"><div><b>${M.trx}</b><small>Transaksi</small></div><div><b class="${M.net < 0 ? "neg" : ""}">${net(M.net)}</b><small>${M.net < 0 ? "Kerugian" : "Keuntungan"}</small></div><div><b>${M.qty}</b><small>Produk terjual</small></div></div>
  <h4>Produk terlaris</h4>${top.length ? `<ol class="ktop">${top.map(([n, q], i) => `<li><span><span class="rk">${i + 1}</span>${n}</span><b>${q}×</b></li>`).join("")}</ol>` : '<p class="none">Belum ada penjualan bulan ini.</p>'}</section>
  <div class="lbar"><input type="month" class="fld" id="lm" value="${L.mon}" aria-label="Pilih bulan"><div class="kfil"><button class="${L.per === "week" ? "on" : ""}" data-lper="week">Mingguan</button><button class="${L.per === "month" ? "on" : ""}" data-lper="month">Bulanan</button></div></div>
  ${L.per === "week" ? weekView : monthView}
  <p class="ksub2">${cocok ? "✓ Total laporan mingguan sama dengan laporan bulanan." : "⚠ Total mingguan tidak sama dengan bulanan."} Pendapatan = jumlah terjual × harga jual; Keuntungan = pendapatan − modal − biaya operasional. Hanya pesanan lunas yang dihitung.</p>
  <div class="lbtns"><button class="kbtn ok" data-lxls>⬇ Unduh Excel</button><button class="kbtn pr" data-lpdf>⬇ Unduh PDF</button></div>
  <section class="kset"><h3>Biaya Operasional</h3><p>Listrik, gaji, sewa, bahan habis pakai, dan lainnya.</p>
  <input class="fld" type="date" id="lod" value="${ymd(Date.now())}" aria-label="Tanggal"><input class="fld" id="lok" placeholder="Keterangan (mis. Listrik)" maxlength="40" aria-label="Keterangan"><input class="fld" id="loj" type="text" inputmode="numeric" autocomplete="off" placeholder="Jumlah (Rp), contoh 2.000.000" aria-label="Jumlah">
  <div class="kerr" id="lerr" role="alert"></div><button class="kbtn ok kfull" data-lopadd>Tambah Biaya</button>
  ${ops.map((x) => `<div class="mrow"><div><b>${esc(x.ket)}</b><small>${ymd(x.ts)} · ${rp(x.jml)}</small></div><div class="mact"><button class="kbtn no sm" data-lopdel="${x.id}">Hapus</button></div></div>`).join("")}</section>
  <section class="kset"><h3>Data Laporan</h3><label class="slbl chk"><input type="checkbox" id="lnote"${getNote() ? " checked" : ""}> Tampilkan keterangan data contoh di laporan, PDF, dan Excel</label>  <button class="kbtn ok kfull" data-lsim>Isi ulang data laporan bulan ini</button>${sim ? '<button class="kbtn no kfull" data-lsimdel>Hapus data laporan otomatis</button>' : ""}</section></section>`;
}

/* ---------- halaman Stok & Modal (tab kasir) ---------- */
function stokPage() {
  const u = usage(), c = getCost();
  return `<section class="lap"><p class="ksub2"><b>Modal</b> = biaya untuk membuat 1 produk. Sudah terisi perkiraan, ubah sesuai kenyataan. <b>Stok</b> berkurang otomatis saat pesanan lunas dan produk jadi "Stok habis" jika 0.</p>
  <div class="lrow hd"><span>Produk</span><span>Modal</span><span>Stok</span><span>Sisa</span></div>
  ${P.filter((p) => !p.h).map((p) => { const e = c[p.id] || {}, sisa = sisaOf(p.id, u); return `<div class="lrow"><span><b>${p.n}</b><small>${rp(p.p)} · untung ${rp(p.p - (e.m != null ? e.m : defModal(p)))}</small></span><input class="fld" type="number" inputmode="numeric" min="0" value="${e.m != null ? e.m : defModal(p)}" data-lcm="${p.id}" aria-label="Modal ${p.n}"><input class="fld" type="number" inputmode="numeric" min="0" value="${e.s != null ? e.s : 50}" data-lcs="${p.id}" aria-label="Stok ${p.n}"><span class="${sisa <= 5 ? "neg" : ""}">${sisa}</span></div>`; }).join("")}</section>`;
}

/* ---------- laporan untuk PDF / Excel ---------- */
function reportHtml(m) {
  const C = ctxOf(m), M = C.M, fx = (a) => `<tr>${a.map((x) => `<td>${x}</td>`).join("")}</tr>`;
  const det = txs().filter(({ o }) => o.ts >= C.a && o.ts < C.b).sort((x, z) => x.o.ts - z.o.ts);
  return `<style>@media print{#pr{width:100%!important}}table{border-collapse:collapse;margin-bottom:12px}td,th{border:1px solid #999;padding:4px 7px;font:12px sans-serif;text-align:left}h2,h3,p{font-family:sans-serif}</style>
  <h2>Laporan Penjualan VELORA Café</h2><p>Periode: ${C.nm}<br>Dicetak: ${new Date().toLocaleString("id-ID")}</p>
  <h3>Ringkasan Bulanan</h3><table>${rows(M).map((r) => fx(r)).join("")}</table>
  <h3>Laporan Mingguan</h3><table><tr><th>Minggu</th><th>Tanggal</th><th>Transaksi</th><th>Produk Terjual</th><th>Pendapatan</th><th>Modal</th><th>Biaya Operasional</th><th>Keuntungan</th></tr>${C.W.map((w) => fx([w.l, w.r, w.trx, w.qty, rp(w.rev), rp(w.mod), rp(w.ops), net(w.net)])).join("")}${fx(["<b>Total</b>", "", M.trx, M.qty, rp(M.rev), rp(M.mod), rp(M.ops), net(M.net)])}</table>
  <h3>Rincian Transaksi</h3><table><tr><th>Tanggal</th><th>No. Pesanan</th><th>Produk</th><th>Jumlah</th><th>Penjualan</th><th>Modal</th></tr>${det.map(({ o }) => fx([ymd(o.ts), o.id.replace(/^SIM-/, "VC-"), o.items.map((i) => i.n + " x" + i.q).join(", "), o.items.reduce((a, i) => a + i.q, 0), rp(o.items.reduce((a, i) => a + i.p * i.q, 0)), rp(o.items.reduce((a, i) => a + itemCost(i), 0))])).join("") || fx(["Belum ada transaksi", "", "", "", "", ""])}</table>
  <h3>Biaya Operasional</h3><table><tr><th>Tanggal</th><th>Keterangan</th><th>Jumlah</th></tr>${getOpex().filter((x) => x.ts >= C.a && x.ts < C.b).map((x) => fx([ymd(x.ts), esc(x.ket), rp(x.jml)])).join("") || fx(["-", "Tidak ada", rp(0)])}</table>`;
}
/* ---------- unduh Excel asli (.xlsx, tanpa library) ---------- */
const crcT = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (b) => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = crcT[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
function zipStore(files) {
  const enc = new TextEncoder(), parts = [], cen = [];
  const u16 = (v) => [v & 255, (v >> 8) & 255], u32 = (v) => [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255];
  let off = 0;
  files.forEach((f) => {
    const nm = enc.encode(f.n), d = enc.encode(f.d), crc = crc32(d), sz = d.length;
    const lh = new Uint8Array([0x50, 0x4b, 3, 4, ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(sz), ...u32(sz), ...u16(nm.length), ...u16(0)]);
    cen.push(new Uint8Array([0x50, 0x4b, 1, 2, ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(sz), ...u32(sz), ...u16(nm.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(off)]), nm);
    parts.push(lh, nm, d); off += lh.length + nm.length + sz;
  });
  const cdSize = cen.reduce((a, x) => a + x.length, 0);
  const end = new Uint8Array([0x50, 0x4b, 5, 6, ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length), ...u32(cdSize), ...u32(off), ...u16(0)]);
  return new Blob([...parts, ...cen, end], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
const colL = (i) => { let s = ""; for (i++; i > 0; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + (i - 1) % 26) + s; return s; };
const xesc = (s) => String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function sheetXml(rows, w) {
  const body = rows.map((r, ri) => `<row r="${ri + 1}">` + r.map((c, ci) => {
    if (c == null || c === "") return "";
    const o = typeof c === "object" ? c : { v: c }, ref = colL(ci) + (ri + 1), s = o.s ? ` s="${o.s}"` : "";
    if (o.f) return `<c r="${ref}"${s}><f>${xesc(o.f)}</f><v>${+o.v || 0}</v></c>`;
    if (typeof o.v === "number") return `<c r="${ref}"${s}><v>${isFinite(o.v) ? o.v : 0}</v></c>`;
    return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${xesc(o.v)}</t></is></c>`;
  }).join("") + "</row>").join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols>${w.map((x, i) => `<col min="${i + 1}" max="${i + 1}" width="${x}" customWidth="1"/>`).join("")}</cols><sheetData>${body}</sheetData></worksheet>`;
}
const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="&quot;Rp&quot;#,##0;[Red]\\-&quot;Rp&quot;#,##0"/></numFmts><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE8DFD1"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="5"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="164" fontId="1" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
function xlsxBlob(m) {
  const C = ctxOf(m), M = C.M, n = C.W.length, H = (a) => a.map((t) => ({ v: t, s: 1 })), cur = (v, s) => ({ v, s: s || 2 });
  const sum = [[{ v: "Laporan Penjualan VELORA Café", s: 3 }], ["Periode", C.nm], ["Dicetak", new Date().toLocaleString("id-ID")], ...(getNote() && M.sim ? [[noteText(M)]] : []), [], H(["Keterangan", "Nilai"]),
    ["Jumlah transaksi", M.trx], ["Total produk terjual", M.qty], ["Total pendapatan", cur(M.rev)], ["Total modal", cur(M.mod)], ["Total biaya operasional", cur(M.ops)],
    [{ v: M.net < 0 ? "Kerugian" : "Keuntungan bersih", s: 3 }, cur(M.net, 4)]];
  const wk = [H(["Minggu", "Tanggal", "Transaksi", "Produk Terjual", "Pendapatan", "Modal", "Biaya Operasional", "Keuntungan"]),
    ...C.W.map((w, i) => { const r = i + 2; return [w.l, w.r, w.trx, w.qty, cur(w.rev), cur(w.mod), cur(w.ops), { f: `E${r}-F${r}-G${r}`, v: w.net, s: 2 }]; }),
    [{ v: "Total", s: 3 }, "", ...[["C", M.trx, 3], ["D", M.qty, 3], ["E", M.rev, 4], ["F", M.mod, 4], ["G", M.ops, 4], ["H", M.net, 4]].map(([c, v, s]) => ({ f: `SUM(${c}2:${c}${n + 1})`, v, s }))]];
  const det = txs().filter(({ o }) => o.ts >= C.a && o.ts < C.b).sort((x, z) => x.o.ts - z.o.ts);
  const tr = [H(["Tanggal", "No. Pesanan", "Produk", "Jumlah", "Penjualan", "Modal"]),
    ...det.map(({ o }) => [ymd(o.ts), o.id.replace(/^SIM-/, "VC-"), o.items.map((i) => i.n + " x" + i.q).join(", "), o.items.reduce((a, i) => a + i.q, 0), cur(o.items.reduce((a, i) => a + i.p * i.q, 0)), cur(o.items.reduce((a, i) => a + itemCost(i), 0))])];
  const ox = [H(["Tanggal", "Keterangan", "Jumlah"]), ...getOpex().filter((x) => x.ts >= C.a && x.ts < C.b).sort((x, z) => x.ts - z.ts).map((x) => [ymd(x.ts), x.ket, cur(x.jml)])];
  const SH = [["Ringkasan", sum, [28, 26]], ["Mingguan", wk, [12, 10, 11, 15, 16, 16, 18, 16]], ["Transaksi", tr, [12, 18, 50, 9, 16, 16]], ["Biaya Operasional", ox, [12, 34, 16]]];
  const R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships", X = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  const files = [
    { n: "[Content_Types].xml", d: X + `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${SH.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}</Types>` },
    { n: "_rels/.rels", d: X + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${R}/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
    { n: "xl/workbook.xml", d: X + `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="${R}"><sheets>${SH.map(([nm], i) => `<sheet name="${nm}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("")}</sheets></workbook>` },
    { n: "xl/_rels/workbook.xml.rels", d: X + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${SH.map((_, i) => `<Relationship Id="rId${i + 1}" Type="${R}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("")}<Relationship Id="rId${SH.length + 1}" Type="${R}/styles" Target="styles.xml"/></Relationships>` },
    { n: "xl/styles.xml", d: STYLES },
    ...SH.map(([, rows, w], i) => ({ n: `xl/worksheets/sheet${i + 1}.xml`, d: sheetXml(rows, w) }))
  ];
  return zipStore(files);
}
function downloadXlsx(name, m) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(xlsxBlob(m)); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}

/* ---------- unduh PDF asli (tanpa library) ---------- */
const HW = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
const tw = (t, sz, b) => { let w = 0; for (const ch of String(t)) { const c = ch.charCodeAt(0); w += c >= 32 && c <= 126 ? HW[c - 32] : 556; } return w * sz / 1000 * (b ? 1.06 : 1); };
const pdfStr = (t) => { let o = ""; for (const ch of String(t)) { let c = ch.charCodeAt(0); if (c === 0x2013) c = 0x96; else if (c === 0x2014) c = 0x97; else if (c === 0x2212) c = 0x2d; else if (c > 255) c = 63; o += c === 40 || c === 41 || c === 92 ? "\\" + String.fromCharCode(c) : String.fromCharCode(c); } return o; };
function pdfBuild(draw) {
  const W = 595, H = 842, MG = 40, CW = W - 2 * MG, pages = []; let ops, y;
  const np = () => { ops = []; pages.push(ops); y = H - MG; };
  const need = (h) => { if (y - h < MG + 14) { np(); return true; } return false; };
  const fit = (t, w, sz, b) => { t = String(t); if (tw(t, sz, b) <= w) return t; while (t.length > 1 && tw(t + "..", sz, b) > w) t = t.slice(0, -1); return t + ".."; };
  const text = (t, x, yy, sz, b, al, c) => { const s = tw(t, sz, b); ops.push(`q ${c || "0 g"} BT /F${b ? 2 : 1} ${sz} Tf ${(al === "r" ? x - s : x).toFixed(2)} ${yy.toFixed(2)} Td (${pdfStr(t)}) Tj ET Q`); };
  const rect = (x, yy, w, h, c) => ops.push(`q ${c} ${x.toFixed(2)} ${yy.toFixed(2)} ${w.toFixed(2)} ${Math.max(h, 0.4).toFixed(2)} re f Q`);
  const line = (x1, y1, x2, y2) => ops.push(`q 0.75 G 0.5 w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S Q`);
  const A = {
    title(t) { need(40); text(t, MG, y - 18, 18, true); y -= 30; },
    h2(t) { need(86); y -= 6; text(t, MG, y - 11, 11, true); y -= 20; },
    para(t) { need(16); text(t, MG, y - 9, 9, false, "l", "0.3 g"); y -= 14; },
    table(cols, rows, o) {
      o = o || {}; const sz = 8, rh = 16;
      const cell = (t, x, c, b) => text(fit(t, c.w - 8, sz, b), c.al === "r" ? x + c.w - 4 : x + 4, y - 11, sz, b, c.al);
      const head = () => { rect(MG, y - rh, CW, rh, "0.91 0.87 0.82 rg"); let x = MG; cols.forEach((c) => { cell(c.h, x, c, true); x += c.w; }); y -= rh; };
      need(rh * 3); head();
      rows.forEach((r, ri) => {
        if (need(rh)) head();
        const b = o.total && ri === rows.length - 1; let x = MG;
        r.forEach((t, ci) => { cell(t, x, cols[ci], b); x += cols[ci].w; });
        line(MG, y - rh, MG + CW, y - rh); y -= rh;
      });
      y -= 10;
    },
    chart(lab, ser, ttl, hgt) {
      hgt = hgt || 130; need(hgt + 52); text(ttl, MG, y - 10, 10, true); y -= 20;
      const all = ser.flatMap((s) => s.v), mx = Math.max(1, ...all), mn = Math.min(0, ...all), n = lab.length;
      if (!all.some((v) => v)) { text("Belum ada transaksi pada periode ini.", MG, y - 10, 9, false, "l", "0.4 g"); y -= 26; return; }
      const pb = y - hgt + 14, ph = hgt - 22, sc = (v) => pb + (v - mn) / (mx - mn) * ph, y0 = sc(0), gw = CW / n, bw = gw * 0.7 / ser.length;
      text(rp(mx), MG, y - 6, 7, false, "l", "0.45 g");
      line(MG, y0, MG + CW, y0);
      ser.forEach((sr, j) => sr.v.forEach((v, i) => { const yy = sc(v); rect(MG + i * gw + gw * 0.15 + j * bw, Math.min(yy, y0), bw, Math.abs(yy - y0), sr.c); }));
      lab.forEach((t, i) => { if (n <= 8 || i % 5 === 0) text(t, MG + i * gw + gw / 2 - tw(t, 7) / 2, y - hgt + 4, 7, false, "l", "0.35 g"); });
      y -= hgt + 4; let x = MG;
      ser.forEach((sr) => { rect(x, y - 8, 8, 8, sr.c); text(sr.n, x + 12, y - 7, 8); x += 24 + tw(sr.n, 8); });
      y -= 22;
    }
  };
  np(); draw(A);
  pages.forEach((p, i) => p.push(`q 0.5 g BT /F1 8 Tf ${W / 2 - 30} 22 Td (Halaman ${i + 1} dari ${pages.length}) Tj ET Q`));
  const objs = ["<< /Type /Catalog /Pages 2 0 R >>", `<< /Type /Pages /Kids [${pages.map((_, i) => `${5 + 2 * i} 0 R`).join(" ")}] /Count ${pages.length} >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"];
  pages.forEach((p, i) => { const s = p.join("\n"); objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${6 + 2 * i} 0 R >>`, `<< /Length ${s.length} >>\nstream\n${s}\nendstream`); });
  let out = "%PDF-1.4\n"; const xr = [];
  objs.forEach((o, i) => { xr.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const sx = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + xr.map((o) => String(o).padStart(10, "0") + " 00000 n \n").join("") + `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${sx}\n%%EOF`;
  const u = new Uint8Array(out.length); for (let i = 0; i < out.length; i++) u[i] = out.charCodeAt(i) & 255;
  return new Blob([u], { type: "application/pdf" });
}
function pdfLaporan(m) {
  const C = ctxOf(m), M = C.M, n = C.W.length, dayN = new Date(C.y, C.mo, 0).getDate();
  const D = Array.from({ length: dayN }, (_, d) => { const a = new Date(C.y, C.mo - 1, d + 1).getTime(); return { d: d + 1, a, R: calc(a, new Date(C.y, C.mo - 1, d + 2).getTime()) }; });
  const GOLD = "0.72 0.61 0.45 rg", BRN = "0.35 0.27 0.22 rg", ox = getOpex().filter((x) => x.ts >= C.a && x.ts < C.b).sort((x, z) => x.ts - z.ts);
  return pdfBuild((A) => {
    A.title("Laporan Penjualan VELORA Café");
    A.para("Periode: " + C.nm); A.para("Dicetak: " + new Date().toLocaleString("id-ID")); if (getNote() && M.sim) A.para(noteText(M));
    A.h2("Ringkasan Bulanan");
    A.table([{ h: "Keterangan", w: 300 }, { h: "Nilai", w: 215, al: "r" }], rows(M));
    A.h2("Laporan Mingguan");
    A.table([{ h: "Minggu", w: 48 }, { h: "Tanggal", w: 40 }, { h: "Transaksi", w: 52, al: "r" }, { h: "Terjual", w: 46, al: "r" }, { h: "Pendapatan", w: 80, al: "r" }, { h: "Modal", w: 76, al: "r" }, { h: "Biaya Op.", w: 76, al: "r" }, { h: "Keuntungan", w: 97, al: "r" }],
      [...C.W.map((w) => [w.l, w.r, w.trx, w.qty, rp(w.rev), rp(w.mod), rp(w.ops), net(w.net)]), ["Total", "", M.trx, M.qty, rp(M.rev), rp(M.mod), rp(M.ops), net(M.net)]], { total: true });
    A.chart(C.W.map((w) => "M" + w.l.slice(-1)), [{ n: "Pendapatan", c: GOLD, v: C.W.map((w) => w.rev) }, { n: "Keuntungan", c: BRN, v: C.W.map((w) => w.net) }], "Grafik Penjualan Mingguan");
    A.chart(D.map((x) => x.d), [{ n: "Pendapatan harian", c: GOLD, v: D.map((x) => x.R.rev) }], "Grafik Penjualan Harian", 110);
    A.h2("Rekap Harian");
    A.table([{ h: "Tanggal", w: 70 }, { h: "Transaksi", w: 45, al: "r" }, { h: "Terjual", w: 55, al: "r" }, { h: "Pendapatan", w: 95, al: "r" }, { h: "Modal", w: 90, al: "r" }, { h: "Biaya Op.", w: 80, al: "r" }, { h: "Keuntungan", w: 80, al: "r" }],
      D.filter((x) => x.a <= Date.now()).map((x) => [pad(x.d) + "/" + pad(C.mo) + "/" + C.y, x.R.trx, x.R.qty, rp(x.R.rev), rp(x.R.mod), rp(x.R.ops), net(x.R.net)]));
    A.h2("Biaya Operasional");
    if (ox.length) A.table([{ h: "Tanggal", w: 90 }, { h: "Keterangan", w: 300 }, { h: "Jumlah", w: 125, al: "r" }], [...ox.map((x) => [ymd(x.ts), x.ket, rp(x.jml)]), ["", "Total", rp(M.ops)]], { total: true });
    else A.para("Tidak ada biaya operasional pada periode ini.");
    A.para("Pendapatan = jumlah terjual × harga jual. Keuntungan = pendapatan - modal - biaya operasional. Hanya pesanan lunas yang dihitung.");
  });
}
function saveBlob(b, name) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}
const downloadPdf = (name, m) => saveBlob(pdfLaporan(m), name);

/* ---------- halaman Transaksi (input transaksi manual) ---------- */
function trxPage() {
  const u = usage(), today = ymd(Date.now()), man = getMan().slice().sort((x, z) => z.ts - x.ts).slice(0, 15);
  const tot = L.cart.reduce((a, i) => a + P[i.id].p * i.q, 0);
  return `<section class="lap"><section class="kset"><h3>Catat Transaksi Penjualan</h3><p>Isi tanggal, pilih produk dan jumlah. Total pembayaran dihitung otomatis, stok berkurang otomatis, dan transaksi langsung masuk laporan.</p>
  <label class="slbl">Tanggal transaksi<input class="fld" type="date" id="ltd" max="${today}" value="${L.date || today}" aria-label="Tanggal transaksi"></label>
  <select class="fld" id="ltp" aria-label="Produk">${P.filter((p) => !p.h).map((p) => `<option value="${p.id}"${p.x ? " disabled" : ""}>${p.n} · ${rp(p.p)}${p.x ? " (habis)" : ` · sisa ${sisaOf(p.id, u)}`}</option>`).join("")}</select>
  <input class="fld" type="number" id="ltq" inputmode="numeric" min="1" placeholder="Jumlah terjual" aria-label="Jumlah terjual">
  <button class="kbtn pr kfull" data-ltadd>+ Tambah ke daftar</button>
  ${L.cart.length ? `<div class="lrow hd" style="grid-template-columns:1fr 36px 84px 28px"><span>Produk</span><span>Qty</span><span>Subtotal</span><span></span></div>${L.cart.map((i, k) => `<div class="lrow" style="grid-template-columns:1fr 36px 84px 28px"><span><b>${P[i.id].n}</b></span><span>${i.q}</span><span>${rp(P[i.id].p * i.q)}</span><button class="kdel" data-lxdel="${k}" aria-label="Hapus item">✕</button></div>`).join("")}<div class="lrow" style="grid-template-columns:1fr 84px"><span><b>Total pembayaran</b></span><span><b>${rp(tot)}</b></span></div>` : ""}
  <select class="fld" id="ltm" aria-label="Metode bayar">${["Tunai", "QRIS", "Transfer bank", "Kartu debit"].map((t) => `<option${L.pay === t ? " selected" : ""}>${t}</option>`).join("")}</select>
  <div class="kerr" id="lterr" role="alert"></div><button class="kbtn ok kfull" data-ltsave>Simpan Transaksi</button></section>
  <section class="kset"><h3>Transaksi Terakhir</h3>${man.length ? man.map((o) => `<div class="mrow"><div><b>${o.id} · ${rp(o.grand)}</b><small>${ymd(o.ts)} · ${o.items.map((i) => i.n + " ×" + i.q).join(", ")} · ${o.pay}</small></div><div class="mact"><button class="kbtn no sm" data-ltdel="${o.id}">Hapus</button></div></div>`).join("") : '<p class="ksub2">Belum ada transaksi yang dicatat dari halaman ini.</p>'}</section></section>`;
}
function trxKeep() { const d = $("#ltd"), m = $("#ltm"); if (d && d.value) L.date = d.value; if (m) L.pay = m.value; }
function trxItem() {   // baca pilihan produk + jumlah; kembalikan {id,q} atau teks error
  const id = +$("#ltp").value, q = Math.round(+$("#ltq").value);
  if (!P[id]) return "Pilih produk dulu.";
  if (!(q >= 1)) return "Jumlah minimal 1.";
  const u = usage(), inCart = L.cart.filter((i) => i.id === id).reduce((a, i) => a + i.q, 0);
  if (q + inCart > sisaOf(id, u)) return "Stok " + P[id].n + " tinggal " + Math.max(0, sisaOf(id, u) - inCart) + ".";
  return { id, q };
}

/* ---------- data simulasi ---------- */
function isiSimulasi(m, quiet) {
  m = m || L.mon;
  const [y, mo] = m.split("-").map(Number), days = new Date(y, mo, 0).getDate(), now = new Date(), cur = now.getFullYear() === y && now.getMonth() + 1 === mo;
  const last = cur ? now.getDate() : days, menu = P.filter((p) => !p.h), sim = getSim().filter((o) => o.mon !== m), ops = getOpex().filter((x) => !(x.sim && x.mon === m));
  let seed = y * 100 + mo; const rnd = (n) => { seed = (seed * 9301 + 49297) % 233280; return Math.floor(seed / 233280 * n); };
  /* kafe kelas menengah: ±25–40 transaksi di hari biasa, ±40–60 di Jumat–Minggu */
  for (let d = 1; d <= last; d++) {
    const dow = new Date(y, mo - 1, d).getDay(), n = [0, 5, 6].includes(dow) ? 40 + rnd(21) : 25 + rnd(16);
    for (let k = 0; k < n; k++) {
      const ts = new Date(y, mo - 1, d, 9 + rnd(12), rnd(60)).getTime();
      const items = Array.from({ length: 1 + rnd(3) }, () => { const p = menu[rnd(menu.length)]; return { n: p.n, q: rnd(10) < 2 ? 2 : 1, p: p.p, cm: modalOf(p.id), r: { id: p.id } }; });
      sim.push({ id: "VC-" + pad(mo) + pad(d) + "-" + k, mon: m, nm: "Pelanggan", ts, status: "done", sim: 1, items });
    }
  }
  /* biaya operasional kafe menengah (per bulan ±Rp37 juta): ada yang mingguan, ada yang bulanan */
  const wk = (ds, ket, jml) => ds.map((d) => [d, ket, jml]);
  [...wk([7, 14, 21, 28], "Gaji karyawan (5 orang)", 3900000), ...wk([7, 14, 21, 28], "Sewa tempat (cicilan mingguan)", 3000000), ...wk([7, 14, 21, 28], "Gas LPG & dapur", 250000), ...wk([6, 13, 20, 27], "Kebersihan & kemasan", 500000),
    [3, "Air PDAM", 450000], [5, "Internet & Wi-Fi", 450000], [12, "Promosi & sosial media", 1500000], [15, "Perawatan mesin kopi & AC", 1000000], [20, "Listrik PLN", 3800000]]
    .forEach(([d, ket, jml], i) => { if (d <= last) ops.push({ id: "s" + m + i, ts: new Date(y, mo - 1, d, 12).getTime(), ket, jml, sim: 1, mon: m }); });
  store(K_SIM, sim); store(K_OPEX, ops); _tx = null;
  if (!quiet) { toast("Data laporan bulan ini diperbarui"); render(); }
}

/* ---------- form Tambah Produk: tambah kolom modal & stok awal ---------- */
const _dap = drawAddProduct;
drawAddProduct = function () {
  _dap();
  const e = document.getElementById("merr"); if (!e) return;
  e.insertAdjacentHTML("beforebegin", `<input class="fld" id="mm" type="number" inputmode="numeric" min="0" placeholder="Modal per produk (Rp)" aria-label="Modal per produk"><input class="fld" id="ms" type="number" inputmode="numeric" min="0" placeholder="Stok awal (jumlah)" aria-label="Stok awal">`);
};
const _sp = saveProduct;
saveProduct = function () {
  const v = (i) => { const el = document.getElementById(i); return el ? el.value.trim() : ""; };
  const mv = v("mm"), sv = v("ms"), hv = +v("mp"), n0 = P.length, bad = (t) => { document.getElementById("merr").textContent = t; };
  if (mv !== "" && !(+mv >= 0)) return bad("Modal harus angka 0 atau lebih.");
  if (mv !== "" && hv > 0 && +mv > hv) return bad("Modal tidak boleh lebih besar dari harga jual.");
  if (sv !== "" && !(+sv >= 0)) return bad("Stok awal harus angka 0 atau lebih.");
  _sp();
  if (P.length > n0 && (mv !== "" || sv !== "")) {
    const id = P[P.length - 1].id, c = getCost(); c[id] = c[id] || {};
    if (mv !== "") c[id].m = Math.round(+mv);
    if (sv !== "") { c[id].s = Math.round(+sv); c[id].t = Date.now(); }
    store(K_COST, c); render();
  }
};

/* ---------- kartu "Penjualan hari ini" ikut menghitung transaksi manual ---------- */
const _sc = salesCard;
salesCard = function () { const o = S.orders; S.orders = [...o, ...getMan()]; try { return _sc(); } finally { S.orders = o; } };

/* ---------- tab & event ---------- */
KT.splice(2, 0, ["trx", "Transaksi"], ["lap", "Laporan"], ["stok", "Stok"]);
const _k = KV.kasir;
KV.kasir = () => (S.kt === "trx" ? kasirShell(trxPage()) : S.kt === "lap" ? kasirShell(lapPage()) : S.kt === "stok" ? kasirShell(stokPage()) : _k());

document.addEventListener("click", (e) => {
  const q = (s) => e.target.closest(s); let b;
  if ((b = q("[data-lper]"))) { L.per = b.dataset.lper; return render(); }
  if (q("[data-lxls]")) return downloadXlsx("Laporan-VELORA-" + L.mon + ".xlsx", L.mon);
  if (q("[data-lpdf]")) return downloadPdf("Laporan-VELORA-" + L.mon + ".pdf", L.mon);
  if (q("[data-lsim]")) return isiSimulasi(L.mon);
  if (q("[data-lsimdel]")) { store(K_SIM, []); store(K_OPEX, getOpex().filter((x) => !x.sim)); toast("Data laporan otomatis dihapus"); return render(); }
  if (q("[data-ltadd]")) { trxKeep(); const r = trxItem(); if (typeof r === "string") return ($("#lterr").textContent = r); L.cart.push(r); return render(); }
  if ((b = q("[data-lxdel]"))) { trxKeep(); L.cart.splice(+b.dataset.lxdel, 1); return render(); }
  if ((b = q("[data-ltdel]"))) { store(K_MAN, getMan().filter((x) => x.id !== b.dataset.ltdel)); toast("Transaksi dihapus"); return render(); }
  if (q("[data-ltsave]")) {
    trxKeep(); const er = (t) => { $("#lterr").textContent = t; };
    if (!L.cart.length && $("#ltq").value) { const r = trxItem(); if (typeof r === "string") return er(r); L.cart.push(r); }
    if (!L.cart.length) return er("Tambahkan minimal 1 produk.");
    const d = L.date || ymd(Date.now()), today = ymd(Date.now()); if (d > today) return er("Tanggal tidak boleh di masa depan.");
    const ts = d === today ? Date.now() : new Date(d + "T12:00:00").getTime(), items = L.cart.map((i) => ({ n: P[i.id].n, q: i.q, p: P[i.id].p, cm: modalOf(i.id), r: { id: i.id } }));
    const o = getMan(); o.push({ id: "TR-" + Date.now().toString().slice(-6), nm: "Kasir", ts, status: "done", man: 1, pay: L.pay, items, grand: items.reduce((a, i) => a + i.p * i.q, 0) });
    store(K_MAN, o); L.cart = []; toast("Transaksi tersimpan, masuk ke laporan"); return render();
  }
  if ((b = q("[data-lopdel]"))) { store(K_OPEX, getOpex().filter((x) => x.id !== b.dataset.lopdel)); return render(); }
  if (q("[data-lopadd]")) {
    const ket = $("#lok").value.trim(), jml = Math.round(+String($("#loj").value).replace(/\D/g, "")), d = $("#lod").value || ymd(Date.now()), er = (t) => { $("#lerr").textContent = t; };
    if (ket.length < 2) return er("Isi keterangan minimal 2 karakter.");
    if (!(jml > 0)) return er("Jumlah harus lebih dari 0.");
    const o = getOpex(); o.push({ id: "o" + Date.now(), ts: new Date(d + "T12:00:00").getTime(), ket, jml }); store(K_OPEX, o); toast("Biaya operasional ditambahkan"); render();
  }
});
document.addEventListener("change", (e) => {
  const t = e.target, c = getCost();
  if (t.id === "lnote") { store(K_NOTE, !!t.checked); toast(t.checked ? "Keterangan data contoh ditampilkan" : "Keterangan data contoh disembunyikan"); return render(); }
  if (t.id === "lm" && t.value) { L.mon = t.value; return render(); }
  const id = t.dataset.lcm !== undefined ? t.dataset.lcm : t.dataset.lcs; if (id === undefined) return;
  const v = Math.max(0, Math.round(+t.value || 0)); c[id] = c[id] || {};
  if (t.dataset.lcm !== undefined) c[id].m = v; else { c[id].s = v; c[id].t = Date.now(); }
  store(K_COST, c); toast("Tersimpan");
});

document.addEventListener("input", (e) => {   // kolom jumlah biaya: titik ribuan otomatis, boleh diketik 2.000.000 atau 2000000
  const t = e.target; if (t.id !== "loj") return;
  const d = t.value.replace(/\D/g, ""); t.value = d ? (+d).toLocaleString("id-ID") : "";
});

/* ---------- gaya tambahan ---------- */
const st = document.createElement("style");
st.textContent = `.kasir-tabs{overflow-x:auto}.kasir-tabs button{flex:none}
.lap .fld,.lbar .fld{background:#17140F;color:#F2EAD9;border:1px solid rgba(184,155,114,.3);color-scheme:dark}.lap .fld::placeholder{color:#8C7F6B}
.lap{padding:0 2px 24px}.lap .neg{color:#B3261E}.lbar{display:flex;gap:8px;align-items:center;margin:12px 0}.lbar .fld{flex:1;margin:0}
.lsim{background:rgba(184,155,114,.2);border-radius:12px;padding:10px 12px;font-size:12px;margin:8px 0}
.lcards{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}.lc{background:rgba(184,155,114,.14);border-radius:14px;padding:10px}.lc small{display:block;font-size:11px;opacity:.75}.lc b{font-size:15px}
.lscroll{overflow-x:auto;margin:8px 0}.ltb{border-collapse:collapse;font-size:11px;min-width:100%;white-space:nowrap}.ltb th,.ltb td{padding:6px 7px;text-align:right;border-bottom:1px solid rgba(128,128,128,.25)}.ltb th:first-child,.ltb td:first-child{text-align:left}.ltb .tot td{font-weight:700}
.lchart{display:block;width:100%;height:auto;aspect-ratio:340/150;min-height:120px;margin-top:6px;stroke:none;overflow:visible}.lchart text{stroke:none}.lleg{display:flex;gap:12px;font-size:11px;margin-bottom:8px}.lleg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:4px}
.lbtns{display:flex;gap:8px;margin:12px 0}.lbtns .kbtn{flex:1}
.kasir-tabs{grid-template-columns:repeat(4,1fr)}
@media(min-width:900px){
.app.wide{width:min(1180px,calc(100vw - 56px));max-width:none;height:min(900px,calc(100dvh - 28px));border-radius:22px;box-shadow:0 0 0 1px rgba(184,155,114,.4),0 30px 80px #000a}
.app.wide .island,.app.wide .sbar{display:none}
.app.wide .kasir-shell{padding:26px 40px 80px}
.app.wide .kasir-tabs{grid-template-columns:repeat(8,1fr);gap:8px}
.app.wide .kasir-tabs button{min-height:46px;font-size:13.5px}
.app.wide .kasir-stats{max-width:720px}
.app.wide .lap{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 32px;align-items:start}
.app.wide .lap>*{grid-column:1/-1}
.app.wide .lap>.kset{grid-column:auto}
.app.wide .ltb{font-size:13px}.app.wide .ltb th,.app.wide .ltb td{padding:9px 12px}
.app.wide .lcards{grid-template-columns:repeat(3,1fr)}
.app.wide .lchart{display:block;max-width:760px;margin:8px auto 2px}
.app.wide .lleg{justify-content:center}
.app.wide .lbtns{max-width:420px}
.app.wide .lbar{max-width:520px}
.app.wide .sheet{align-items:center;justify-content:center}
.app.wide .panel{width:min(480px,92%);max-height:88%;border-radius:26px}
}

.lrow{display:grid;grid-template-columns:1fr 78px 58px 36px;gap:6px;align-items:center;padding:6px 0;border-bottom:1px solid rgba(128,128,128,.2);font-size:12px}.lrow small{display:block;opacity:.7}.lrow .fld{margin:0;padding:8px 6px;font-size:12px}.lrow.hd{font-weight:600;font-size:11px}`;
document.head.appendChild(st);

{   // isi data laporan otomatis untuk bulan ini & bulan lalu bila belum ada (bulan baru ikut terisi)
  const d = new Date(), pm = new Date(d.getFullYear(), d.getMonth() - 1, 1), ms = [pm.getFullYear() + "-" + pad(pm.getMonth() + 1), L.mon], done = load("vc_sim_months", []);
  ms.forEach((m) => { if (!done.includes(m) && !getSim().some((o) => o.mon === m)) isiSimulasi(m, true); if (!done.includes(m)) done.push(m); });
  store("vc_sim_months", done);
  if (!ctxOf(L.mon).M.trx && ctxOf(ms[0]).M.trx) L.mon = ms[0];   // bulan ini masih kosong -> tampilkan bulan lalu
}
applyMenu(); render();
})();
