#!/usr/bin/env node
/**
 * Henter et billede pr. node fra Wikipedia og cacher det lokalt.
 *
 *   node scripts/images.js            # hent kun frit licenserede billeder
 *   node scripts/images.js --nonfree  # medtag også fair-use (fx filmplakater)
 *   node scripts/images.js --dry      # opløs kun titler, hent intet (til kontrol)
 *   node scripts/images.js --force    # hent alt forfra
 *
 * Titler kommer fra:
 *   filosoffer          → `wiki`-feltet i data/philosophers.js
 *   begreber/traditioner → nodens `en`-felt (det engelske begreb er præcist)
 *   epoker              → nodens `en`-felt
 *   artefakter          → data/images.js (kurateret, ingen gæt – bøgers engelske
 *                         navne er tvetydige, fx «Metaphysics»)
 *
 * Noder hvor artiklen ikke findes, er en flertydig side eller kun har et ikon
 * (svg-logo, skabelonbillede) får INGEN fil – de får en genereret planet i
 * viseren i stedet. Det er bedre end et billede der viser noget forkert.
 *
 * LICENS: Standard er kun frit licenserede billeder (filosoffer, begreber,
 * traditioner, epoker). Filmplakater og andre artefakter er typisk fair use og
 * kommer derfor kun med ved --nonfree (til personligt brug).
 *
 * Resultat:
 *   build/images/<id>.jpg
 *   build/images.json        { nodeId: { fil, titel, bredde, højde } }
 *   build/images-report.txt  fuld oversigt til gennemsyn
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildModel } from './model.js';
import { wikiTitles } from '../data/images.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'build');
const IMGDIR = path.join(OUT, 'images');

const DRY = process.argv.includes('--dry');
const FORCE = process.argv.includes('--force');
const NONFREE = process.argv.includes('--nonfree');
const SIZE = 200;
// Wikimedia beder om et beskrivende User-Agent med kontaktoplysninger.
const UA = 'Filsofografen/1.0 (local dataset build; nodejs)';

const { model } = buildModel();

// ── Hvilke noder skal have et rigtigt billede? ───────────────────────────────
const wanted = [];      // alle noder vi gerne vil have et billede til
const unmatched = [];   // kuraterede titler der ikke matcher nogen node
for (const p of model.philosophers) {
  const t = p.wiki ? decodeURIComponent(p.wiki).replace(/_/g, ' ') : null;
  if (t) wanted.push({ id: `philosopher:${p.id}`, key: p.id, title: t, navn: p.da, gruppe: 'filosof', licens: 'free' });
  else unmatched.push({ id: p.id, navn: p.da, grund: 'ingen wiki-felt' });
}
for (const c of model.concepts) {
  if (c.en) wanted.push({ id: `concept:${c.id}`, key: c.id, title: c.en, navn: c.da,
    gruppe: c.isTradition ? 'tradition' : 'begreb', licens: 'free' });
}
for (const e of model.eras) {
  if (e.en) wanted.push({ id: `era:${e.id}`, key: e.id, title: e.en, navn: e.da, gruppe: 'epoke', licens: 'free' });
}
for (const a of model.artifacts) {
  const t = wikiTitles[a.id];
  if (t) wanted.push({ id: `artifact:${a.id}`, key: a.id, title: t, navn: a.da, gruppe: 'artefakt', licens: 'any' });
}
for (const [id, t] of Object.entries(wikiTitles)) {
  if (!model.artifacts.some((a) => a.id === id)) unmatched.push({ id, navn: t, grund: 'findes ikke som artefakt' });
}
const GRUPPER = ['filosof', 'begreb', 'tradition', 'epoke', 'artefakt'];
const antal = (g, liste = wanted) => liste.filter((w) => w.gruppe === g).length;
console.log(`\nBilleder: ${wanted.length} noder ønsket (` +
  GRUPPER.map((g) => `${antal(g)} ${g}er`).join(', ') + ')');

// ── Opløs titler i batcher ──────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Wikimedia svarer nogle gange på rate-limit med HTTP 200 og ren tekst
 * ("You are making too many requests to the API."), ikke JSON. Derfor tjekker
 * vi content-type og bakker af med eksponentiel backoff + Retry-After.
 */
async function getJson(url, forsog = 6) {
  for (let i = 0; i < forsog; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('json')) return res.json();
    if (i === forsog - 1) throw new Error(`gav op efter ${forsog} forsøg (HTTP ${res.status}, ${ct || 'uden type'})`);
    const ra = Number(res.headers.get('retry-after'));
    const vent = Number.isFinite(ra) && ra > 0 ? ra * 1000 : Math.min(60000, 4000 * 2 ** i);
    process.stdout.write(`\r  afventer ${Math.round(vent / 1000)}s (HTTP ${res.status}) …            `);
    await sleep(vent);
  }
}

async function getBinary(url, forsog = 4) {
  for (let i = 0; i < forsog; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.startsWith('image/')) return res;
    if (i === forsog - 1) throw new Error(`HTTP ${res.status} (${ct || 'uden type'})`);
    const ra = Number(res.headers.get('retry-after'));
    await sleep(Number.isFinite(ra) && ra > 0 ? ra * 1000 : Math.min(30000, 3000 * 2 ** i));
  }
}

async function resolveBatch(titles, licens) {
  const url = 'https://en.wikipedia.org/w/api.php?' + new URLSearchParams({
    action: 'query', format: 'json', formatversion: '2', redirects: '1',
    // pageprops bruges til at afvise flertydige sider ("Arendt" → peger videre),
    // categories til at afvise personsider (fx «Homo mensura» → Protagoras).
    prop: 'pageimages|pageprops|categories', cllimit: '60', clshow: '!hidden',
    piprop: 'thumbnail', pithumbsize: String(SIZE),
    pilicense: licens === 'any' && NONFREE ? 'any' : 'free',
    titles: titles.join('|'),
  });
  const j = await getJson(url);
  const chain = new Map();
  for (const n of j.query.normalized || []) chain.set(n.from, n.to);
  for (const r of j.query.redirects || []) chain.set(r.from, r.to);
  const resolve = (t) => {
    let cur = t;
    for (let i = 0; i < 6; i++) { const nx = chain.get(cur); if (!nx || nx === cur) break; cur = nx; }
    return cur;
  };
  const pages = new Map((j.query.pages || []).map((p) => [p.title, p]));
  const out = new Map();
  for (const t of titles) out.set(t, pages.get(resolve(t)) || null);
  return out;
}

const resolved = new Map(); // id -> { title, page }
const BATCH = 50;

/** Opløs en flok titler i batcher på 50, så Wikimedia ikke rate-limiter os. */
async function resolveGroup(items, licens) {
  if (!items.length) return;
  const batches = [];
  for (let i = 0; i < items.length; i += BATCH) batches.push(items.slice(i, i + BATCH));
  let bi = 0;
  for (const batch of batches) {
    bi++;
    const map = await resolveBatch(batch.map((w) => w.title), licens);
    for (const w of batch) resolved.set(w.id, { title: w.title, page: map.get(w.title) });
    process.stdout.write(`\r  opløser ${licens}-titler … ${bi}/${batches.length} batcher   `);
    await sleep(1500);
  }
  console.log();
}

// Frie billeder først (filosoffer/begreber/traditioner/epoker), så artefakter
// – de sidstnævnte må kun hentes med fair use når --nonfree er sat.
await resolveGroup(wanted.filter((w) => w.licens === 'free'), 'free');
await resolveGroup(wanted.filter((w) => w.licens === 'any'), 'any');

// Nogle artikler har kun et fair use-billede (fx et portræt af en nulevende
// filosof). Er --nonfree sat, prøver vi dem igen – ellers står de tomme.
if (NONFREE) {
  const tomme = wanted.filter((w) => {
    const p = resolved.get(w.id) && resolved.get(w.id).page;
    return w.licens === 'free' && (!p || !p.thumbnail || !p.thumbnail.source);
  });
  if (tomme.length) {
    console.log(`  ${tomme.length} noder uden frit billede – prøver igen med fair use tilladt`);
    await resolveGroup(tomme, 'any');
  }
}

// ── Rapport ─────────────────────────────────────────────────────────────────
/**
 * Afvis ikoner og skabelonbilleder. Et ledende billede på en Wikipedia-artikel
 * er ofte et ikon (fx et spørgsmålstegn eller et Commons-logo) når artiklen ikke
 * har et rigtigt billede – så er en genereret planet bedre.
 */
const UI_FIL = /(question_book|ambox|padlock|commons-|wiktionary|symbol_|crystal_|edit-|folder|portal|nuvola|disambig|wiki_?letter|mbox_|help_)/i;
const DOKUMENT_FIL = /(logo|icon|flag_of|coat_of_arms|emblem|seal_of|blank)/i;
function brugbartBillede(thumb, gruppe) {
  const fil = decodeURIComponent(thumb.split('/').pop() || '').toLowerCase();
  if (UI_FIL.test(fil)) return false;
  // Vektorgrafik er fint for artefakter (flag, våbenskjold, segl, diagram), men
  // for et abstrakt begreb er det oftest et skabelonikon – dér er den
  // genererede planet bedre end et ikon.
  if (/\.svg\.png$/.test(fil)) return gruppe === 'artefakt';
  if (gruppe !== 'artefakt' && DOKUMENT_FIL.test(fil)) return false;
  return true;
}

// Kategorier der røber at siden er en biografi og ikke et begreb.
const PERSON_KAT = /(births|deaths|living people|biograph|people from|philosophers|writers|politicians|economists|sociologists|scientists)$/i;
const personsider = new Set();
for (const p of [...model.philosophers]) {
  for (const n of [p.en, p.da]) if (n) personsider.add(n.trim().toLowerCase());
}
function erPersonSide(page) {
  if (personsider.has(String(page.title || '').trim().toLowerCase())) return true;
  const kats = (page.categories || []).map((c) => String(c.title || '').replace(/^Category:/, ''));
  return kats.some((k) => PERSON_KAT.test(k));
}

const found = [], missing = [];
for (const w of wanted) {
  const r = resolved.get(w.id);
  const page = r && r.page;
  const thumb = page && page.thumbnail && page.thumbnail.source;
  const flertydig = page && page.pageprops && page.pageprops.disambiguation !== undefined;
  // Et begreb må ikke få et portræt af en person (fx «Being-in-the-world» → Heidegger).
  const person = w.gruppe !== 'filosof' && w.gruppe !== 'artefakt' && page && erPersonSide(page);
  if (thumb && !flertydig && !person && brugbartBillede(thumb, w.gruppe)) {
    found.push({ ...w, thumb, sideTitel: page.title });
  } else {
    missing.push({ ...w, sideTitel: page ? page.title : '(ingen artikel)',
      grund: !page ? 'ingen artikel' : flertydig ? 'flertydig side' : person ? 'personside, ikke begrebet'
        : !thumb ? 'artiklen har intet billede' : 'kun ikon/skabelonbillede' });
  }
}
console.log(`  fundet: ${found.length}   uden billede: ${missing.length} (får genereret planet)`);
console.log('  fordeling: ' + GRUPPER.map((g) => `${g} ${antal(g, found)}/${antal(g)}`).join(', '));
if (missing.length) {
  const vis = DRY ? missing : missing.slice(0, 20);
  console.log('  uden billede:');
  for (const m of vis) console.log(`    - ${m.key}  «${m.title}»  → ${m.sideTitel}  (${m.grund})`);
  if (vis.length < missing.length) console.log(`    … og ${missing.length - vis.length} mere (se build/images-report.txt)`);
}

const report = [];
report.push('Billeder hentet fra den engelske Wikipedia (artikel-thumbnail).');
report.push('Licens: se den enkelte fils beskrivelsesside på Wikimedia Commons.');
report.push('');
report.push(`Noder med billede: ${found.length}`);
for (const f of found.sort((a, b) => a.key.localeCompare(b.key))) {
  report.push(`  ${f.id.padEnd(46)} ${f.title.padEnd(58)} → ${f.sideTitel}`);
}
report.push('');
report.push(`Noder uden billede (genereret planet): ${missing.length}`);
for (const m of missing.sort((a, b) => a.key.localeCompare(b.key))) {
  report.push(`  ${m.id.padEnd(46)} ${m.title.padEnd(58)} → ${m.sideTitel}  (${m.grund})`);
}
report.push('');
report.push('Kuraterede titler der ikke matcher nogen node:');
for (const u of unmatched) report.push(`  ${u.id.padEnd(46)} ${u.navn}  (${u.grund})`);
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'images-report.txt'), report.join('\n') + '\n', 'utf8');

if (unmatched.length) {
  console.log(`\n  ADVARSEL: ${unmatched.length} kuraterede titler matcher ingen node:`);
  for (const u of unmatched) console.log(`    - ${u.id}: ${u.grund}`);
}

if (DRY) {
  // Kun kuraterede titler der ikke matcher en node er en fejl – abstrakte
  // begreber uden Wikipedia-artikel er forventeligt og ikke en fejl.
  console.log('\n--dry: hentede intet. Se build/images-report.txt');
  console.log(`  ${found.length} noder ville få et rigtigt billede, ${missing.length} en genereret planet.\n`);
  process.exit(unmatched.length ? 1 : 0);
}

// ── Hent billederne ─────────────────────────────────────────────────────────
fs.mkdirSync(IMGDIR, { recursive: true });
const manifest = {};
let bytes = 0, downloaded = 0, skipped = 0, failed = 0;

async function download(item) {
  const key = item.id.replace(':', '_');
  const file = `${key}.jpg`;
  const dest = path.join(IMGDIR, file);
  const clean = item.thumb.split('?')[0];
  if (!FORCE && fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    manifest[item.id] = { fil: file, titel: item.sideTitel };
    bytes += fs.statSync(dest).size;
    skipped++;
    return;
  }
  try {
    const res = await getBinary(clean);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 500) throw new Error('for lille svar');
    fs.writeFileSync(dest, buf);
    manifest[item.id] = { fil: file, titel: item.sideTitel };
    bytes += buf.length;
    downloaded++;
  } catch (e) {
    failed++;
    console.log(`\n    ! kunne ikke hente ${item.key}: ${e.message}`);
  }
}

const CONC = 4;
for (let i = 0; i < found.length; i += CONC) {
  await Promise.all(found.slice(i, i + CONC).map(download));
  process.stdout.write(`\r  henter billeder … ${Math.min(i + CONC, found.length)}/${found.length}`);
  await sleep(180);
}
console.log();

fs.writeFileSync(path.join(OUT, 'images.json'), JSON.stringify(manifest, null, 1), 'utf8');

console.log(`\n  hentet: ${downloaded}   genbrugt: ${skipped}   fejlet: ${failed}`);
console.log(`  i alt ${(bytes / 1048576).toFixed(1)} MB i build/images/`);
console.log(`  manifest: build/images.json (${Object.keys(manifest).length} noder)`);
console.log(`  rapport:  build/images-report.txt\n`);
