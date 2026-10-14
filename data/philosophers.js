/**
 * Filosoffer fra oldtiden til i dag.
 *
 * P(id, dansk navn, engelsk navn, epoke, født, død, wikipedia, {…})
 *
 *   invented     begreber filosoffen har opfundet / grundlagt
 *   developed    begreber filosoffen har videreudviklet
 *   revised      begreber filosoffen har forandret / omarbejdet
 *   critiqued    begreber filosoffen har kritiseret
 *   founded      traditioner/skoler filosoffen har grundlagt
 *   member       traditioner filosoffen tilhører
 *   influencedBy filosoffer der har påvirket filosoffen (Raper-grafens "influenced by")
 *   works        bøger, bygninger, institutioner m.m. filosoffen har skabt
 */
const P = (id, da, en, era, born, died, wiki, o = {}) => ({
  id, da, en, era, born, died, wiki,
  invented: [], developed: [], revised: [], critiqued: [],
  founded: [], member: [], influencedBy: [], works: [],
  ...o,
});

export const philosophers = [
  // ═══════════════════════════════ ANTIKKEN ═══════════════════════════════
  P('thales', 'Thales fra Milet', 'Thales of Miletus', 'antikken', -624, -546, 'Thales_of_Miletus', {
    invented: ['naturfilosofi', 'vand-som-grundstof'],
    founded: ['ionisk-naturfilosofi'],
    works: ['thales-fragmenter'],
  }),
  P('pythagoras', 'Pythagoras', 'Pythagoras', 'antikken', -570, -495, 'Pythagoras', {
    invented: ['talfilosofi', 'matematisk-harmoni', 'sjaelens-vandring'],
    founded: ['pythagoraeisme'],
    works: ['pythagoras-skolen'],
  }),
  P('anaxagoras', 'Anaxagoras', 'Anaxagoras', 'antikken', -500, -428, 'Anaxagoras', {
    invented: ['nous', 'pluralisme'],
    member: ['ionisk-naturfilosofi'],
    works: ['anaxagoras-fragmenter'],
  }),
  P('heraklit', 'Heraklit', 'Heraclitus', 'antikken', -535, -475, 'Heraclitus', {
    invented: ['panta-rhei', 'logos', 'forandringens-filosofi'],
    works: ['heraklit-fragmenter'],
  }),
  P('parmenides', 'Parmenides', 'Parmenides', 'antikken', -515, -450, 'Parmenides', {
    invented: ['vaeren-uforanderlig', 'monisme'],
    founded: ['eleatisk-skole'],
    influencedBy: ['anaxagoras', 'heraklit'],
    works: ['parmenides-digte'],
  }),
  P('protagoras', 'Protagoras', 'Protagoras', 'antikken', -490, -420, 'Protagoras', {
    invented: ['relativisme', 'homo-mensura'],
    founded: ['sofisme'],
    influencedBy: ['heraklit'],
    works: ['protagoras-fragmenter'],
  }),
  P('demokrit', 'Demokrit', 'Democritus', 'antikken', -460, -370, 'Democritus', {
    invented: ['materialisme'],
    founded: ['atomisme'],
    influencedBy: ['anaxagoras'],
    works: ['demokrit-fragmenter'],
  }),
  P('sokrates', 'Sokrates', 'Socrates', 'antikken', -470, -399, 'Socrates', {
    invented: ['sokratisk-metode', 'mayeutik', 'etisk-intellektualisme'],
    influencedBy: ['parmenides', 'anaxagoras', 'protagoras'],
  }),
  P('platon', 'Platon', 'Plato', 'antikken', -427, -347, 'Plato', {
    invented: ['formernes-teori', 'hulelignelsen', 'idealismen'],
    founded: ['platonisme'],
    influencedBy: ['sokrates', 'pythagoras', 'heraklit', 'parmenides'],
    works: ['platon-politeia', 'platon-symposion', 'platon-faidon', 'platon-timaios', 'platon-akademiet'],
  }),
  P('aristoteles', 'Aristoteles', 'Aristotle', 'antikken', -384, -322, 'Aristotle', {
    invented: ['syllogismen', 'hylomorfisme', 'de-fire-aarsager', 'teleologi', 'dydsetik'],
    founded: ['aristotelisme'],
    influencedBy: ['platon'],
    critiqued: ['formernes-teori'],
    works: ['aristoteles-organon', 'aristoteles-metafysik', 'aristoteles-fysik', 'aristoteles-nikomacheiske-etik', 'aristoteles-politik', 'aristoteles-lykeion'],
  }),
  P('diogenes', 'Diogenes', 'Diogenes', 'antikken', -412, -323, 'Diogenes', {
    invented: ['asketisme', 'kynisk-naturlighed'],
    founded: ['kynisme'],
    influencedBy: ['sokrates'],
    works: ['diogenes-fragmenter'],
  }),
  P('epikur', 'Epikur', 'Epicurus', 'antikken', -341, -270, 'Epicurus', {
    invented: ['hedonisme', 'ataraxia'],
    founded: ['epikuraeisme'],
    developed: ['atomisme', 'materialisme'],
    influencedBy: ['demokrit'],
    works: ['epikurs-brev', 'epikurs-have'],
  }),
  P('zenon-af-kition', 'Zenon af Kition', 'Zeno of Citium', 'antikken', -334, -262, 'Zeno_of_Citium', {
    invented: ['dyd-er-det-eneste-gode'],
    founded: ['stoicisme'],
    influencedBy: ['sokrates', 'heraklit'],
  }),
  P('chrysippos', 'Chrysippos', 'Chrysippus', 'antikken', -279, -206, 'Chrysippus', {
    invented: ['stoisk-logik', 'determinisme'],
    member: ['stoicisme'],
    influencedBy: ['zenon-af-kition'],
    works: ['krisippos-fragmenter'],
  }),
  P('cicero', 'Cicero', 'Cicero', 'antikken', -106, -43, 'Cicero', {
    invented: ['naturret', 'retorisk-filosofi', 'humanitas'],
    founded: ['eklekticisme'],
    influencedBy: ['platon', 'aristoteles', 'zenon-af-kition'],
    works: ['cicero-om-pligterne', 'cicero-om-lovene'],
  }),
  P('seneca', 'Seneca', 'Seneca the Younger', 'antikken', -4, 65, 'Seneca_the_Younger', {
    invented: ['stoisk-livskunst'],
    developed: ['dydsetik'],
    member: ['stoicisme'],
    influencedBy: ['cicero', 'zenon-af-kition'],
    works: ['senecas-breve'],
  }),
  P('epiktet', 'Epiktet', 'Epictetus', 'antikken', 50, 135, 'Epictetus', {
    invented: ['indre-frihed', 'amor-fati'],
    member: ['stoicisme'],
    influencedBy: ['zenon-af-kition', 'seneca'],
    works: ['epiktet-haandbogen'],
  }),
  P('marcus-aurelius', 'Marcus Aurelius', 'Marcus Aurelius', 'antikken', 121, 180, 'Marcus_Aurelius', {
    invented: ['stoisk-selvdisciplin'],
    member: ['stoicisme'],
    influencedBy: ['epiktet'],
    works: ['marcus-aurelius-til-sig-selv'],
  }),
  P('sextus-empiricus', 'Sextus Empiricus', 'Sextus Empiricus', 'antikken', 160, 210, 'Sextus_Empiricus', {
    invented: ['epoche'],
    founded: ['skepticisme'],
    works: ['sextus-pyrrhonske-skitse'],
  }),
  P('plotin', 'Plotin', 'Plotinus', 'antikken', 204, 270, 'Plotinus', {
    invented: ['emanation', 'det-ene'],
    founded: ['nyplatonisme'],
    influencedBy: ['platon'],
    works: ['plotin-enneaderne'],
  }),

  // ══════════════════════ MIDDELALDEREN OG ISLAM ══════════════════════
  P('augustin', 'Augustin af Hippo', 'Augustine of Hippo', 'middelalderen', 354, 430, 'Augustine_of_Hippo', {
    invented: ['arvesynden', 'naadelaeren', 'fri-vilje', 'gudsstaten'],
    founded: ['patristik'],
    influencedBy: ['platon', 'plotin', 'cicero'],
    works: ['augustin-bekendelser', 'augustin-gudsstaten'],
  }),
  P('boethius', 'Boëthius', 'Boethius', 'middelalderen', 477, 524, 'Boethius', {
    invented: ['forsyn-og-skaebne', 'universaliestriden'],
    developed: ['aristotelisme', 'nyplatonisme'],
    influencedBy: ['aristoteles', 'plotin', 'augustin'],
    works: ['boethius-troest'],
  }),
  P('avicenna', 'Avicenna (Ibn Sina)', 'Avicenna', 'middelalderen', 980, 1037, 'Avicenna', {
    invented: ['nodvendig-eksistens', 'essens-og-eksistens', 'det-flyvende-menneske'],
    founded: ['islamisk-filosofi'],
    influencedBy: ['aristoteles'],
    works: ['avicenna-al-shifa', 'avicenna-kanon'],
  }),
  P('al-ghazali', 'Al-Ghazali', 'Al-Ghazali', 'middelalderen', 1058, 1111, 'Al-Ghazali', {
    invented: ['okkasionalisme', 'sufisme'],
    member: ['islamisk-filosofi'],
    influencedBy: ['avicenna'],
    critiqued: ['aristotelisme'],
    works: ['al-ghazali-tahafut'],
  }),
  P('abelard', 'Peter Abelard', 'Peter Abelard', 'middelalderen', 1079, 1142, 'Peter_Abelard', {
    invented: ['konceptualisme', 'dialektisk-metode'],
    founded: ['skolastik'],
    influencedBy: ['boethius'],
    works: ['abelard-sic-et-non'],
  }),
  P('averroes', 'Averroes (Ibn Rushd)', 'Averroes', 'middelalderen', 1126, 1198, 'Averroes', {
    invented: ['dobbelt-sandhed'],
    founded: ['averroisme'],
    developed: ['aristotelisme'],
    member: ['islamisk-filosofi'],
    influencedBy: ['aristoteles', 'avicenna'],
    critiqued: ['okkasionalisme'],
    works: ['averroes-tahafut-tahafut', 'averroes-kommentarer'],
  }),
  P('maimonides', 'Maimonides', 'Maimonides', 'middelalderen', 1138, 1204, 'Maimonides', {
    invented: ['negativ-teologi', 'fornuft-og-aabenbaring'],
    founded: ['jodisk-filosofi'],
    influencedBy: ['aristoteles', 'averroes', 'avicenna'],
    works: ['maimonides-dukvane', 'maimonides-mishne-torah'],
  }),
  P('aquinas', 'Thomas Aquinas', 'Thomas Aquinas', 'middelalderen', 1225, 1274, 'Thomas_Aquinas', {
    invented: ['de-fem-gudsbeviser'],
    revised: ['aristotelisme'],
    developed: ['naturret', 'hylomorfisme', 'dydsetik'],
    founded: ['thomisme'],
    influencedBy: ['aristoteles', 'augustin', 'avicenna', 'maimonides'],
    works: ['aquinas-summa-theologica', 'aquinas-summa-contra-gentiles'],
  }),
  P('duns-scotus', 'Duns Scotus', 'Duns Scotus', 'middelalderen', 1266, 1308, 'Duns_Scotus', {
    invented: ['voluntarisme', 'haecceitas'],
    member: ['skolastik'],
    influencedBy: ['aristoteles', 'augustin'],
    works: ['duns-scotus-ordinatio'],
  }),
  P('ockham', 'William af Ockham', 'William of Ockham', 'middelalderen', 1287, 1347, 'William_of_Ockham', {
    invented: ['nominalisme', 'ockhams-ragekniv'],
    member: ['skolastik'],
    influencedBy: ['duns-scotus'],
    works: ['ockham-summa-logicae'],
  }),
  P('tabatabai', 'Muhammad Husayn Tabataba\'i', 'Muhammad Husayn Tabataba\'i', 'middelalderen', 1892, 1981, 'Muhammad_Husayn_Tabataba%27i', {
    invented: ['transcendent-filosofi', 'koranfortolkning'],
    member: ['islamisk-filosofi'],
    influencedBy: ['avicenna', 'maimonides'],
    works: ['al-mizan', 'sadras-transcendente-filosofi'],
  }),

  // ═════════════════════ RENÆSSANCE OG TIDLIG MODERNE ═════════════════════
  P('grotius', 'Hugo Grotius', 'Hugo Grotius', 'renaessancen', 1583, 1645, 'Hugo_Grotius', {
    // Folkerettens grundlægger: han tog naturretten ud af teologien og gjorde
    // den til en ret mellem stater, og skrev imod de opdelte verdenshave.
    invented: ['havets-frihed'],
    developed: ['naturret'],
    influencedBy: ['cicero', 'aquinas'],
    works: ['grotius-krigens-ret', 'grotius-mare-liberum'],
  }),
  P('erasmus', 'Erasmus af Rotterdam', 'Erasmus', 'renaessancen', 1466, 1536, 'Erasmus', {
    invented: ['tekstfilologi', 'kristen-reformisme'],
    founded: ['humanisme'],
    influencedBy: ['cicero', 'augustin'],
    works: ['erasmus-daarskabens-lovprisning'],
  }),
  P('machiavelli', 'Niccolò Machiavelli', 'Niccolò Machiavelli', 'renaessancen', 1469, 1527, 'Niccol%C3%B2_Machiavelli', {
    invented: ['politisk-realismen', 'machiavellisme', 'republikanisme'],
    influencedBy: ['cicero', 'aristoteles'],
    works: ['machiavelli-fyrsten', 'machiavelli-discorsi'],
  }),
  P('more', 'Thomas More', 'Thomas More', 'renaessancen', 1478, 1535, 'Thomas_More', {
    invented: ['utopi'],
    developed: ['naturret'],
    member: ['humanisme'],
    influencedBy: ['platon', 'erasmus', 'augustin'],
    works: ['more-utopia'],
  }),
  P('bruno', 'Giordano Bruno', 'Giordano Bruno', 'renaessancen', 1548, 1600, 'Giordano_Bruno', {
    invented: ['kosmologisk-pluralisme', 'hermetisme'],
    developed: ['panteisme'],
    influencedBy: ['plotin', 'avicenna'],
    works: ['bruno-uendelige-univers'],
  }),
  P('bacon', 'Francis Bacon', 'Francis Bacon', 'renaessancen', 1561, 1626, 'Francis_Bacon_(philosopher)', {
    invented: ['induktiv-metode', 'idolernes-laere', 'videnskabelig-metode'],
    founded: ['empirisme'],
    works: ['bacon-novum-organum'],
  }),
  P('hobbes', 'Thomas Hobbes', 'Thomas Hobbes', 'renaessancen', 1588, 1679, 'Thomas_Hobbes', {
    invented: ['samfundskontrakten', 'naturtilstanden', 'absolutisme'],
    developed: ['materialisme'],
    influencedBy: ['bacon', 'machiavelli'],
    works: ['hobbes-leviathan'],
  }),
  P('descartes', 'René Descartes', 'René Descartes', 'renaessancen', 1596, 1650, 'Ren%C3%A9_Descartes', {
    invented: ['cogito-ergo-sum', 'metodisk-tvivl', 'dualisme'],
    revised: ['aristotelisme'],
    founded: ['rationalisme'],
    influencedBy: ['aquinas', 'augustin', 'avicenna'],
    works: ['descartes-metode', 'descartes-meditationer'],
  }),
  P('pascal', 'Blaise Pascal', 'Blaise Pascal', 'renaessancen', 1623, 1662, 'Blaise_Pascal', {
    invented: ['pascals-vaeddemal', 'fideisme', 'sandsynlighedsteori', 'jansenisme'],
    member: ['jansenisme'],
    influencedBy: ['augustin', 'descartes'],
    works: ['pascal-tanker'],
  }),
  P('spinoza', 'Baruch Spinoza', 'Baruch Spinoza', 'renaessancen', 1632, 1677, 'Baruch_Spinoza', {
    invented: ['deus-sive-natura'],
    revised: ['dualisme'],
    developed: ['panteisme', 'monisme', 'determinisme'],
    member: ['rationalisme'],
    influencedBy: ['descartes', 'bruno', 'hobbes'],
    works: ['spinoza-etik'],
  }),
  P('locke', 'John Locke', 'John Locke', 'renaessancen', 1632, 1704, 'John_Locke', {
    invented: ['tabula-rasa', 'naturlige-rettigheder', 'personlig-identitet', 'erfaringspaedagogik'],
    revised: ['naturret'],
    developed: ['samfundskontrakten'],
    member: ['empirisme', 'liberalisme'],
    influencedBy: ['bacon', 'hobbes'],
    works: ['locke-forstand', 'locke-styre', 'locke-opdragelse'],
  }),
  P('leibniz', 'Gottfried Wilhelm Leibniz', 'Gottfried Wilhelm Leibniz', 'renaessancen', 1646, 1716, 'Gottfried_Wilhelm_Leibniz', {
    invented: ['monadelaeren', 'praeetableret-harmoni', 'theodice'],
    revised: ['dualisme'],
    member: ['rationalisme'],
    influencedBy: ['descartes', 'spinoza', 'aristoteles'],
    works: ['leibniz-monadologien', 'leibniz-theodicee'],
  }),
  P('berkeley', 'George Berkeley', 'George Berkeley', 'renaessancen', 1685, 1753, 'George_Berkeley', {
    invented: ['subjektiv-idealisme', 'immaterialisme', 'esse-est-percipi'],
    member: ['empirisme'],
    influencedBy: ['locke'],
    critiqued: ['materialisme'],
    works: ['berkeley-traktat'],
  }),

  // ═══════════════════════════ OPLYSNINGSTIDEN ═══════════════════════════
  P('montesquieu', 'Montesquieu', 'Montesquieu', 'oplysningen', 1689, 1755, 'Montesquieu', {
    invented: ['magtens-tredeling', 'konstitutionalisme'],
    influencedBy: ['locke', 'aristoteles'],
    works: ['montesquieu-lovens-and'],
  }),
  P('voltaire', 'Voltaire', 'Voltaire', 'oplysningen', 1694, 1778, 'Voltaire', {
    invented: ['deisme', 'ytringsfrihed', 'religionskritik'],
    founded: ['oplysningsfilosofi'],
    influencedBy: ['locke', 'bacon'],
    works: ['voltaire-candide', 'voltaire-filosofiske-breve'],
  }),
  P('hume', 'David Hume', 'David Hume', 'oplysningen', 1711, 1776, 'David_Hume', {
    invented: ['kausalitetskritik', 'induktionsproblemet', 'naturalisme'],
    member: ['empirisme'],
    influencedBy: ['locke', 'berkeley', 'cicero'],
    works: ['hume-traktat'],
  }),
  P('rousseau', 'Jean-Jacques Rousseau', 'Jean-Jacques Rousseau', 'oplysningen', 1712, 1778, 'Jean-Jacques_Rousseau', {
    invented: ['almenviljen', 'den-aeble-vilde', 'naturlig-opdragelse'],
    revised: ['samfundskontrakten'],
    developed: ['samfundskontrakten'],
    member: ['romantik'],
    influencedBy: ['hobbes', 'locke', 'platon'],
    works: ['rousseau-samfundskontrakten', 'rousseau-emile'],
  }),
  P('diderot', 'Denis Diderot', 'Denis Diderot', 'oplysningen', 1713, 1784, 'Denis_Diderot', {
    invented: ['encyklopaedisme'],
    developed: ['materialisme'],
    member: ['oplysningsfilosofi'],
    influencedBy: ['bacon', 'locke'],
    works: ['diderot-encyclopedien'],
  }),
  P('smith', 'Adam Smith', 'Adam Smith', 'oplysningen', 1723, 1790, 'Adam_Smith', {
    invented: ['den-usynlige-haand', 'arbejdsdeling'],
    founded: ['okonomisk-liberalisme'],
    influencedBy: ['hume', 'locke'],
    works: ['smith-nationernes-velstand'],
  }),
  P('kant', 'Immanuel Kant', 'Immanuel Kant', 'oplysningen', 1724, 1804, 'Immanuel_Kant', {
    invented: ['transcendental-idealisme', 'det-kategoriske-imperativ', 'deontologi', 'kritisk-filosofi', 'autonomi', 'evig-fred', 'myndighed'],
    revised: ['empirisme', 'rationalisme'],
    founded: ['tysk-idealisme'],
    influencedBy: ['hume', 'rousseau', 'leibniz'],
    works: ['kant-ren-fornuft', 'kant-praktisk-fornuft', 'kant-dommekraften', 'kant-hvad-er-oplysning'],
  }),
  P('burke', 'Edmund Burke', 'Edmund Burke', 'oplysningen', 1729, 1797, 'Edmund_Burke', {
    invented: ['det-sublime', 'organisk-samfundssyn'],
    founded: ['konservatisme'],
    influencedBy: ['hume', 'cicero'],
    works: ['burke-refleksioner'],
  }),
  P('bentham', 'Jeremy Bentham', 'Jeremy Bentham', 'oplysningen', 1748, 1832, 'Jeremy_Bentham', {
    invented: ['utilitarisme', 'panoptisme', 'hedonistisk-kalkule', 'retspositivisme'],
    influencedBy: ['hume', 'locke'],
    works: ['bentham-indledning', 'bentham-panoptikon'],
  }),
  P('reid', 'Thomas Reid', 'Thomas Reid', 'oplysningen', 1710, 1796, 'Thomas_Reid', {
    invented: ['common-sense-realismen'],
    influencedBy: ['hume', 'bacon'],
    works: ['reid-menneskelige-sind'],
  }),

  // ═══════════════════════════ TYSK IDEALISME ═══════════════════════════
  P('fichte', 'Johann Gottlieb Fichte', 'Johann Gottlieb Fichte', 'tysk-idealisme', 1762, 1814, 'Johann_Gottlieb_Fichte', {
    invented: ['jeget-som-princip'],
    revised: ['transcendental-idealisme'],
    developed: ['subjektiv-idealisme'],
    member: ['tysk-idealisme'],
    influencedBy: ['kant'],
    works: ['fichte-videnskabslaeren'],
  }),
  P('schelling', 'Friedrich Schelling', 'Friedrich Wilhelm Joseph Schelling', 'tysk-idealisme', 1775, 1854, 'Friedrich_Wilhelm_Joseph_Schelling', {
    invented: ['naturfilosofi-schelling', 'identitetsfilosofi'],
    revised: ['transcendental-idealisme'],
    founded: ['romantik'],
    member: ['tysk-idealisme'],
    influencedBy: ['kant', 'fichte', 'spinoza'],
    works: ['schelling-transcendentale-idealisme'],
  }),
  P('hegel', 'Georg Wilhelm Friedrich Hegel', 'Georg Wilhelm Friedrich Hegel', 'tysk-idealisme', 1770, 1831, 'Georg_Wilhelm_Friedrich_Hegel', {
    invented: ['dialektik', 'absolut-idealisme', 'verdensaanden', 'anerkendelse', 'historiefilosofi'],
    revised: ['transcendental-idealisme'],
    member: ['tysk-idealisme'],
    influencedBy: ['kant', 'fichte', 'schelling', 'heraklit', 'rousseau'],
    works: ['hegel-aandens-faenomenologi', 'hegel-retsfilosofien', 'hegel-forelaesninger-filosofiens-historie'],
  }),
  P('schleiermacher', 'Friedrich Schleiermacher', 'Friedrich Schleiermacher', 'tysk-idealisme', 1768, 1834, 'Friedrich_Schleiermacher', {
    invented: ['absolut-afhaengighed', 'romantisk-teologi'],
    developed: ['hermeneutik'],
    member: ['romantik'],
    influencedBy: ['kant', 'schelling'],
    works: ['schleiermacher-om-religion'],
  }),
  P('schopenhauer', 'Arthur Schopenhauer', 'Arthur Schopenhauer', 'tysk-idealisme', 1788, 1860, 'Arthur_Schopenhauer', {
    invented: ['pessimisme', 'viljen-som-tingen-i-sig'],
    revised: ['transcendental-idealisme'],
    influencedBy: ['kant', 'platon', 'spinoza'],
    works: ['schopenhauer-verden-som-vilje'],
  }),

  // ═══════════════════════════ 1800-TALLET ═══════════════════════════
  P('comte', 'Auguste Comte', 'Auguste Comte', '1800-tallet', 1798, 1857, 'Auguste_Comte', {
    invented: ['trestadie-loven', 'sociologi-begreb'],
    founded: ['positivisme'],
    influencedBy: ['hume'],
    works: ['comte-positiv-filosofi'],
  }),
  P('kierkegaard', 'Søren Kierkegaard', 'Søren Kierkegaard', '1800-tallet', 1813, 1855, 'S%C3%B8ren_Kierkegaard', {
    invented: ['subjektivitet', 'troens-spring', 'angstbegrebet'],
    founded: ['eksistentialisme'],
    influencedBy: ['sokrates', 'augustin', 'hegel'],
    critiqued: ['absolut-idealisme'],
    works: ['kierkegaard-enten-eller', 'kierkegaard-angstens-begreb', 'kierkegaard-efterkrift'],
  }),
  P('mill', 'John Stuart Mill', 'John Stuart Mill', '1800-tallet', 1806, 1873, 'John_Stuart_Mill', {
    invented: ['skadeprincippet', 'kvindefrigoerelse'],
    developed: ['utilitarisme', 'induktionsproblemet', 'liberalisme'],
    member: ['liberalisme'],
    influencedBy: ['bentham', 'hume', 'rousseau'],
    works: ['mill-om-friheden', 'mill-utilitarismen', 'mill-kvindernes-underkastelse'],
  }),
  P('marx', 'Karl Marx', 'Karl Marx', '1800-tallet', 1818, 1883, 'Karl_Marx', {
    invented: ['historisk-materialisme', 'klassekamp', 'dialektisk-materialisme', 'fremmedgoerelse', 'varefetichisme', 'mervaerdi'],
    revised: ['dialektik'],
    founded: ['marxisme'],
    influencedBy: ['hegel', 'smith', 'ricardo'],
    works: ['kommunistiske-manifest', 'marx-kapitalen'],
  }),
  P('engels', 'Friedrich Engels', 'Friedrich Engels', '1800-tallet', 1820, 1895, 'Friedrich_Engels', {
    developed: ['historisk-materialisme', 'dialektisk-materialisme'],
    member: ['marxisme'],
    influencedBy: ['hegel', 'marx'],
    works: ['engels-dialektik-naturen'],
  }),
  P('emerson', 'Ralph Waldo Emerson', 'Ralph Waldo Emerson', '1800-tallet', 1803, 1882, 'Ralph_Waldo_Emerson', {
    invented: ['individualisme-emerson', 'selvrealisering'],
    founded: ['transcendentalisme'],
    influencedBy: ['platon', 'kant'],
    works: ['emerson-nature', 'emerson-selvtillid'],
  }),
  P('stirner', 'Max Stirner', 'Max Stirner', '1800-tallet', 1806, 1856, 'Max_Stirner', {
    invented: ['egoisme', 'individualanarkisme'],
    member: ['anarkisme'],
    influencedBy: ['hegel'],
    works: ['stirner-den-eneste'],
  }),
  P('proudhon', 'Pierre-Joseph Proudhon', 'Pierre-Joseph Proudhon', '1800-tallet', 1809, 1865, 'Pierre-Joseph_Proudhon', {
    invented: ['mutualisme', 'ejendomskritik'],
    founded: ['anarkisme'],
    influencedBy: ['hegel', 'rousseau'],
    works: ['proudhon-hvad-er-ejendom'],
  }),
  P('bakunin', 'Mikhail Bakunin', 'Mikhail Bakunin', '1800-tallet', 1814, 1876, 'Mikhail_Bakunin', {
    invented: ['kollektiv-anarkisme', 'anti-autoritarisme'],
    member: ['anarkisme'],
    influencedBy: ['proudhon', 'hegel'],
    works: ['bakunin-gud-og-staten'],
  }),
  P('ricardo', 'David Ricardo', 'David Ricardo', '1800-tallet', 1772, 1823, 'David_Ricardo', {
    invented: ['komparative-fordele', 'arbejdsvaerditeori'],
    member: ['okonomisk-liberalisme'],
    influencedBy: ['smith'],
    works: ['ricardo-politisk-okonomi'],
  }),
  P('nietzsche', 'Friedrich Nietzsche', 'Friedrich Nietzsche', '1800-tallet', 1844, 1900, 'Friedrich_Nietzsche', {
    invented: ['nihilisme', 'overmennesket', 'viljen-til-magt', 'evig-genkomst', 'ressentiment'],
    // Nietzsche omskaber Schopenhauers vilje til «viljen til magt» og bryder
    // med hans pessimisme – de to eneste steder i grafen hvor han rører ved
    // andres begreber.
    revised: ['viljen-som-tingen-i-sig'],
    critiqued: ['pessimisme'],
    influencedBy: ['schopenhauer', 'emerson'],
    works: ['nietzsche-zarathustra', 'nietzsche-hinsides-godt-ondt', 'nietzsche-moralens-genealogi'],
  }),
  P('peirce', 'Charles Sanders Peirce', 'Charles Sanders Peirce', '1800-tallet', 1839, 1914, 'Charles_Sanders_Peirce', {
    invented: ['semiotik', 'fallibilisme', 'abduktion'],
    founded: ['pragmatisme'],
    influencedBy: ['kant', 'hume'],
    works: ['peirce-klare-ideer'],
  }),
  P('james', 'William James', 'William James', '1800-tallet', 1842, 1910, 'William_James', {
    invented: ['radikal-empirisme', 'den-religioese-erfaring'],
    member: ['pragmatisme'],
    influencedBy: ['peirce', 'emerson'],
    works: ['james-pragmatismen'],
  }),
  P('frege', 'Gottlob Frege', 'Gottlob Frege', '1800-tallet', 1848, 1925, 'Gottlob_Frege', {
    invented: ['praedikatslogik', 'logicisme', 'betydning-og-reference'],
    founded: ['analytisk-filosofi'],
    influencedBy: ['leibniz', 'kant'],
    works: ['frege-begriffsschrift'],
  }),
  P('dilthey', 'Wilhelm Dilthey', 'Wilhelm Dilthey', '1800-tallet', 1833, 1911, 'Wilhelm_Dilthey', {
    invented: ['forstaaelse', 'livsfilosofi'],
    developed: ['hermeneutik'],
    influencedBy: ['kant', 'schleiermacher'],
    works: ['dilthey-aandsvidenskaberne'],
  }),
  P('de-maistre', 'Joseph de Maistre', 'Joseph de Maistre', '1800-tallet', 1753, 1821, 'Joseph_de_Maistre', {
    invented: ['ultramontanisme', 'modoplysning'],
    member: ['konservatisme'],
    influencedBy: ['burke'],
    works: ['de-maistre-om-paven'],
  }),
  P('tocqueville', 'Alexis de Tocqueville', 'Alexis de Tocqueville', '1800-tallet', 1805, 1859, 'Alexis_de_Tocqueville', {
    invented: ['demokratianalyse', 'flertallets-tyranni', 'civilsamfundet'],
    member: ['liberalisme'],
    influencedBy: ['montesquieu', 'rousseau', 'pascal'],
    works: ['tocqueville-demokratiet'],
  }),
  P('kropotkin', 'Peter Kropotkin', 'Peter Kropotkin', '1800-tallet', 1842, 1921, 'Peter_Kropotkin', {
    invented: ['anarkokommunisme', 'gensidig-hjaelp'],
    member: ['anarkisme'],
    influencedBy: ['proudhon', 'bakunin'],
    works: ['kropotkin-gensidig-hjaelp'],
  }),
  P('luxemburg', 'Rosa Luxemburg', 'Rosa Luxemburg', '1800-tallet', 1871, 1919, 'Rosa_Luxemburg', {
    invented: ['revolutionaer-socialisme', 'spontanitetsteori', 'antiimperialisme'],
    member: ['marxisme'],
    influencedBy: ['marx', 'kropotkin'],
    works: ['luxemburg-akkumulationen'],
  }),

  // ═══════════════════════════ TIDLIGT 1900-TAL ═══════════════════════════
  P('keynes', 'John Maynard Keynes', 'John Maynard Keynes', 'tidligt-1900-tal', 1883, 1946, 'John_Maynard_Keynes', {
    // Efterspørgselsøkonomien og hovedmanden bag Bretton Woods-institutionerne.
    invented: ['keynesianisme'],
    influencedBy: ['smith', 'ricardo'],
    works: ['keynes-general-teori'],
  }),
  P('husserl', 'Edmund Husserl', 'Edmund Husserl', 'tidligt-1900-tal', 1859, 1938, 'Edmund_Husserl', {
    invented: ['intentionalitet', 'transcendental-reduktion', 'livsverdenen'],
    founded: ['faenomenologi'],
    member: ['kontinental-filosofi'],
    influencedBy: ['descartes', 'hume'],
    works: ['husserl-ideer', 'husserl-krisen'],
  }),
  P('bergson', 'Henri Bergson', 'Henri Bergson', 'tidligt-1900-tal', 1859, 1941, 'Henri_Bergson', {
    invented: ['varighed', 'intuitionisme', 'elan-vital'],
    influencedBy: ['spinoza', 'plotin'],
    works: ['bergson-skabende-evolution'],
  }),
  P('russell', 'Bertrand Russell', 'Bertrand Russell', 'tidligt-1900-tal', 1872, 1970, 'Bertrand_Russell', {
    invented: ['logisk-atomisme', 'typeteori'],
    developed: ['logicisme'],
    member: ['analytisk-filosofi'],
    influencedBy: ['frege', 'leibniz', 'mill'],
    works: ['principia-mathematica'],
  }),
  P('whitehead', 'Alfred North Whitehead', 'Alfred North Whitehead', 'tidligt-1900-tal', 1861, 1947, 'Alfred_North_Whitehead', {
    invented: ['procesfilosofi', 'organisk-filosofi'],
    developed: ['logicisme'],
    influencedBy: ['bergson', 'james', 'platon', 'russell'],
    works: ['whitehead-proces-og-virkelighed'],
  }),
  P('dewey', 'John Dewey', 'John Dewey', 'tidligt-1900-tal', 1859, 1952, 'John_Dewey', {
    invented: ['instrumentalisme', 'progressiv-paedagogik'],
    developed: ['pragmatisme'],
    influencedBy: ['peirce', 'james', 'hegel'],
    works: ['dewey-demokrati-og-uddannelse', 'lab-school'],
  }),
  P('santayana', 'George Santayana', 'George Santayana', 'tidligt-1900-tal', 1863, 1952, 'George_Santayana', {
    invented: ['kritisk-realismen', 'aestetisk-erfaring'],
    developed: ['naturalisme'],
    influencedBy: ['james', 'spinoza', 'emerson'],
    works: ['santayana-sans-for-skønhed'],
  }),
  P('royce', 'Josiah Royce', 'Josiah Royce', 'tidligt-1900-tal', 1855, 1916, 'Josiah_Royce', {
    invented: ['loyalitetens-filosofi'],
    developed: ['absolut-idealisme'],
    influencedBy: ['hegel', 'emerson'],
    works: ['royce-loyalitetens-filosofi'],
  }),
  P('wittgenstein', 'Ludwig Wittgenstein', 'Ludwig Wittgenstein', 'tidligt-1900-tal', 1889, 1951, 'Ludwig_Wittgenstein', {
    invented: ['sprogspil', 'billedteori', 'sprogfilosofi'],
    developed: ['logisk-atomisme'],
    revised: ['billedteori'],
    member: ['analytisk-filosofi'],
    influencedBy: ['frege', 'russell', 'schopenhauer'],
    works: ['wittgenstein-tractatus', 'wittgenstein-undersoegelser'],
  }),
  P('heidegger', 'Martin Heidegger', 'Martin Heidegger', 'tidligt-1900-tal', 1889, 1976, 'Martin_Heidegger', {
    invented: ['dasein', 'vaeren-i-verden', 'teknikfilosofi'],
    revised: ['faenomenologi'],
    developed: ['faenomenologi', 'eksistentialisme'],
    member: ['kontinental-filosofi'],
    influencedBy: ['husserl', 'kierkegaard', 'nietzsche', 'aristoteles'],
    works: ['heidegger-vaeren-og-tid'],
  }),
  P('schlick', 'Moritz Schlick', 'Moritz Schlick', 'tidligt-1900-tal', 1882, 1936, 'Moritz_Schlick', {
    invented: ['verifikationsprincip'],
    founded: ['logisk-positivisme'],
    influencedBy: ['hume', 'comte'],
    works: ['wienerkredsens-manifest'],
  }),
  P('carnap', 'Rudolf Carnap', 'Rudolf Carnap', 'tidligt-1900-tal', 1891, 1970, 'Rudolf_Carnap', {
    invented: ['logisk-analyse'],
    developed: ['verifikationsprincip'],
    member: ['logisk-positivisme'],
    influencedBy: ['frege', 'russell', 'schlick'],
    works: ['carnap-verdens-opbygning'],
  }),
  P('simmel', 'Georg Simmel', 'Georg Simmel', 'tidligt-1900-tal', 1858, 1918, 'Georg_Simmel', {
    invented: ['formal-sociologi', 'kulturfilosofi'],
    influencedBy: ['kant', 'nietzsche'],
    works: ['simmel-pengefilosofi'],
  }),
  P('weber', 'Max Weber', 'Max Weber', 'tidligt-1900-tal', 1864, 1920, 'Max_Weber', {
    invented: ['idealtyper', 'bureaukrati', 'protestantismens-etik'],
    influencedBy: ['kant', 'nietzsche', 'marx'],
    works: ['weber-protestantismens-etik'],
  }),
  P('freud', 'Sigmund Freud', 'Sigmund Freud', 'tidligt-1900-tal', 1856, 1939, 'Sigmund_Freud', {
    invented: ['psykoanalyse', 'det-ubevidste', 'oedipuskomplekset', 'det-topiske-system'],
    influencedBy: ['schopenhauer', 'nietzsche'],
    works: ['freud-droemmetydning', 'freud-jeg-og-det'],
  }),
  P('croce', 'Benedetto Croce', 'Benedetto Croce', 'tidligt-1900-tal', 1866, 1952, 'Benedetto_Croce', {
    invented: ['historicisme', 'aestetisk-intuition'],
    influencedBy: ['hegel', 'marx'],
    works: ['croce-aestetik'],
  }),
  P('gentile', 'Giovanni Gentile', 'Giovanni Gentile', 'tidligt-1900-tal', 1875, 1944, 'Giovanni_Gentile', {
    invented: ['aktuel-idealisme', 'totalitarisme'],
    influencedBy: ['hegel', 'croce'],
    works: ['fascismens-doktrin'],
  }),
  P('ortega', 'José Ortega y Gasset', 'José Ortega y Gasset', 'tidligt-1900-tal', 1883, 1955, 'Jos%C3%A9_Ortega_y_Gasset', {
    invented: ['ratiovitalisme', 'perspektivisme', 'massemennesket'],
    influencedBy: ['nietzsche', 'dilthey', 'kant'],
    works: ['ortega-massernes-oproer'],
  }),
  P('berdyaev', 'Nikolai Berdyaev', 'Nikolai Berdyaev', 'tidligt-1900-tal', 1874, 1948, 'Nikolai_Berdyaev', {
    invented: ['religioes-eksistentialisme', 'kreativitet'],
    influencedBy: ['kierkegaard', 'nietzsche'],
    works: ['berdyaev-frihedens-filosofi'],
  }),
  P('gramsci', 'Antonio Gramsci', 'Antonio Gramsci', 'tidligt-1900-tal', 1891, 1937, 'Antonio_Gramsci', {
    invented: ['kulturhegemoni', 'organisk-intellektuel'],
    founded: ['vestlig-marxisme'],
    influencedBy: ['marx', 'croce', 'machiavelli'],
    works: ['gramsci-faengselsnoter'],
  }),
  P('lukacs', 'György Lukács', 'György Lukács', 'tidligt-1900-tal', 1885, 1971, 'Gy%C3%B6rgy_Luk%C3%A1cs', {
    invented: ['reifikation', 'klassebevidsthed'],
    member: ['vestlig-marxisme'],
    influencedBy: ['hegel', 'marx', 'simmel', 'weber'],
    works: ['lukacs-klassebevidsthed'],
  }),
  P('steiner', 'Rudolf Steiner', 'Rudolf Steiner', 'tidligt-1900-tal', 1861, 1925, 'Rudolf_Steiner', {
    invented: ['aandsvidenskab', 'tregrening', 'steinerpaedagogik'],
    founded: ['antroposofi'],
    influencedBy: ['fichte'],
    works: ['antroposofisk-selskab', 'waldorfpaedagogik', 'goetheanum'],
  }),
  P('schmitt', 'Carl Schmitt', 'Carl Schmitt', 'tidligt-1900-tal', 1888, 1985, 'Carl_Schmitt', {
    invented: ['det-politiske', 'suveraenitet', 'ven-fjende-distinktionen', 'politisk-teologi'],
    influencedBy: ['hobbes', 'machiavelli', 'de-maistre'],
    works: ['schmitt-det-politiske'],
  }),
  P('jaspers', 'Karl Jaspers', 'Karl Jaspers', 'tidligt-1900-tal', 1883, 1969, 'Karl_Jaspers', {
    invented: ['graensesituationer', 'den-aksiale-tid', 'eksistensfilosofi'],
    influencedBy: ['kierkegaard', 'nietzsche', 'weber'],
    works: ['jaspers-filosofien'],
  }),
  P('bachelard', 'Gaston Bachelard', 'Gaston Bachelard', 'tidligt-1900-tal', 1884, 1962, 'Gaston_Bachelard', {
    invented: ['epistemologisk-brud', 'epistemologi'],
    influencedBy: ['bergson', 'kant'],
    works: ['bachelard-videnskabelige-sind'],
  }),

  // ═══════════════════════════ MIDT-1900-TALLET ═══════════════════════════
  P('popper', 'Karl Popper', 'Karl Popper', 'midt-1900-tal', 1902, 1994, 'Karl_Popper', {
    invented: ['falsifikationisme', 'det-aabne-samfund', 'kritisk-rationalisme'],
    member: ['videnskabsfilosofi'],
    influencedBy: ['hume', 'kant', 'marx'],
    works: ['popper-logikken-i-forskningen', 'popper-det-aabne-samfund'],
  }),
  P('benjamin', 'Walter Benjamin', 'Walter Benjamin', 'midt-1900-tal', 1892, 1940, 'Walter_Benjamin', {
    invented: ['kunstvaerkets-aura', 'kritisk-historieflosofi'],
    member: ['kritisk-teori'],
    influencedBy: ['marx', 'nietzsche'],
    works: ['benjamin-kunstvaerket'],
  }),
  P('adorno', 'Theodor W. Adorno', 'Theodor W. Adorno', 'midt-1900-tal', 1903, 1969, 'Theodor_W._Adorno', {
    invented: ['oplysningens-dialektik', 'kulturindustri', 'negativ-dialektik'],
    member: ['kritisk-teori'],
    influencedBy: ['hegel', 'marx', 'benjamin', 'nietzsche'],
    works: ['adorno-oplysningens-dialektik', 'adorno-negativ-dialektik'],
  }),
  P('marcuse', 'Herbert Marcuse', 'Herbert Marcuse', 'midt-1900-tal', 1898, 1979, 'Herbert_Marcuse', {
    invented: ['det-endimensionelle-menneske', 'den-store-afvisning'],
    member: ['kritisk-teori'],
    influencedBy: ['hegel', 'marx', 'heidegger'],
    works: ['marcuse-endimensionelle-menneske'],
  }),
  P('sartre', 'Jean-Paul Sartre', 'Jean-Paul Sartre', 'midt-1900-tal', 1905, 1980, 'Jean-Paul_Sartre', {
    invented: ['eksistensen-forud-for-essensen', 'daarlig-tro', 'radikal-frihed'],
    revised: ['faenomenologi'],
    member: ['eksistentialisme', 'marxisme'],
    influencedBy: ['heidegger', 'husserl', 'kierkegaard', 'marx'],
    works: ['sartre-vaeren-og-intethed', 'sartre-eksistentialisme-er-humanisme'],
  }),
  P('beauvoir', 'Simone de Beauvoir', 'Simone de Beauvoir', 'midt-1900-tal', 1908, 1986, 'Simone_de_Beauvoir', {
    invented: ['det-andet-koen', 'eksistentialistisk-etik'],
    founded: ['feministisk-filosofi'],
    member: ['eksistentialisme'],
    influencedBy: ['sartre', 'hegel', 'marx'],
    works: ['beauvoir-det-andet-koen'],
  }),
  P('camus', 'Albert Camus', 'Albert Camus', 'midt-1900-tal', 1913, 1960, 'Albert_Camus', {
    invented: ['absurdisme', 'det-absurde-oproer'],
    influencedBy: ['kierkegaard', 'nietzsche', 'sartre'],
    critiqued: ['dialektisk-materialisme'],
    works: ['camus-sisyfos-myten', 'camus-oproerets-menneske'],
  }),
  P('merleau-ponty', 'Maurice Merleau-Ponty', 'Maurice Merleau-Ponty', 'midt-1900-tal', 1908, 1961, 'Maurice_Merleau-Ponty', {
    invented: ['kropslig-perception'],
    revised: ['faenomenologi'],
    developed: ['faenomenologi'],
    member: ['kontinental-filosofi'],
    influencedBy: ['husserl', 'heidegger', 'sartre'],
    works: ['merleau-ponty-perceptionen'],
  }),
  P('levinas', 'Emmanuel Levinas', 'Emmanuel Levinas', 'midt-1900-tal', 1906, 1995, 'Emmanuel_Levinas', {
    invented: ['ansigtets-etik', 'den-anden', 'etik-som-foerstefilosofi'],
    influencedBy: ['husserl', 'heidegger', 'maimonides'],
    works: ['levinas-totalitet-og-uendelighed'],
  }),
  P('arendt', 'Hannah Arendt', 'Hannah Arendt', 'midt-1900-tal', 1906, 1975, 'Hannah_Arendt', {
    invented: ['ondskabens-banalitet', 'vita-activa', 'totalitarisme'],
    influencedBy: ['heidegger', 'jaspers', 'kant'],
    works: ['arendt-menneskets-vilkaar', 'arendt-eichmann'],
  }),
  P('ricoeur', 'Paul Ricoeur', 'Paul Ricoeur', 'midt-1900-tal', 1913, 2005, 'Paul_Ricoeur', {
    invented: ['narrativ-identitet'],
    revised: ['hermeneutik'],
    developed: ['hermeneutik'],
    influencedBy: ['husserl', 'gadamer', 'freud'],
    works: ['ricoeur-tid-og-fortaelling'],
  }),
  P('gadamer', 'Hans-Georg Gadamer', 'Hans-Georg Gadamer', 'midt-1900-tal', 1900, 2002, 'Hans-Georg_Gadamer', {
    invented: ['horisontsammensmeltning', 'virkningshistorie'],
    revised: ['hermeneutik'],
    developed: ['hermeneutik'],
    influencedBy: ['heidegger', 'dilthey', 'schleiermacher'],
    works: ['gadamer-sandhed-og-metode'],
  }),
  P('ayer', 'Alfred Jules Ayer', 'Alfred Jules Ayer', 'midt-1900-tal', 1910, 1989, 'Alfred_Jules_Ayer', {
    invented: ['emotivisme'],
    developed: ['verifikationsprincip', 'logisk-positivisme'],
    member: ['analytisk-filosofi'],
    influencedBy: ['hume', 'carnap', 'russell'],
    works: ['ayer-sprog-sandhed-logik'],
  }),
  P('ryle', 'Gilbert Ryle', 'Gilbert Ryle', 'midt-1900-tal', 1900, 1976, 'Gilbert_Ryle', {
    invented: ['kategorifejl', 'spoegelset-i-maskinen'],
    member: ['analytisk-filosofi'],
    influencedBy: ['wittgenstein', 'russell'],
    works: ['ryle-sindets-begreb'],
  }),
  P('quine', 'Willard Van Orman Quine', 'Willard Van Orman Quine', 'midt-1900-tal', 1908, 2000, 'Willard_Van_Orman_Quine', {
    invented: ['holisme'],
    developed: ['naturalisme', 'empirisme'],
    member: ['analytisk-filosofi'],
    influencedBy: ['carnap', 'frege', 'russell'],
    critiqued: ['logisk-positivisme'],
    works: ['quine-to-dogmer'],
  }),
  P('austin', 'J.L. Austin', 'J. L. Austin', 'midt-1900-tal', 1911, 1960, 'J._L._Austin', {
    invented: ['talehandlingsteori', 'performativer'],
    member: ['analytisk-filosofi'],
    influencedBy: ['wittgenstein', 'ryle'],
    works: ['austin-talehandlinger'],
  }),
  P('anscombe', 'G.E.M. Anscombe', 'G. E. M. Anscombe', 'midt-1900-tal', 1919, 2001, 'G._E._M._Anscombe', {
    invented: ['handlingsfilosofi'],
    developed: ['dydsetik'],
    influencedBy: ['wittgenstein', 'aquinas'],
    works: ['anscombe-intention'],
  }),
  P('althusser', 'Louis Althusser', 'Louis Althusser', 'midt-1900-tal', 1918, 1990, 'Louis_Althusser', {
    invented: ['ideologiske-statsapparater', 'strukturel-marxisme'],
    member: ['vestlig-marxisme'],
    influencedBy: ['marx', 'bachelard', 'gramsci'],
    works: ['althusser-ideologiske-statsapparater'],
  }),
  P('strauss', 'Leo Strauss', 'Leo Strauss', 'midt-1900-tal', 1899, 1973, 'Leo_Strauss', {
    invented: ['esoterisk-hermeneutik'],
    developed: ['naturret'],
    influencedBy: ['hobbes', 'machiavelli', 'platon'],
    works: ['strauss-naturret-og-historie'],
  }),
  P('voegelin', 'Eric Voegelin', 'Eric Voegelin', 'midt-1900-tal', 1901, 1985, 'Eric_Voegelin', {
    invented: ['gnosticismekritik', 'bevidsthedshistorie'],
    influencedBy: ['platon', 'hegel', 'jaspers'],
    works: ['voegelin-orden-og-historie'],
  }),
  P('mises', 'Ludwig von Mises', 'Ludwig von Mises', 'midt-1900-tal', 1881, 1973, 'Ludwig_von_Mises', {
    invented: ['praxeologi'],
    founded: ['ostrigsk-skole'],
    influencedBy: ['kant', 'smith'],
    works: ['mises-menneskelig-handlen'],
  }),
  P('hayek', 'Friedrich Hayek', 'Friedrich Hayek', 'midt-1900-tal', 1899, 1992, 'Friedrich_Hayek', {
    invented: ['spontan-orden'],
    member: ['ostrigsk-skole', 'liberalisme'],
    influencedBy: ['mises', 'hume', 'smith'],
    works: ['hayek-vejen-til-traeldom'],
  }),
  P('rand', 'Ayn Rand', 'Ayn Rand', 'midt-1900-tal', 1905, 1982, 'Ayn_Rand', {
    invented: ['objektivisme', 'rationel-egoisme', 'laissez-faire-kapitalisme'],
    member: ['libertarianisme'],
    influencedBy: ['aristoteles', 'stirner', 'nietzsche'],
    works: ['rand-fountainhead', 'rand-atlas-shrugged'],
  }),
  P('rothbard', 'Murray Rothbard', 'Murray Rothbard', 'midt-1900-tal', 1926, 1995, 'Murray_Rothbard', {
    invented: ['anarkokapitalisme'],
    member: ['ostrigsk-skole', 'libertarianisme'],
    influencedBy: ['mises', 'rand', 'locke'],
    works: ['rothbard-menneske-okonomi-stat'],
  }),
  P('kuhn', 'Thomas Kuhn', 'Thomas Kuhn', 'midt-1900-tal', 1922, 1996, 'Thomas_Kuhn', {
    invented: ['paradigme', 'paradigmeskift', 'normalvidenskab'],
    revised: ['videnskabelig-metode'],
    member: ['videnskabsfilosofi'],
    influencedBy: ['bachelard', 'popper'],
    works: ['kuhn-videnskabelige-revolutioner'],
  }),
  P('lakatos', 'Imre Lakatos', 'Imre Lakatos', 'midt-1900-tal', 1922, 1974, 'Imre_Lakatos', {
    invented: ['forskningsprogrammer', 'sofistikeret-falsifikationisme'],
    revised: ['falsifikationisme'],
    member: ['videnskabsfilosofi'],
    influencedBy: ['popper', 'kuhn', 'hegel'],
    works: ['lakatos-forskningsprogrammer'],
  }),
  P('feyerabend', 'Paul Feyerabend', 'Paul Feyerabend', 'midt-1900-tal', 1924, 1994, 'Paul_Feyerabend', {
    invented: ['epistemologisk-anarkisme'],
    member: ['videnskabsfilosofi'],
    influencedBy: ['popper', 'kuhn', 'wittgenstein'],
    works: ['feyerabend-mod-metoden'],
  }),
  P('davidson', 'Donald Davidson', 'Donald Davidson', 'midt-1900-tal', 1917, 2003, 'Donald_Davidson_(philosopher)', {
    invented: ['anomal-monisme', 'radikal-fortolkning'],
    member: ['analytisk-filosofi'],
    influencedBy: ['quine', 'wittgenstein', 'anscombe'],
    works: ['davidson-handlinger'],
  }),
  P('goodman', 'Nelson Goodman', 'Nelson Goodman', 'midt-1900-tal', 1906, 1998, 'Nelson_Goodman', {
    invented: ['nyt-induktionsproblem', 'konstruktionisme', 'symbolteori'],
    influencedBy: ['hume', 'carnap', 'quine'],
    works: ['goodman-kendsgerninger'],
  }),
  P('kripke', 'Saul Kripke', 'Saul Kripke', 'midt-1900-tal', 1940, 2022, 'Saul_Kripke', {
    invented: ['mulige-verdener', 'modallogik', 'stiv-identifikation'],
    member: ['analytisk-filosofi'],
    influencedBy: ['frege', 'russell', 'wittgenstein'],
    works: ['kripke-navngivning'],
  }),

  // ═══════════════════════ SEN 1900-TAL OG NUTID ═══════════════════════
  P('foucault', 'Michel Foucault', 'Michel Foucault', 'sen-1900-tal-og-nutid', 1926, 1984, 'Michel_Foucault', {
    invented: ['magt-viden', 'biopolitik', 'diskursanalyse'],
    founded: ['poststrukturalisme'],
    member: ['kontinental-filosofi'],
    influencedBy: ['nietzsche', 'heidegger', 'bachelard', 'althusser'],
    works: ['foucault-overvaagning-og-straf', 'foucault-seksualitetens-historie'],
  }),
  P('derrida', 'Jacques Derrida', 'Jacques Derrida', 'sen-1900-tal-og-nutid', 1930, 2004, 'Jacques_Derrida', {
    invented: ['dekonstruktion', 'differance', 'logocentrisme'],
    revised: ['faenomenologi'],
    member: ['poststrukturalisme'],
    influencedBy: ['heidegger', 'husserl', 'nietzsche', 'levinas'],
    works: ['derrida-grammatologien', 'derrida-skriften-og-differancen'],
  }),
  P('deleuze', 'Gilles Deleuze', 'Gilles Deleuze', 'sen-1900-tal-og-nutid', 1925, 1995, 'Gilles_Deleuze', {
    invented: ['rhizom', 'differens-og-gentagelse', 'immanens'],
    member: ['poststrukturalisme'],
    influencedBy: ['nietzsche', 'bergson', 'spinoza', 'hume'],
    works: ['deleuze-tusind-plateauer'],
  }),
  P('habermas', 'Jürgen Habermas', 'Jürgen Habermas', 'sen-1900-tal-og-nutid', 1929, 2026, 'J%C3%BCrgen_Habermas', {
    invented: ['kommunikativ-handlen', 'diskursetik', 'offentlighed'],
    revised: ['kritisk-teori'],
    member: ['kritisk-teori'],
    influencedBy: ['adorno', 'kant', 'hegel'],
    works: ['habermas-kommunikativ-handlen', 'habermas-offentlighed'],
  }),
  P('chomsky', 'Noam Chomsky', 'Noam Chomsky', 'sen-1900-tal-og-nutid', 1928, 2026, 'Noam_Chomsky', {
    invented: ['generativ-grammatik', 'nativisme', 'mediekritik', 'anarkosyndikalisme'],
    member: ['anarkisme'],
    influencedBy: ['descartes', 'russell', 'hume'],
    works: ['chomsky-syntaktiske-strukturer', 'chomsky-manufacturing-consent'],
  }),
  P('putnam', 'Hilary Putnam', 'Hilary Putnam', 'sen-1900-tal-og-nutid', 1926, 2016, 'Hilary_Putnam', {
    invented: ['funktionalisme', 'semantisk-eksternalisme', 'hjerne-i-et-kar'],
    member: ['analytisk-filosofi'],
    influencedBy: ['quine', 'wittgenstein', 'james'],
    works: ['putnam-fornuft-sandhed-historie'],
  }),
  P('rorty', 'Richard Rorty', 'Richard Rorty', 'sen-1900-tal-og-nutid', 1931, 2007, 'Richard_Rorty', {
    invented: ['neopragmatisme', 'anti-fundamentisme', 'liberal-ironiker'],
    member: ['pragmatisme'],
    influencedBy: ['dewey', 'heidegger', 'wittgenstein'],
    works: ['rorty-filosofi-og-spejlet'],
  }),
  P('dennett', 'Daniel Dennett', 'Daniel Dennett', 'sen-1900-tal-og-nutid', 1942, 2024, 'Daniel_Dennett', {
    invented: ['kompatibilisme', 'multiple-drafts', 'evolutionaer-filosofi'],
    member: ['analytisk-filosofi'],
    influencedBy: ['quine', 'ryle', 'davidson'],
    works: ['dennett-bevidsthed'],
  }),
  P('nozick', 'Robert Nozick', 'Robert Nozick', 'sen-1900-tal-og-nutid', 1938, 2002, 'Robert_Nozick', {
    invented: ['rettighedsteori', 'minimalstaten'],
    member: ['libertarianisme'],
    influencedBy: ['locke', 'hayek', 'rand'],
    works: ['nozick-anarki-stat-utopi'],
  }),
  P('singer', 'Peter Singer', 'Peter Singer', 'sen-1900-tal-og-nutid', 1946, 2026, 'Peter_Singer', {
    invented: ['praeferenceutilitarisme', 'dyreetik', 'effektiv-altruisme', 'artsformynderi'],
    influencedBy: ['bentham', 'mill', 'goodman'],
    works: ['singer-dyrenes-frigoerelse'],
  }),
  P('zizek', 'Slavoj Žižek', 'Slavoj Žižek', 'sen-1900-tal-og-nutid', 1949, 2026, 'Slavoj_%C5%BDi%C5%BEek', {
    invented: ['ideologikritik', 'lacansk-marxisme'],
    member: ['vestlig-marxisme'],
    influencedBy: ['hegel', 'marx', 'adorno'],
    works: ['zizek-ideologiens-sublime-objekt'],
  }),
  P('butler', 'Judith Butler', 'Judith Butler', 'sen-1900-tal-og-nutid', 1956, 2026, 'Judith_Butler', {
    invented: ['performativitet', 'koensteori', 'queer-teori'],
    member: ['feministisk-filosofi', 'poststrukturalisme'],
    influencedBy: ['foucault', 'derrida', 'beauvoir', 'austin'],
    works: ['butler-koenets-besvaer'],
  }),
  P('badiou', 'Alain Badiou', 'Alain Badiou', 'sen-1900-tal-og-nutid', 1937, 2026, 'Alain_Badiou', {
    invented: ['begivenhedsfilosofi', 'sandhedsprocedurer'],
    influencedBy: ['althusser', 'deleuze', 'platon'],
    works: ['badiou-vaeren-og-begivenhed'],
  }),
  P('macintyre', 'Alasdair MacIntyre', 'Alasdair MacIntyre', 'sen-1900-tal-og-nutid', 1929, 2026, 'Alasdair_MacIntyre', {
    founded: ['kommunitarisme'],
    developed: ['dydsetik'],
    influencedBy: ['aristoteles', 'aquinas', 'marx'],
    critiqued: ['deontologi'],
    works: ['macintyre-after-virtue'],
  }),
  P('taylor', 'Charles Taylor', 'Charles Taylor', 'sen-1900-tal-og-nutid', 1931, 2026, 'Charles_Taylor_(philosopher)', {
    invented: ['autenticitet', 'multikulturalisme'],
    member: ['kommunitarisme'],
    influencedBy: ['hegel', 'merleau-ponty', 'macintyre'],
    works: ['taylor-selvets-kilder'],
  }),
  P('nussbaum', 'Martha Nussbaum', 'Martha Nussbaum', 'sen-1900-tal-og-nutid', 1947, 2026, 'Martha_Nussbaum', {
    invented: ['kapabilitetstilgangen', 'kosmopolitisme'],
    developed: ['dydsetik', 'dyreetik'],
    influencedBy: ['aristoteles', 'mill', 'macintyre'],
    works: ['nussbaum-det-gode-livs-skaerhed'],
  }),
  P('west', 'Cornel West', 'Cornel West', 'sen-1900-tal-og-nutid', 1953, 2026, 'Cornel_West', {
    invented: ['profetisk-pragmatisme', 'racekritik'],
    member: ['pragmatisme'],
    influencedBy: ['dewey', 'rorty', 'benjamin'],
    works: ['west-race-matters'],
  }),
  P('bloom', 'Allan Bloom', 'Allan Bloom', 'sen-1900-tal-og-nutid', 1930, 1992, 'Allan_Bloom', {
    invented: ['kulturkritik', 'kulturel-relativisme'],
    influencedBy: ['strauss', 'platon', 'rousseau'],
    works: ['bloom-american-mind'],
  }),

  // ═════════════════════════════ ØSTLIG FILOSOFI ═════════════════════════════
  P('konfucius', 'Konfucius', 'Confucius', 'klassisk-kina', -551, -479, 'Confucius', {
    invented: ['ren-medmenneskelighed', 'li-ritualer', 'den-edle-mand', 'meritokrati'],
    founded: ['konfucianisme'],
    works: ['konfucius-analekterne'],
  }),
  P('laozi', 'Lao Tzu', 'Laozi', 'klassisk-kina', -571, -471, 'Laozi', {
    invented: ['wu-wei', 'dao', 'naturlig-harmoni'],
    founded: ['daoisme'],
    works: ['laozi-daodejing'],
  }),

  // ══════════ PÆDAGOGIK, LÆRING, MOTIVATION, BARNDOM OG LEG ══════════
  // Tænkere hvis begreber har sat sig i institutioner og praksis: skole,
  // læreruddannelse, børnehave, leg, omsorg og arbejdsliv. Kronologien ligger
  // i `era`-feltet, og hver ny kant til et fænomen bærer sin kilde
  // (se KILDER og `kilder` i data/concepts.js).
  P('comenius', 'John Amos Comenius', 'John Amos Comenius', 'renaessancen', 1592, 1670, 'John_Amos_Comenius', {
    invented: ['pansofisme', 'didaktik'],
    influencedBy: ['bacon'],
    works: ['comenius-didactica-magna', 'comenius-orbis-pictus'],
  }),
  P('pestalozzi', 'Johann Heinrich Pestalozzi', 'Johann Heinrich Pestalozzi', 'oplysningen', 1746, 1827, 'Johann_Heinrich_Pestalozzi', {
    invented: ['elementarmetoden'],
    influencedBy: ['rousseau'],
    works: ['pestalozzi-leonard-og-gertrud'],
  }),
  P('herbart', 'Johann Friedrich Herbart', 'Johann Friedrich Herbart', 'tysk-idealisme', 1776, 1841, 'Johann_Friedrich_Herbart', {
    invented: ['videnskabelig-paedagogik'],
    influencedBy: ['kant', 'pestalozzi'],
    works: ['herbart-almindelig-paedagogik'],
  }),
  P('frobel', 'Friedrich Fröbel', 'Friedrich Fröbel', 'tysk-idealisme', 1782, 1852, 'Friedrich_Fr%C3%B6bel', {
    invented: ['leg-som-dannelse'],
    influencedBy: ['pestalozzi', 'schelling'],
    works: ['frobel-menneskets-opdragelse'],
  }),
  P('grundtvig', 'N.F.S. Grundtvig', 'N. F. S. Grundtvig', '1800-tallet', 1783, 1872, 'N._F._S._Grundtvig', {
    invented: ['skole-for-livet', 'det-levende-ord'],
    works: ['grundtvig-nordens-mytologi'],
  }),
  P('kold', 'Christen Kold', 'Christen Kold', '1800-tallet', 1816, 1870, 'Christen_Kold', {
    developed: ['det-levende-ord'],
    influencedBy: ['grundtvig'],
  }),
  P('montessori', 'Maria Montessori', 'Maria Montessori', 'tidligt-1900-tal', 1870, 1952, 'Maria_Montessori', {
    invented: ['forberedte-omgivelser'],
    works: ['montessori-metoden'],
  }),
  P('huizinga', 'Johan Huizinga', 'Johan Huizinga', 'tidligt-1900-tal', 1872, 1945, 'Johan_Huizinga', {
    invented: ['leg-som-kultur'],
    works: ['huizinga-homo-ludens'],
  }),
  P('vygotsky', 'Lev Vygotsky', 'Lev Vygotsky', 'tidligt-1900-tal', 1896, 1934, 'Lev_Vygotsky', {
    invented: ['zonen-for-naermeste-udvikling', 'legens-betydning'],
    influencedBy: ['marx'],
    works: ['vygotsky-taenkning-og-sprog'],
  }),
  P('piaget', 'Jean Piaget', 'Jean Piaget', 'midt-1900-tal', 1896, 1980, 'Jean_Piaget', {
    invented: ['kognitiv-udviklingstrappe'],
    works: ['piaget-sprog-og-taenkning', 'piaget-leg-drom-efterligning'],
  }),
  P('winnicott', 'Donald Winnicott', 'Donald Winnicott', 'midt-1900-tal', 1896, 1971, 'Donald_Winnicott', {
    invented: ['overgangsobjekt'],
    influencedBy: ['freud'],
    works: ['winnicott-leg-og-virkelighed'],
  }),
  P('erikson', 'Erik Erikson', 'Erik Erikson', 'midt-1900-tal', 1902, 1994, 'Erik_Erikson', {
    invented: ['psykosociale-stadier'],
    influencedBy: ['freud'],
    works: ['erikson-childhood-and-society'],
  }),
  P('bowlby', 'John Bowlby', 'John Bowlby', 'midt-1900-tal', 1907, 1990, 'John_Bowlby', {
    invented: ['tilknytningsteori'],
    influencedBy: ['freud'],
    works: ['bowlby-maternal-care'],
  }),
  P('maslow', 'Abraham Maslow', 'Abraham Maslow', 'midt-1900-tal', 1908, 1970, 'Abraham_Maslow', {
    invented: ['behovspyramiden'],
    works: ['maslow-motivation-og-personlighed'],
  }),
  P('bloom-benjamin', 'Benjamin Bloom', 'Benjamin Bloom', 'midt-1900-tal', 1913, 1999, 'Benjamin_Bloom', {
    invented: ['blooms-taksonomi'],
    works: ['bloom-taksonomi'],
  }),
  P('caillois', 'Roger Caillois', 'Roger Caillois', 'midt-1900-tal', 1913, 1978, 'Roger_Caillois', {
    invented: ['legenes-former'],
    influencedBy: ['huizinga'],
    works: ['caillois-leg-og-spil'],
  }),
  P('aries', 'Philippe Ariès', 'Philippe Ariès', 'midt-1900-tal', 1914, 1984, 'Philippe_Ari%C3%A8s', {
    invented: ['barndommen-som-konstruktion'],
    works: ['aries-barndommens-historie'],
  }),
  P('bruner', 'Jerome Bruner', 'Jerome Bruner', 'midt-1900-tal', 1915, 2016, 'Jerome_Bruner', {
    invented: ['stilladsering', 'spiral-laereplan'],
    influencedBy: ['piaget', 'vygotsky'],
    works: ['bruner-process-of-education', 'wood-bruner-ross-stilladsering'],
  }),
  P('herzberg', 'Frederick Herzberg', 'Frederick Herzberg', 'midt-1900-tal', 1923, 2000, 'Frederick_Herzberg', {
    invented: ['tofaktorteori'],
    influencedBy: ['maslow'],
    works: ['herzberg-one-more-time'],
  }),
  P('polanyi', 'Michael Polanyi', 'Michael Polanyi', 'midt-1900-tal', 1891, 1976, 'Michael_Polanyi', {
    invented: ['tavs-viden'],
    works: ['polanyi-tavs-viden'],
  }),
  P('freire', 'Paulo Freire', 'Paulo Freire', 'sen-1900-tal-og-nutid', 1921, 1997, 'Paulo_Freire', {
    invented: ['kritisk-paedagogik'],
    influencedBy: ['marx'],
    works: ['freire-de-undertryktes-paedagogik'],
  }),
  P('illich', 'Ivan Illich', 'Ivan Illich', 'sen-1900-tal-og-nutid', 1926, 2002, 'Ivan_Illich', {
    invented: ['afskoling'],
    works: ['illich-deschooling'],
  }),
  P('bandura', 'Albert Bandura', 'Albert Bandura', 'sen-1900-tal-og-nutid', 1925, 2021, 'Albert_Bandura', {
    invented: ['tiltro-til-egen-formaaen'],
    works: ['bandura-self-efficacy'],
  }),
  P('gettier', 'Edmund Gettier', 'Edmund Gettier', 'sen-1900-tal-og-nutid', 1927, 2021, 'Edmund_Gettier', {
    invented: ['gettier-problemet'],
    works: ['gettier-artikel'],
  }),
  P('luckmann', 'Thomas Luckmann', 'Thomas Luckmann', 'sen-1900-tal-og-nutid', 1927, 2016, 'Thomas_Luckmann', {
    developed: ['social-konstruktion'],
    works: ['berger-luckmann-social-konstruktion'],
  }),
  P('berger', 'Peter L. Berger', 'Peter L. Berger', 'sen-1900-tal-og-nutid', 1929, 2017, 'Peter_L._Berger', {
    invented: ['social-konstruktion'],
    works: ['berger-luckmann-social-konstruktion'],
  }),
  P('csikszentmihalyi', 'Mihaly Csikszentmihalyi', 'Mihaly Csikszentmihalyi', 'sen-1900-tal-og-nutid', 1934, 2021, 'Mihaly_Csikszentmihalyi', {
    invented: ['flow'],
    influencedBy: ['maslow'],
    works: ['csikszentmihalyi-flow'],
  }),
  P('lave', 'Jean Lave', 'Jean Lave', 'sen-1900-tal-og-nutid', 1939, 2026, 'Jean_Lave', {
    invented: ['situeret-laering'],
    works: ['lave-wenger-situeret-laering'],
  }),
  P('dweck', 'Carol Dweck', 'Carol Dweck', 'sen-1900-tal-og-nutid', 1942, 2026, 'Carol_Dweck', {
    invented: ['vaeksttankesaet'],
    influencedBy: ['bandura'],
    works: ['dweck-mindset'],
  }),
  P('wenger', 'Etienne Wenger', 'Etienne Wenger', 'sen-1900-tal-og-nutid', 1952, 2026, 'Etienne_Wenger', {
    developed: ['situeret-laering'],
    influencedBy: ['lave'],
    works: ['lave-wenger-situeret-laering'],
  }),
];
