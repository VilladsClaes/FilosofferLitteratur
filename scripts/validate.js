#!/usr/bin/env node
/** Validerer datamodellerne og rapporterer grafenes dækning. */
import { buildModel, ARTIFACT_TYPE_DA, EVIDENS } from './model.js';

const { errors, warnings, stats, model } = buildModel();

console.log('\n══ Filsofografen – datavalidering ══\n');
console.log(`Filosoffer:   ${stats.philosophers}`);
console.log(`Begreber:     ${stats.concepts}  (+ ${stats.traditions} traditioner = ${stats.concepts + stats.traditions} begrebsnoder)`);
console.log(`Artefakter:   ${stats.artifacts}`);
console.log(`Epoker:       ${stats.eras}`);
console.log(`Relationer:   ${stats.relations}`);
console.log('\nRelationstyper:');
for (const [type, n] of Object.entries(stats.byType).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${type.padEnd(14)} ${n}`);
}
console.log('\nTidslinje:');
console.log(`  Noder med årstal: ${stats.tidslinje.antal} (${stats.tidslinje.min} → ${stats.tidslinje.max}), uden eget årstal: ${stats.tidslinje.udenAar}`);
console.log(`  Begrebernes afledte årstal – efter værk: ${stats.tidslinje.begreberEfter.værk}, ` +
  `efter fænomen: ${stats.tidslinje.begreberEfter.fænomen}, efter tænker: ${stats.tidslinje.begreberEfter.tænker}, ` +
  `ikke placerbare: ${stats.tidslinje.begreberEfter.ingen}`);

console.log('\nEvidensgrader:');
for (const e of EVIDENS) console.log(`  ${e.da.padEnd(18)} ${stats.byEvidens[e.id]}`);

console.log('\nArtefakttyper:');
for (const [type, n] of Object.entries(stats.artifactsByType).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${(ARTIFACT_TYPE_DA[type] || type).padEnd(22)} ${n}`);
}

// Dækningskrav: hvert begreb skal kunne følges til mindst én artefakt.
const uncovered = model.concepts.filter(
  (c) => !model.rels.some((r) => r.fromLabel === 'Concept' && r.fromId === c.id && r.toLabel === 'Artifact'),
);
console.log(`\nBegreber uden forbindelse til en artefakt: ${uncovered.length}`);

console.log(`\nFejl:     ${errors.length}`);
console.log(`Advarsler: ${warnings.length}`);
for (const e of errors) console.log(`  ✗ ${e}`);
for (const w of warnings) console.log(`  ! ${w}`);

if (errors.length) {
  console.error('\nDatavalidering FEJLEDE.\n');
  process.exit(1);
}
console.log('\nDatavalidering OK.\n');
