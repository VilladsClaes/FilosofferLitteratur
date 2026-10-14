/**
 * Traditioner: skoler, strømninger og retninger.
 *
 * Disse bliver i build.js slået sammen med begreberne til ÉN nodefamilie
 * (:Concept:Tradition), sådan at "stoicisme" både er det begreb filosoffer
 * grundlægger/tilhører, og den tradition begreber er centrale for.
 *
 * `in`  = artefakter begrebet er udtrykt i (typisk grundteksten)
 * `out` = artefakter begrebet har givet ophav til
 * `developsFrom` = id på den tradition/ traditionelle begreb den udspringer af
 * `kilder`       = { artefaktId: 'URL' }, gemmes som r.kilde på kanten i grafen
 */
import { KILDER } from './concepts.js';

export const traditions = [
  { id: 'ionisk-naturfilosofi', da: 'Ionisk naturfilosofi', en: 'Ionian natural philosophy', kind: 'skole', group: 'Antikken', note: 'Milet-skolen: Thales, Anaximander, Anaximenes.', in: ['thales-fragmenter'], out: ['de-fire-elementer', 'atomteorien'] },
  { id: 'pythagoraeisme', da: 'Pythagoræisme', en: 'Pythagoreanism', kind: 'skole', group: 'Antikken', note: 'Tal, harmoni og sjælevandring som religiøst-matematisk program.', in: ['pythagoras-skolen'], out: ['platon-timaios'] },
  { id: 'eleatisk-skole', da: 'Den eleatiske skole', en: 'Eleatic school', kind: 'skole', group: 'Antikken', note: 'Parmenides og Zenon: væren er én og uforanderlig.', in: ['parmenides-digte'], out: ['aristoteles-metafysik'] },
  { id: 'sofisme', da: 'Sofismen', en: 'Sophism', kind: 'strømning', group: 'Antikken', note: 'Protagoras og Gorgias: retorik, relativisme og betalt undervisning.', in: ['protagoras-fragmenter'], out: ['retorik-som-fag'] },
  { id: 'atomisme', da: 'Atomisme', en: 'Atomism', kind: 'doktrin', group: 'Antikken', note: 'Leukippos og Demokrit: virkeligheden består af atomer og tomrum.', in: ['demokrit-fragmenter', 'lucretius-de-rerum-natura'], out: ['atomteorien'] },
  { id: 'kynisme', da: 'Kynismen', en: 'Cynicism', kind: 'skole', group: 'Antikken', note: 'Diogenes: dyd er selvtilstrækkelighed og frigørelse fra konventioner.', in: ['diogenes-fragmenter'], out: ['epikurs-have'] },
  { id: 'platonisme', da: 'Platonismen', en: 'Platonism', kind: 'skole', group: 'Antikken', note: 'Akademiet og læren om formerne.', in: ['platon-politeia'], out: ['platon-akademiet', 'the-matrix'] },
  { id: 'nyplatonisme', da: 'Nyplatonismen', en: 'Neoplatonism', kind: 'skole', group: 'Antikken', note: 'Plotin: emanation fra det Ene.', developsFrom: 'platonisme', in: ['plotin-enneaderne'], out: ['kristendommen', 'sixtinske-kapel-skabelsen', 'dantes-guddommelige-komedie'] },
  { id: 'aristotelisme', da: 'Aristotelismen (den peripatetiske skole)', en: 'Aristotelianism', kind: 'skole', group: 'Antikken', note: 'Lykeion og den peripatetiske tradition.', in: ['aristoteles-metafysik'], out: ['averroes-kommentarer', 'aquinas-summa-theologica'] },
  { id: 'epikuraeisme', da: 'Epikuræismen', en: 'Epicureanism', kind: 'skole', group: 'Antikken', note: '"Haven" i Athen: ataraxia gennem begærsbegrænsning.', in: ['epikurs-brev'], out: ['lucretius-de-rerum-natura'] },
  { id: 'stoicisme', da: 'Stoicismen', en: 'Stoicism', kind: 'skole', group: 'Antikken', note: 'Stoa Poikile: dyd, logos og accept af skæbnen.', in: ['epiktet-haandbogen', 'stoa-poikile'], out: ['romerretten', 'codex-justinianus', 'jediernes-kodeks', 'gladiator'] },
  { id: 'skepticisme', da: 'Skepticismen', en: 'Skepticism', kind: 'strømning', group: 'Antikken', note: 'Pyrrhon og Sextus: epoché og dommens tilbageholdenhed.', in: ['sextus-pyrrhonske-skitse'], out: ['hume-traktat'] },
  { id: 'eklekticisme', da: 'Eklekticismen', en: 'Eclecticism', kind: 'strømning', group: 'Antikken', note: 'Cicero: det bedste fra hver skole, formidlet på latin.', in: ['cicero-om-pligterne'], out: ['romerretten'] },

  { id: 'patristik', da: 'Patristikken', en: 'Patristics', kind: 'strømning', group: 'Middelalderen', note: 'Kirkefædrene: kristendom møder græsk filosofi.', in: ['augustin-bekendelser'], out: ['kristendommen', 'benediktinerreglen'] },
  { id: 'skolastik', da: 'Skolastikken', en: 'Scholasticism', kind: 'strømning', group: 'Middelalderen', note: 'Universiteterne i Paris, Oxford og Bologna.', in: ['aquinas-summa-theologica'], out: ['universitetet-i-paris', 'universitetet-i-bologna', 'oxford-universitet', 'dantes-guddommelige-komedie'] },
  { id: 'thomisme', da: 'Thomismen', en: 'Thomism', kind: 'skole', group: 'Middelalderen', note: 'Aquinas: aristotelisme i kristen form.', developsFrom: 'skolastik', in: ['aquinas-summa-theologica'], out: ['kanonisk-ret', 'se7en'] },
  { id: 'islamisk-filosofi', da: 'Islamisk filosofi (falsafa)', en: 'Islamic philosophy', kind: 'strømning', group: 'Middelalderen', note: 'Avicenna, al-Ghazali, Averroes: græsk filosofi på arabisk.', in: ['avicenna-al-shifa'], out: ['islam', 'islamisk-retstradition', 'al-azhar', 'sadras-transcendente-filosofi'] },
  { id: 'jodisk-filosofi', da: 'Jødisk filosofi', en: 'Jewish philosophy', kind: 'strømning', group: 'Middelalderen', note: 'Maimonides: fornuft og åbenbaring i dialog.', in: ['maimonides-dukvane'], out: ['maimonides-mishne-torah'] },
  { id: 'averroisme', da: 'Averroismen (latinsk aristotelisme)', en: 'Averroism', kind: 'skole', group: 'Middelalderen', note: 'Radikal aristotelisme ved Paris-universitetet.', developsFrom: 'islamisk-filosofi', in: ['averroes-tahafut-tahafut'], out: ['universitetet-i-paris'] },

  { id: 'humanisme', da: 'Humanismen', en: 'Humanism', kind: 'strømning', group: 'Renæssancen', note: 'Studia humanitatis og kilderne tilbage til græsk og latin.', in: ['erasmus-daarskabens-lovprisning'], out: ['david-michelangelo', 'more-utopia', 'dannelsesidealet'] },
  { id: 'rationalisme', da: 'Rationalismen', en: 'Rationalism', kind: 'retning', group: 'Renæssancen', note: 'Descartes, Spinoza, Leibniz: fornuften som kilde til viden.', in: ['descartes-meditationer'], out: ['kant-ren-fornuft', 'spinoza-etik'] },
  { id: 'empirisme', da: 'Empirismen', en: 'Empiricism', kind: 'retning', group: 'Renæssancen', note: 'Bacon, Locke, Berkeley, Hume: erfaringen som kilde til viden.', in: ['bacon-novum-organum', 'locke-forstand'], out: ['royal-society', 'locke-opdragelse'] },

  { id: 'oplysningsfilosofi', da: 'Oplysningsfilosofien', en: 'Enlightenment philosophy', kind: 'strømning', group: 'Oplysningen', note: 'Fornuftens offentlige brug mod fordomme og autoritet.', in: ['kant-hvad-er-oplysning'], out: ['diderot-encyclopedien', 'franske-rettighedserklaering', 'oplysningsbevaegelsen', 'folkeskolen', 'folkeskoleloven-1814'], kilder: { 'folkeskoleloven-1814': KILDER.folkeskole1814 } },
  { id: 'tysk-idealisme', da: 'Den tyske idealisme', en: 'German idealism', kind: 'retning', group: 'Tysk idealisme', note: 'Kant, Fichte, Schelling, Hegel: ånden som virkelighedens grund.', in: ['hegel-aandens-faenomenologi'], out: ['humboldt-universitetet', 'dannelsesidealet', 'romantikbevaegelsen'] },
  { id: 'romantik', da: 'Romantikken', en: 'Romanticism', kind: 'strømning', group: 'Tysk idealisme', note: 'Følelse, natur, ironi og det uendelige.', in: ['schleiermacher-om-religion', 'vandringsmanden-over-taagen'], out: ['transcendentalistklubben'] },

  { id: 'positivisme', da: 'Positivismen', en: 'Positivism', kind: 'retning', group: '1800-tallet', note: 'Comte: videnskaben erstatter metafysikken.', in: ['comte-positiv-filosofi'], out: ['sociologien', 'wienerkredsen'] },
  { id: 'eksistentialisme', da: 'Eksistentialismen', en: 'Existentialism', kind: 'strømning', group: '1800-tallet', note: 'Kierkegaard til Sartre: den enkeltes eksistens og valg.', in: ['sartre-vaeren-og-intethed', 'kierkegaard-enten-eller'], out: ['sartre-eksistentialisme-er-humanisme', 'waking-life'] },
  { id: 'marxisme', da: 'Marxismen', en: 'Marxism', kind: 'retning', group: '1800-tallet', note: 'Historisk materialisme som samfundskritik og politisk praksis.', in: ['kommunistiske-manifest', 'marx-kapitalen'], out: ['sovjetunionen', 'folkerepublikken-kina', 'fagbevaegelsen', 'socialdemokratiet', 'velfaerdsstaten', 'kubas-revolution'] },
  { id: 'anarkisme', da: 'Anarkismen', en: 'Anarchism', kind: 'retning', group: '1800-tallet', note: 'Proudhon, Bakunin, Kropotkin: afskaffelse af stat og autoritet.', in: ['proudhon-hvad-er-ejendom', 'bakunin-gud-og-staten'], out: ['den-forste-internationale', 'le-guin-moerket'] },
  { id: 'liberalisme', da: 'Liberalismen', en: 'Liberalism', kind: 'retning', group: 'Oplysningen', note: 'Lockes rettigheder, Smiths marked, Mills frihedsbegreb.', in: ['locke-styre', 'mill-om-friheden'], out: ['den-amerikanske-forfatning', 'den-danske-grundlov', 'borgerretsloven-1964'] },
  { id: 'konservatisme', da: 'Konservatismen', en: 'Conservatism', kind: 'retning', group: 'Oplysningen', note: 'Burke og de Maistre: tradition, organisk samfund og mistillid til fornuftsrevolutioner.', in: ['burke-refleksioner'], out: ['de-maistre-om-paven'] },
  { id: 'pragmatisme', da: 'Pragmatismen', en: 'Pragmatism', kind: 'retning', group: '1800-tallet', note: 'Peirce, James, Dewey: betydning og sandhed måles på virkning i praksis.', in: ['peirce-klare-ideer', 'james-pragmatismen'], out: ['dewey-demokrati-og-uddannelse', 'progressiv-paedagogik'] },
  { id: 'okonomisk-liberalisme', da: 'Klassisk økonomi', en: 'Classical economics', kind: 'retning', group: '1800-tallet', note: 'Smith og Ricardo: marked, arbejdsdeling og komparative fordele.', in: ['smith-nationernes-velstand'], out: ['ricardo-politisk-okonomi'] },
  { id: 'transcendentalisme', da: 'Transcendentalismen', en: 'Transcendentalism', kind: 'strømning', group: '1800-tallet', note: 'Emerson: selvtillid, natur og det over-individuelle.', in: ['emerson-nature'], out: ['transcendentalistklubben', 'emerson-selvtillid'] },

  { id: 'faenomenologi', da: 'Fænomenologien', en: 'Phenomenology', kind: 'retning', group: 'Tidligt 1900-tal', note: 'Husserl: tilbage til sagerne selv gennem beskrivelse af bevidstheden.', in: ['husserl-ideer'], out: ['heidegger-vaeren-og-tid', 'merleau-ponty-perceptionen'] },
  { id: 'hermeneutik', da: 'Hermeneutikken', en: 'Hermeneutics', kind: 'strømning', group: 'Tidligt 1900-tal', note: 'Forståelsens teori fra Schleiermacher over Dilthey til Gadamer.', in: ['gadamer-sandhed-og-metode'], out: ['dilthey-aandsvidenskaberne', 'ricoeur-tid-og-fortaelling'] },
  { id: 'analytisk-filosofi', da: 'Den analytiske filosofi', en: 'Analytic philosophy', kind: 'retning', group: 'Tidligt 1900-tal', note: 'Frege, Russell, Wittgenstein: sprog og logik som filosofiens metode.', in: ['frege-begriffsschrift'], out: ['principia-mathematica', 'wittgenstein-tractatus', 'wienerkredsen'] },
  { id: 'logisk-positivisme', da: 'Logisk positivisme', en: 'Logical positivism', kind: 'skole', group: 'Tidligt 1900-tal', note: 'Verifikationsprincippet og afvisningen af metafysik.', developsFrom: 'analytisk-filosofi', in: ['wienerkredsens-manifest'], out: ['wienerkredsen', 'ayer-sprog-sandhed-logik'] },
  { id: 'kontinental-filosofi', da: 'Den kontinentale filosofi', en: 'Continental philosophy', kind: 'retning', group: 'Tidligt 1900-tal', note: 'Tyskland og Frankrig: historie, erfaring, magt og fortolkning.', in: ['hegel-aandens-faenomenologi'], out: ['heidegger-vaeren-og-tid', 'frankfurterskolen'] },
  { id: 'kritisk-teori', da: 'Kritisk teori', en: 'Critical theory', kind: 'skole', group: 'Tidligt 1900-tal', note: 'Oplysningens dialektik, kulturindustri og emancipation.', developsFrom: 'marxisme', in: ['adorno-oplysningens-dialektik'], out: ['frankfurterskolen', 'marcuse-studentoproeet', 'hippiebevaegelsen'] },
  { id: 'vestlig-marxisme', da: 'Vestlig marxisme', en: 'Western Marxism', kind: 'retning', group: 'Tidligt 1900-tal', note: 'Gramsci, Lukács, Althusser: kultur, ideologi og stat.', developsFrom: 'marxisme', in: ['gramsci-faengselsnoter', 'lukacs-klassebevidsthed'], out: ['frankfurterskolen'] },
  { id: 'antroposofi', da: 'Antroposofien', en: 'Anthroposophy', kind: 'strømning', group: 'Tidligt 1900-tal', note: 'Steiner: åndsvidenskab, pædagogik og social tregrening.', in: ['antroposofisk-selskab'], out: ['waldorfpaedagogik', 'goetheanum'] },

  { id: 'videnskabsfilosofi', da: 'Videnskabsfilosofien', en: 'Philosophy of science', kind: 'strømning', group: 'Midt-1900-tal', note: 'Popper, Kuhn, Lakatos, Feyerabend: hvad er videnskabelig viden?', in: ['popper-logikken-i-forskningen'], out: ['kuhn-videnskabelige-revolutioner', 'feyerabend-mod-metoden'] },
  { id: 'ostrigsk-skole', da: 'Den østrigske skole', en: 'Austrian School', kind: 'skole', group: 'Midt-1900-tal', note: 'Mises og Hayek: praxeologi, spontan orden og klassisk liberalisme.', in: ['mises-menneskelig-handlen'], out: ['hayek-vejen-til-traeldom'] },
  { id: 'libertarianisme', da: 'Libertarianismen', en: 'Libertarianism', kind: 'retning', group: 'Midt-1900-tal', note: 'Rand, Rothbard, Nozick: selvbestemmelse og minimalstat.', developsFrom: 'liberalisme', in: ['nozick-anarki-stat-utopi', 'rand-atlas-shrugged'], out: ['rothbard-menneske-okonomi-stat', 'fountainhead-filmen'] },
  { id: 'kommunitarisme', da: 'Kommunitarismen', en: 'Communitarianism', kind: 'retning', group: 'Midt-1900-tal', note: 'MacIntyre og Taylor: fællesskab, tradition og det gode liv mod liberal proceduralisme.', in: ['macintyre-after-virtue'], out: ['taylor-selvets-kilder'] },

  { id: 'poststrukturalisme', da: 'Poststrukturalismen', en: 'Post-structuralism', kind: 'retning', group: 'Sen 1900-tal og nutid', note: 'Foucault, Derrida, Deleuze: sprog, magt, differens og decentrering.', developsFrom: 'kontinental-filosofi', in: ['derrida-grammatologien'], out: ['foucault-overvaagning-og-straf', 'butler-koenets-besvaer', 'deleuze-tusind-plateauer'] },
  { id: 'feministisk-filosofi', da: 'Feministisk filosofi', en: 'Feminist philosophy', kind: 'retning', group: 'Sen 1900-tal og nutid', note: 'de Beauvoir til Butler: køn som filosofisk problem.', in: ['beauvoir-det-andet-koen'], out: ['ligestillingsloven', 'me-too', 'butler-koenets-besvaer'] },

  { id: 'konfucianisme', da: 'Konfucianismen', en: 'Confucianism', kind: 'skole', group: 'Klassisk Kina', note: 'Dyd, ritualer, medmenneskelighed og det harmoniske samfund.', in: ['konfucius-analekterne'], out: ['konfuciansk-eksamensvaesen', 'filial-piety', 'den-gyldne-regel'] },
  { id: 'daoisme', da: 'Daoismen', en: 'Daoism', kind: 'skole', group: 'Klassisk Kina', note: 'Dao ("vejen"), wu wei og den naturlige harmoni.', in: ['laozi-daodejing'], out: ['zhuangzi', 'kinesisk-medicin', 'feng-shui', 'tai-chi', 'zenbuddhisme', 'daoismen-som-religion'] },
];
