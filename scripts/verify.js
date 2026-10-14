#!/usr/bin/env node
/**
 * Uafhængig kontrol af de byggede artefakter i build/ – uden Neo4j.
 *
 * Tjekker:
 *   1. Cypher-filen: hver MATCH-refereret node findes, og alle noder oprettes.
 *   2. CSV-filerne: :ID er globalt unikt, og alle rel-endpoints findes.
 *   3. JSON: ingen døde links.
 *   4. Kravopfyldelse: begreber -> artefakter, filosoffer -> begreber,
 *      og at de efterspurgte artefaktkategorier faktisk er repræsenteret.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', 'build');
const CSVDIR = path.join(OUT, 'csv');

let failures = 0;
const ok = (msg) => console.log(`  \u2713 ${msg}`);
const bad = (msg) => { failures++; console.log(`  \u2717 ${msg}`); };
const check = (cond, msg) => (cond ? ok(msg) : bad(msg));

const graph = JSON.parse(fs.readFileSync(path.join(OUT, 'filosofi.json'), 'utf8'));
const nodes = graph.nodes, links = graph.links;

console.log('\n\u2550\u2550 Kontrol af build/ \u2550\u2550');

// ── 1) Cypher ───────────────────────────────────────────────────────────────
console.log('\n1) Cypher');
const cypher = fs.readFileSync(path.join(OUT, 'filosofi.cypher'), 'utf8');
const created = new Set();
for (const m of cypher.matchAll(/MERGE \(n:([A-Za-z:]+) \{id: '((?:[^'\\]|\\.)*)'\}\)/g)) {
  const labels = m[1];
  const id = m[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
  const primary = labels.split(':')[0];
  const key = `${primary}:${id}`;
  if (created.has(key)) bad(`Dubleret MERGE for ${key}`);
  created.add(key);
}
const expectedNodes = new Set(nodes.map((n) => {
  const primary = n.labels.split(';')[0];
  return `${primary}:${n.ren}`;
}));
check(created.size === expectedNodes.size, `Cypher opretter ${created.size} noder (forventet ${expectedNodes.size})`);
for (const k of expectedNodes) if (!created.has(k)) bad(`Cypher mangler node ${k}`);

const relStmts = [...cypher.matchAll(/MERGE \(a\)-\[r:([A-Z_]+)\]->\(b\)/g)].length;
check(relStmts === links.length, `Cypher opretter ${relStmts} relationer (forventet ${links.length})`);
const cypherEvidens = [...cypher.matchAll(/r\.evidens = '/g)].length;
check(cypherEvidens === links.length,
  `Cypher sætter r.evidens på alle ${links.length} relationer (${cypherEvidens} fundet)`);

const danglingCypher = [];
for (const m of cypher.matchAll(/MATCH \(a:([A-Za-z]+) \{id: '((?:[^'\\]|\\.)*)'\}\), \(b:([A-Za-z]+) \{id: '((?:[^'\\]|\\.)*)'\}\)/g)) {
  const a = `${m[1]}:${m[2].replace(/\\'/g, "'")}`;
  const b = `${m[3]}:${m[4].replace(/\\'/g, "'")}`;
  if (!created.has(a)) danglingCypher.push(a);
  if (!created.has(b)) danglingCypher.push(b);
}
check(danglingCypher.length === 0, `alle MATCH-referencer findes (${danglingCypher.length} manglende)`);
for (const d of new Set(danglingCypher)) bad(`MATCH peger på ukendt ${d}`);

// 1b) Sætningshygiejne: hvert statement skal ende med ';' og have balancerede
// anførselstegn og parenteser (fanger fejl i streng-escaping).
const stmtLines = cypher.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('//'));
const badQuote = [], badParen = [];
stmtLines.forEach((l, i) => {
  let q = 0;
  for (let j = 0; j < l.length; j++) {
    if (l[j] !== "'") continue;
    let b = 0;
    while (j - 1 - b >= 0 && l[j - 1 - b] === '\\') b++;
    if (b % 2 === 0) q++;
  }
  if (q % 2 !== 0) badQuote.push(i + 1);
  let depth = 0;
  for (const c of l) { if (c === '(') depth++; else if (c === ')') depth--; }
  if (depth !== 0) badParen.push(i + 1);
});
check(badQuote.length === 0, `anførselstegn balancerer på alle statements (${badQuote.length} afvigere)`);
check(badParen.length === 0, `parenteser balancerer på alle statements (${badParen.length} afvigere)`);
check(stmtLines.every((l) => l.trim().endsWith(';')), 'alle statements afsluttes med semikolon');

// ── 2) CSV ──────────────────────────────────────────────────────────────────
console.log('\n2) CSV (neo4j-admin import)');
function parseCsv(file) {
  const txt = fs.readFileSync(path.join(CSVDIR, file), 'utf8');
  const rows = [];
  let row = [], cell = '', inQ = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (inQ) {
      if (c === '"') { if (txt[i + 1] === '"') { cell += '"'; i++; } else inQ = false; }
      else cell += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c === '\r') { /* skip */ }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const header = rows.shift();
  return { header, rows: rows.filter((r) => r.length > 1) };
}

const nodeFiles = ['nodes_philosophers.csv', 'nodes_concepts.csv', 'nodes_artifacts.csv', 'nodes_eras.csv'];
const importIds = new Map();
let totalNodeRows = 0;
for (const f of nodeFiles) {
  const { header, rows } = parseCsv(f);
  if (header[0] !== ':ID') bad(`${f}: første kolonne er ikke :ID`);
  if (header[header.length - 1] !== ':LABEL') bad(`${f}: sidste kolonne er ikke :LABEL`);
  for (const r of rows) {
    const id = r[0];
    if (importIds.has(id)) bad(`CSV: dubleret :ID "${id}" i ${f} og ${importIds.get(id)}`);
    importIds.set(id, f);
    if (r[r.length - 1] === '') bad(`CSV: ${f} række ${id} mangler :LABEL`);
    if (r.length !== header.length) bad(`CSV: ${f} række ${id} har ${r.length} kolonner, forventet ${header.length}`);
    totalNodeRows++;
  }
}
check(totalNodeRows === nodes.length, `CSV noderækker: ${totalNodeRows} (forventet ${nodes.length})`);

const rels = parseCsv('rels.csv');
check(rels.header.join(',') === ':START_ID,:END_ID,:TYPE,kilde,evidens', `rels.csv header: ${rels.header.join(',')}`);
check(rels.rows.length === links.length, `rels.csv rækker: ${rels.rows.length} (forventet ${links.length})`);
// CSV'en og JSON'en kommer fra samme model: proveniens og grader skal matche
// række for række, ellers importerer Neo4j noget andet end viseren tegner.
check(rels.rows.map((r) => r[3]).join('|') === links.map((l) => l.kildeURL).join('|'),
  'rels.csv bærer samme kilde-kolonne som JSON');
check(rels.rows.map((r) => r[4]).join('|') === links.map((l) => l.evidens).join('|'),
  'rels.csv bærer samme evidensgrader som JSON');
for (const r of rels.rows) {
  if (!r[4]) bad(`rels.csv: manglende evidens for ${r[0]} -> ${r[1]}`);
}
let danglingRel = 0;
for (const r of rels.rows) {
  if (!importIds.has(r[0])) { bad(`rels.csv: ukendt :START_ID ${r[0]}`); danglingRel++; }
  if (!importIds.has(r[1])) { bad(`rels.csv: ukendt :END_ID ${r[1]}`); danglingRel++; }
  if (!r[2]) bad(`rels.csv: manglende :TYPE for ${r[0]} -> ${r[1]}`);
}
if (!danglingRel) ok('alle relation-endpoints findes blandt noderne');

// ── 3) JSON-integritet ──────────────────────────────────────────────────────
console.log('\n3) JSON');
const ids = new Set(nodes.map((n) => n.id));
const dead = links.filter((l) => !ids.has(l.kilde) || !ids.has(l.maal));
check(dead.length === 0, `ingen døde links (${dead.length})`);
check(new Set(nodes.map((n) => n.id)).size === nodes.length, 'alle node-id\'er er unikke');

// ── 4) Kravopfyldelse ───────────────────────────────────────────────────────
console.log('\n4) Kravopfyldelse');
const CP = 'concept:';
const conceptArtifact = new Set(['GAVE_RISE_TO', 'EXPRESSED_IN']);
const byTypeOfConcept = new Map();
for (const l of links) {
  if (!l.kilde.startsWith(CP) || !conceptArtifact.has(l.type)) continue;
  const k = l.kilde.slice(CP.length);
  if (!byTypeOfConcept.has(k)) byTypeOfConcept.set(k, new Set());
  byTypeOfConcept.get(k).add(l.type);
}
const conceptNodes = nodes.filter((n) => n.labels.split(';')[0] === 'Concept');
const lonely = conceptNodes.filter((n) => !byTypeOfConcept.has(n.id.slice(CP.length)));
check(lonely.length === 0, `hvert begreb er forbundet til mindst én artefakt (${conceptNodes.length - lonely.length}/${conceptNodes.length})`);
for (const n of lonely) bad(`Begreb uden artefakt: ${n.navn}`);

const thinkerRels = new Set(['INVENTED', 'DEVELOPED', 'REVISED', 'CRITIQUED', 'FOUNDED']);
const anchored = new Set(links.filter((l) => thinkerRels.has(l.type) && l.maal.startsWith(CP)).map((l) => l.maal));
check(anchored.size > 0, `begreber knyttet til en tænker: ${anchored.size}`);

const developed = links.filter((l) => l.type === 'DEVELOPED');
const revised = links.filter((l) => l.type === 'REVISED');
const critiqued = links.filter((l) => l.type === 'CRITIQUED');
check(developed.length > 0 && revised.length > 0 && critiqued.length > 0,
  `videreudvikling/forandring: ${developed.length} DEVELOPED, ${revised.length} REVISED, ${critiqued.length} CRITIQUED`);

const influ = links.filter((l) => l.type === 'INFLUENCED').length;
const philos = nodes.filter((n) => n.labels.split(';')[0] === 'Philosopher');
check(influ > 100, `indflydelsesnetværk: ${influ} INFLUENCED-relationer mellem ${philos.length} filosoffer`);

// De kategorier brugeren eksplicit efterspurgte
const wanted = ['Book', 'Film', 'Building', 'Ideology', 'MoralCode', 'Pedagogy', 'Legislation', 'Institution', 'Movement', 'Constitution'];
for (const w of wanted) {
  const n = nodes.filter((x) => x.labels.split(';').includes(w)).length;
  check(n > 0, `artefaktkategori ${w}: ${n}`);
}

// ── 5) Univers-viserens data ────────────────────────────────────────────────
// Viseren tegner hver node ud fra de indbagte koordinater og det billede
// manifestet peger på. Begge dele skal holde, ellers viser universet noget
// andet end grafen.
console.log('\n5) Univers-viser');
const IMGDIR = path.join(OUT, 'images');
const manifestFil = path.join(OUT, 'images.json');
const manifest = fs.existsSync(manifestFil) ? JSON.parse(fs.readFileSync(manifestFil, 'utf8')) : {};

let manglendeFil = 0;
for (const n of nodes) {
  if (!n.billede) continue;
  if (!fs.existsSync(path.join(IMGDIR, n.billede))) { bad(`billedfil mangler for ${n.id}: ${n.billede}`); manglendeFil++; }
}
check(manglendeFil === 0, `alle ${nodes.filter((n) => n.billede).length} billedreferencer peger på en fil der findes`);

const ukendte = Object.keys(manifest).filter((id) => !ids.has(id));
check(ukendte.length === 0, `billedmanifestet peger kun på kendte noder (${Object.keys(manifest).length} poster)`);

const udenKoordinater = nodes.filter((n) => !Number.isFinite(n.x) || !Number.isFinite(n.y) || !Number.isFinite(n.z));
check(udenKoordinater.length === 0, `alle ${nodes.length} noder har et 3D-punkt i rummet`);
for (const n of udenKoordinater) bad(`Node uden koordinater: ${n.id}`);

// To noder oven på hinanden ville være en planet man ikke kan se eller klikke.
let tættest = Infinity;
for (let i = 0; i < nodes.length; i++) {
  for (let j = i + 1; j < nodes.length; j++) {
    const a = nodes[i], b = nodes[j];
    const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
    if (d < tættest) tættest = d;
  }
}
const RADIUS = 7;
check(tættest > RADIUS, `mindste afstand mellem to planeter: ${tættest.toFixed(1)} (radius ${RADIUS})`);
const medBillede = nodes.filter((n) => n.billede).length;
ok(`${medBillede}/${nodes.length} noder har et rigtigt billede, resten en genereret planet`);

// Viserens script skal kunne parses. En syntaksfejl her er usynlig for både
// bygget og datavalideringen, men giver en tom side i browseren – så den
// kontrolleres eksplicit på det færdige build.
const html = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8');
const inlineScript = html.match(/<script>([\s\S]*)<\/script>/);
if (!inlineScript) {
  bad('build/index.html har intet inline-script');
} else {
  try {
    new vm.Script(inlineScript[1], { filename: 'build/index.html' });
    ok(`viserens script parses (${inlineScript[1].split('\n').length} linjer JavaScript)`);
  } catch (e) {
    bad(`viserens script har syntaksfejl: ${e.message}`);
  }
}
const manglendePladsholder = html.includes('__FILOSOFI_DATA__');
check(!manglendePladsholder, 'datapladsholderen er udskiftet i build/index.html');

// ── 6b) Tidslinjen ──────────────────────────────────────────────────────────
// Viserens tidslinje lægger noderne efter årstal. Filosoffer og artefakter har
// deres eget; begrebernes er afledt, og det skal stå på noden hvad det bygger på.
console.log('\n6b) Tidslinje');
const medAar = nodes.filter((n) => typeof n.aar === 'number');
// Epokerne har også et årstal (deres spænd) – de tegnes som bånd, ikke som
// markører, så de tælles ikke med i tidslinjens antal.
const markører = medAar.filter((n) => n.gruppe !== 'epoke');
const udenAar = nodes.filter((n) => n.gruppe !== 'epoke' && typeof n.aar !== 'number');
check(udenAar.length === 0, `hver node uden for epokerne har et årstal (${markører.length})`);
for (const n of udenAar.slice(0, 5)) bad(`Node uden årstal: ${n.id} (${n.navn})`);

const filosofFejl = nodes.filter((n) => n.gruppe === 'filosof' && (n.aar !== n.born || n.aarSlut !== n.died));
check(filosofFejl.length === 0, 'filosoffernes tidslinjepunkt er deres levetid');
for (const n of filosofFejl.slice(0, 5)) bad(`Filosof med forkert levetid: ${n.id} (${n.aar}–${n.aarSlut} vs ${n.born}–${n.died})`);

const artefaktFejl = nodes.filter((n) => n.gruppe === 'artefakt' && n.year !== undefined && n.aar !== n.year);
check(artefaktFejl.length === 0, 'artefakternes tidslinjepunkt er deres årstal');

const graderAfAar = new Set(['værk', 'fænomen', 'tænker']);
const begreberMedAar = nodes.filter((n) => n.gruppe === 'begreb' && typeof n.aar === 'number');
const udenKilde = begreberMedAar.filter((n) => !graderAfAar.has(n.aarKilde));
check(udenKilde.length === 0,
  `hvert placeret begreb siger hvad det afledte årstal bygger på (${begreberMedAar.length} begreber)`);
for (const n of udenKilde.slice(0, 5)) bad(`Begreb uden aarKilde: ${n.id} (${n.navn})`);

const dårligLevetid = nodes.filter((n) => typeof n.aarSlut === 'number' && n.aarSlut < n.aar);
check(dårligLevetid.length === 0, 'ingen levetid eller epoke slutter før den begynder');

const metaTid = graph.meta.tidslinje || {};
const faktiskMin = Math.min(...medAar.map((n) => n.aar));
const faktiskMax = Math.max(...medAar.map((n) => (typeof n.aarSlut === 'number' ? Math.max(n.aar, n.aarSlut) : n.aar)));
check(metaTid.min === faktiskMin && metaTid.max === faktiskMax,
  `meta.tidslinje spænder ${faktiskMin} → ${faktiskMax}`);
check(metaTid.antal === markører.length,
  `meta.tidslinje.antal tæller markørerne, ikke epokebåndene (${markører.length} markører, ${medAar.length - markører.length} bånd)`);
check(metaTid.udenAar === 0, `intet er efterladt uden årstal (${metaTid.udenAar})`);
const efter = metaTid.begreberEfter || {};
const sumEfter = (efter.værk || 0) + (efter.fænomen || 0) + (efter.tænker || 0) + (efter.ingen || 0);
check(sumEfter === nodes.filter((n) => n.gruppe === 'begreb').length,
  `begrebernes afledningsveje summer til antallet af begreber (${sumEfter})`);

const aarICypher = [...cypher.matchAll(/n\.aar = -?\d+/g)].length;
check(aarICypher === begreberMedAar.length,
  `Cypher gemmer begrebernes afledte årstal (${aarICypher} af ${begreberMedAar.length})`);

// Begge importveje skal give samme graf: CSV'en bruger en fast kolonneliste og
// skal derfor have årstallene med eksplicit.
const konceptCsv = parseCsv('nodes_concepts.csv');
const ixAar = konceptCsv.header.indexOf('aar');
const ixKilde = konceptCsv.header.indexOf('aarKilde');
check(ixAar > -1 && ixKilde > -1, `nodes_concepts.csv har kolonnerne aar og aarKilde (${konceptCsv.header.join(',')})`);
const konceptNode = new Map(nodes.filter((n) => n.gruppe === 'begreb').map((n) => ['concept:' + n.ren, n]));
const csvFejl = [];
const csvTom = [];
for (const r of konceptCsv.rows) {
  if (r.length <= ixKilde) { csvFejl.push(`${r[0]}: for få kolonner`); continue; }
  const n = konceptNode.get(r[0]);
  if (!n) continue;
  if (r[ixAar] === '') { csvTom.push(r[0]); continue; }
  if (Number(r[ixAar]) !== n.aar || r[ixKilde] !== n.aarKilde) {
    csvFejl.push(`${r[0]}: CSV ${r[ixAar]}/${r[ixKilde]} mod JSON ${n.aar}/${n.aarKilde}`);
  }
}
check(csvFejl.length === 0, `CSV'ens årstal og aarKilde stemmer med JSON (${csvFejl.length} afvigelser)`);
for (const f of csvFejl.slice(0, 5)) bad(`CSV-afvigelse: ${f}`);
check(csvTom.length === 0,
  `alle ${konceptCsv.rows.length} begrebsrækker i CSV har et årstal (${csvTom.length} tomme)`);
for (const id of csvTom.slice(0, 5)) bad(`CSV-række uden årstal: ${id}`);

// ── 6) Evidensgrader ────────────────────────────────────────────────────────
// Hver kant skal have netop én grad, og graderne skal betyde det samme i data
// som i viseren: «belagt» er forbeholdt kanter med en kilde-URL.
console.log('\n6) Evidensgrader');
const grader = (graph.meta.evidens || []).map((e) => e.id);
check(grader.length === 4 && new Set(grader).size === 4, `fire evidensgrader i meta: ${grader.join(', ')}`);
const tilladt = new Set(grader);
const udenGrad = links.filter((l) => !tilladt.has(l.evidens));
check(udenGrad.length === 0, `hver kant har en gyldig evidensgrad (${links.length - udenGrad.length}/${links.length})`);
for (const l of udenGrad.slice(0, 5)) bad(`Kant uden gyldig grad: ${l.kilde} -[${l.type}]-> ${l.maal} ("${l.evidens}")`);

const gradUdenKilde = links.filter((l) => (l.evidens === 'belagt') !== /^https?:\/\//.test(l.kildeURL));
check(gradUdenKilde.length === 0, 'graden «belagt» svarer præcis til kanter med en kilde-URL');
for (const l of gradUdenKilde.slice(0, 5)) {
  bad(`Grad og kilde stemmer ikke: ${l.evidens} / ${l.kildeURL || '(ingen kilde)'} (${l.type})`);
}

const faktisk = {};
for (const l of links) faktisk[l.evidens] = (faktisk[l.evidens] || 0) + 1;
const iMeta = graph.meta.evidensFordeling || {};
const afvig = grader.filter((g) => (iMeta[g] || 0) !== (faktisk[g] || 0));
check(afvig.length === 0,
  `meta.evidensFordeling stemmer med kanterne (${grader.map((g) => `${g}:${faktisk[g] || 0}`).join(', ')})`);
for (const g of afvig) bad(`Fordelingen afviger for ${g}: meta ${iMeta[g] || 0}, kanter ${faktisk[g] || 0}`);
check(grader.every((g) => (faktisk[g] || 0) > 0), 'alle fire grader er i brug i grafen');
const udenForklaring = (graph.meta.evidens || []).filter((e) => !e.da || !e.forklaring);
check(udenForklaring.length === 0, 'hver grad har dansk navn og forklaring til viseren');

console.log(`\n${failures ? `\u2717 ${failures} fejl fundet.` : '\u2713 Alle kontroller bestået.'}\n`);
process.exit(failures ? 1 : 0);
