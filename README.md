# Filsofografen

En Neo4j-grafdatabase over filosoffer fra oldtiden til i dag, de begreber de har
opfundet og videreudviklet, og den kulturskabte virkelighed begreberne har givet
ophav til: bøger, film, bygninger, politiske ideologier, moralske kodekser,
pædagogiske teorier, lovgivning, institutioner, bevægelser, forfatninger m.m.

Bygger på den samme idé som Simon Rapers *"Graphing the History of Philosophy"*
(`influenced by`-data fra Wikipedia/DBpedia) og udvider den med en anden akse:
**filosof → begreb → artefakt**.

```
(Philosopher) --INVENTED/DEVELOPED/REVISED/CRITIQUED--> (Concept)
(Philosopher) --INFLUENCED--> (Philosopher)
(Concept)     --GAVE_RISE_TO/EXPRESSED_IN--> (Artifact)
```

## Indhold

| | |
|---|---|
| Filosoffer | **183** |
| Begreber | **388** + **50** traditioner = **438** begrebsnoder |
| Artefakter | **410** (22 typer) |
| Epoker | **10** |
| Relationer | **2584** |
| Billeder | **572** af 1041 noder (resten genererede planeter) |

Alt i `data/` er almindelige ES-moduler, så datasættet er let at rette i og
versionere. `npm run build` genererer hele leverancen.

```
data/eras.js          epoker i kronologisk kæde
data/traditions.js    skoler og strømninger (bliver :Concept:Tradition)
data/concepts.js      begreber, doktriner, -ismer og metoder
data/artifacts.js     bøger, film, bygninger, ideologier, kodekser, lovgivning …
data/philosophers.js  filosoffer + opfundet/videreudviklet/kritiseret + påvirkning
data/images.js        kuraterede Wikipedia-titler for artefaktbilleder
scripts/model.js      samler data til én model og validerer alle referencer
scripts/build.js      udsender Cypher, CSV, JSON og den offline viser
scripts/images.js     henter og cacher et billede pr. node (Wikipedia)
scripts/layout.js     3D-kraftlayout, bages ind i bygget
scripts/validate.js   rapport over dækning og datakvalitet
scripts/verify.js     uafhængig kontrol af build/ (kører uden Neo4j)
scripts/serve.js      lille statisk server, så viser + billeder kan ses over http
templates/viewer.html skabelon for univers-viseren
```

## Kommandoer

```bash
npm run validate   # datatjek + dækningsrapport
npm run build      # genererer build/
npm run verify     # kontrollerer det genererede build/ mod kravene
npm run check      # build + validate + verify
npm run images     # henter billeder pr. node (--nonfree medtager fair use)
npm run serve      # serverer build/ på http://127.0.0.1:5180
npm run load       # starter Neo4j i Docker og indlæser grafen
```

`build/` indeholder:

| Fil | Indhold |
|---|---|
| `filosofi.cypher` | ~3.700 Cypher-linjer, klar til `cypher-shell -f` |
| `csv/*.csv` | `neo4j-admin database import`-format (5 filer) |
| `filosofi.json` | hele grafen som nodes/links inkl. 3D-koordinater – til egne værktøjer |
| `index.html` | selvstændig offline univers-viser (ingen afhængigheder) |
| `images/*.jpg` + `images.json` | ét billede pr. node der har et, ellers genereret planet |
| `images-report.txt` | hvilke noder fik hvilket billede – og hvorfor nogle ikke gjorde |

## Indlæsning i Neo4j

### Nemt: Docker + Cypher

```bash
./scripts/load-neo4j.sh          # starter Neo4j, venter, indlæser grafen
```

Åbn derefter Neo4j Browser på <http://localhost:7474> (login `neo4j` / `filosoffer`).

### Manuelt

```bash
docker compose up -d neo4j
docker compose exec -T neo4j cypher-shell -u neo4j -p filosoffer -f /import/filosofi.cypher
```

Har du en Neo4j i forvejen:

```bash
cypher-shell -a neo4j://localhost:7687 -u neo4j -p <kode> -f build/filosofi.cypher
```

Kører du med en eksisterende, tom database, kan du i stedet bulkindlæse CSV-filerne
(husk at stoppe databasen først):

```bash
neo4j-admin database import full neo4j \
  --nodes=build/csv/nodes_philosophers.csv \
  --nodes=build/csv/nodes_concepts.csv \
  --nodes=build/csv/nodes_artifacts.csv \
  --nodes=build/csv/nodes_eras.csv \
  --relationships=build/csv/rels.csv \
  --overwrite-destination
```

Forvalgte unikhedsbegrænsninger på `id` for `:Philosopher`, `:Concept`,
`:Artifact` og `:Era` oprettes af Cypher-filen, så gentagne kørsler ikke giver
dubletter.

## Skema

### Noder

| Label | Egenskaber |
|---|---|
| `:Philosopher` | `id`, `da`, `en`, `born`, `died`, `wiki` |
| `:Concept` (`:Tradition` for skoler/strømninger) | `id`, `da`, `en`, `kind`, `note` |
| `:Artifact` + en type-label | `id`, `da`, `type`, `year`, `en`, `note` |
| `:Era` | `id`, `da`, `en`, `start`, `end`, `order`, `note` |

Artefakt-typer: `Book`, `Text`, `Poem`, `Film`, `TVSeries`, `Building`,
`Institution`, `Ideology`, `State`, `Party`, `Revolution`, `Movement`,
`MoralCode`, `Pedagogy`, `Legislation`, `Constitution`, `Artwork`,
`ScientificTheory`, `Religion`, `Technology`, `Event`, `Practice`.

### Relationer

| Relation | Betydning |
|---|---|
| `(:Philosopher)-[:INVENTED]->(:Concept)` | filosoffen har opfundet/grundlagt begrebet |
| `(:Philosopher)-[:DEVELOPED]->(:Concept)` | videreudviklet |
| `(:Philosopher)-[:REVISED]->(:Concept)` | forandret/omarbejdet |
| `(:Philosopher)-[:CRITIQUED]->(:Concept)` | kritiseret |
| `(:Philosopher)-[:FOUNDED]->(:Concept:Tradition)` | grundlagt en skole/strømning |
| `(:Philosopher)-[:MEMBER_OF]->(:Concept:Tradition)` | tilhører en skole/strømning |
| `(:Philosopher)-[:INFLUENCED]->(:Philosopher)` | påvirkning (fra den påvirkende til den påvirkede) |
| `(:Philosopher)-[:AUTHORED]->(:Artifact)` | forfatter til tekst |
| `(:Philosopher)-[:CREATED]->(:Artifact)` | har skabt fx en bygning eller institution |
| `(:Philosopher)-[:LIVED_IN]->(:Era)` | levede i en epoke |
| `(:Concept)-[:EXPRESSED_IN]->(:Artifact)` | begrebet er udtrykt i (typisk grundteksten) |
| `(:Concept)-[:GAVE_RISE_TO]->(:Artifact)` | begrebet har givet ophav til |
| `(:Concept)-[:DEVELOPS_FROM]->(:Concept)` | begrebet udspringer af et andet |
| `(:Concept)-[:CENTRAL_IN]->(:Era)` | begrebet er centralt i epoken |
| `(:Era)-[:FOLLOWS]->(:Era)` | kronologisk rækkefølge |

`INFLUENCED`-kanterne bærer egenskaben `kilde`.

## Eksempelqueries

**Hvad opfandt Kant, og hvad gav det ophav til?**

```cypher
MATCH (p:Philosopher {id: 'kant'})-[:INVENTED]->(c:Concept)
OPTIONAL MATCH (c)-[:GAVE_RISE_TO]->(a:Artifact)
RETURN c.da AS begreb, collect(a.da) AS artefakter;
```

**Hvem har videreudviklet eller forandret dydsetik?**

```cypher
MATCH (p:Philosopher)-[r:DEVELOPED|REVISED|CRITIQUED]->(c:Concept {id: 'dydsetik'})
RETURN type(r) AS relation, p.da AS filosof;
```

**Den fulde kæde filosof → begreb → artefakt**

```cypher
MATCH (p:Philosopher)-[:INVENTED]->(c:Concept)-[:GAVE_RISE_TO]->(a:Artifact)
RETURN p.da AS filosof, c.da AS begreb, a.da AS artefakt, a.type AS type
ORDER BY filosof, begreb LIMIT 25;
```

**Hvilke politiske ideologier og lovtekster udspringer af filosofiske begreber?**

```cypher
MATCH (c:Concept)-[:GAVE_RISE_TO]->(a:Artifact)
WHERE a.type IN ['Ideology', 'Legislation', 'Constitution', 'MoralCode']
MATCH (p:Philosopher)-[:INVENTED|DEVELOPED]->(c)
RETURN a.type AS type, a.da AS artefakt, c.da AS begreb, collect(p.da) AS taenkere
ORDER BY type, artefakt;
```

**Film og bygninger som begreberne har givet ophav til**

```cypher
MATCH (c:Concept)-[:GAVE_RISE_TO]->(a:Artifact)
WHERE a.type IN ['Film', 'Building', 'Artwork']
RETURN a.type AS type, a.da AS artefakt, a.year AS aar, c.da AS begreb
ORDER BY aar;
```

**Kants intellektuelle slægtstræ to led tilbage**

```cypher
MATCH (p:Philosopher {id: 'kant'})<-[:INFLUENCED*1..2]-(q:Philosopher)
RETURN DISTINCT q.da AS forgaenger SKIP 0;
```

**De mest forbundne filosoffer (Raper-grafens knudepunkter)**

```cypher
MATCH (p:Philosopher)-[:INFLUENCED]-(q:Philosopher)
RETURN p.da AS filosof, count(q) AS forbindelser
ORDER BY forbindelser DESC LIMIT 12;
```

**Alle begreber uden artefakt – skal give nul rækker**

```cypher
MATCH (c:Concept)
WHERE NOT (c)-[:EXPRESSED_IN|GAVE_RISE_TO]->(:Artifact)
RETURN c.id, c.da;
```

## Univers-viseren

`build/index.html` viser grafen som et **univers**: hver node er en planet med
en fast plads i rummet og et billede på sig, og kanterne er lysende baner gennem
rummet. Der er ingen afhængigheder – alt ligger i den ene fil, og billederne
ligger ved siden af i `build/images/`.

```bash
npm run serve     # åbn http://127.0.0.1:5180
```

(Serveren er den nemmeste vej, fordi billederne indlæses relativt. `index.html`
kan også åbnes direkte som fil i de fleste browsere.)

**Navigation**

| Handling | Virkning |
|---|---|
| Træk | roterer universet (kameraet kredser om grafen) |
| Rul | zoomer ind og ud |
| Højreklik-træk | panorerer |
| Klik / dobbeltklik | vælger en planet / låser kameraet på den |
| `Esc` | rydder valg, sti og svar |

Filtre: **Filosoffer / Begreber / Alt** samt afkrydsning for begreber, artefakter
og epoker. I værktøjslinjen sidder desuden **Kanter**, hvor hver evidensgrad kan
slås til og fra (se afsnittet om evidensgrader nedenfor). Når du vælger en
planet, dæmpes alt andet, og detaljepanelet viser alle ind- og udgående
relationer med klikbare links.

**Spørgsmål**

Skriv et dansk spørgsmål, eller brug en af de forvalgte:

- «Hvad opfandt Kant?» → filosoffens opfundne og grundlagte begreber
- «Hvilke begreber videreudviklede Heidegger?» → `DEVELOPED`/`REVISED`
- «Hvem kritiserede Platon?» → kritik af personen *eller* af hans begreber
- «Hvilke film udspringer af nihilisme?» → artefakter af en bestemt type
- «Hvad skrev Hannah Arendt?» → værker
- «Find stien fra Platon til Nietzsche» → konceptuel sti
- «Hvor meget af grafen er dokumenteret?» → evidensgraderne med antal, og
  universet filtreres til den grad man klikker på

Spørgsmålet opløses mod grafen: verber (opfinde, videreudvikle, kritisere,
skrive, udspringe …) vælger relationstype, spørgeordet (`hvem` / `hvad`)
vælger retning, og en artefakttype (`film`, `bygning`, `lov`) filtrerer
svaret. Matcher intet, svarer viseren ærligt hvad noden *har* i stedet for at
gætte.

**Konceptuelle stier**

Vælg en start- og slutnode (eller spørg efter en sti). Viseren finder den
korteste vej gennem grafen på tværs af alle relationstyper, tegner den som en
gylden kæde og sender et lysglimt gennem den – fx
`Platon → Idealismen → Hegel: Åndens fænomenologi → Dialektik → Marx: Kapitalen`.

## Tidslinjen

Knappen **Tidslinje** lægger det samme univers ud efter årstal: x-aksen er tid, og
filosoffer, begreber og artefakter har hver sin bane med epokerne som bånd bagved.
Træk for at panorere, og rul for at zoome om markøren, så det årstal man peger på
bliver stående. Spørgsmålene «vis tidslinjen» og «hvornår levede Kant?» fører
dertil, og i oversigten kan man klikke på en epoke for at zoome til dens tidsrum.

| Hvad | Hvor årstallet kommer fra |
|---|---|
| Filosoffer (183) | født og død – markøren står ved fødslen |
| Artefakter (410) | `year` i `data/artifacts.js` |
| Begreber (438) | **afledt** – se nedenfor |

Begreberne har ikke eget årstal, så deres plads er udledt og lagt i grafen som
`aar` sammen med `aarKilde`, der siger hvad placeringen hviler på:

| `aarKilde` | Betydning | Antal |
|---|---|---:|
| `værk` | det tidligste værk, begrebet er udtrykt i | 438 |
| `fænomen` | det tidligste fænomen, det gav ophav til | 0 |
| `tænker` | fødselsåret for den tidligste tænker bag det | 0 |

Rækkefølgen betyder at et begreb placeres der, hvor det **først optræder i et
værk** – fx står «Myndighed – ud af selvforskyldt umyndighed» ved **1784**
(Kants essay) og «Behovspyramiden» ved **1954** (Maslows bog), mens «Leg som
dannelse» står ved **1826** hos Fröbel. Det er en afledning, ikke en kilde, og
viseren skriver det derfor som «≈ 1784 (efter det tidligste værk)» i panelet.

Tidslinjen er et diagram og ikke en ny 3D-visning: x-aksen zoomer med årstallene,
men banerne og rækkerne holder deres plads på skærmen, og markørerne har fast
størrelse, så et tæt årti kan skilles ad ved at zoome ind. Noder der ligger tæt i
tid lægges i rækker over og under banens midte, og navnene skrives kun hvor der er
plads – de vigtige (valgt, hover, sti) først.

I grafen kan fordelingen slås op direkte:

```cypher
MATCH (n:Concept) WHERE n.aar IS NOT NULL
RETURN n.aarKilde AS grundlag, count(*) AS antal
ORDER BY antal DESC;
```

## Billeder pr. node

`npm run images` henter et artikel-thumbnail fra Wikipedia til hver node og
cacher det i `build/images/` (572 af 1041 noder). Resten får en **genereret
planet**, som er deterministisk udregnet ud fra nodens id – samme node har
samme planet hver gang.

Hvilket billede en node får, afgøres af nodens *egne* oplysninger:

| Gruppe | Titel der slås op |
|---|---|
| Filosoffer | `wiki`-feltet i `data/philosophers.js` |
| Begreber, traditioner, epoker | nodens `en`-felt (det engelske begreb) |
| Artefakter | `data/images.js` – kurateret, fordi bøgers engelske titler er tvetydige |

Ingen billeder hentes på et gæt. En node får kun et billede hvis

- artiklen findes og **ikke** er en flertydig side,
- artikelbilledet ikke er et skabelonikon, og
- begreber ikke ender på en **personside** (fx «Being-in-the-world» → Heideggers
  biografi). I de tilfælde bruges den genererede planet i stedet.

Standard er kun **frit licenserede** billeder. Filmplakater og andre fair
use-billeder kræver `--nonfree` (til personligt brug).

## Begrebernes vej ind i menneskelivet

Ud over grundteksterne peger grafen på de **fænomener og koncepter i menneskelivet**,
som begreberne har sat spor i: institutioner, lovgivning, praksisser og bevægelser.
Hver sådan kant bærer sin egen **kilde**, så påstanden kan efterprøves.

| Filosof → begreb | Fænomen (type, år) | Kilde |
|---|---|---|
| Kant → Den evige fred | Folkeforbundet (1920), FN-pagten (1945) | [UN Geneva](https://www.ungeneva.org/en/about/league-of-nations/overview), [UN Charter](https://www.un.org/en/about-us/un-charter) |
| Grotius → Mare liberum | Folkeretten (1625), Genève-konventionerne (1949) | [IEP](https://iep.utm.edu/grotius/), [ICRC](https://www.icrc.org/en/law-and-policy/geneva-conventions-and-their-commentaries) |
| Naturret | Den Europæiske Menneskerettighedskonvention (1950) | [lex.dk](https://lex.dk/Den_Europ%C3%A6iske_Menneskerettighedskonvention) |
| Keynes → Keynesianismen | IMF (1944), Verdensbanken (1944) | [IMF](https://www.imf.org/external/pubs/ft/fandd/2014/09/basics.htm), [World Bank](https://www.worldbank.org/en/archive/history/exhibits/Bretton-Woods-and-the-Birth-of-the-World-Bank) |
| Stoisk livskunst (Epiktet) | Kognitiv adfærdsterapi (1955) | [Cavanna et al. 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10175387/), [lex.dk](https://lex.dk/kognitiv_adf%C3%A6rdsterapi) |
| Eksistensfilosofi | Eksistentiel psykoterapi (1946) | [SEP](https://plato.stanford.edu/entries/existentialism/) |
| Autonomi (Kant) | Informeret samtykke (1947), Helsingforsdeklarationen (1964) | [SEP](https://plato.stanford.edu/entries/informed-consent/), [WMA](https://www.wma.net/policies-post/wma-declaration-of-helsinki/) |
| Utilitarisme | Cost-benefit-analysen (1936) | [Marseille & Kahn 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6446322/) |
| Artsformynderi (Singer) | Dyrevelfærdsloven | [Animal Legal & Historical Center](https://www.animallaw.info/article/overview-historical-materials) |
| Magt/viden (Foucault) | Fængselsinformationsgruppen GIP (1971) | [SEP](https://plato.stanford.edu/entries/foucault/) |
| Klassekamp | ILO (1919), otte-timers-arbejdsdagen (1919) | [ILO](https://www.ilo.org/resource/article/convention-no-1-landmark-workers%E2%80%99-rights) |
| Kvindefrigørelse | Kvindernes valgret i Danmark (1915) | [danmarkshistorien.lex.dk](https://danmarkshistorien.lex.dk/Kvindelig_valgret_1849-1915) |
| Oplysningsfilosofien | Skoleloven af 1814 | [Larsen, NJEDH](https://journals.ub.umu.se/index.php/njedh/article/view/85) |
| Perspektivisme (Nietzsche) | Postmodernismen (1979) | [SEP](https://plato.stanford.edu/entries/postmodernism/) |

**Læs kilderne, ikke bare kanterne.** Kanterne er af to slags, og noterne siger
hvilken: *dokumenteret* indflydelse (fx Stoicismen → kognitiv terapi, hvor Ellis og
Beck selv pegede på stoikerne; Keynes → Bretton Woods, hvor IMF og Verdensbanken
selv nævner ham) og *bredt idehistorisk bånd* (fx Mill og kvindernes valgret 1915,
hvor retten kom 46 år senere og ikke kan føres tilbage til én tænker). Moderne
fænomener som peer review, reproduktionskrisen og mindfulness er bevidst **ikke**
ført tilbage til Popper, Kuhn eller Schopenhauer – kilderne understøtter det ikke.

Kilden ligger i grafen som egenskaben `kilde` på relationen:

```cypher
MATCH (c:Concept)-[r:GAVE_RISE_TO]->(a:Artifact)
WHERE r.kilde IS NOT NULL
RETURN c.da AS begreb, a.da AS faenomen, r.kilde AS kilde
ORDER BY begreb;
```

I JSON-eksporten hedder feltet `kildeURL`, og viseren skriver «kilde ↗» ved de
relationer, der har en kilde-URL – i detaljepanelet og i svarene. Har kanten en
fælles proveniens uden URL (fx `Wikipedia/Afledt af Raper 2012`), vises den som
dæmpet tekst i stedet, så den ikke bliver et dødt link.

## Evidensgrader på kanterne

Hver enkelt relation bærer en **evidensgrad**, så det er maskinlæsbart hvad
påstanden hviler på – og så viseren kan farve og filtrere efter det. Graderne
udregnes i `scripts/model.js` (`EVIDENS_REGLER`) og følger kanten med ind i
Cypher, CSV og JSON som `r.evidens`.

| Grad | Kanter | Betydning |
|---|---:|---|
| `belagt` | 60 | Kanten bærer en kilde, der belægger netop denne forbindelse. |
| `afledt` | 379 | Påvirkningen er udledt af et fælles netværk (Wikipedia-lister via Raper 2012), ikke af en kilde på den enkelte kant. |
| `slaegtskab` | 619 | Idehistorisk forbindelse uden en kilde, der belægger netop denne kant. |
| `katalog` | 1526 | Optegnelse over hvem der skrev, grundlagde, kritiserede eller levede hvornår – ikke en påstand om indflydelse. |

Reglen er enkel: en URL på kanten gør den `belagt`, uanset relationstype. Ellers
afgør typen graden – `INFLUENCED` er `afledt` (hele tænker-nettet deler én
udledt proveniens), `GAVE_RISE_TO` og `DEVELOPS_FROM` er `slaegtskab`, og selve
optegnelserne (`AUTHORED`, `INVENTED`, `CRITIQUED`, `MEMBER_OF`, `LIVED_IN` …) er
`katalog`. Forskellen kan slås op direkte i databasen:

```cypher
MATCH ()-[r]->()
RETURN r.evidens AS grad, count(*) AS antal
ORDER BY antal DESC;
```

I viseren står hver kant i sin grads farve: **grøn** = belagt, **gul** = afledt,
**rød stiplet** = slægtskab, **dæmpet blå** = katalogfaktum. Stiplet betyder
«ingen kilde belægger netop denne kant». Tegnforklaringen nederst til venstre
viser antallet pr. grad og filtrerer universet, når man klikker på en grad – og
spørgsmålet «hvor meget af grafen er dokumenteret?» stiller filteret og svarer
med fordelingen. I panelet og i svarene får de svage led et lille mærke
(`afledt`, `slægtskab`), mens `belagt` viser sit kildelink og `katalog` står
umarkeret.

## Pædagogik, læring, motivation, barndom og leg

Samme greb er brugt på de temaer, hvor begreberne har sat sig i skole, børnehave,
opdragelse og arbejdsliv: **tænker → begreb → institution, lov eller praksis**,
med kilden hængende på kanten. 30 nye tænkere og 32 nye begreber kom til på denne
akse.

| Tænker → begreb | Fænomen (type, år) | Kilde |
|---|---|---|
| Comenius → Pansofisme, Didaktik | Den trinopdelte skole (1657), Orbis Sensualium Pictus (1658) | [Britannica](https://www.britannica.com/biography/John-Amos-Comenius), [Encyclopedia.com](https://www.encyclopedia.com/education/encyclopedias-almanacs-transcripts-and-maps/comenius-johann-1592-1670) |
| Pestalozzi → Elementarmetoden | Institutet i Yverdon (1805) | [Britannica](https://www.britannica.com/biography/Johann-Heinrich-Pestalozzi) |
| Herbart → Videnskabelig pædagogik | Det pædagogiske seminar med øvelsesskole (1810) | [Britannica](https://www.britannica.com/topic/Herbartianism) |
| Fröbel → Leg som dannelse | Børnehaven (1871), Frøbelseminariet (1904) | [lex.dk](https://lex.dk/b%C3%B8rnehave), [lex.dk](https://lex.dk/Hedevig_Bagger) |
| Grundtvig → Skolen for livet | Folkehøjskolen (1844), Folkehøjskoleloven (2019) | [Nordics.info](https://nordics.info/show/artikel/folk-high-schools), [UVM](https://eng.uvm.dk/adult-education-and-continuing-training/non-formal-adult-education/) |
| Grundtvig/Kold → Det levende ord | De grundtvig-koldske friskoler (1851) | [lex.dk](https://lex.dk/grundtvig-koldske_friskoler) |
| Locke → Erfaringspædagogik | Forældrevejledning og opdragelsesråd (1693) | [NEH](https://www.neh.gov/article/discovering-childhood) |
| Dewey → Progressiv pædagogik | Laboratorieskolen i Chicago (1896), Projektmetoden (1918) | [Britannica](https://www.britannica.com/topic/University-of-Chicago-Laboratory-Schools), [Kilpatrick 1918](https://education-uk.org/documents/kilpatrick1918/index.html) |
| Montessori → De forberedte omgivelser | Montessori-pædagogikken (1907) | [SEP](https://plato.stanford.edu/entries/montessori-maria/) |
| Piaget → Udviklingstrappen | Udviklingspsykologien | [The Education Hub](https://theeducationhub.org.nz/piagets-theory-of-education/) |
| Vygotsky → Zonen for nærmeste udvikling | Stilladsering i undervisningen (1976) | [Simply Psychology](https://www.simplypsychology.org/zone-of-proximal-development.html) |
| Bruner → Spirallæreplanen | Læreplansreformen efter Sputnik (1960) | [EBSCO](https://www.ebsco.com/research-starters/education/spiral-curriculum/) |
| Bloom → Taksonomien | Læringsmål og evaluering (1956) | [Adams, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4511057/) |
| Polanyi → Tavs viden | Vidensledelse (1991) | [HBR/Nonaka](https://hbr.org/2007/07/the-knowledge-creating-company) |
| Gettier-problemet | Den post-gettierske vidensanalyse (1963) | [IEP](https://iep.utm.edu/gettier/) |
| Berger & Luckmann → Social konstruktion | Konstruktivistisk pædagogik | [Ernest, Exeter](https://www.exeter.ac.uk/research/groups/education/pmej/pome12/article8.htm) |
| Lave & Wenger → Situeret læring | Arbejdspladslæring og mesterlære (1991) | [New Learning](https://newlearningonline.com/new-learning/chapter-6/supporting-material/lave-and-wenger-on-situated-learning) |
| Freire → Kritisk pædagogik | Angicos (1963), deltagende aktionsforskning | [Freire-instituttet](https://angicos50anos.paulofreire.org/en/cronologia/), [Participatory Methods](https://www.participatorymethods.org/resource/an-introduction-to-paulo-freire-and-his-influence-on-participatory-action-research) |
| Maslow → Behovspyramiden | HR og medarbejdermotivation (1954) | [EBSCO](https://www.ebsco.com/research-starters/psychology/maslows-hierarchy-needs/) |
| Herzberg → To-faktor-teorien | Jobberigelse (1968) | [HBR](https://hbr.org/1969/03/job-enrichment-pays-off) |
| Csikszentmihalyi → Flow | Flow som designprincip i spil | [Larche & Dixon 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC8943660/) |
| Bandura → Self-efficacy | Adfærdsændringsinterventioner (2020) | [Cambridge Handbook](https://www.cambridge.org/core/books/handbook-of-behavior-change/selfefficacy-interventions/D4EC41A2F16CB6171058C5B00AE575AB) |
| Dweck → Væksttankesættet | Interventioner i skolen | [Yeager & Dweck 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC8299535/) |
| Erikson → De psykosociale stadier | Udviklingspsykologien | [Baylor](https://openbooks.library.baylor.edu/lifespanhumandevelopment/chapter/chapter-19-1-eriksons-theory-of-psychosocial-development/) |
| Kant → Myndighed | Oplysningsbevægelsen | [Kant 1784](https://www.columbia.edu/acis/ets/CCREAD/etscc/kant.html) |
| Huizinga → Leg som kultur | Spilforskningen | [Game Studies](https://gamestudies.org/0601/articles/rodriges) |
| Caillois → Legens fire former | Spilforskningen | [UNLV](https://oasis.library.unlv.edu/gaming_institute/2023/May25/20/) |
| Winnicott → Overgangsobjektet | Børnepsykoterapi | [Ratnapalan & Batty](https://pmc.ncbi.nlm.nih.gov/articles/PMC2654842/) |
| Bowlby → Tilknytningsteorien | Børneforsorg (1951) | [Van der Horst et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC7496263/) |
| Ariès → Barndommen som historisk størrelse | Barndomshistorien (1960) | [Cambridge](https://www.cambridge.org/core/journals/continuity-and-change/article/philippe-ariess-discovery-of-childhood-imagery-and-historical-evidence/F2008C0AB57FEC1EC3CA13778574360A) |
| FN's Børnekonvention (1989) | Barnet som retssubjekt, artikel 31 om leg | [UNICEF](https://www.unicef.org/child-rights-convention/convention-text) |

**Hvad kilderne ikke kunne bære.** Samme skelnen som ovenfor gælder her. *Dokumenteret
indflydelse* er fx Fröbel → den danske børnehave- og pædagoguddannelse (Bagger
arbejdede udtrykkeligt i hans spor), Herzberg → jobberigelse, Dewey → forsøgsskolen
og Bloom → læringsmål i undervisningen. *Bredt bånd* er fx Rousseau → barncentreret
pædagogik (kilden beskriver et slægtskab, ikke en institutionel arvefølge), båndet
mellem Fröbels leg og den danske byggelegeplads, og forbindelsen mellem Vygotskys
leg og den danske dagtilbudslov.
Bevidst **udeladt**, fordi kilderne ikke understøtter en linje til én tænker: ordet
«scaffolding» tilskrevet Vygotsky (det er Wood, Bruner & Ross 1976), Vroom →
management by objectives (MBO er Druckers, før Vrooms bog), Popper → peer review,
Illich → hjemmeundervisning, de svenske/danske karakter- og PISA-systemer,
Korczak-linjen til Børnekonventionen og Lave & Wengers teori som ophav til mesterlære.
Uforløst er også SDT (Deci & Ryan): de kilder der kunne læses, var PDF-sider og et
dødt teoriside-link, så kæden til skole og arbejdsliv er ikke dokumenteret her.

## Datagrundlag og forbehold

- `INFLUENCED`-relationerne er udtrukket efter samme princip som Rapers graf
  (`influenced by` fra Wikipedia/DBpedia). Enkelte kanter er konsoliderede og
  skal læses som *inspiration*, ikke som dokumenteret direkte indflydelse.
- Artiklen i `Filosoffer Oversigt.md` (Simon Raper, Drunks & Lampposts 2012)
  er brugt som kilde til filosoffernes gruppering og hovedbegreber; resten er
  suppleret fra standardfilosofihistorien og wikidata.
- Begrebs- og artefaktrelationerne er kuraterede, ikke automatisk udtrukne.
  `scripts/validate.js` sikrer, at hvert begreb kan følges til mindst én
  artefakt, og `scripts/verify.js` kontrollerer det færdige build.
- Billederne er hentet fra den engelske Wikipedia og tilhører deres respektive
  rettighedshavere; licensen for den enkelte fil står på dens beskrivelsesside
  på Wikimedia Commons. Billederne ligger kun i det lokale `build/`.
