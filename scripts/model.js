/**
 * Samler data/modulerne til én normaliseret grafmodel og validerer alle
 * referencer. Bruges af både scripts/validate.js og scripts/build.js.
 */
import { eras } from '../data/eras.js';
import { traditions } from '../data/traditions.js';
import { artifacts } from '../data/artifacts.js';
import { concepts } from '../data/concepts.js';
import { philosophers } from '../data/philosophers.js';

/** Artefakt-type → Neo4j-label */
export const ARTIFACT_LABELS = {
  Book: 'Book', Text: 'Text', Poem: 'Poem', Film: 'Film', TVSeries: 'TVSeries',
  Building: 'Building', Institution: 'Institution', Ideology: 'Ideology',
  State: 'State', Party: 'Party', Revolution: 'Revolution', Movement: 'Movement',
  MoralCode: 'MoralCode', Pedagogy: 'Pedagogy', Legislation: 'Legislation',
  Constitution: 'Constitution', Artwork: 'Artwork', ScientificTheory: 'ScientificTheory',
  Religion: 'Religion', Technology: 'Technology', Event: 'Event', Practice: 'Practice',
};

/** Dansk visningsnavn for artefakt-typer */
export const ARTIFACT_TYPE_DA = {
  Book: 'Bog', Text: 'Tekst', Poem: 'Digt', Film: 'Film', TVSeries: 'TV-serie',
  Building: 'Bygning', Institution: 'Institution', Ideology: 'Ideologi',
  State: 'Stat', Party: 'Parti', Revolution: 'Revolution', Movement: 'Bevægelse',
  MoralCode: 'Moralkodeks', Pedagogy: 'Pædagogik', Legislation: 'Lovgivning',
  Constitution: 'Forfatning', Artwork: 'Kunstværk', ScientificTheory: 'Videnskabelig teori',
  Religion: 'Religion', Technology: 'Teknologi', Event: 'Begivenhed', Practice: 'Praksis',
};

/**
 * Evidensgrader: hvor godt en kant er belagt.
 *
 * Graderne er ikke en vurdering af, om forbindelsen er "sand", men af hvad
 * kanten bygger på. En kant om at filosoffen *skrev* et værk er en optegnelse;
 * en kant om at et begreb *gav ophav til* en institution er en historisk
 * påstand, og den bør kunne efterprøves.
 */
export const EVIDENS = [
  {
    id: 'belagt', da: 'Belagt med kilde', kort: 'belagt',
    forklaring: 'Kanten bærer en kilde, der belægger netop denne forbindelse.',
  },
  {
    id: 'afledt', da: 'Afledt netværk', kort: 'afledt',
    forklaring: 'Påvirkningen er udledt af et fælles netværk (Wikipedia-lister via Raper 2012), ikke af en kilde på den enkelte kant.',
  },
  {
    id: 'slaegtskab', da: 'Bredt slægtskab', kort: 'slægtskab',
    forklaring: 'Idehistorisk forbindelse uden en kilde, der belægger netop denne kant.',
  },
  {
    id: 'katalog', da: 'Katalogfaktum', kort: 'katalog',
    forklaring: 'Optegnelse over hvem der skrev, grundlagde, kritiserede eller levede hvornår – ikke en påstand om indflydelse.',
  },
];
export const EVIDENS_ID = new Set(EVIDENS.map((e) => e.id));

/**
 * Standardgrad pr. relationstype. En kanprops kilde overstyrer den: bærer
 * kanten en URL, er forbindelsen belagt, uanset type.
 */
const EVIDENS_REGLER = {
  // Optegnelser om noden selv – ingen påstand om indflydelse.
  LIVED_IN: 'katalog', FOLLOWS: 'katalog', AUTHORED: 'katalog', CREATED: 'katalog',
  INVENTED: 'katalog', DEVELOPED: 'katalog', REVISED: 'katalog', CRITIQUED: 'katalog',
  FOUNDED: 'katalog', MEMBER_OF: 'katalog', CENTRAL_IN: 'katalog', EXPRESSED_IN: 'katalog',
  // Tænker → tænker: hele netværket deler én maskinelt udledt proveniens.
  INFLUENCED: 'afledt',
  // Årsagskrav, der hviler på en faglig vurdering indtil en kilde belægger dem.
  GAVE_RISE_TO: 'slaegtskab', DEVELOPS_FROM: 'slaegtskab',
};

/** Kantens evidensgrad: en URL-kilde slår typeforskriften. */
export function evidensFor(type, props = {}) {
  if (/^https?:\/\//.test(props.source || '')) return 'belagt';
  return EVIDENS_REGLER[type] || 'slaegtskab';
}

/** Traditionernes gruppe → epoke-id */
const TRADITION_ERA = {
  'Antikken': 'antikken',
  'Middelalderen': 'middelalderen',
  'Renæssancen': 'renaessancen',
  'Oplysningen': 'oplysningen',
  'Tysk idealisme': 'tysk-idealisme',
  '1800-tallet': '1800-tallet',
  'Tidligt 1900-tal': 'tidligt-1900-tal',
  'Midt-1900-tal': 'midt-1900-tal',
  'Sen 1900-tal og nutid': 'sen-1900-tal-og-nutid',
  'Klassisk Kina': 'klassisk-kina',
};

/** Artefakter som filosoffen har skrevet (vs. skabt/grundlagt) */
const TEXTUAL = new Set(['Book', 'Text', 'Poem']);

export function buildModel() {
  const errors = [];
  const warnings = [];

  // ── Normalisering ────────────────────────────────────────────────────────
  const eraById = new Map(eras.map((e) => [e.id, { ...e, label: 'Era' }]));
  const artifactById = new Map(artifacts.map((a) => [a.id, a]));
  const philosopherById = new Map(philosophers.map((p) => [p.id, p]));

  // Traditioner bliver til begreber med ekstra-label
  const allConcepts = [
    ...concepts.map((c) => ({ ...c, isTradition: false })),
    ...traditions.map((t) => ({
      id: t.id,
      da: t.da,
      en: t.en,
      kind: t.kind,
      note: t.note,
      in: t.in || [],
      out: t.out || [],
      kilder: t.kilder || null,
      developsFrom: t.developsFrom || null,
      isTradition: true,
      era: TRADITION_ERA[t.group] || null,
    })),
  ];
  const conceptById = new Map();
  for (const c of allConcepts) {
    if (conceptById.has(c.id)) {
      errors.push(`Dubleret begrebs-id: "${c.id}" findes både som begreb og tradition.`);
    }
    conceptById.set(c.id, c);
  }

  // ── Dublerede id'er inden for samme nodefamilie ──────────────────────────
  const dupCheck = (list, label) => {
    const seen = new Set();
    for (const item of list) {
      if (seen.has(item.id)) errors.push(`Dubleret ${label}-id: "${item.id}".`);
      seen.add(item.id);
    }
  };
  dupCheck(eras, 'era');
  dupCheck(artifacts, 'artefakt');
  dupCheck(philosophers, 'filosof');

  // ── Referencetjek ────────────────────────────────────────────────────────
  const needConcept = (cid, ctx) => {
    if (!conceptById.has(cid)) {
      errors.push(`${ctx}: ukendt begreb "${cid}".`);
      return false;
    }
    return true;
  };
  const needArtifact = (aid, ctx) => {
    if (!artifactById.has(aid)) {
      errors.push(`${ctx}: ukendt artefakt "${aid}".`);
      return false;
    }
    return true;
  };

  for (const c of allConcepts) {
    const ctx = `Begreb "${c.id}"`;
    for (const a of [...(c.in || []), ...(c.out || [])]) needArtifact(a, ctx);
    if (c.developsFrom) needConcept(c.developsFrom, ctx);
    if (c.isTradition && c.era && !eraById.has(c.era)) {
      errors.push(`${ctx}: ukendt epoke "${c.era}".`);
    }
  }

  for (const p of philosophers) {
    const ctx = `Filosof "${p.id}"`;
    if (!eraById.has(p.era)) errors.push(`${ctx}: ukendt epoke "${p.era}".`);
    for (const c of [...p.invented, ...p.developed, ...p.revised, ...p.critiqued, ...p.founded, ...p.member]) {
      needConcept(c, ctx);
    }
    for (const other of p.influencedBy) {
      if (!philosopherById.has(other)) errors.push(`${ctx}: ukendt påvirkningskilde "${other}".`);
      if (other === p.id) errors.push(`${ctx}: påvirker sig selv.`);
    }
    for (const w of p.works) needArtifact(w, ctx);
    if (typeof p.born !== 'number' || typeof p.died !== 'number') {
      errors.push(`${ctx}: mangler født/død-årstal.`);
    } else if (p.died < p.born) {
      errors.push(`${ctx}: dødsår før fødselsår.`);
    }
  }

  // ── Kanter ───────────────────────────────────────────────────────────────
  const E = { nodes: {}, rels: [] };
  // Hver kant får sin evidensgrad med fra begyndelsen, så graderingen er den
  // samme i Cypher, CSV, JSON og viseren – og kan kontrolleres maskinelt.
  const rel = (type, fromLabel, fromId, toLabel, toId, props = {}) =>
    E.rels.push({
      type, fromLabel, fromId, toLabel, toId,
      props: { ...props, evidens: evidensFor(type, props) },
    });

  // Epoker i kronologisk kæde
  const sortedEras = [...eras].sort((a, b) => a.order - b.order);
  for (let i = 1; i < sortedEras.length; i += 1) {
    rel('FOLLOWS', 'Era', sortedEras[i - 1].id, 'Era', sortedEras[i].id);
  }

  // Filosof → begreb
  const CONCEPT_REL = {
    invented: 'INVENTED', developed: 'DEVELOPED', revised: 'REVISED',
    critiqued: 'CRITIQUED', founded: 'FOUNDED', member: 'MEMBER_OF',
  };
  for (const p of philosophers) {
    rel('LIVED_IN', 'Philosopher', p.id, 'Era', p.era);
    for (const [field, type] of Object.entries(CONCEPT_REL)) {
      for (const c of p[field]) rel(type, 'Philosopher', p.id, 'Concept', c);
    }
    // Raper-grafens kerne: "influenced by" vendes, så kanten løber fra
    // den påvirkende til den påvirkede.
    for (const other of p.influencedBy) {
      rel('INFLUENCED', 'Philosopher', other, 'Philosopher', p.id, { source: 'Wikipedia/Afledt af Raper 2012' });
    }
    for (const w of p.works) {
      const art = artifactById.get(w);
      if (!art) continue;
      rel(TEXTUAL.has(art.type) ? 'AUTHORED' : 'CREATED', 'Philosopher', p.id, 'Artifact', w);
    }
  }

  // Begreb → artefakt. c.kilder giver kanten sin kilde, så en påstand om
  // indflydelse kan følges tilbage til opslagsværket eller artiklen.
  for (const c of allConcepts) {
    const kilder = c.kilder || {};
    const medKilde = (aid) => (kilder[aid] ? { source: kilder[aid] } : {});
    for (const a of c.in || []) {
      if (artifactById.has(a)) rel('EXPRESSED_IN', 'Concept', c.id, 'Artifact', a, medKilde(a));
    }
    for (const a of c.out || []) {
      if (artifactById.has(a)) rel('GAVE_RISE_TO', 'Concept', c.id, 'Artifact', a, medKilde(a));
    }
    if (c.developsFrom && conceptById.has(c.developsFrom)) {
      rel('DEVELOPS_FROM', 'Concept', c.id, 'Concept', c.developsFrom);
    }
    if (c.isTradition && c.era) rel('CENTRAL_IN', 'Concept', c.id, 'Era', c.era);
  }

  // ── Årstal til tidslinjen ────────────────────────────────────────────────
  // Filosoffer (født/død) og artefakter (år) har deres eget årstal. Begreber
  // har ikke, så de får et *afledt* årstal – og vejen dertil gemmes, så
  // tidslinjen kan sige hvad placeringen hviler på i stedet for at gætte i det
  // skjulte. Rækkefølgen er: det tidligste værk begrebet er udtrykt i, ellers
  // det tidligste fænomen det gav ophav til, ellers den tidligste tænker bag.
  const artefaktAar = (aid) => {
    const a = artifactById.get(aid);
    return a && typeof a.year === 'number' ? a.year : null;
  };
  const tidligste = (aar) => {
    const brugbare = aar.filter((y) => typeof y === 'number');
    return brugbare.length ? Math.min(...brugbare) : null;
  };
  const tænkerAar = new Map();
  for (const r of E.rels) {
    if (r.fromLabel !== 'Philosopher' || r.toLabel !== 'Concept') continue;
    const p = philosopherById.get(r.fromId);
    if (!p) continue;
    if (!tænkerAar.has(r.toId)) tænkerAar.set(r.toId, []);
    tænkerAar.get(r.toId).push(p.born);
  }
  for (const c of allConcepts) {
    const iVærk = tidligste((c.in || []).map(artefaktAar));
    const iFænomen = tidligste((c.out || []).map(artefaktAar));
    const hosTænker = tidligste(tænkerAar.get(c.id) || []);
    if (iVærk !== null) { c.aar = iVærk; c.aarKilde = 'værk'; }
    else if (iFænomen !== null) { c.aar = iFænomen; c.aarKilde = 'fænomen'; }
    else if (hosTænker !== null) { c.aar = hosTænker; c.aarKilde = 'tænker'; }
    else { c.aar = null; c.aarKilde = null; }
  }

  // Tidslinjens udstrækning og hvad der ikke kunne placeres.
  const aarspor = [
    ...philosophers.map((p) => ({ gruppe: 'filosof', aar: p.born, slut: p.died })),
    ...allConcepts.map((c) => ({ gruppe: 'begreb', aar: c.aar, slut: c.aar })),
    ...artifacts.map((a) => ({ gruppe: 'artefakt', aar: a.year, slut: a.year })),
  ];
  const placeret = aarspor.filter((x) => typeof x.aar === 'number');
  const tidslinje = {
    min: Math.min(...placeret.map((x) => x.aar)),
    max: Math.max(...placeret.map((x) => (typeof x.slut === 'number' ? Math.max(x.aar, x.slut) : x.aar))),
    antal: placeret.length,
    udenAar: aarspor.length - placeret.length,
    // Hvad de afledte årstal bygger på, fordelt på begreberne.
    begreberEfter: {
      værk: allConcepts.filter((c) => c.aarKilde === 'værk').length,
      fænomen: allConcepts.filter((c) => c.aarKilde === 'fænomen').length,
      tænker: allConcepts.filter((c) => c.aarKilde === 'tænker').length,
      ingen: allConcepts.filter((c) => c.aarKilde === null).length,
    },
  };

  // ── Advarsler af faglig karakter ─────────────────────────────────────────
  const orphanConcepts = allConcepts.filter((c) => (c.in || []).length + (c.out || []).length === 0);
  for (const c of orphanConcepts) {
    errors.push(`Begreb "${c.id}" er ikke forbundet med nogen artefakt.`);
  }
  for (const a of artifacts) {
    const used = E.rels.some((r) => r.toId === a.id && r.toLabel === 'Artifact');
    if (!used) warnings.push(`Artefakt "${a.id}" (${a.da}) er ikke forbundet til noget begreb eller nogen filosof.`);
  }
  const ANCHOR = ['INVENTED', 'DEVELOPED', 'REVISED', 'FOUNDED', 'MEMBER_OF'];
  for (const c of allConcepts) {
    if (!E.rels.some((r) => r.toId === c.id && r.toLabel === 'Concept' && ANCHOR.includes(r.type))) {
      warnings.push(`Begreb "${c.id}" (${c.da}) er ikke knyttet til nogen tænker.`);
    }
  }

  const model = {
    eras: sortedEras,
    concepts: allConcepts,
    artifacts,
    philosophers,
    rels: E.rels,
  };

  const stats = {
    philosophers: philosophers.length,
    concepts: concepts.length,
    traditions: traditions.length,
    artifacts: artifacts.length,
    eras: eras.length,
    relations: E.rels.length,
    byType: E.rels.reduce((acc, r) => ({ ...acc, [r.type]: (acc[r.type] || 0) + 1 }), {}),
    artifactsByType: artifacts.reduce((acc, a) => ({ ...acc, [a.type]: (acc[a.type] || 0) + 1 }), {}),
    // Alle fire grader står med, også hvis en af dem ikke er i brug.
    tidslinje,
    byEvidens: E.rels.reduce(
      (acc, r) => ({ ...acc, [r.props.evidens]: (acc[r.props.evidens] || 0) + 1 }),
      Object.fromEntries(EVIDENS.map((e) => [e.id, 0])),
    ),
    inventedConcepts: concepts.length + traditions.length,
  };

  return { model, errors, warnings, stats };
}
