#!/usr/bin/env node
/**
 * Bygger hele leverancen ud fra data/:
 *
 *   build/filosofi.cypher   – kan køres direkte med  cypher-shell -f
 *   build/csv/*.csv         – neo4j-admin database import-format
 *   build/filosofi.json     – fuld graf som JSON (nodes/links)
 *   build/index.html        – selvstændig, offline grafviser (ingen netadgang)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildModel, ARTIFACT_LABELS, ARTIFACT_TYPE_DA, EVIDENS } from './model.js';
import { computeLayout } from './layout.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'build');
const CSVDIR = path.join(OUT, 'csv');
const TEMPLATE = path.join(ROOT, 'templates', 'viewer.html');

const { model, errors, warnings, stats } = buildModel();

if (errors.length) {
  for (const e of errors) console.error(`\u2717 ${e}`);
  throw new Error(`Datavalidering fejlede med ${errors.length} fejl \u2013 bygger ikke.`);
}
for (const w of warnings) console.warn(`! ${w}`);

fs.rmSync(CSVDIR, { recursive: true, force: true });
fs.mkdirSync(CSVDIR, { recursive: true });

// ── Hjælpere ────────────────────────────────────────────────────────────────
const q = (v) => `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const propKey = (k) => k.replace(/[^A-Za-z0-9_]/g, '_');
const cypherSet = (props) =>
  Object.entries(props)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `n.${propKey(k)} = ${typeof v === 'number' ? v : q(v)}`)
    .join(', ');

const csvCell = (v) => {
  const s = v === undefined || v === null ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csvRow = (cells) => cells.map(csvCell).join(',') + '\n';
const writeCsv = (file, header, rows) => {
  fs.writeFileSync(path.join(CSVDIR, file), csvRow(header) + rows.map(csvRow).join(''), 'utf8');
  return file;
};

// ── Noder ───────────────────────────────────────────────────────────────────
// key = globalt unikt import-id; id = den "rene" id-egenskab i grafen.
const nodes = [
  ...model.eras.map((e) => ({
    key: `era:${e.id}`,
    id: e.id,
    labels: ['Era'],
    group: 'epoke',
    name: e.da,
    props: { da: e.da, en: e.en, start: e.start, end: e.end, order: e.order, note: e.note },
  })),
  ...model.concepts.map((c) => ({
    key: `concept:${c.id}`,
    id: c.id,
    labels: c.isTradition ? ['Concept', 'Tradition'] : ['Concept'],
    group: 'begreb',
    subtype: c.isTradition ? 'tradition' : c.kind,
    name: c.da,
    // aar/aarKilde er tidslinjens afledte placering af begrebet (se model.js).
    props: { da: c.da, en: c.en, kind: c.kind, note: c.note, aar: c.aar, aarKilde: c.aarKilde },
    era: c.era || null,
  })),
  ...model.artifacts.map((a) => ({
    key: `artifact:${a.id}`,
    id: a.id,
    labels: ['Artifact', ARTIFACT_LABELS[a.type] || 'Artifact'],
    group: 'artefakt',
    subtype: a.type,
    name: a.da,
    props: { da: a.da, type: a.type, year: a.year, en: a.en, note: a.note },
  })),
  ...model.philosophers.map((p) => ({
    key: `philosopher:${p.id}`,
    id: p.id,
    labels: ['Philosopher'],
    group: 'filosof',
    subtype: p.era,
    name: p.da,
    props: { da: p.da, en: p.en, born: p.born, died: p.died, wiki: p.wiki },
    era: p.era,
  })),
];

const keyOf = (label, id) =>
  `${({ Era: 'era', Concept: 'concept', Artifact: 'artifact', Philosopher: 'philosopher' })[label]}:${id}`;

const nodeByKey = new Map(nodes.map((n) => [n.key, n]));
for (const r of model.rels) {
  if (!nodeByKey.has(keyOf(r.fromLabel, r.fromId))) throw new Error(`Ukendt startnode: ${r.fromLabel}/${r.fromId}`);
  if (!nodeByKey.has(keyOf(r.toLabel, r.toId))) throw new Error(`Ukendt slutnode: ${r.toLabel}/${r.toId}`);
}

// ── 1) Cypher ───────────────────────────────────────────────────────────────
const cypher = [];
cypher.push('// Filsofografen \u2013 Neo4j-indl\u00e6sning');
cypher.push(`// Genereret ${new Date().toISOString()}`);
cypher.push(`// ${stats.philosophers} filosoffer, ${stats.concepts} begreber, ${stats.traditions} traditioner, ` +
  `${stats.artifacts} artefakter, ${stats.eras} epoker, ${stats.relations} relationer.`);
cypher.push('// K\u00f8r:  cypher-shell -u neo4j -p <kode> -f build/filosofi.cypher');
cypher.push('');
cypher.push('// \u2500\u2500 Unikhedsbegr\u00e6nsninger \u2500\u2500');
for (const label of ['Philosopher', 'Concept', 'Artifact', 'Era']) {
  cypher.push(`CREATE CONSTRAINT ${label.toLowerCase()}_id IF NOT EXISTS FOR (n:${label}) REQUIRE n.id IS UNIQUE;`);
}
cypher.push('');

// Noder grupperet efter label-sæt, så CREATE/MERGE bliver læsbart.
const byLabelSet = new Map();
for (const n of nodes) {
  const k = n.labels.join(':');
  if (!byLabelSet.has(k)) byLabelSet.set(k, []);
  byLabelSet.get(k).push(n);
}
cypher.push('// \u2500\u2500 Noder \u2500\u2500');
for (const [labelSet, list] of byLabelSet) {
  cypher.push(`// ${list.length} noder med label :${labelSet}`);
  for (const n of list) {
    cypher.push(`MERGE (n:${labelSet} {id: ${q(n.id)}}) SET ${cypherSet(n.props)};`);
  }
  cypher.push('');
}

cypher.push('// \u2500\u2500 Relationer \u2500\u2500');
const relsByType = new Map();
for (const r of model.rels) {
  if (!relsByType.has(r.type)) relsByType.set(r.type, []);
  relsByType.get(r.type).push(r);
}
for (const [type, list] of [...relsByType].sort((a, b) => a[0].localeCompare(b[0]))) {
  cypher.push(`// ${list.length} \u00d7 :${type}`);
  for (const r of list) {
    // Proveniens og evidensgrad følger kanten ind i databasen.
    const rp = [];
    if (r.props && r.props.source) rp.push(`r.kilde = ${q(r.props.source)}`);
    if (r.props && r.props.evidens) rp.push(`r.evidens = ${q(r.props.evidens)}`);
    const props = rp.length ? ` SET ${rp.join(', ')}` : '';
    cypher.push(
      `MATCH (a:${r.fromLabel} {id: ${q(r.fromId)}}), (b:${r.toLabel} {id: ${q(r.toId)}}) MERGE (a)-[r:${r.type}]->(b)${props};`,
    );
  }
  cypher.push('');
}
cypher.push('// \u2500\u2500 Kontrol \u2500\u2500');
cypher.push('// MATCH (n) RETURN labels(n) AS label, count(*) ORDER BY label;');
cypher.push('// MATCH ()-[r]->() RETURN type(r) AS type, count(*) ORDER BY type;');
fs.writeFileSync(path.join(OUT, 'filosofi.cypher'), cypher.join('\n') + '\n', 'utf8');

// ── 2) CSV (neo4j-admin database import) ────────────────────────────────────
const csvFiles = [];
csvFiles.push(writeCsv(
  'nodes_philosophers.csv',
  [':ID', 'id', 'da', 'en', 'born', 'died', 'wiki', ':LABEL'],
  model.philosophers.map((p) => [keyOf('Philosopher', p.id), p.id, p.da, p.en, p.born, p.died, p.wiki, 'Philosopher']),
));
csvFiles.push(writeCsv(
  'nodes_concepts.csv',
  // aar/aarKilde er tidslinjens placering af begrebet og skal med i begge
  // importveje (CSV såvel som Cypher), ellers ville de to importer give
  // hver sin graf.
  [':ID', 'id', 'da', 'en', 'kind', 'note', 'aar', 'aarKilde', ':LABEL'],
  model.concepts.map((c) => [
    keyOf('Concept', c.id), c.id, c.da, c.en, c.kind, c.note,
    c.aar === null || c.aar === undefined ? '' : c.aar, c.aarKilde || '',
    c.isTradition ? 'Concept;Tradition' : 'Concept',
  ]),
));
csvFiles.push(writeCsv(
  'nodes_artifacts.csv',
  [':ID', 'id', 'da', 'type', 'year', 'en', 'note', ':LABEL'],
  model.artifacts.map((a) => [keyOf('Artifact', a.id), a.id, a.da, a.type, a.year, a.en, a.note, `Artifact;${ARTIFACT_LABELS[a.type] || 'Artifact'}`]),
));
csvFiles.push(writeCsv(
  'nodes_eras.csv',
  [':ID', 'id', 'da', 'en', 'start', 'end', 'order', 'note', ':LABEL'],
  model.eras.map((e) => [keyOf('Era', e.id), e.id, e.da, e.en, e.start, e.end, e.order, e.note, 'Era']),
));
csvFiles.push(writeCsv(
  'rels.csv',
  [':START_ID', ':END_ID', ':TYPE', 'kilde', 'evidens'],
  model.rels.map((r) => [
    keyOf(r.fromLabel, r.fromId), keyOf(r.toLabel, r.toId), r.type,
    (r.props && r.props.source) || '', (r.props && r.props.evidens) || '',
  ]),
));

// ── 3) JSON ─────────────────────────────────────────────────────────────────
// 3D-layout bages ind, så viseren er deterministisk og ikke skal simulere.
const { positions, metrics: layoutMetrics } = computeLayout(model);

// Billedmanifest fra scripts/images.js (valgfrit – viseren falder tilbage
// på genererede planeter for noder uden billede).
const IMGMANIFEST = path.join(OUT, 'images.json');
const imageManifest = fs.existsSync(IMGMANIFEST)
  ? JSON.parse(fs.readFileSync(IMGMANIFEST, 'utf8'))
  : {};
const medBillede = nodes.filter((n) => imageManifest[n.key]).length;

// Årstal til tidslinjen: filosoffer og artefakter har deres eget, begreberne et
// afledt (model.js), epokerne deres spænd. `aarKilde` siger hvilken vej et
// afledt årstal kom fra, så viseren kan vise det.
const aarFor = (n) => {
  const p = n.props || {};
  if (typeof p.born === 'number') return { aar: p.born, slut: p.died };
  if (typeof p.year === 'number') return { aar: p.year, slut: p.year };
  if (typeof p.aar === 'number') return { aar: p.aar, slut: p.aar };
  if (typeof p.start === 'number') return { aar: p.start, slut: p.end };
  return { aar: null, slut: null };
};

const jsonNodes = nodes.map((n) => {
  const pos = positions.get(n.key) || { x: 0, y: 0, z: 0 };
  const img = imageManifest[n.key];
  const { aar, slut } = aarFor(n);
  return {
    ...n.props,
    id: n.key,
    ren: n.id,
    navn: n.name,
    labels: n.labels.join(';'),
    gruppe: n.group,
    undertype: n.subtype || '',
    epoke: n.era || '',
    x: pos.x, y: pos.y, z: pos.z,
    billede: img ? img.fil : '',
    billedeTitel: img ? img.titel : '',
    aar,
    aarSlut: typeof slut === 'number' ? slut : aar,
    aarKilde: (n.props && n.props.aarKilde) || '',
  };
});
const jsonLinks = model.rels.map((r) => ({
  kilde: keyOf(r.fromLabel, r.fromId),
  maal: keyOf(r.toLabel, r.toId),
  type: r.type,
  // Proveniens: hvilket opslagsværk eller hvilken artikel kanten bygger på.
  kildeURL: (r.props && r.props.source) || '',
  // Evidensgrad: belagt | afledt | slaegtskab | katalog (se meta.evidens).
  evidens: (r.props && r.props.evidens) || '',
}));
const graph = {
  meta: {
    titel: 'Filsofografen',
    genereret: new Date().toISOString(),
    filosoffer: stats.philosophers,
    begreber: stats.concepts + stats.traditions,
    artefakter: stats.artifacts,
    epoker: stats.eras,
    relationer: stats.relations,
    relationstyper: stats.byType,
    // Evidensgraderne med forklaring, så viseren kan vise dem og filtrere efter
    // dem uden at skulle kende dem på forhånd.
    evidens: EVIDENS,
    evidensFordeling: stats.byEvidens,
    // Tidslinjens udstrækning og hvad begrebernes afledte årstal bygger på.
    tidslinje: stats.tidslinje,
    artefakttyper: stats.artifactsByType,
    artefaktTypeDa: ARTIFACT_TYPE_DA,
    medBillede,
    layout: layoutMetrics,
  },
  nodes: jsonNodes,
  links: jsonLinks,
};
fs.writeFileSync(path.join(OUT, 'filosofi.json'), JSON.stringify(graph, null, 1), 'utf8');

// ── 4) Offline HTML-viser ───────────────────────────────────────────────────
const payload = JSON.stringify(graph).replace(/</g, '\\u003c');
const tpl = fs.readFileSync(TEMPLATE, 'utf8');
if (!tpl.includes('__FILOSOFI_DATA__')) throw new Error('viewer.html mangler __FILOSOFI_DATA__-pladsholderen.');
fs.writeFileSync(path.join(OUT, 'index.html'), tpl.replace('__FILOSOFI_DATA__', () => payload), 'utf8');

// ── Rapport ─────────────────────────────────────────────────────────────────
console.log('\nBygget:');
console.log(`  build/filosofi.cypher   ${cypher.length} linjer`);
console.log(`  build/filosofi.json     ${jsonNodes.length} noder, ${jsonLinks.length} relationer`);
console.log(`  billeder                ${medBillede}/${jsonNodes.length} noder har et rigtigt billede`);
console.log(`  evidens p\u00e5 kanterne     ${EVIDENS.map((e) => `${stats.byEvidens[e.id]} ${e.kort}`).join(' \u00b7 ')}`);
console.log(`  tidslinje               ${stats.tidslinje.antal} noder fra ${stats.tidslinje.min} til ${stats.tidslinje.max}` +
  ` (${stats.tidslinje.udenAar} uden eget årstal)`);console.log(`  3D-layout               udstraekning ${layoutMetrics.udstraekning}, ` +
  `mindste afstand ${layoutMetrics.mindsteAfstand}, gennemsnitlig kant ${layoutMetrics.gennemsnitligKantlaengde}`);
console.log(`  build/index.html        offline viser`);
console.log(`  build/csv/              ${csvFiles.join(', ')}`);
console.log(`\nStatistik: ${stats.philosophers} filosoffer \u00b7 ${stats.concepts} begreber \u00b7 ${stats.traditions} traditioner \u00b7 ` +
  `${stats.artifacts} artefakter \u00b7 ${stats.relations} relationer\n`);
