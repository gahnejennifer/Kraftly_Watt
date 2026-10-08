# Prestanda

## Så mäter vi

Dashboarden: Chrome DevTools → Performance → Local metrics, produktionsbygget
(`npm run build && npm run preview` mot lokala mock-API:t), enhetsläge iPhone 12 Pro,
Fast 4G, CPU no throttling, cache av, median av tre omladdningar (`Cmd+R` direkt på
dashboarden). /login: Lighthouse CI (`lighthouserc.json`), tre körningar mot
produktionsbygget, i pipelinen på varje PR. JavaScript: gzip i `npm run build`.

## Före (main)

| Mått                   | Värde                                                |
| ---------------------- | ---------------------------------------------------- |
| LCP dashboard (median) | 1,04 s (1,07 / 1,03 / 1,04)                          |
| CLS dashboard (median) | 0,00 (0,00 / 0,00 / 0,00) – 1 shift: `p.hint` 0,0008 |
| LCP-element            | `img.hero` (hero.jpg, 96 kB, 2400 × 1200 px)         |
| JS /login (gzip)       | 141,82 kB – en fil för alla sidor                    |
| JS dashboarden (gzip)  | 141,82 kB – samma fil                                |

## Budgeten

Vaktas av jobbet **Prestandabudget (Lighthouse)** i CI, som är required check på main.
`error` = PR:en blir röd, `warn` = varning.

| Mått                | Budget             | Var         | Varför just den                                                                                                                                    |
| ------------------- | ------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| LCP                 | ≤ 2,5 s            | /login i CI | Googles gräns för "bra". /login ligger på 1,38 s (median av tre), så den fångar en stor regression utan att slå larm för brus.                     |
| CLS                 | ≤ 0,1              | /login i CI | Googles gräns för "bra". /login ligger på 0,0008.                                                                                                  |
| JavaScript          | ≤ 45 kB            | /login i CI | vi ligger på 43,0 kB (index 40,6 + LoginView 1,5 + config.js 0,6 + hjälpfil 0,4) – ca 5 % marginal, så en ny tung import i `index` blir röd direkt |
| Total Blocking Time | ≤ 200 ms (varning) | /login i CI | varnar om huvudtråden blockeras, men stoppar inte                                                                                                  |
| Performance-poäng   | ≥ 0,9 (varning)    | /login i CI | sammanfattande poäng, för brusig för att stoppa en PR                                                                                              |

Budgeten mäter bara /login, eftersom dashboarden kräver inloggning. Dashboarden mäts
manuellt (se Före och Optimeringarna). Lighthouse simulerar en långsammare mobil än
våra manuella DevTools-mätningar, så /login-siffrorna i CI går inte att jämföra rakt av
med dashboardens.

## Optimeringarna

### Spår 1 • Bilden och det som hoppar

### 1.1 Hero-bilden som WebP

LCP-elementet är `img.hero`. Bilden var en JPG på 96 kB och 2400 × 1200 px, men visas
som mest ca 900 px bred, och den saknade `width`/`height`. Vi konverterade till WebP,
skalade ner till 1200 px (räcker för 2× skärmar), lade till `width`/`height` +
`height: auto` så att browsern reserverar platsen innan bilden laddats, och
`fetchpriority="high"` så att LCP-bilden hämtas först. PR: #79

**Fynd:** Bilden gick från 96 kB till 5 kB (5044 byte), minskning på ca 95%.

|                        | Före                        | Efter                       |
| ---------------------- | --------------------------- | --------------------------- |
| hero-bilden            | 96 kB (JPG, 2400 × 1200)    | 5 kB (WebP, 1200 × 600)     |
| LCP dashboard (median) | 1,04 s (1,07 / 1,03 / 1,04) | 0,94 s (0,98 / 0,93 / 0,94) |
| CLS dashboard (median) | 0,00                        | 0,00                        |

### 1.2 Reserverad plats för diagrammet

När dashboarden laddas visas först "Laddar…" i förbrukningskortet. När
`/api/v2/consumption` svarat (efter ca 600 ms) byts texten mot diagrammet, som är mycket
högre, och raden under (`p.hint`, "Källa: din elmätare…") trycktes ner. Vi lade
"Laddar…" och diagrammet i en `div.chart-box` med `aspect-ratio`, så att platsen är
reserverad från start och inget under flyttas när svaret kommer. PR: #82

Mätt mot main efter lazy routes (#80).

|                        | Före                            | Efter                       |
| ---------------------- | ------------------------------- | --------------------------- |
| LCP dashboard (median) | 1,09 s (1,09 / 1,09 / 1,13)     | 1,12 s (1,12 / 1,12 / 1,11) |
| CLS dashboard (median) | 0,00 – 1 shift: `p.hint` 0,0008 | 0 – inga shifts             |

LCP oförändrat, som väntat: ändringen rör inte bilden. Hoppet syntes knappt i CLS på
mobil eftersom det mesta som flyttades låg under skärmkanten, men på en större skärm
eller långsammare API flyttas hela resten av sidan.

**Känt:** lådans proportioner matchar inte Chart.js exakt, så det blir lite tom yta
under diagrammet. Justeras när Chart.js-ändringen i spår 2 är klar.

### Spår 2 • JavaScript

### 2.1 Lazy routes

Alla vyer importerades statiskt i `src/router/index.js`, så `/login` hämtade en enda
fil på 141,82 kB gzip, inklusive dashboardens diagramkod. Vi bytte till
`() => import(...)` så att varje vy blir en egen fil som bara hämtas när sidan
besöks. Routern hade inte lazy routes sedan tidigare. PR: 80

|                         | Före      | Efter    |
| ----------------------- | --------- | -------- |
| JS /login (gzip)        | 141,82 kB | 41,42 kB |
| JS dashboarden (gzip)   | 141,82 kB | 140,6 kB |
| Antal JS-filer i bygget | 1         | 8        |

Dashboarden är i stort sett oförändrad eftersom `DashboardView` (100,13 kB gzip)
innehåller Chart.js och lodash; det tas i nästa optimeringar.

### 2.2 Chart.js: bara det vi ritar

`ConsumptionChart.vue` importerade `chart.js/auto`, som registrerar alla diagramtyper,
skalor och plugins. Vi ritar bara ett stapeldiagram och importerar nu `BarController`,
`BarElement`, `CategoryScale`, `LinearScale` och `Tooltip`. Testernas mock är anpassad
till den nya importen (`vi.mock('chart.js', …)`). PR: 81

|                              | Före      | Efter                 |
| ---------------------------- | --------- | --------------------- |
| DashboardView-chunk (gzip)   | 100,13 kB | 78,92 kB              |
| JS dashboarden totalt (gzip) | 140,64 kB | 119,43 kB             |
| JS /login (gzip)             | 41,42 kB  | 41,42 kB (oförändrad) |

### 2.3 Lodash: bort med hela paketet

`DashboardView.vue` importerade hela lodash (`import _ from 'lodash'`) för att använda
en enda funktion, `debounce`. Vi ersatte den med en egen `debounce` i
`src/utils/debounce.js` (6 rader) och avinstallerade `lodash`. PR: 83

|                              | Före      | Efter    |
| ---------------------------- | --------- | -------- |
| DashboardView-chunk (gzip)   | 78.92 kB  | 51.72 kB |
| JS dashboarden totalt (gzip) | 119.43 kB | 92.22 kB |
| JS /login (gzip)             | 41.42 kB  | 41.41 kB |

### Spår 3 • Budgeten och servern

### 3.1 Prestandabudget i CI

Budgeten var bara siffror i ett dokument – inget hindrade en PR från att göra /login
tyngre igen. Nu kör jobbet `lighthouse` Lighthouse CI tre gånger mot produktionsbygget
(artefakten `dist` från `build`) på varje PR, och `publish` har `needs: [quality, e2e,
lighthouse]`: ingen image utan godkänd budget. PR: 85

|                                    | Före      | Efter                                                   |
| ---------------------------------- | --------- | ------------------------------------------------------- |
| Vad stoppar en tyngre /login?      | ingenting | jobbet blir rött över 45 kB JS, 2,5 s LCP eller 0,1 CLS |
| JS /login (Lighthouse, över nätet) | –         | 43,0 kB (tak 45 kB)                                     |

**Lärdom:** första lokala körningen gav 71 kB och röd budget. Rapporten visade fel
filnamn: en gammal `npm run preview` från ett annat repo låg kvar på port 4173, så
Lighthouse mätte fel app. Vi kontrollerar nu vilka filer som mättes, inte bara siffran.

### 3.2 Komprimering

Vi kollade om staging skickar JavaScript komprimerat innan vi rörde nginx. Det gör den:
Render komprimerar på plattformen (Brotli när browsern ber om det, annars gzip), så vi
lade inte till `gzip on` i `nginx.conf.template`. Räknas inte som en av våra
optimeringar – det var redan på plats.

| `assets/index-DNbX3Ezn.js` på staging | Byte över nätet         |
| ------------------------------------- | ----------------------- |
| Utan `Accept-Encoding`                | 101 842                 |
| `Accept-Encoding: gzip`               | 40 034 (ca 61 % mindre) |
| `Accept-Encoding: gzip, br`           | `content-encoding: br`  |

Mätt med:
`curl -s -o /dev/null -w "%{size_download}\n" -H 'Accept-Encoding: gzip' https://kraftly-watt-main.onrender.com/assets/index-DNbX3Ezn.js`

**Om vi byter plattform:** vår egen nginx-container komprimerar inte. Lokalt med
`docker compose` går JS-filerna okomprimerade. Byter vi bort Render behöver `gzip on`
läggas till i `nginx.conf.template`.

### Hur optimeringarna påverkar varandra

LCP på dashboarden gick från 0,94 s (efter 1.1, hero-bilden) till 1,09 s efter lazy
routes (2.1). Bilden ligger i `DashboardView.vue`, som nu är en egen fil: browsern
hittar bilden först när både `index-*.js` och `DashboardView-*.js` har hämtats. Det är
en medveten avvägning – mycket mindre JavaScript på /login, mot något senare LCP på
dashboarden. LCP ligger fortfarande långt under budgeten på 2,5 s.

## Flaskhalsen vi inte äger

`/api/v2/consumption` väntar 673,8 ms innan den svarar, fast svaret är litet (Waiting
for server response i nätverksfliken). Fördröjningen finns både i Kraftlys test-API
(staging) och i mock-API:t lokalt (`setTimeout` på 600 ms). Den äger vi inte – den
rapporteras till API:ts ägare. Vår del är att resten av sidan inte väntar på den:
hero-bilden (LCP-elementet) laddas utan att vänta på API:t, och diagrammets plats är
reserverad (1.2) så att inget hoppar när svaret kommer. Räknas inte som en av våra
optimeringar.

Bevis: `consumption` startar vid ca 854 ms och svarar efter 677 ms (klar ca 1,53 s),
medan LCP (hero-bilden) kommer vid 1,12 s – bilden visas innan API:t svarat.
